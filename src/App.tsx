import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  TrendingUp,
  Activity,
  Cpu,
  ShieldAlert,
  BarChart2,
  FileText,
  UserCheck,
  Server,
  Zap,
  LayoutDashboard,
  Coins,
  Globe
} from "lucide-react";

import {
  HistoricalPoint,
  LivePricePayload,
  TechnicalIndicatorsPayload,
  MonteCarloPayload,
  RiskAnalysisPayload,
  PredictionPayload,
  SystemLog,
  SystemLogsPayload
} from "./types";

import LandingPage from "./components/LandingPage";
import Dashboard from "./components/Dashboard";
import PredictionPage from "./components/PredictionPage";
import AnalyticsPage from "./components/AnalyticsPage";
import ReportsPage from "./components/ReportsPage";
import AdminPage from "./components/AdminPage";

export default function App() {
  const [activeTab, setActiveTab] = useState<string>("landing"); // 'landing', 'dashboard', 'predictions', 'analytics', 'reports', 'admin'
  
  // Data State
  const [livePrice, setLivePrice] = useState<LivePricePayload | null>(null);
  const [historicalData, setHistoricalData] = useState<HistoricalPoint[]>([]);
  const [indicators, setIndicators] = useState<TechnicalIndicatorsPayload | null>(null);
  const [simulation, setSimulation] = useState<MonteCarloPayload | null>(null);
  const [risk, setRisk] = useState<RiskAnalysisPayload | null>(null);
  const [forecast, setForecast] = useState<PredictionPayload | null>(null);
  
  // System State
  const [systemLogs, setSystemLogs] = useState<SystemLog[]>([]);
  const [logsMetrics, setLogsMetrics] = useState<any>(null);
  const [currentModel, setCurrentModel] = useState<string>("lstm"); // lstm, xgb, rf, lr
  
  // App states
  const [loading, setLoading] = useState<boolean>(true);
  const [synchronizing, setSynchronizing] = useState<boolean>(false);

  // Core Orchestration: Fetch initial payloads
  useEffect(() => {
    async function loadInitialData() {
      setLoading(true);
      try {
        await Promise.all([
          fetchPriceFeed(),
          fetchHistoricalTimeline(),
          fetchIndicatorsOverview(),
          fetchMonteCarloDetails(),
          fetchRiskEvaluation(),
          fetchModelParameters(currentModel),
          fetchSystemLogsAndMetrics()
        ]);
      } catch (err) {
        console.error("Failed loading core system files", err);
      } finally {
        setLoading(false);
      }
    }
    loadInitialData();

    // Set 20-second interval automatic live spot price sync
    const interval = setInterval(() => {
      fetchPriceFeed();
    }, 20000);

    return () => clearInterval(interval);
  }, []);

  // Update forecast model triggers
  useEffect(() => {
    fetchModelParameters(currentModel);
  }, [currentModel]);

  const fetchPriceFeed = async () => {
    try {
      const res = await fetch("/api/price");
      if (res.ok) {
        const data = await res.json();
        setLivePrice(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchHistoricalTimeline = async () => {
    try {
      const res = await fetch("/api/history");
      if (res.ok) {
        const data = await res.json();
        setHistoricalData(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchIndicatorsOverview = async () => {
    try {
      const res = await fetch("/api/technical-indicators");
      if (res.ok) {
        const data = await res.json();
        setIndicators(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMonteCarloDetails = async () => {
    try {
      const res = await fetch("/api/simulation");
      if (res.ok) {
        const data = await res.json();
        setSimulation(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchRiskEvaluation = async () => {
    try {
      const res = await fetch("/api/risk-analysis");
      if (res.ok) {
        const data = await res.json();
        setRisk(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchModelParameters = async (modelId: string) => {
    try {
      const res = await fetch(`/api/forecast?model=${modelId}`);
      if (res.ok) {
        const data = await res.json();
        setForecast(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchSystemLogsAndMetrics = async () => {
    try {
      const res = await fetch("/api/logs");
      if (res.ok) {
        const data: SystemLogsPayload = await res.json();
        setSystemLogs(data.logs);
        setLogsMetrics(data.metrics);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Synchronize manual button action
  const handleManualSync = async () => {
    setSynchronizing(true);
    await Promise.all([
      fetchPriceFeed(),
      fetchIndicatorsOverview(),
      fetchRiskEvaluation()
    ]);
    setSynchronizing(false);
  };

  // Post Retaining model call
  const triggerRetrainingRun = async (modelId: string) => {
    try {
      const res = await fetch("/api/train-model", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: modelId }),
      });
      if (res.ok) {
        const data = await res.json();
        // Update local logs and metrics
        await fetchSystemLogsAndMetrics();
        // Refresh active forecast to capture update
        await fetchModelParameters(currentModel);
        return data;
      }
    } catch (err) {
      console.error(err);
    }
    return null;
  };

  // Navigations switcher wrapper
  const handlePageNavigation = (page: string) => {
    setActiveTab(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Render Loader screen
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center font-sans">
        <div className="relative flex flex-col items-center space-y-6">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-slate-900 border-t-amber-500 rounded-full animate-spin" />
            <Coins className="w-6 h-6 text-amber-500 animate-pulse absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>

          <div className="text-center space-y-2">
            <h1 className="text-lg font-bold font-mono tracking-wider uppercase text-white">
              S_NODE: BOOTING ORACLE v1
            </h1>
            <p className="text-xs text-slate-500 font-mono animate-pulse">
              Seeding regressions & stochastic Brownian pipelines...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#05070a] text-slate-200 selection:bg-orange-500/30 selection:text-orange-200">
      {/* Decorative overhead gradient bar */}
      <div className="h-1 bg-linear-to-r from-orange-500 via-amber-400 to-orange-600 w-full no-print" />

      {/* Persistent Horizontal Navigation Bar */}
      <header className="sticky top-0 bg-[#0a0b14]/80 backdrop-blur-md border-b border-white/5 z-50 no-print">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Brand logo trigger back to landing */}
          <button
            id="brand-logo-nav"
            onClick={() => handlePageNavigation("landing")}
            className="flex items-center gap-3 cursor-pointer text-left select-none"
          >
            <div className="w-8 h-8 rounded-lg overflow-hidden shadow-[0_0_15px_rgba(249,115,22,0.4)]">
              <img src="/logo.svg" alt="Bitcoin Oracle AI" className="w-full h-full object-cover" />
            </div>
            <div>
              <span className="text-sm font-black tracking-tight text-white block">
                BITCOIN <span className="text-orange-500 underline underline-offset-4 decoration-2 font-black">ORACLE AI</span>
              </span>
              <span className="text-[9px] font-mono font-medium text-slate-400 -mt-0.5 block uppercase tracking-wider">
                Advanced Forecasting Platform
              </span>
            </div>
          </button>

          {/* Nav Items */}
          <nav className="hidden md:flex items-center gap-1.5 bg-white/5 p-1 border border-white/10 rounded-xl">
            {[
              { id: "landing", label: "Overview", icon: Globe },
              { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
              { id: "predictions", label: "Scenarios", icon: Cpu },
              { id: "analytics", label: "Analytics", icon: BarChart2 },
              { id: "reports", label: "Reports", icon: FileText },
              { id: "admin", label: "Operations", icon: Server },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  id={`nav-tab-${tab.id}`}
                  onClick={() => handlePageNavigation(tab.id)}
                  className={`px-4 py-2 text-xs font-semibold rounded-lg flex items-center gap-2 transition-all cursor-pointer ${
                    activeTab === tab.id
                      ? "bg-orange-500/20 text-orange-400 border border-orange-500/30"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${activeTab === tab.id ? "text-orange-400" : ""}`} />
                  {tab.label}
                </button>
              );
            })}
          </nav>

          {/* Quick Price Indicator widget */}
          <div className="flex items-center gap-4">
            <div className="hidden lg:flex flex-col items-end text-right">
              <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest leading-none">
                Live Feed Rate
              </span>
              <span className="text-xs font-mono font-bold text-emerald-400 mt-0.5">
                ${livePrice ? livePrice.price.toLocaleString(undefined, { minimumFractionDigits: 2 }) : "96,420.00"}
              </span>
            </div>
            <div className="w-px h-6 bg-white/10 hidden lg:block" />
            <button
              id="sidebar-launch-btn"
              onClick={() => handlePageNavigation("dashboard")}
              className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-black rounded-xl text-[11px] font-sans font-bold hover:shadow-[0_0_15px_rgba(249,115,22,0.3)] cursor-pointer transition-all uppercase select-none"
            >
              Forecaster Core
            </button>
          </div>
        </div>
      </header>

      {/* Mobiles Sticky Navigation Dock, visible on screen only */}
      <div className="md:hidden fixed bottom-0 inset-x-0 bg-[#0a0b14]/90 backdrop-blur-md border-t border-white/5 p-2.5 grid grid-cols-6 gap-0.5 z-50 no-print">
        {[
          { id: "landing", label: "Home", icon: Globe },
          { id: "dashboard", label: "Dash", icon: LayoutDashboard },
          { id: "predictions", label: "Projs", icon: Cpu },
          { id: "analytics", label: "Risk", icon: BarChart2 },
          { id: "reports", label: "PDF", icon: FileText },
          { id: "admin", label: "Ops", icon: Server },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => handlePageNavigation(tab.id)}
              className={`flex flex-col items-center justify-center py-1 rounded-lg text-[9px] font-mono transition-all uppercase ${
                activeTab === tab.id ? "text-orange-400 font-bold bg-[#10121d]" : "text-slate-500"
              }`}
            >
              <Icon className="w-4 h-4 mb-0.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Main Pages Content with dynamic fade routing wrappers */}
      <main className="min-h-[calc(100vh-68px)]">
        <AnimatePresence mode="wait">
          {activeTab === "landing" && (
            <motion.div
              key="landing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <LandingPage
                onNavigate={handlePageNavigation}
                currentPrice={livePrice?.price || 96420}
                priceChange={livePrice?.change24h || 1.84}
              />
            </motion.div>
          )}

          {activeTab === "dashboard" && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Dashboard
                onNavigate={handlePageNavigation}
                priceData={livePrice}
                history={historicalData}
                indicators={indicators}
                simulation={simulation}
                risk={risk}
                loading={synchronizing}
                onRefresh={handleManualSync}
              />
            </motion.div>
          )}

          {activeTab === "predictions" && (
            <motion.div
              key="predictions"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <PredictionPage
                currentModel={currentModel}
                onModelChange={setCurrentModel}
                forecastData={forecast}
                simulationData={simulation}
                loading={loading}
              />
            </motion.div>
          )}

          {activeTab === "analytics" && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <AnalyticsPage history={historicalData} riskData={risk} loading={loading} />
            </motion.div>
          )}

          {activeTab === "reports" && (
            <motion.div
              key="reports"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ReportsPage forecastData={forecast} riskData={risk} loading={loading} />
            </motion.div>
          )}

          {activeTab === "admin" && (
            <motion.div
              key="admin"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <AdminPage
                logs={systemLogs}
                metrics={logsMetrics}
                onRetrainModel={triggerRetrainingRun}
                onRefreshLogs={fetchSystemLogsAndMetrics}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer & Authorship */}
      <footer id="app-footer" className="py-10 border-t border-white/5 text-center no-print pb-24 md:pb-10 text-slate-500 font-sans text-xs relative z-10 select-none max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-left">
            <p className="text-sm font-bold text-white tracking-tight">BITCOIN <span className="text-orange-500 font-bold">ORACLE AI</span></p>
            <p className="text-[10px] font-mono text-slate-500 mt-1 uppercase tracking-wider">Deep Forecasting Ensemble & Probability Hub</p>
          </div>
          <div className="flex flex-col items-center md:items-end gap-1">
            <span id="footer-author-credit" className="text-xs font-semibold text-slate-300">
              Made with precision by <span className="text-orange-500 underline underline-offset-4 font-bold decoration-orange-500/40">Muhammad Mawiya</span>
            </span>
            <span className="text-[9px] font-mono text-slate-500 mt-1 uppercase tracking-widest">
              © 2026 Bitcoin Oracle AI. Independent Market Intelligence.
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
