from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import numpy as np
from pydantic import BaseModel
from pydantic import BaseModel
from tensorflow.keras.models import load_model
import joblib
from gcp_analyzer import fetch_gcp_cpu
from decision_engine import predict_cpu, generate_decision
from cost_engine import calculate_savings
import psutil
from datetime import datetime
from pricing_presets import PRICING_PRESETS

app=FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

df=pd.read_csv("data/processed/final_decisions.csv")
df = df.replace({np.nan: None})

@app.get("/")
def root():
    return {"message": "Cloud Cost Optimizer API is running"}

@app.get("/data")
def get_data(limit: int = 50, offset: int = 0):
    subset = df.iloc[offset: offset + limit]
    return subset.to_dict(orient="records")                  

@app.get("/summary")
def get_summary():
    return {
        "total_instances":len(df),
        "scale_down":int((df["decision"]=="SCALE DOWN").sum()),
        "scale_up":int((df["decision"]=="SCALE UP").sum()),
        "total_savings":float(df["estimated_savings"].sum())
    }
@app.get("/instance/{instance_id}")
def get_instance(instance_id: str):
    subset = df[df["instance_id"] == instance_id]
    return subset.to_dict(orient="records")

class UserInput(BaseModel):
    cpu_usage: float
    memory_usage: float
    cost: float
    workload: str

@app.post("/recommend")
def recommend(data: UserInput):
    recommendations = []

    if data.cpu_usage < 0.3:
        recommendations.append("Scale down instance")
    if data.cpu_usage > 0.8:
        recommendations.append("Scale up instance")
    if data.memory_usage < 0.4:
        recommendations.append("Reduce memory allocation")
    if data.cost > 1.0:
        recommendations.append("Switch to cheaper instance type")
    else:
        recommendations.append("Keep")

    return {
        "decision": recommendations,
        "estimated_savings": round(data.cost * 0.2, 2)
    }



model = load_model("models/cpu_forecast_model.keras")
scaler = joblib.load("models/scaler.pkl")

class AnalyzeRequest(BaseModel):
    project_id: str
    instance_type: str
    instance_count: int

@app.post("/analyze_gcp")
def analyze_gcp(data: AnalyzeRequest):

    cpu_values = fetch_gcp_cpu(data.project_id)

    predicted_cpu = predict_cpu(model, scaler, cpu_values)

    decision = generate_decision(predicted_cpu)

    savings = calculate_savings(
        provider="GCP",
        instance_type=data.instance_type,
        instance_count=data.instance_count,
        decision=decision
    )

    return {
        "current_cpu": cpu_values[-1] if cpu_values else None,
        "predicted_cpu": predicted_cpu,
        "decision": decision,
        "estimated_savings_next_minute": savings
    }


current_pricing = {
    "provider": "local",
    "instance_type": "default",
    "instances": 1,
    "cost_per_hour": 0.08
}


instance_state = {}



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
