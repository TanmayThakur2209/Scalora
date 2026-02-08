import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { LuUpload } from "react-icons/lu";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Scatter
} from "recharts";

interface CsvRow {
  cpu_usage: number;
  anomaly?: number;
  timestamp?: string;
  index: number;
}

interface Opportunity {
  timestamp: string;
  predicted_cpu: number;
  recommendation: string;
}

const API = "https://scalora.onrender.com";

export default function CsvAnalyzer() {
  const [data, setData] = useState<CsvRow[]>([]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [savings, setSavings] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [stepIndex, setStepIndex] = useState<number>(0);
  const [isDragging, setIsDragging] = useState(false);

  const steps = [
    "Parsing workload data...",
    "Normalizing features...",
    "Running LSTM forecast...",
    "Detecting anomalies...",
    "Simulating cost optimization..."
  ];

  /* ---------------- AI PROGRESS SIM ---------------- */

  useEffect(() => {
    if (!loading) return;

    setProgress(0);
    setStepIndex(0);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }

        const next = prev + 5;

        if (next % 20 === 0 && stepIndex < steps.length - 1) {
          setStepIndex((s) => s + 1);
        }

        return next;
      });
    }, 300);

    return () => clearInterval(interval);
  }, [loading]);

  /* ---------------- FILE PROCESSOR ---------------- */

  const processFile = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);

      const res = await axios.post(
        `${API}/analyze_csv`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      const processed = res.data.historical.map(
        (row: any, i: number) => ({
          ...row,
          index: i
        })
      );

      setTimeout(() => {
        setData(processed);
        setOpportunities(res.data.opportunities || []);
        setSavings(res.data.total_estimated_savings || 0);
        setLoading(false);
      }, 1000);

    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  /* ---------------- DRAG EVENTS ---------------- */

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white relative overflow-hidden">

      {/* Glow Background */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-blue-600 opacity-20 blur-3xl rounded-full animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-72 h-72 bg-purple-600 opacity-20 blur-3xl rounded-full animate-pulse"></div>

      <header className="border-b border-white/10 backdrop-blur-sm relative z-10">
        <nav className="container mx-auto px-6 py-5 flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-[#030f6a] to-blue-800 rounded-lg flex items-center justify-center">
              <span className="font-bold text-white">S</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-[#7484e9] to-blue-400 bg-clip-text text-transparent">
              Scalora
            </span>
          </Link>
        </nav>
      </header>

      <div className="container mx-auto px-6 py-10 relative z-10">

        <h2 className="text-2xl font-bold mb-6 text-center">
          AI Workload Optimization Simulator
        </h2>

        {/* DRAG & DROP AREA */}
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "15rem" }}
          transition={{ duration: 0.4 }}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`w-2/3 mx-auto flex flex-col bg-[#030f6a40] hover:bg-[#030c47] justify-center items-center rounded-2xl border-2 border-dashed transition-all duration-300 ${
            isDragging
              ? "border-blue-500 bg-blue-500/10"
              : "border-gray-500"
          }`}
        >
          <LuUpload className="text-4xl text-gray-400 mb-4" />
          <p className="text-gray-300">
            Drag & drop your CSV file here
          </p>

          <label className="mt-4 cursor-pointer text-blue-400">
            Browse File
            <input
              type="file"
              accept=".csv"
              className="hidden"
              onChange={(e) =>
                e.target.files && processFile(e.target.files[0])
              }
            />
          </label>
        </motion.div>

        {/* AI LOADING CARD */}
        {loading && (
          <div className="mt-10 bg-white/5 backdrop-blur-xl p-8 rounded-2xl border border-white/10 shadow-xl text-center">
            <div className="text-blue-400 text-xl font-semibold animate-pulse">
              🤖 AI Optimization Engine
            </div>

            <div className="mt-4 text-gray-300">
              {steps[stepIndex]}
            </div>

            <div className="w-full bg-gray-800 rounded-full h-3 mt-6">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="mt-2 text-sm text-gray-400">
              {progress}%
            </div>
          </div>
        )}

        {/* RESULTS */}
        {!loading && data.length > 0 && (
          <div className="mt-12">

            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={data}>
                <XAxis dataKey="index" />
                <YAxis domain={[0, 1]} />
                <Tooltip />
                <CartesianGrid stroke="#333" />
                <Line
                  type="monotone"
                  dataKey="cpu_usage"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={false}
                />
                <Scatter
                  data={data.filter(d => d.anomaly === 1)}
                  dataKey="cpu_usage"
                  fill="red"
                />
              </LineChart>
            </ResponsiveContainer>

            <div className="mt-10">
              <h3 className="text-xl font-semibold text-green-400 mb-4">
                Optimization Opportunities
              </h3>

              {opportunities.map((item, idx) => (
                <div key={idx} className="text-green-300 mb-2">
                  📍 {item.timestamp} → SCALE DOWN
                  (Predicted: {item.predicted_cpu.toFixed(2)})
                </div>
              ))}

              {savings > 0 && (
                <div className="mt-4 text-emerald-400 font-bold text-lg">
                  💰 Total Estimated Savings: ${savings.toFixed(4)}
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
