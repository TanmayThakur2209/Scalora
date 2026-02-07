import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import InputForm from "./InputForm";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";

export default function LiveCpuChart() {
  const [chartData, setChartData] = useState([]);
  const [decision, setDecision] = useState("WAITING");
  const [latestActual, setLatestActual] = useState(null);
  const [latestPredicted, setLatestPredicted] = useState(null);
  const [totalSavings, setTotalSavings] = useState(0);
  const [scaledDownTime, setScaledDownTime] = useState(0);
  const [costPerHour, setCostPerHour] = useState(0);

  const Icons={
    Sparkles: () => (
    <svg
    viewBox="0 0 16 16"
    xmlns="http://www.w3.org/2000/svg"
    className="w-6 h-6"
    fill="currentColor"
  >
    <path d="M11.473 9a4.5 4.5 0 0 0-8.72-.99A3 3 0 0 0 3 14h8.5a2.5 2.5 0 1 0-.027-5z" />
    <path d="M14.544 9.772a3.506 3.506 0 0 0-2.225-1.676 5.502 5.502 0 0 0-6.337-4.002 4.002 4.002 0 0 1 7.392.91 2.5 2.5 0 0 1 1.17 4.769z" />
  </svg>
  ),

  }


  

  useEffect(() => {
    const interval = setInterval(() => {
      axios.get("http://127.0.0.1:8000/live_cpu")
        .then(res => {
          const history = res.data.history || [];
          const predicted = res.data.predicted_cpu;

          if (history.length === 0) return;

          const last = history[history.length - 1];
          setLatestActual(last.cpu_usage);
          setLatestPredicted(predicted)
          setTotalSavings(res.data.total_savings || 0);
          setScaledDownTime(res.data.scaled_down_seconds || 0);
          setCostPerHour(res.data.cost_per_hour || 0);



          setChartData(prev => {
            const next = [
              ...prev,
              {
                time: last.time,
                cpu_usage: last.cpu_usage,
                predicted_cpu: predicted
              }
            ];
            return next.slice(-30);
          });

          setDecision(res.data.decision || "WAITING");
        })
        .catch(console.error);
    }, 2000);

    return () => clearInterval(interval);
  }, []);



  return (
     <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="fixed inset-0 overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#03063d] rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#03063d] rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-[#03063d] rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <header className="relative z-10 border-b border-white/10 backdrop-blur-sm">
        <nav className="container mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-linear-to-br from-[#030f6a] to-blue-800 rounded-lg flex items-center justify-center">
                <Icons.Sparkles />
              </div>
              <span className="text-2xl font-bold bg-linear-to-r from-[#7484e9] to-blue-400 bg-clip-text text-transparent">
                Scalora
              </span>
            </Link>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-slate-300 hover:text-white transition-colors duration-200">Features</a>
              <a href="#pricing" className="text-slate-300 hover:text-white transition-colors duration-200">Pricing</a>
              <a href="#about" className="text-slate-300 hover:text-white transition-colors duration-200">About</a>
              <button className="px-6 py-2 bg-linear-to-r from-blue-700 to-blue-900 rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500 transition-all duration-300 transform hover:scale-105">
                Get Started
              </button>
            </div>
          </div>
        </nav>
      </header>
    <div className="p-6  text-white">
      <InputForm/>
      <h2 className="text-2xl mb-4 font-bold">⚡ Live CPU Forecast</h2>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <XAxis dataKey="time" stroke="#aaa" />
          <YAxis
            domain={[0, 1]}
            tickFormatter={(v) => `${Math.round(v * 100)}%`}
          />
          <Tooltip formatter={(v) => `${(v * 100).toFixed(1)}%`} />
          <CartesianGrid stroke="#333" />

          {/* Actual CPU */}
          <Line
            type="monotone"
            dataKey="cpu_usage"
            stroke="#22c55e"
            strokeWidth={2}
            dot={false}
            name="Actual CPU"
          />

          {/* Predicted CPU (overlapping line) */}
          <Line
            type="monotone"
            dataKey="predicted_cpu"
            stroke="#60a5fa"
            strokeWidth={2}
            strokeDasharray="6 "
            dot={false}
            name="Predicted CPU"
          />
        </LineChart>
      </ResponsiveContainer>

      <div className="mt-4 text-lg">
        ⚙️ Decision:&nbsp;
        <span className={`font-bold
          ${decision === "SCALE UP" ? "text-red-400" :
            decision === "SCALE DOWN" ? "text-green-400" :
            "text-yellow-400"}`}>
          {decision}
        </span>
      </div>
      <div className="mt-2 text-sm text-gray-300 space-y-1">
        <div>
          🟢 Actual CPU:&nbsp;
          <span className="font-semibold text-green-400">
            {latestActual !== null
              ? `${(latestActual * 100).toFixed(1)}%`
              : "--"}
          </span>
        </div>
        <div>
          🔵 Predicted CPU:&nbsp;
          <span className="font-semibold text-blue-400">
            {latestPredicted !== null
              ? `${(latestPredicted * 100).toFixed(2)}%`
              : "--"}
          </span>
        </div>

  <div>
    ⏱️ Time Scaled Down:&nbsp;
    <span className="font-semibold text-yellow-300">
      {scaledDownTime.toFixed(1)} sec
    </span>
  </div>

  <div>
    💰 Money Saved So Far:&nbsp;
    <span className="font-semibold text-emerald-400">
      ${totalSavings.toFixed(6)}
    </span>
  </div>
  <div className="mt-2 text-sm text-gray-300">
  💸 Instance Cost / hour:&nbsp;
  <span className="font-semibold text-red-400">
    ${costPerHour}
  </span>
</div>

<div className="mt-2 text-sm text-gray-300">
  💰 Savings Rate (while scaled down):&nbsp;
  <span className="font-semibold text-emerald-400">
    ${(costPerHour * 0.5)} / hour
  </span>
</div>

</div>

</div>
    </div>
      
  );
}
