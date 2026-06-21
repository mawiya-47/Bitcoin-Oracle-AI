import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { PredictionPayload, MonteCarloPayload } from "../types";
import { Cpu, ShieldAlert, AlertTriangle, Layers, Zap, Info, Landmark } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

interface PredictionPageProps {
  currentModel: string;
  onModelChange: (model: string) => void;
  forecastData: PredictionPayload | null;
  simulationData: MonteCarloPayload | null;
  loading: boolean;
}

export default function PredictionPage({
  currentModel,
  onModelChange,
  forecastData,
  simulationData,
  loading,
}: PredictionPageProps) {
  const [activeHorizon, setActiveHorizon] = useState<number>(30); // 1, 7, 30, 365

  // Extract prediction for currently active horizon
  const selectedHorizonForecast = forecastData?.predictions.find(
    (p) => p.horizonDays === activeHorizon
  );

  const formatPrice = (val: number) => {
    return val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  // Convert Monte Carlo paths to lines for line chart
  const mcChartData = React.useMemo(() => {
    if (!simulationData) return [];
    // Combine 15 paths on month-based milestones.
    const stepsCount = 13; // 0 to 12
    const rows = [];
    for (let m = 0; m < stepsCount; m++) {
      const row: any = { month: `Month ${m}` };
      simulationData.samplePaths.forEach((path) => {
        const pt = path.points.find((p) => p.month === m);
        if (pt) {
          row[`Path ${path.pathId}`] = pt.price;
        }
      });
      rows.push(row);
    }
    return rows;
  }, [simulationData]);

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-6 py-8 font-sans">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-extrabold text-white tracking-tight">Machine Learning Scenario Forecaster</h2>
        <p className="text-xs text-slate-500 font-light mt-1">
          Apply state-specific sequence algorithms to evaluate bullish, neutral, and bearish standard deviation bands.
        </p>
      </div>

      {/* Model Selection Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-1.5 bg-slate-950 border border-slate-900 rounded-2xl">
        {[
          { id: "lstm", label: "LSTM Sequence Net", type: "Deep Neural" },
          { id: "xgb", label: "XGBoost Forest", type: "Gradient Trees" },
          { id: "rf", label: "Random Forest", type: "Bootstrap Tree" },
          { id: "lr", label: "Linear Regression", type: "Statistical" },
        ].map((m) => (
          <button
            key={m.id}
            id={`model-select-${m.id}`}
            onClick={() => onModelChange(m.id)}
            className={`p-4 rounded-xl text-left transition-all relative ${
              currentModel === m.id
                ? "bg-[#10121d] border border-orange-500/30 shadow-lg shadow-orange-950/20"
                : "hover:bg-white/5 border border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <div className="text-xs uppercase font-mono tracking-widest text-slate-500">{m.type}</div>
            <div className="text-sm font-bold text-white mt-1 flex items-center justify-between">
              {m.label}
              {currentModel === m.id && <Zap className="w-3.5 h-3.5 text-orange-400 animate-pulse" />}
            </div>
          </button>
        ))}
      </div>

      {/* Horizon selector and main prediction content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Predictions & Scenarios */}
        <div className="lg:col-span-8 space-y-6">
          <div className="glass-panel rounded-2xl p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h3 className="text-base font-bold text-slate-200 uppercase tracking-wider font-sans">
                  Active Model Projections
                </h3>
                <p className="text-xs text-slate-500 font-mono mt-0.5">
                  SELECTED: {forecastData?.modelName || "Deep Neural"}
                </p>
              </div>

              {/* Time Horizon buttons */}
              <div className="flex p-0.5 bg-slate-950 border border-slate-900 rounded-lg">
                {[
                  { days: 1, label: "1D Forecast" },
                  { days: 7, label: "7D Trend" },
                  { days: 30, label: "30D Horizon" },
                  { days: 365, label: "365D Core" },
                ].map((hz) => (
                  <button
                    key={hz.days}
                    onClick={() => setActiveHorizon(hz.days)}
                    className={`px-3 py-1.5 rounded-md text-[10px] font-mono transition-all ${
                      activeHorizon === hz.days
                        ? "bg-orange-500/15 text-orange-400 font-bold border border-orange-500/25"
                        : "text-slate-500 hover:text-slate-300"
                    }`}
                  >
                    {hz.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Core Scenario bento grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Bullish Scenario Card */}
              <div className="bg-emerald-500/5 hover:bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-5 transition-all text-left">
                <div className="flex justify-between items-center text-emerald-400 font-mono text-[10px] uppercase">
                  <span>Bullish Scenario</span>
                  <span className="px-1.5 py-0.5 bg-emerald-500/15 rounded text-[8px] font-semibold">
                    +1.28 Std Dev
                  </span>
                </div>
                <div className="text-2xl font-mono font-bold text-emerald-400 tracking-tight mt-3">
                  ${selectedHorizonForecast ? formatPrice(selectedHorizonForecast.bullishScenario) : "---"}
                </div>
                <p className="text-[10px] text-slate-400 font-light mt-1.5 leading-relaxed">
                  Calculated price distribution on continuous bullish macro momentum parameters.
                </p>
              </div>

              {/* Neutral Base-Case Scenario Card */}
              <div className="bg-slate-900/40 hover:bg-slate-900/60 border border-slate-800 rounded-xl p-5 transition-all text-left">
                <div className="flex justify-between items-center text-slate-300 font-mono text-[10px] uppercase">
                  <span>Expected Median</span>
                  <span className="px-1.5 py-0.5 bg-slate-800 rounded text-[8px] font-semibold">
                    Expected Mean
                  </span>
                </div>
                <div className="text-2xl font-mono font-bold text-white tracking-tight mt-3">
                  ${selectedHorizonForecast ? formatPrice(selectedHorizonForecast.expectedPrice) : "---"}
                </div>
                <p className="text-[10px] text-slate-400 font-light mt-1.5 leading-relaxed">
                  Statistical midpoint projection boundary holding systemic macro elements constant.
                </p>
              </div>

              {/* Bearish Scenario Card */}
              <div className="bg-rose-500/5 hover:bg-rose-500/10 border border-rose-500/20 rounded-xl p-5 transition-all text-left">
                <div className="flex justify-between items-center text-rose-400 font-mono text-[10px] uppercase">
                  <span>Bearish Scenario</span>
                  <span className="px-1.5 py-0.5 bg-rose-500/15 rounded text-[8px] font-semibold">
                    -1.28 Std Dev
                  </span>
                </div>
                <div className="text-2xl font-mono font-bold text-rose-400 tracking-tight mt-3">
                  ${selectedHorizonForecast ? formatPrice(selectedHorizonForecast.bearishScenario) : "---"}
                </div>
                <p className="text-[10px] text-slate-400 font-light mt-1.5 leading-relaxed">
                  Support trigger points based on capitulative selling distributions.
                </p>
              </div>
            </div>

            {/* Confidence intervals details */}
            <div className="mt-8 p-4 bg-slate-950 border border-slate-900 rounded-xl flex flex-col md:flex-row justify-between items-stretch gap-6">
              <div className="space-y-1">
                <div className="text-[10px] text-slate-500 font-mono uppercase">95% Confidence Bounds</div>
                <div className="text-sm font-mono text-slate-300 font-semibold leading-relaxed">
                  ${selectedHorizonForecast ? formatPrice(selectedHorizonForecast.confidenceIntervalLow) : "---"}{" "}
                  <span className="text-slate-600">to</span>{" "}
                  ${selectedHorizonForecast ? formatPrice(selectedHorizonForecast.confidenceIntervalHigh) : "---"}
                </div>
              </div>
              <div className="hidden md:block w-1px bg-slate-900" />
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-ping" />
                <p className="text-[10px] text-slate-400 font-light leading-snug">
                  The model estimates with 95% statistical confidence that price outputs will converge within this specific band.
                </p>
              </div>
            </div>
          </div>

          {/* Monte Carlo Simulated Paths Line Chart */}
          <div className="glass-panel rounded-2xl p-6">
            <div className="mb-6">
              <h3 className="text-base font-bold text-white uppercase tracking-wider">
                Monte Carlo Random Walk Simulator (1 Year)
              </h3>
              <p className="text-[10px] text-slate-500 font-mono">
                DISPLAYING 15 SEPARATE CHANNELS FROM 1,000 PATH ASSEMBLIES
              </p>
            </div>

            <div className="h-260px md:h-320px">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mcChartData} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
                  <XAxis dataKey="month" stroke="#475569" fontSize={8} className="font-mono" />
                  <YAxis
                    domain={["auto", "auto"]}
                    stroke="#475569"
                    fontSize={8}
                    className="font-mono"
                    tickFormatter={(tick) => `$${Math.round(tick).toLocaleString()}`}
                  />
                  <CartesianGrid stroke="#1e293b" />
                  <Tooltip labelClassName="text-slate-950 font-mono text-xs" />

                  {/* Programmatic drawing of multiple paths */}
                  {Array.from({ length: 15 }, (_, idx) => (
                    <Line
                      key={idx}
                      type="monotone"
                      dataKey={`Path ${idx + 1}`}
                      stroke={idx % 2 === 0 ? "#f97316" : "#f59e0b"}
                      strokeWidth={1}
                      strokeOpacity={0.15}
                      dot={false}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right Side: Backtesting & Metrics */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-panel rounded-2xl p-6">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest font-mono border-b border-slate-900 pb-4 mb-4">
              Model Evaluation Metrics
            </h3>

            <div className="space-y-4">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-slate-500">Root Mean Sq Err (RMSE)</span>
                <span className="text-orange-400 font-bold">
                  {forecastData ? forecastData.metrics.rmse.toFixed(3) : "23.26"}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-slate-500">Mean Absolute Err (MAE)</span>
                <span className="text-white">
                  {forecastData ? forecastData.metrics.mae.toFixed(3) : "15.65"}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-slate-500">Mean Squared Err (MSE)</span>
                <span className="text-slate-400">
                  {forecastData ? forecastData.metrics.mse.toFixed(2) : "541.22"}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-slate-500">R-Squared Coefficient (R²)</span>
                <span className="text-amber-500 font-bold">
                  {forecastData ? (forecastData.metrics.r2 * 100).toFixed(1) : "99.1"}%
                </span>
              </div>

              <div className="pt-4 border-t border-slate-900/60 text-[10px] text-slate-500 font-mono space-y-1">
                <div>SYNC STATUS: CONVERGED</div>
                <div>LAST RETRAINED: {forecastData ? forecastData.metrics.trainedAt : "Boot"}</div>
              </div>
            </div>
          </div>

          <div className="bg-[#0a0b14] border border-white/5 rounded-2xl p-5 space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Landmark className="w-4 h-4 text-orange-400" />
              Scenario Architecture
            </h4>
            <p className="text-[10px] text-slate-400 font-light leading-relaxed">
              LSTM sequencing incorporates historical multi-day close shifts, creating persistent states using cell memory weights. XGBoost/Random Forest partition relative moving averages in branches to minimize bootstrap variance.
            </p>
          </div>
        </div>
      </div>

      {/* Mandatory Disclaimer Statement */}
      <div className="p-4 bg-slate-950/80 border border-amber-500/20 text-slate-300 rounded-xl space-y-2 max-w-4xl mx-auto flex items-start gap-3 relative z-10">
        <Info className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="text-[10px] font-mono text-amber-500 uppercase font-bold tracking-widest">
            Mandatory Disclaimer Indicator
          </div>
          <p className="text-[11px] leading-relaxed font-light text-slate-400">
            Predictions are probabilistic estimates based on historical data and are not financial advice. Future Bitcoin prices cannot be predicted with certainty.
          </p>
        </div>
      </div>
    </div>
  );
}
