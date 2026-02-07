INSTANCE_PRICING = {
    "GCP": {
        "e2-micro": 0.0076,
        "e2-small": 0.0152,
        "e2-medium": 0.0304,
        "e2-standard-2": 0.067
    }
}

SCALE_FACTOR = 0.5

def calculate_savings(provider, instance_type, instance_count, decision, duration_seconds=60):

    cost_per_hour = INSTANCE_PRICING[provider][instance_type]
    cost_per_second = cost_per_hour / 3600

    if decision == "SCALE DOWN":
        instances_reduced = int(instance_count * SCALE_FACTOR)
        savings = instances_reduced * cost_per_second * duration_seconds
    else:
        savings = 0

    return savings
