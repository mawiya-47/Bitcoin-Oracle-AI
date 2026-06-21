import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { TrendingUp, Activity, Cpu, ShieldAlert, ChevronRight, BarChart2, Radio, Server } from "lucide-react";
import { LineChart, Line, ResponsiveContainer } from "recharts";

interface LandingPageProps {
  onNavigate: (page: string) => void;
  currentPrice: number;
  priceChange: number;
}

export default function LandingPage({ onNavigate, currentPrice, priceChange }: LandingPageProps) {
  const [animatedData, setAnimatedData] = useState<any[]>([]);

  useEffect(() => {
    // Generate a beautiful, moving sine-like random walk to display as hero background line
    const dataPoints = Array.from({ length: 40 }, (_, idx) => {
      const angle = (idx / 39) * Math.PI * 4;
      const noise = Math.sin(idx * 0.7) * 800 + Math.cos(idx * 0.3) * 400;
      return {
        idx,
        price: 90000 + Math.sin(angle) * 7000 + noise + idx * 250,
      };
    });
    setAnimatedData(dataPoints);

    const interval = setInterval(() => {
      setAnimatedData((prev) => {
        if (prev.length === 0) return prev;
        const nextPrice = prev[prev.length - 1].price + (Math.random() - 0.48) * 1000 + 100;
        const newArr = [...prev.slice(1), { idx: prev[prev.length - 1].idx + 1, price: nextPrice }];
        return newArr;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen text-slate-200 font-sans overflow-hidden bg-[#05070a] pb-20">
      {/* Decorative Blur Orbs */}
      <div className="absolute top-1/4 -left-1/4 w-150 h-150 bg-orange-500/5 rounded-full blur-[160px] animate-pulse-slow pointer-events-none" />
      <div className="absolute top-1/2 -right-1/4 w-150 h-150 bg-amber-500/5 rounded-full blur-[160px] animate-pulse-slow pointer-events-none" />

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 pt-16 md:pt-28 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        <div className="lg:col-span-7 space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 px-3.5 py-1.5 rounded-full text-orange-400 text-xs font-mono tracking-wider uppercase font-semibold"
          >
            <Radio className="w-3.5 h-3.5 animate-pulse text-orange-500" />
            Live Deep Learning Prediction Engine
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl md:text-6xl font-extrabold tracking-tight text-white leading-[1.1]"
          >
            The Ultimate <span className="text-transparent bg-clip-text bg-linear-to-r from-orange-500 via-amber-300 to-amber-500">Bitcoin Oracle</span>
            <br />
            Deep Forecasting Hub
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-slate-400 text-lg max-w-2xl font-light leading-relaxed"
          >
            Leverage neural networks, boosted decision forests, and complex Monte Carlo probability algorithms to decode Bitcoin volatility bounds. Built for micro-analysts and institutional researchers alike.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4"
          >
            <button
              id="hero-launch-dashboard-btn"
              onClick={() => onNavigate("dashboard")}
              className="px-8 py-4 bg-orange-500 hover:bg-orange-600 text-black font-bold uppercase tracking-tight rounded-xl shadow-[0_0_15px_rgba(249,115,22,0.4)] transition-all flex items-center justify-center gap-2 group cursor-pointer"
            >
              Launch Platform Dashboard
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform stroke-[2.5]" />
            </button>
            <button
              id="hero-view-forecasts-btn"
              onClick={() => onNavigate("predictions")}
              className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 font-semibold rounded-xl transition-all text-center cursor-pointer"
            >
              Analyze Daily Forecasts
            </button>
          </motion.div>

          {/* Quick Stats Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="grid grid-cols-3 gap-6 pt-6 border-t border-white/5"
          >
            <div>
              <div className="font-mono text-xl md:text-3xl font-bold text-white tracking-tight">1,000+</div>
              <div className="text-xs text-slate-500 font-mono mt-1">Monte Carlo Paths</div>
            </div>
            <div>
              <div className="font-mono text-xl md:text-3xl font-bold text-orange-400 tracking-tight">99.1%</div>
              <div className="text-xs text-slate-500 font-mono mt-1">LSTM Sequence R²</div>
            </div>
            <div>
              <div className="font-mono text-xl md:text-3xl font-bold text-amber-500 tracking-tight">4 Models</div>
              <div className="text-xs text-slate-500 font-mono mt-1">Ensemble Scenarios</div>
            </div>
          </motion.div>
        </div>

        {/* Hero Interactive Chart Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="lg:col-span-5 h-85 md:h-100 glass-panel rounded-3xl p-6 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-4 font-mono text-[10px] text-slate-600 uppercase tracking-widest leading-none pointer-events-none">
            ORACLE_STREAMING_NODE_v1
          </div>
          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="text-xs text-slate-500 font-mono uppercase tracking-wider">Estimated Spot Oracle</div>
              <div className="text-3xl font-mono font-bold text-white tracking-tight mt-1">
                ${currentPrice ? currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "$96,420.00"}
              </div>
              <div className={`text-xs font-mono font-semibold flex items-center gap-1 mt-1 ${priceChange >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                <span className="w-1.5 h-1.5 rounded-full bg-current animate-ping" />
                {priceChange >= 0 ? "+" : ""}{priceChange ? priceChange.toFixed(2) : "1.84"}% (24H)
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg flex items-center gap-2">
              <Activity className="w-4 h-4 text-orange-400 animate-pulse" />
              <div className="text-[10px] text-slate-400 font-mono">P-WALK REALIZED</div>
            </div>
          </div>

          <div className="h-44 md:h-56 relative w-full font-mono">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={animatedData}>
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke="#f97316"
                  strokeWidth={2.5}
                  dot={false}
                  animationDuration={1500}
                />
              </LineChart>
            </ResponsiveContainer>
            {/* Soft overlay gradient */}
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-[#0a0b14]/50 to-transparent pointer-events-none" />
          </div>

          <div className="text-[10px] text-slate-500 font-mono text-center flex justify-around border-t border-white/5 pt-4 mt-2">
            <span>S_0: 64,000 USD</span>
            <span>MODEL: LSTM SEQUENCE</span>
            <span>GRID: CONVERGED</span>
          </div>
        </motion.div>
      </div>

      {/* Features Bento Grid */}
      <div className="max-w-7xl mx-auto px-6 mt-28 relative z-10">
        <div className="text-center space-y-3 mb-16">
          <div className="text-orange-500 font-mono text-xs tracking-widest uppercase font-semibold">Mathematical Rigor</div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Machine Learning Ensemble Forecasting</h2>
          <p className="text-slate-400 max-w-xl mx-auto leading-relaxed">
            Four specialized algorithms run server-side, backtesting historical signals to build a unified probability horizon.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Card 1 */}
          <div className="glass-panel glass-panel-hover rounded-2xl p-6 space-y-4 group">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 group-hover:scale-110 transition-transform">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-orange-400 transition-colors">LSTM Neural Nets</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-light">
              Long Short-Term Memory networks detect long-range memory states in daily close cycles to simulate recurring market structures.
            </p>
          </div>

          {/* Card 2 */}
          <div className="glass-panel glass-panel-hover rounded-2xl p-6 space-y-4 group">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors">XGBoost Boosting</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-light">
              Gradient-boosted decision trees process relative volume spreads, RSI signals, and moving averages to predict intraday swing offsets.
            </p>
          </div>

          {/* Card 3 */}
          <div className="glass-panel glass-panel-hover rounded-2xl p-6 space-y-4 group">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 group-hover:scale-110 transition-transform">
              <BarChart2 className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-orange-400 transition-colors">Monte Carlo Paths</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-light">
              1,000+ geometric Brownian motion simulations outline the 1, 5, and 10-year percentile distributions of possible prices.
            </p>
          </div>

          {/* Card 4 */}
          <div className="glass-panel glass-panel-hover rounded-2xl p-6 space-y-4 group">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform">
              <Server className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors">Technical Overlays</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-light">
              Automated compilation of Bollinger Band expansions, moving average dual crosses, MACD signals, and raw stochastic indicators.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Warning Disclaimer Section */}
      <div className="max-w-5xl mx-auto px-6 mt-32 relative z-10">
        <div className="glass-panel rounded-3xl p-8 md:p-12 relative overflow-hidden bg-linear-to-br from-[#10121d] to-[#0a0b14] border border-white/10">
          {/* Subtle decoration lines */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-8 space-y-4">
              <div className="flex items-center gap-2 text-orange-400 bg-orange-500/10 w-fit px-3 py-1 rounded-md border border-orange-500/20">
                <ShieldAlert className="w-4 h-4" />
                <span className="text-[10px] uppercase font-mono tracking-wider font-semibold">Strict Volatility Limits Apply</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-white">Ready to probe underlying volatility boundaries?</h3>
              <p className="text-xs text-slate-400 font-light leading-relaxed">
                Connect directly to our deep learning nodes, initiate automated retraining exercises to synchronize loss weights, or generate print-friendly PDF risk reports in a single click.
              </p>
            </div>
            <div className="md:col-span-4 flex justify-start md:justify-end">
              <button
                id="cta-launch-dashboard-btn"
                onClick={() => onNavigate("dashboard")}
                className="w-full md:w-auto px-8 py-4 bg-orange-500 hover:bg-orange-600 text-black font-bold uppercase tracking-tight rounded-xl text-center shadow-[0_0_15px_rgba(249,115,22,0.4)] transition-all cursor-pointer whitespace-nowrap"
              >
                Access Forecasting Core
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
