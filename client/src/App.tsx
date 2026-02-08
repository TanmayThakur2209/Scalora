import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import GcpAnalyzer from "./components/GcpAnalyzer";
import LiveCpuChart from "./components/LiveCpuChart";
import CsvAnalyzer from "./components/CSVAnalyzer";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/Demo" element={<LiveCpuChart />} />
        <Route path="/Analyze" element={<GcpAnalyzer/>} />
        <Route path="/AnalyzeCSV" element={<CsvAnalyzer/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
