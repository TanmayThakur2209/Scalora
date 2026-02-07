PRICING_PRESETS = {
    "AWS": {
        "t3.micro": {
            "cpus": 2,
            "memory_gb": 1,
            "cost_per_hour": 0.0104
        },
        "t3.small": {
            "cpus": 2,
            "memory_gb": 2,
            "cost_per_hour": 0.0208
        },
        "t3.medium": {
            "cpus": 2,
            "memory_gb": 4,
            "cost_per_hour": 0.0416
        },
        "t3.large": {
            "cpus": 2,
            "memory_gb": 8,
            "cost_per_hour": 0.0832
        }
    },

    "GCP": {
        "e2-small": {
            "cpus": 2,
            "memory_gb": 2,
            "cost_per_hour": 0.025
        },
        "e2-medium": {
            "cpus": 2,
            "memory_gb": 4,
            "cost_per_hour": 0.050
        },
        "e2-standard-2": {
            "cpus": 2,
            "memory_gb": 8,
            "cost_per_hour": 0.067
        }
    }
}
