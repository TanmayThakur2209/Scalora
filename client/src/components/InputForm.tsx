import { useEffect, useState } from "react";
import axios from "axios";

const API = "https://scalora.onrender.com";

type Provider = "AWS" | "GCP";

interface InstanceConfig {
  cost_per_hour: number;
  cpus: number;
  memory_gb: number;
}

const INSTANCE_PRESETS: Record<Provider, string[]> = {
  AWS: ["t3.micro", "t3.small", "t3.medium", "t3.large"],
  GCP: ["e2-small", "e2-medium", "e2-standard-2"],
};

export default function ConfigForm() {

  const [provider, setProvider] = useState<Provider>("AWS");

  const [instanceType, setInstanceType] = useState<string>(
    INSTANCE_PRESETS.AWS[0]
  );

  const [instances, setInstances] = useState<number>(1);

  const [config, setConfig] = useState<InstanceConfig | null>(null);


  useEffect(() => {
    setInstanceType(INSTANCE_PRESETS[provider][0]);
  }, [provider]);

  useEffect(() => {
    axios
      .get<InstanceConfig>(`${API}/preset`, {
        params: { provider, instance_type: instanceType },
      })
      .then((res) => setConfig(res.data));
  }, [provider, instanceType]);


  const submit = () => {
    if (!config) return;

    axios.post(`${API}/config`, {
      provider,
      instance_type: instanceType,
      instances,
      ...config,
    });
  };


  return (
    <div className="max-w-4xl mx-auto p-6 rounded-xl mb-10 text-white">
      <h2 className="text-xl font-semibold mb-4">
        Server Configuration
      </h2>

      <div className="grid md:grid-cols-4 gap-4">
        <select
          className="p-2 border rounded bg-[#020939]"
          value={provider}
          onChange={(e) =>
            setProvider(e.target.value as Provider)
          }
        >
          <option value="AWS">AWS</option>
          <option value="GCP">GCP</option>
        </select>

        <select
          className="p-2 border rounded bg-[#020939]"
          value={instanceType}
          onChange={(e) =>
            setInstanceType(e.target.value)
          }
        >
          {INSTANCE_PRESETS[provider].map((inst: string) => (
            <option key={inst} value={inst}>
              {inst}
            </option>
          ))}
        </select>

        <input
          type="number"
          min="1"
          value={instances}
          onChange={(e) =>
            setInstances(Number(e.target.value))
          }
          className="p-2 border rounded bg-[#020939]"
        />

        <button
          onClick={submit}
          className="px-6 py-2 bg-linear-to-r from-blue-700 to-blue-900 rounded-lg hover:shadow-lg hover:shadow-blue-500 transition-all duration-300 transform hover:scale-105"
        >
          Apply
        </button>
      </div>

      {config && (
        <div className="mt-4 text-sm text-gray-400">
          CPUs: {config.cpus} | RAM: {config.memory_gb} GB |
          Cost/hr: ${config.cost_per_hour}
        </div>
      )}
    </div>
  );
}
