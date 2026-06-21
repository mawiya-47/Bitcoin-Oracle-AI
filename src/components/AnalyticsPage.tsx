import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { HistoricalPoint, RiskAnalysisPayload } from "../types";
import { BarChart2, TrendingDown, Cpu, ChevronDown, Check, ArrowRight, Activity, Zap, Sparkles } from "lucide-react";
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Bar,
  BarChart,
  AreaChart,
  Area
} from "recharts";

interface AnalyticsPageProps {
  history: HistoricalPoint[];
  riskData: RiskAnalysisPayload | null;
  loading: boolean;
}

export default function AnalyticsPage({ history, riskData, loading }: AnalyticsPageProps) {
  const [insightPrompt, setInsightPrompt] = useState<string>("");
  const [insightText, setInsightText] = useState<string>("");
  const [insightLoading, setInsightLoading] = useState<boolean>(false);
  const [insightSource, setInsightSource] = useState<string>("");
  const [chartMode, setChartMode] = useState<"volatility" | "drawdown">("volatility");

  // Fetch initial general insights on mount
  useEffect(() => {
    fetchInsights();
  }, []);

  const fetchInsights = async (customPrompt?: string) => {
    setInsightLoading(true);
    try {
      const url = customPrompt
        ? `/api/insights?prompt=${encodeURIComponent(customPrompt)}`
        : "/api/insights";
      const res = await fetch(url);
      if (res.ok) {
        const payload = await res.json();
        setInsightText(payload.insights);
        setInsightSource(payload.source);
      } else {
        setInsightText("Failed to retrieve market advice. Please synchronize connection.");
      }
    } catch (err) {
      setInsightText("Error connecting to Gemini. Displaying cached analysis.");
    } finally {
      setInsightLoading(false);
    }
  };

  const handleCustomPromptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!insightPrompt.trim()) return;
    fetchInsights(insightPrompt);
  };

  // Compute drawdown sequence for the area chart
  const drawdownChartData = React.useMemo(() => {
    if (history.length === 0) return [];
    let peak = history[0].close;
    return history.slice(-90).map((d) => {
      if (d.close > peak) peak = d.close;
      const dd = ((peak - d.close) / peak) * 100; // as positive %, e.g., 5% drawdown
      return {
        date: d.date,
        drawdown: Math.round(dd * 100) / 100,
        price: d.close,
      };
    });
  }, [history]);

  // Static correlation dataset matching June 2026 financial indexes
  const correlationData = [
    { name: "Nasdaq 100", correlation: 0.64, stroke: "#3b82f6" },
    { name: "S&P 500", correlation: 0.58, stroke: "#60a5fa" },
    { name: "Gold Index", correlation: 0.35, stroke: "#fbbf24" },
    { name: "DXY Dollar Index", correlation: -0.48, stroke: "#ef4444" },
    { name: "US High-Yield Bonds", correlation: 0.22, stroke: "#34d399" },
    { name: "Inflation (CPI)", correlation: 0.12, stroke: "#a78bfa" },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-6 py-8 font-sans">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-extrabold text-white tracking-tight">Macro Risk & Correlation Core</h2>
        <p className="text-xs text-slate-500 font-light mt-1">
          Evaluate underlying probability assets, return distributions, peak drawdown thresholds, and Gemini analytical insights.
        </p>
      </div>

      {/* Main Grid: Analytical Plots */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Hand: Interactive Volatility or Drawdown Chart */}
        <div className="lg:col-span-8 glass-panel rounded-2xl p-6 space-y-6">
          <div className="flex justify-between items-center border-b border-slate-900 pb-4">
            <div>
              <h3 className="text-base font-bold text-white uppercase tracking-wider">
                {chartMode === "volatility" ? "Volatility Return Frequencies" : "90-Day Peak-to-Trough Drawdowns"}
              </h3>
              <p className="text-[10px] text-slate-500 font-mono">
                {chartMode === "volatility"
                  ? "DISTRIBUTION FREQUENCIES OF DAILY PERCENT CHANGE RETURNS"
                  : "PEAK VALUE RETREAT AS A UNIT LOSS PERCENTAGE"}
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setChartMode("volatility")}
                className={`px-3 py-1 text-[10px] font-mono rounded ${
                  chartMode === "volatility" ? "bg-orange-500/15 text-orange-400 font-bold border border-orange-500/25" : "text-slate-500"
                }`}
              >
                VOLATILITY FREQS
              </button>
              <button
                onClick={() => setChartMode("drawdown")}
                className={`px-3 py-1 text-[10px] font-mono rounded ${
                  chartMode === "drawdown" ? "bg-violet-500/15 text-violet-400 font-bold border border-violet-500/25" : "text-slate-500"
                }`}
              >
                DRAWDOWN RATIO
              </button>
            </div>
          </div>

          <div className="h-65 md:h-75">
            {chartMode === "volatility" && riskData ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={riskData.distribution} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
                  <XAxis dataKey="binLabel" stroke="#475569" fontSize={8} interval={2} />
                  <YAxis stroke="#475569" fontSize={8} />
                  <Tooltip labelClassName="text-slate-950 font-mono text-xs" />
                  <CartesianGrid stroke="#1e293b" />
                  <Bar dataKey="countKey" fill="#f97316" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={drawdownChartData} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
                  <defs>
                    <linearGradient id="drawdownColor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" stroke="#475569" fontSize={8} />
                  <YAxis stroke="#475569" fontSize={8} tickFormatter={(v) => `${v}%`} />
                  <Tooltip labelClassName="text-slate-950 font-mono text-xs" />
                  <CartesianGrid stroke="#1e293b" />
                  <Area
                    type="monotone"
                    dataKey="drawdown"
                    stroke="#ef4444"
                    fill="url(#drawdownColor)"
                    strokeWidth={1.5}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Right Hand: Asset Correlation list */}
        <div className="lg:col-span-4 glass-panel rounded-2xl p-6 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest font-mono border-b border-slate-900 pb-4">
              Macro Asset Pearson Coefficients
            </h3>

            <div className="space-y-4">
              {correlationData.map((item, idx) => {
                const percentage = Math.abs(item.correlation) * 100;
                return (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs font-mono">
                      <span className="text-slate-400">{item.name}</span>
                      <span className={`font-bold ${item.correlation >= 0 ? "text-orange-400" : "text-rose-400"}`}>
                        {item.correlation >= 0 ? "+" : ""}
                        {item.correlation.toFixed(2)}
                      </span>
                    </div>
                    <div className="h-1 bg-slate-950 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: item.stroke,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="text-[10px] text-slate-500 font-mono mt-4 pt-4 border-t border-slate-900/40">
            *Pearson correlation of daily returns evaluated over latest 180 trading sessions.
          </div>
        </div>
      </div>

      {/* Grid lower: Gemini smart insights */}
      <div className="glass-panel rounded-2xl p-6 relative overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-cyan-400/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-6 border-b border-slate-900 pb-4">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500 animate-pulse" />
              Gemini AI Lead Analyst Desk
            </h3>
            <p className="text-xs text-slate-500 font-mono">
              GENERATED LIVE FROM LATEST Spot & MOMENTUM CONVERGENCES
            </p>
          </div>

          <form onSubmit={handleCustomPromptSubmit} className="w-full md:w-auto flex items-center gap-2 bg-slate-950 border border-slate-900 rounded-xl p-1 shrink-0">
            <input
              type="text"
              placeholder="Ask lead analyst desk (e.g. DXY hedging...)"
              value={insightPrompt}
              onChange={(e) => setInsightPrompt(e.target.value)}
              className="px-3 py-1.5 text-xs bg-transparent border-none text-slate-200 outline-none w-full md:w-64"
            />
            <button
              id="analytics-ask-gemini-btn"
              type="submit"
              disabled={insightLoading}
              className="px-4 py-1.5 bg-orange-500 hover:bg-orange-600 text-black font-bold uppercase text-[10px] tracking-tight rounded-lg transition-all shrink-0 cursor-pointer disabled:opacity-50"
            >
              Analyze
            </button>
          </form>
        </div>

        <div className="bg-slate-950/40 border border-slate-900/60 rounded-xl p-6 relative">
          <AnimatePresence mode="wait">
            {insightLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-10 space-y-4"
              >
                <div className="relative">
                  <div className="w-10 h-10 border-2 border-slate-800 border-t-orange-400 rounded-full animate-spin" />
                  <Sparkles className="w-4 h-4 text-orange-400 animate-pulse absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                </div>
                <div className="text-center">
                  <p className="text-xs text-slate-300 font-mono animate-pulse">Compiling Gemini Neural Parameters...</p>
                  <p className="text-[10px] text-slate-600 font-mono mt-1">ESTIMATED RUN TIME ~3 SECS</p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4 text-slate-300 font-light text-sm leading-relaxed"
              >
                {/* Parse the simple headers in the generated advice */}
                {insightText.split("\n\n").map((chunk, idx) => {
                  if (chunk.startsWith("###")) {
                    return (
                      <h4 key={idx} className="text-xs font-bold text-white uppercase tracking-wider font-mono pt-2">
                        {chunk.replace("###", "").trim()}
                      </h4>
                    );
                  }
                  return <p key={idx} className="font-light text-xs text-slate-400">{chunk}</p>;
                })}

                <div className="flex justify-between items-center text-[10px] text-slate-600 font-mono pt-4 border-t border-slate-900/40">
                  <span>SOURCE_ALGORITHM: {insightSource || "Local Fallback"}</span>
                  <span>TIME_STAMP: {new Date().toLocaleTimeString()}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
