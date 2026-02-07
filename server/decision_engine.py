import numpy as np

def predict_cpu(model, scaler, cpu_values):
    if len(cpu_values) < 24:
        return None

    cpu_array = np.array(cpu_values[-24:]).reshape(-1, 1)
    cpu_scaled = scaler.transform(cpu_array)

    seq = cpu_scaled.reshape(1, 24, 1)

    pred_scaled = model.predict(seq)[0][0]
    predicted = scaler.inverse_transform([[pred_scaled]])[0][0]

    return float(predicted)


def generate_decision(predicted_cpu):
    if predicted_cpu is None:
        return "INSUFFICIENT DATA"

    if predicted_cpu > 0.7:
        return "SCALE UP"
    elif predicted_cpu < 0.3:
        return "SCALE DOWN"
    else:
        return "NO CHANGE"
