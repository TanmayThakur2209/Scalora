import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Demo from "./components/Demo";
import GcpAnalyzer from "./components/GcpAnalyzer";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/Demo" element={<Demo />} />
        <Route path="/Analyze" element={<GcpAnalyzer/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
