import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import IsolationForest



def train_isolation_forest(df,features):
    x=df[features].dropna()
    scaler=StandardScaler()
    x_scaled=scaler.fit_transform(x)

    model=IsolationForest(
        n_estimators=200,
        contamination=0.15,
        random_state=69,
        n_jobs=-1
    )
    df.loc[x.index,"anomaly_flag"]=model.fit_predict(x_scaled)
    return model,df

