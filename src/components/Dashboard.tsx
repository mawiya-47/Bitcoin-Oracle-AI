import React, { useState } from "react";
import { motion } from "motion/react";
import { HistoricalPoint, LivePricePayload, TechnicalIndicatorsPayload, MonteCarloPayload, RiskAnalysisPayload } from "../types";
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Award,  
  RefreshCw,
  Eye,
  Percent,
  Calendar,
  Layers,
  ArrowRight
} from "lucide-react";
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Line,
  Area,
  ComposedChart,
  ReferenceLine,
  Bar,
  BarChart
} from "recharts";

interface DashboardProps {
  onNavigate: (page: string) => void;
  priceData: LivePricePayload | null;
  history: HistoricalPoint[];
  indicators: TechnicalIndicatorsPayload | null;
  simulation: MonteCarloPayload | null;
  risk: RiskAnalysisPayload | null;
  loading: boolean;
  onRefresh: () => void;
}

export default function Dashboard({
  onNavigate,
  priceData,
  history,
  indicators,
  simulation,
  risk,
  loading,
  onRefresh,
}: DashboardProps) {
  // Chart states: range filter (30 days, 90 days, 180 days, full year)
  const [range, setRange] = useState<number>(90);
  const [activeOverlay, setActiveOverlay] = useState<"none" | "bollinger" | "ma">("bollinger");
  const [secondaryChart, setSecondaryChart] = useState<"rsi" | "macd">("rsi");

  // Filter historical data according to selected range
  const filteredHistory = history.slice(-range);

  const formatPrice = (val: number) => {
    return val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const getCustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900 border border-slate-700/80 p-3 rounded-lg shadow-xl font-mono text-xs text-slate-200">
          <div className="text-slate-400 border-b border-slate-800 pb-1.5 mb-1.5 flex justify-between gap-4 font-semibold">
            <span>{data.date}</span>
            <span className="text-slate-200">${formatPrice(data.close)}</span>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between gap-8">
              <span className="text-slate-500">O/H/L:</span>
              <span className="text-slate-300">
                {Math.round(data.open)} / {Math.round(data.high)} / {Math.round(data.low)}
              </span>
            </div>
            {data.sma20 && (
              <div className="flex justify-between gap-8">
                <span className="text-cyan-400">SMA (20):</span>
                <span>{Math.round(data.sma20)}</span>
              </div>
            )}
            {data.bbUpper && (
              <div className="flex justify-between gap-8">
                <span className="text-violet-400">B-Upper:</span>
                <span>{Math.round(data.bbUpper)}</span>
              </div>
            )}
            {data.bbLower && (
              <div className="flex justify-between gap-8">
                <span className="text-violet-400">B-Lower:</span>
                <span>{Math.round(data.bbLower)}</span>
              </div>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-6 py-8 font-sans">
      {/* Upper Grid - Key Financial Widgets */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            Forecasting System Dashboard
            {loading && <RefreshCw className="w-5 h-5 text-cyan-400 animate-spin" />}
          </h2>
          <p className="text-xs text-slate-500 font-light mt-1">
            Stateful metrics derived from machine learning and localized multi-regressive models.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="dash-refresh-btn"
            onClick={onRefresh}
            className="p-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg text-slate-400 hover:text-cyan-400 transition-all flex items-center gap-2 text-xs font-mono select-none pointer-events-auto"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-cyan-400" : ""}`} />
            SYNCHRONIZE LIVE SPOT
          </button>
          <div className="h-4 w-px bg-slate-800" />
          <div className="flex gap-1.5 p-1 bg-slate-950 border border-slate-900 rounded-lg">
            {[30, 90, 180, 365].map((d) => (
              <button
                key={d}
                onClick={() => setRange(d)}
                className={`px-3 py-1 text-[10px] font-mono rounded-md transition-all uppercase ${
                  range === d
                    ? "bg-orange-500/15 text-orange-400 border border-orange-500/25 font-bold"
                    : "text-slate-500 hover:text-slate-300"
                }`}
              >
                {d}D
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Spot prices cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Live Oracle Rate Card */}
        <div className="glass-panel rounded-2xl p-5 relative overflow-hidden">
          <p className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">Estimated Spot Rate (BTC/USD)</p>
          <div className="flex justify-between items-baseline mt-2">
            <span className="text-3xl font-mono font-bold text-white tracking-tight">
              ${priceData ? formatPrice(priceData.price) : "96,420.00"}
            </span>
            <span
              className={`text-xs font-mono font-semibold px-2 py-0.5 rounded flex items-center gap-1 ${
                (priceData?.change24h || 2.45) >= 0 ? "text-emerald-400 bg-emerald-500/10" : "text-rose-400 bg-rose-500/10"
              }`}
            >
              {(priceData?.change24h || 2.45) >= 0 ? "+" : ""}
              {priceData ? priceData.change24h.toFixed(2) : "1.84"}%
            </span>
          </div>
          <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono mt-4 pt-4 border-t border-slate-900/40">
            <span>Volume (24H):</span>
            <span className="text-slate-300">
              ${(priceData?.volume24h ? priceData.volume24h / 1e9 : 18.4).toFixed(2)}B
            </span>
          </div>
        </div>

        {/* Bollinger Volatility Card */}
        <div className="glass-panel rounded-2xl p-5 relative">
          <p className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">Bollinger Contraction Bandwidth</p>
          <div className="flex justify-between items-baseline mt-2">
            <span className="text-3xl font-mono font-bold text-violet-400 tracking-tight">
              {indicators ? indicators.bollingerBands.bandwidth.toFixed(1) : "12.4"}%
            </span>
            <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-violet-500/10 text-violet-400 uppercase tracking-widest text-[9px]">
              {indicators?.trend || "Bullish"}
            </span>
          </div>
          <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono mt-4 pt-4 border-t border-slate-900/40">
            <span>Upper Cap Support:</span>
            <span className="text-slate-300">
              ${indicators ? Math.round(indicators.bollingerBands.upper).toLocaleString() : "102,400"}
            </span>
          </div>
        </div>

        {/* RSI Momentum Overload */}
        <div className="glass-panel rounded-2xl p-5 relative">
          <p className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">Relative Strength Indicator (14)</p>
          <div className="flex justify-between items-baseline mt-2">
            <span className="text-3xl font-mono font-bold text-orange-400 tracking-tight">
              {indicators ? Math.round(indicators.rsi) : "58"}
            </span>
            <span
              className={`text-xs font-mono font-semibold px-2 py-0.5 rounded text-[9px] uppercase tracking-widest ${
                indicators?.rsiStatus === "Overbought"
                  ? "bg-rose-500/10 text-rose-400 animate-pulse"
                  : indicators?.rsiStatus === "Oversold"
                  ? "bg-emerald-500/10 text-emerald-400 animate-pulse"
                  : "bg-orange-500/10 text-orange-400"
              }`}
            >
              {indicators?.rsiStatus || "Neutral"}
            </span>
          </div>
          <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono mt-4 pt-4 border-t border-slate-900/40">
            <span>24H High Bounds:</span>
            <span className="text-slate-300">
              ${priceData ? Math.round(priceData.high24h).toLocaleString() : "98,200"}
            </span>
          </div>
        </div>

        {/* Sharpe Risk Assessment */}
        <div className="glass-panel rounded-2xl p-5 relative">
          <p className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">Sharpe Ratio (Risk Adj. Return)</p>
          <div className="flex justify-between items-baseline mt-2">
            <span className="text-3xl font-mono font-bold text-amber-500 tracking-tight">
              {risk ? risk.sharpeRatio.toFixed(2) : "1.84"}
            </span>
            <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-amber-500/10 text-amber-500 uppercase text-[9px] tracking-wider">
              {risk ? "Optimized" : "Stable"}
            </span>
          </div>
          <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono mt-4 pt-4 border-t border-slate-900/40">
            <span>Annual Volatility:</span>
            <span className="text-slate-300">
              {risk ? risk.annualizedVolatility.toFixed(1) : "45.6"}%
            </span>
          </div>
        </div>
      </div>

      {/* Main Historical Composed Chart */}
      <div className="glass-panel rounded-3xl p-6 relative">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">Price Feed & Technical Indicator Overlay</h3>
            <span className="text-[10px] text-slate-500 font-mono uppercase">
              INTERVAL: DAILY | RANGE: {range} DAYS | FILTERED CLOSE PATH
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex p-0.5 bg-slate-950 border border-slate-900 rounded-lg">
              <button
                onClick={() => setActiveOverlay("bollinger")}
                className={`px-3 py-1 rounded text-[10px] font-mono transition-all ${
                  activeOverlay === "bollinger" ? "bg-violet-500/15 text-violet-400 border border-violet-500/20 font-bold" : "text-slate-500"
                }`}
              >
                BOLLINGER BANDS
              </button>
              <button
                onClick={() => setActiveOverlay("ma")}
                className={`px-3 py-1 rounded text-[10px] font-mono transition-all ${
                  activeOverlay === "ma" ? "bg-orange-500/15 text-orange-400 border border-orange-500/20 font-bold" : "text-slate-500"
                }`}
              >
                DUAL SMA
              </button>
              <button
                onClick={() => setActiveOverlay("none")}
                className={`px-3 py-1 rounded text-[10px] font-mono transition-all ${
                  activeOverlay === "none" ? "bg-slate-800 text-slate-200" : "text-slate-500"
                }`}
              >
                RAW CLOSE
              </button>
            </div>
          </div>
        </div>

        {/* High-quality Line/Area Chart */}
        <div className="h-70 md:h-87.5">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={filteredHistory} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorClose" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F7931A" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#F7931A" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorBB" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.05} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" stroke="#475569" fontSize={9} className="font-mono" />
              <YAxis
                domain={["auto", "auto"]}
                stroke="#475569"
                fontSize={9}
                tickFormatter={(tick) => `$${Math.round(tick).toLocaleString()}`}
              />
              <Tooltip content={getCustomTooltip} />
              <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" />

              {/* Area close highlight */}
              <Area type="monotone" dataKey="close" stroke="none" fill="url(#colorClose)" />

              {/* Bollinger bands background shadow boundary */}
              {activeOverlay === "bollinger" && (
                <>
                  <Area
                    type="monotone"
                    dataKey="bbUpper"
                    stroke="none"
                    fill="url(#colorBB)"
                  />
                  <Line
                    type="monotone"
                    dataKey="bbUpper"
                    stroke="#8b5cf6"
                    strokeWidth={1}
                    strokeDasharray="4 4"
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="bbLower"
                    stroke="#8b5cf6"
                    strokeWidth={1}
                    strokeDasharray="4 4"
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="bbMiddle"
                    stroke="#6d28d9"
                    strokeWidth={1}
                    dot={false}
                  />
                </>
              )}

              {/* SMA Indicators */}
              {activeOverlay === "ma" && (
                <>
                  <Line
                    type="monotone"
                    dataKey="sma20"
                    stroke="#f97316"
                    strokeWidth={1.5}
                    name="SMA 20"
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="sma50"
                    stroke="#ec4899"
                    strokeWidth={1.5}
                    name="SMA 50"
                    dot={false}
                  />
                </>
              )}

              <Line type="monotone" dataKey="close" stroke="#F7931A" strokeWidth={2.5} dot={false} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Secondary Chart for Oscillators */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 glass-panel rounded-2xl p-6">
          <div className="flex justify-between items-center mb-6 border-b border-slate-900 pb-4">
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">Sub-Indicator Oscillator</h4>
              <p className="text-[10px] text-slate-500 font-mono">Select momentum filters to display</p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setSecondaryChart("rsi")}
                className={`px-3 py-1 text-[10px] font-mono rounded ${
                  secondaryChart === "rsi" ? "bg-orange-500/15 text-orange-400 font-semibold border border-orange-500/25" : "text-slate-500 hover:text-slate-300"
                }`}
              >
                RSI (14)
              </button>
              <button
                onClick={() => setSecondaryChart("macd")}
                className={`px-3 py-1 text-[10px] font-mono rounded ${
                  secondaryChart === "macd" ? "bg-violet-500/15 text-violet-400 font-semibold border border-violet-500/25" : "text-slate-500 hover:text-slate-300"
                }`}
              >
                MACD HISTOGRAM
              </button>
            </div>
          </div>

          <div className="h-35 md:h-45">
            {secondaryChart === "rsi" ? (
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={filteredHistory} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                  <XAxis dataKey="date" stroke="#475569" fontSize={8} />
                  <YAxis domain={[0, 100]} stroke="#475569" fontSize={8} />
                  <CartesianGrid stroke="#1e293b" />
                  <Tooltip labelClassName="text-slate-950 font-mono text-xs" />
                  <Line type="monotone" dataKey="rsi" stroke="#f97316" strokeWidth={1.5} dot={false} />
                  <ReferenceLine y={70} stroke="#ef4444" strokeDasharray="3 3" label={{ value: "70 Overbought", fill: "#ef4444", fontSize: 8, fontStyle: "italic" }} />
                  <ReferenceLine y={30} stroke="#22c55e" strokeDasharray="3 3" label={{ value: "30 Oversold", fill: "#22c55e", fontSize: 8, fontStyle: "italic" }} />
                </ComposedChart>
              </ResponsiveContainer>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={filteredHistory} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
                  <XAxis dataKey="date" stroke="#475569" fontSize={8} />
                  <YAxis stroke="#475569" fontSize={8} />
                  <CartesianGrid stroke="#1e293b" />
                  <Tooltip labelClassName="text-slate-950 font-mono text-xs" />
                  <Bar dataKey="macdHist" fill="#a78bfa" />
                  <Line type="monotone" dataKey="macd" stroke="#818cf8" strokeWidth={1} dot={false} />
                  <Line type="monotone" dataKey="macdSignal" stroke="#f472b6" strokeWidth={1} dot={false} />
                  <ReferenceLine y={0} stroke="#475569" />
                </ComposedChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Quick Monte Carlo Percentile Outlook */}
        <div className="lg:col-span-4 glass-panel rounded-2xl p-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="border-b border-slate-900 pb-4">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">Simulated Volatility Outlook</h4>
              <p className="text-[10px] text-slate-500 font-mono">1,000 geometric Brownian simulations</p>
            </div>

            <div className="space-y-4 pt-1">
              {/* 1 Year */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-slate-400">1 Year (Expected P50)</span>
                  <span className="text-white font-bold">
                    ${simulation ? Math.round(simulation.horizons["1 Year"].median).toLocaleString() : "118,500"}
                  </span>
                </div>
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>P10: ${simulation ? Math.round(simulation.horizons["1 Year"].bearish).toLocaleString() : "74,200"}</span>
                  <span>P90: ${simulation ? Math.round(simulation.horizons["1 Year"].bullish).toLocaleString() : "165,000"}</span>
                </div>
              </div>

              {/* 5 Years */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-slate-400">5 Year Outlook (P50)</span>
                  <span className="text-orange-400 font-bold">
                    ${simulation ? Math.round(simulation.horizons["5 Year"].median).toLocaleString() : "215,900"}
                  </span>
                </div>
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>P10: ${simulation ? Math.round(simulation.horizons["5 Year"].bearish).toLocaleString() : "110,400"}</span>
                  <span>P90: ${simulation ? Math.round(simulation.horizons["5 Year"].bullish).toLocaleString() : "534,000"}</span>
                </div>
              </div>

              {/* 10 Years */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-slate-400">10 Year Target (P50)</span>
                  <span className="text-amber-500 font-bold">
                    ${simulation ? Math.round(simulation.horizons["10 Year"].median).toLocaleString() : "420,000"}
                  </span>
                </div>
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>P10: ${simulation ? Math.round(simulation.horizons["10 Year"].bearish).toLocaleString() : "180,200"}</span>
                  <span>P90: ${simulation ? Math.round(simulation.horizons["10 Year"].bullish).toLocaleString() : "1,350,000"}</span>
                </div>
              </div>
            </div>
          </div>

          <button
            id="dash-mc-details-btn"
            onClick={() => onNavigate("predictions")}
            className="w-full mt-6 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] font-mono font-bold text-orange-400 hover:text-orange-300 rounded-lg flex items-center justify-center gap-1.5 transition-all text-center cursor-pointer"
          >
            Launch Probability Simulator
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
