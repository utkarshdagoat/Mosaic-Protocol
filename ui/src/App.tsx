import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";

import Home from "@/pages/home";
import Dashboard from "@/pages/dashboard";
import Onboarding from "./pages/onboarding";
import Login from "./pages/login";
import Connect from "./pages/connect";
import Governance from "./pages/governance";

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/connect" element={<Connect />} />
          <Route path="/governance" element={<Governance />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
