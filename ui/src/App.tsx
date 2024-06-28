import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";

import Home from "@/pages/home";
import Dashboard from "@/pages/dashboard";
import Onboarding from "./pages/onboarding";
import Login from "./pages/login";
import Connect from "./pages/connect";
import Governance from "./pages/governance";

import { useEffect } from "react";
import { useWalletStore } from "./hooks/useStore";
function App() {
  const {walletAddress, setWalletAddress } = useWalletStore()
  useEffect(()=>{
    if(localStorage.getItem("walletAddress")){
      setWalletAddress(localStorage.getItem("walletAddress"))
    }
  },[])
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
