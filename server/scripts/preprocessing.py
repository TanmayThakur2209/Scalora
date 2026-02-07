import pandas as pd
import numpy as np
import ast
import time

start=time.time()

df=pd.read_csv("data/raw/borg_traces_data.csv")
# df = df.sample(n=2100, random_state=42)

TRACE_START = pd.Timestamp("2019-05-01 00:00:00")
MAXINT = (2**63) - 1

# Replace invalid times with NaN
df.loc[(df["time"] == 0) | (df["time"] == MAXINT), "time"] = np.nan
df["time"]=(TRACE_START + pd.to_timedelta(df["time"] - 600_000_000, unit="us"))
df = df.dropna(subset=["time"])

df["instance_id"]=(
    df["collection_id"].astype(str)+"_"+
    df["instance_index"].astype(str)
)


def extract_cpu(x):
    try:
        if pd.isna(x):
            return np.nan
        if isinstance(x, str):
            return ast.literal_eval(x).get("cpus", np.nan)
        return x.get("cpus", np.nan)
    except Exception:
        return np.nan

def extract_memory(x):
    try:
        if pd.isna(x):
            return np.nan
        if isinstance(x, str):
            return ast.literal_eval(x).get("memory", np.nan)
        return x.get("memory", np.nan)
    except Exception:
        return np.nan


parsed_avg = df["average_usage"].dropna().apply(ast.literal_eval)

df.loc[parsed_avg.index, "cpu_usage"] = parsed_avg.apply(lambda x: x.get("cpus"))
df.loc[parsed_avg.index, "memory_usage"] = parsed_avg.apply(lambda x: x.get("memory"))

parsed_max = df["maximum_usage"].dropna().apply(ast.literal_eval)

df.loc[parsed_max.index, "max_cpu_usage"] = parsed_max.apply(lambda x: x.get("cpus"))


usage_cols = [
    "time",
    "instance_id",
    "cpu_usage",
    "max_cpu_usage",
    "memory_usage",
    "assigned_memory",
    "page_cache_memory",
    "cycles_per_instruction",
    "memory_accesses_per_instruction",
    "cluster"
]

df_usage = df[usage_cols].copy()

df_hourly = (
    df_usage
    .set_index("time")
    .groupby("instance_id")
    .resample("1h")
    .agg({
        "cpu_usage": "mean",
        "max_cpu_usage": "max",
        "memory_usage": "mean",
        "assigned_memory": "mean",
        "page_cache_memory": "mean",
        "cycles_per_instruction": "mean",
        "memory_accesses_per_instruction": "mean",
        "cluster": "first"
    })
    .reset_index()
)
df_hourly = df_hourly.dropna(subset=["cpu_usage"])
df_hourly["cpu_usage"] = df_hourly["cpu_usage"].clip(0, 1)
df_hourly["max_cpu_usage"] = df_hourly["max_cpu_usage"].clip(0, 1)

numeric_cols = [
    "cpu_usage",
    "max_cpu_usage",
    "memory_usage",
    "assigned_memory",
    "page_cache_memory",
    "cycles_per_instruction",
    "memory_accesses_per_instruction"
]

df_hourly[numeric_cols] = df_hourly[numeric_cols].apply(
    pd.to_numeric, errors="coerce"
)


print(df_hourly.head())
print(df_hourly.columns)
end=time.time()
print(end-start)

df_hourly.to_csv("data/processed/cloud_hourly_usage.csv", index=False)



