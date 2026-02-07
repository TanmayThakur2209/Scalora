import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import GcpAnalyzer from "./components/GcpAnalyzer";
import LiveCpuChart from "./components/LiveCpuChart";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/Demo" element={<LiveCpuChart />} />
        <Route path="/Analyze" element={<GcpAnalyzer/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
