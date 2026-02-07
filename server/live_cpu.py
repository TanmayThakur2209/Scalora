import psutil
from datetime import datetime
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from tensorflow.keras.models import load_model
import joblib
import numpy as np
from datetime import datetime
from pydantic import BaseModel
from pricing_presets import PRICING_PRESETS




# Active pricing config (default fallback)
current_pricing = {
    "provider": "local",
    "instance_type": "default",
    "instances": 1,
    "cost_per_hour": 0.08
}


# Per-instance state
instance_state = {}




app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model and scaler
model = load_model("models/cpu_forecast_model.keras")
scaler = joblib.load("models/scaler.pkl")

cpu_history = []

class UserConfig(BaseModel):
    provider: str
    instance_type: str
    instances: int
    cpus: int
    memory_gb: float
    cost_per_hour: float

current_config = None

def get_savings_rate():
    cost = current_pricing.get("cost_per_hour", 0.08)
    return (cost * 0.5) / 3600

def update_savings(instance_id, decision):
    now = datetime.utcnow()
    savings_rate = get_savings_rate()

    if instance_id not in instance_state:
        instance_state[instance_id] = {
            "scaled_down_since": None,
            "total_savings": 0.0
        }

    state = instance_state[instance_id]

    if decision == "SCALE DOWN":
        if state["scaled_down_since"] is None:
            state["scaled_down_since"] = now
    else:
        if state["scaled_down_since"]:
            duration = (now - state["scaled_down_since"]).total_seconds()
            state["total_savings"] += duration * savings_rate
            state["scaled_down_since"] = None

    if state["scaled_down_since"]:
        duration = (now - state["scaled_down_since"]).total_seconds()
        live_savings = duration * savings_rate
        scaled_down_seconds = duration
    else:
        live_savings = 0
        scaled_down_seconds = 0

    return {
        "total_savings": state["total_savings"] + live_savings,
        "scaled_down_seconds": scaled_down_seconds,
        "cost_per_hour": current_pricing["cost_per_hour"]
    }

@app.post("/config")
def set_config(config: UserConfig):
    global current_pricing

    preset = PRICING_PRESETS[config.provider][config.instance_type]

    total_cost_per_hour = (
        preset["cost_per_hour"] * config.instances
    )

    current_pricing = {
        "provider": config.provider,
        "instance_type": config.instance_type,
        "instances": config.instances,
        "cost_per_hour": total_cost_per_hour
    }

    return {
        "status": "Config saved",
        "pricing": current_pricing
    }


@app.get("/preset")
def get_preset(provider: str, instance_type: str):
    try:
        preset = PRICING_PRESETS[provider][instance_type]
        return {
            "provider": provider,
            "instance_type": instance_type,
            **preset
        }
    except KeyError:
        return {"error": "Preset not found"}
    

@app.get("/live_cpu")
def get_live_cpu():
    cpu = psutil.cpu_percent(interval=None) / 100

    data = {
        "time": datetime.now().strftime("%H:%M:%S"),
        "cpu_usage": cpu
    }

    cpu_history.append(data)

    if len(cpu_history) > 30:
        cpu_history.pop(0)

    predicted = None
    decision = "WAITING FOR DATA"


    if len(cpu_history) >= 24:
        cpu_values = [x["cpu_usage"] for x in cpu_history[-24:]]

        cpu_scaled = scaler.transform(np.array(cpu_values).reshape(-1,1))

        seq = cpu_scaled.reshape(1, 24, 1)

        pred_scaled = model.predict(seq)[0][0]

        predicted = float(scaler.inverse_transform([[pred_scaled]])[0][0])

        if predicted > 0.7:
            decision = "SCALE UP"
        elif predicted < 0.3:
            decision = "SCALE DOWN"
        else:
            decision = "NO CHANGE"
    instance_id = "random"  
    savings_info = update_savings(instance_id, decision)

    return {
        "history": cpu_history,
        "predicted_cpu": predicted,
        "decision": decision,
        "total_savings": savings_info["total_savings"],
        "scaled_down_seconds": savings_info["scaled_down_seconds"],
        "cost_per_hour": savings_info["cost_per_hour"]
    }
