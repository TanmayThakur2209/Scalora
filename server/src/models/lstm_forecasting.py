import numpy as np
import pandas as pd
from sklearn.preprocessing import MinMaxScaler
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense
from tensorflow.keras.callbacks import EarlyStopping

def load_data():
    df = pd.read_csv("data/processed/cloud_hourly_usage.csv")
    df["time"] = pd.to_datetime(df["time"])
    return df

def lstm_sequence(df):
    SEQ_LEN=24
    TARGET_COL="cpu_usage"
    scaler=MinMaxScaler()
    df_sorted=df.sort_values(["instance_id","time"])
    df_sorted[TARGET_COL]=scaler.fit_transform(df_sorted[[TARGET_COL]])

    x_seq,y_seq=[],[]

    for _,group in df_sorted.groupby("instance_id"):
        values=group[TARGET_COL].values
        for i in range (len(values)-SEQ_LEN):
            x_seq.append(values[i:i+SEQ_LEN])
            y_seq.append(values[i+SEQ_LEN])

    x_seq=np.array(x_seq).reshape(-1, SEQ_LEN, 1)
    y_seq=np.array(y_seq)
    return x_seq,y_seq,scaler

def build_lstm_model(SEQ_LEN):
    model=Sequential([LSTM(64,input_shape=(SEQ_LEN,1),return_sequences=False),Dense(1)])

    model.compile(optimizer="adam",loss="mse")
    return model

def train_lstm(x_seq,y_seq,SEQ_LEN):
    model=build_lstm_model(SEQ_LEN)
    early_stop=EarlyStopping(monitor="val_loss",patience=2,restore_best_weights=True)
    history=model.fit(
        x_seq,
        y_seq,
        epochs=5,
        batch_size=256,
        validation_split=0.1,
        callbacks=[early_stop],
        verbose=1
    )
    return model,history

def forecast_next_cpu(model,df,scaler):
    SEQ_LEN=24
    TARGET_COL="cpu_usage"
    predictions={}
    df=df.sort_values(["instance_id","time"]).copy()
    df[TARGET_COL]=scaler.transform(df[[TARGET_COL]])

    for inst,group in df.groupby("instance_id"):
        if len(group)<SEQ_LEN:
            continue

        last_seq=group[TARGET_COL].values[-SEQ_LEN:]
        last_seq=last_seq.reshape(1,SEQ_LEN,1)
        pred= model.predict(last_seq,verbose=0)
        pred_cpu=scaler.inverse_transform(pred)[0][0]
        predictions[inst]=pred_cpu
    return predictions