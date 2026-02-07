import numpy as np
from src.models.lstm_forecasting import (load_data, lstm_sequence,train_lstm,forecast_next_cpu)
from src.models.isolation_forest import train_isolation_forest
import time
import tensorflow as tf
import joblib

print(tf.config.list_physical_devices('GPU'))
start=time.time()
df=load_data()

features = [
    "cpu_usage",
    "max_cpu_usage",
    "memory_usage",
    "assigned_memory",
    "page_cache_memory"
]
isolation_model,df=train_isolation_forest(df,features)
print("Isolation Forest Trained")

x,y,scaler=lstm_sequence(df)
model,history=train_lstm(x,y,24)
print("LSTM Trained")
model.save("models/cpu_forecast_model.keras")
joblib.dump(scaler, "models/scaler.pkl")

print("Model and scaler saved")

predictions=forecast_next_cpu(model,df,scaler)

def decision(row):
    if row["cpu_usage"]<0.2 and row["anomaly_flag"]==-1:
        return "SCALE DOWN"
    elif row["cpu_usage"]>0.8:
        return "SCALE UP"
    else:
        return "KEEP"

df["predicted_cpu"]=df["instance_id"].map(predictions)
df["decision"]=df.apply(decision,axis=1)

df["cost_per_hour"]=0.08
df["estimated_savings"]=np.where(df["decision"]=="SCALE DOWN",df["cost_per_hour"]*0.5,0)
df.to_csv("data/processed/final_decisions.csv", index=False)
print("Pipeline complete. Results saved to data/processed/final_decisions.csv")
print(df[["instance_id", "cpu_usage", "predicted_cpu", "decision", "estimated_savings"]].head())

# print(list(predictions.items())[:5])

end=time.time()
print(end-start)