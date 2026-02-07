import { useEffect, useState } from "react";
import axios from "axios";

const API = "http://127.0.0.1:8000";

const INSTANCE_PRESETS = {
  AWS: ["t3.micro", "t3.small", "t3.medium", "t3.large"],
  GCP: ["e2-small", "e2-medium", "e2-standard-2"],
};

export default function ConfigForm() {
  const [provider, setProvider] = useState("AWS");
  const [instanceType, setInstanceType] = useState(
    INSTANCE_PRESETS.AWS[0]
  );
  const [instances, setInstances] = useState(1);
  const [config, setConfig] = useState({});

  useEffect(() => {
    setInstanceType(INSTANCE_PRESETS[provider][0]);
  }, [provider]);

  useEffect(() => {
    axios
      .get(`${API}/preset`, {
        params: { provider, instance_type: instanceType },
      })
      .then((res) => setConfig(res.data));
  }, [provider, instanceType]);

  const submit = () => {
    axios.post(`${API}/config`, {
      provider,
      instance_type: instanceType,
      instances,
      ...config,
    });
  };

  return (
    <div className="max-w-4xl mx-auto  p-6 rounded-xl mb-10 text-[#ffffff]">
      <h2 className="text-xl font-semibold mb-4">Server Configuration</h2>

      <div className="grid md:grid-cols-4 gap-4">
        <select
          className="p-2 border rounded"
          value={provider}
          onChange={(e) => setProvider(e.target.value)}
        >
          <option className="bg-[#020939]" value="AWS">AWS</option>
          <option  className="bg-[#020939]" value="GCP">GCP</option>
        </select>

        <select
          className="p-2 border rounded"
          value={instanceType}
          onChange={(e) => setInstanceType(e.target.value)}
        >
          {INSTANCE_PRESETS[provider].map((inst) => (
            <option className="bg-[#020939]" key={inst} value={inst}>
              {inst}
            </option>
          ))}
        </select>
        <input
          type="number"
          min="1"
          value={instances}
          onChange={(e) => setInstances(Number(e.target.value))}
          className="p-2 border rounded"
        />

        <button onClick={submit} className="px-6 py-2 bg-linear-to-r from-blue-700 to-blue-900 rounded-lg  hover:shadow-lg hover:shadow-blue-500 transition-all duration-300 transform hover:scale-105">
                Apply
              </button>
      </div>

      {config.cost_per_hour && (
        <div className="mt-4 text-sm text-gray-400">
          CPUs: {config.cpus} | RAM: {config.memory_gb} GB | Cost/hr: $
          {config.cost_per_hour}
        </div>
      )}
    </div>
  );
}
