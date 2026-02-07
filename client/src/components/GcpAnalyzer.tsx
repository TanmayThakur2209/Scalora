import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const API = "http://127.0.0.1:8000";

export default function GcpAnalyzer() {
  const [projectId, setProjectId] = useState("");
  const [instanceType, setInstanceType] = useState("e2-medium");
  const [instanceCount, setInstanceCount] = useState(1);

  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
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

  const analyze = async () => {
    setLoading(true);
    try {
      const res = await axios.post(`${API}/analyze_gcp`, {
        project_id: projectId,
        instance_type: instanceType,
        instance_count: instanceCount,
      });

      setResult(res.data);
    } catch (err) {
      console.error(err);
      alert("Error analyzing GCP data");
    }
    setLoading(false);
  };

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
    <div className="max-w-4xl mx-auto z-50 p-8 rounded-xl shadow-lg mt-10 text-white">
      <h2 className="text-2xl font-semibold mb-6">
         Analyze GCP Infrastructure
      </h2>

      <div className="grid md:grid-cols-3 gap-4">
        <input
          type="text"
          placeholder="GCP Project ID"
          value={projectId}
          onChange={(e) => setProjectId(e.target.value)}
          className="p-3 border rounded"
          />

        <select
          value={instanceType}
          onChange={(e) => setInstanceType(e.target.value)}
          className="p-3  border rounded"
          >
          <option className="bg-[#020939]" value="e2-micro">e2-micro</option>
          <option className="bg-[#020939]" value="e2-small">e2-small</option>
          <option className="bg-[#020939]" value="e2-medium">e2-medium</option>
          <option className="bg-[#020939]" value="e2-standard-2">e2-standard-2</option>
        </select>

        <input
          type="number"
          min="1"
          value={instanceCount}
          onChange={(e) => setInstanceCount(Number(e.target.value))}
          className="p-3  border rounded"
          />
      </div>

      <button
        onClick={analyze}
        disabled={loading}
        className="px-6 py-2 w-full mt-6 bg-linear-to-r from-blue-700 to-blue-900 rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500 transition-all duration-300 transform hover:scale-105"
        >
        {loading ? "Analyzing..." : "Analyze with Scalora AI"}
      </button>

      {result && (
          <div className="mt-8 bg-black p-6 rounded-lg border border-zinc-700">
          <h3 className="text-xl font-semibold mb-4">
            📊 Analysis Result
          </h3>

          <div className="grid md:grid-cols-2 gap-4 text-lg">
            <div>
              Current CPU:
              <span className="ml-2 font-bold text-green-400">
                {result.current_cpu?.toFixed(3)}
              </span>
            </div>

            <div>
              Predicted CPU:
              <span className="ml-2 font-bold text-yellow-400">
                {result.predicted_cpu?.toFixed(3)}
              </span>
            </div>

            <div>
              Decision:
              <span className="ml-2 font-bold text-blue-400">
                {result.decision}
              </span>
            </div>

            <div>
              Estimated Savings (next min):
              <span className="ml-2 font-bold text-emerald-400">
                ${result.estimated_savings_next_minute?.toFixed(6)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
      </div>
  );
}
