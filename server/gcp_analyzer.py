import time
from google.cloud import monitoring_v3

def fetch_gcp_cpu(project_id: str):
    client = monitoring_v3.MetricServiceClient()

    project_name = f"projects/{project_id}"

    interval = monitoring_v3.TimeInterval({
        "end_time": {"seconds": int(time.time())},
        "start_time": {"seconds": int(time.time()) - 300},
    })

    results = client.list_time_series(
        request={
            "name": project_name,
            "filter": 'metric.type="compute.googleapis.com/instance/cpu/utilization"',
            "interval": interval,
            "view": monitoring_v3.ListTimeSeriesRequest.TimeSeriesView.FULL,
        }
    )

    cpu_values = []

    for series in results:
        for point in series.points:
            cpu_values.append(point.value.double_value)

    return cpu_values[:24]  # return last 24 datapoints
