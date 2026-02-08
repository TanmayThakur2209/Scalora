<h1>
  <img src="https://github.com/user-attachments/assets/3fe80b6a-7488-42fe-b42b-6cd3233ac69f" 
       width="30" 
        />
  Scalora
</h1>
 
### AI-Powered Predictive Cloud Optimization Platform

Scalora is an intelligent cloud workload optimization system that uses machine learning to predict infrastructure demand, detect inefficiencies, and recommend proactive scaling decisions to reduce cloud costs.

Instead of reacting to resource spikes, **Scalora forecasts them.**


##  Problem

Modern cloud infrastructure relies on reactive auto-scaling mechanisms that respond only after usage thresholds are crossed. This leads to:

- Over-provisioned resources  
- Idle compute waste  
- Late scaling during spikes  
- Unnecessary cloud spending  

Organizations lack predictive intelligence for infrastructure optimization.


##  Solution

Scalora transforms reactive scaling into predictive optimization using AI.

It:

- Forecasts CPU utilization using LSTM
- Detects anomalies in workload patterns
- Identifies missed scale-down opportunities
- Simulates cost savings
- Visualizes optimization insights interactively



##  Features

-  Live CPU forecasting  
-  CSV workload upload & analysis  
-  AI-powered scaling simulation  
-  Anomaly detection  
-  Cost savings estimation  
-  Interactive charts (Recharts)  
- Animated AI processing engine UI  


##  Architecture
Scalora follows a modular, layered architecture that separates data collection, AI intelligence, decision logic, and cost computation into independent components.
   ```
                ┌──────────────────────────────┐
                │          Frontend            │
                │   React + Tailwind Dashboard │
                └───────────────┬──────────────┘
                                │ REST API
                                ▼
                ┌──────────────────────────────┐
                │           Backend            │
                │            FastAPI           │
                └───────────────┬──────────────┘
                                │
        ┌───────────────────────┼────────────────────────┐
        ▼                       ▼                        ▼
┌───────────────┐      ┌────────────────┐       ┌────────────────┐
│  Data Layer   │      │   AI Engine    │       │  Cost Engine   │
│ (CPU Metrics) │      │ LSTM + IF Model│       │ Pricing Logic  │
└───────────────┘      └────────────────┘       └────────────────┘
                                │
                                ▼
                ┌──────────────────────────────┐
                │       Decision Engine        │
                │  Scale Up / Down / Maintain  │
                └──────────────────────────────┘

```

## AI Engine
- LSTM (Long Short-Term Memory)

  - Predicts future CPU usage based on the last 24 time steps.

- Isolation Forest

  - Detects anomalous workload patterns to identify inefficiencies.


## API Integration (Bring Your Own Server)

Scalora is designed to integrate seamlessly with your existing infrastructure.

You can connect your own server or cloud environment via API and let Scalora analyze real workload data.


## Analyze Historical CSV


Returns:
- Historical CPU data
- Predicted CPU values
- Optimization opportunities
- Estimated cost savings


### Live CPU Monitoring

Returns:
- Real-time CPU usage
- Predicted next CPU
- Scaling decision
- Live savings calculation



## Cloud Configuration

Configure:
- Provider (AWS / GCP)
- Instance type
- Instance count
- Cost per hour

Scalora then simulates scaling decisions and cost impact.



## How to Integrate Your Infrastructure

1. Expose your server metrics via API or export CSV.
2. Send workload data to Scalora.
3. Receive predictive scaling recommendations.
4. Optionally trigger scaling using your own cloud SDK.

## Why Scalora?

Scalora is not just a monitoring dashboard.

It is a predictive **financial optimization engine** that:

- Reduces cloud waste
- Prevents performance bottlenecks
- Enables intelligent scaling
- Turns infrastructure data into financial insight



