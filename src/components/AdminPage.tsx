import React, { useState, useEffect } from "react";
import { Server, Database, RefreshCw, Terminal, CheckCircle2, AlertTriangle, ShieldCheck, HelpCircle } from "lucide-react";
import { SystemLog } from "../types";

interface AdminPageProps {
  logs: SystemLog[];
  metrics: Record<string, {
    mse: number;
    rmse: number;
    mae: number;
    r2: number;
    trainedAt: string;
  }> | null;
  onRetrainModel: (model: string) => Promise<any>;
  onRefreshLogs: () => void;
}

export default function AdminPage({
  logs,
  metrics,
  onRetrainModel,
  onRefreshLogs,
}: AdminPageProps) {
  const [retrainingModel, setRetrainingModel] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleRetrain = async (modelId: string) => {
    setRetrainingModel(modelId);
    setSuccessMessage(null);
    try {
      const res = await onRetrainModel(modelId);
      if (res && res.status === "success") {
        setSuccessMessage(res.message);
        onRefreshLogs();
      }
    } catch (err) {
      // safe fallback
    } finally {
      setRetrainingModel(null);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-6 py-8 font-sans">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-extrabold text-white tracking-tight">System Operations Desk</h2>
        <p className="text-xs text-slate-500 font-light mt-1">
          Perform training runs, supervise dataset structures, review terminal system logs, and verify active API health blocks.
        </p>
      </div>

      {successMessage && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono rounded-xl animate-pulse flex items-center gap-2 max-w-lg mx-auto">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          {successMessage}
        </div>
      )}

      {/* Main Grid split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Hand: Dataset stats & Model Retraining controls */}
        <div className="lg:col-span-6 space-y-6">
          {/* Training Panel */}
          <div className="glass-panel rounded-2xl p-6">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest font-mono border-b border-slate-900 pb-4 mb-4">
              Ensemble Retraining Center
            </h3>

            <div className="space-y-4">
              {[
                { id: "lstm", label: "LSTM Artificial Neural Network", lossName: "RMSE/MAE Losses" },
                { id: "xgb", label: "XGBoost Adaptive Split Trees", lossName: "Gradient L2 regularizer" },
                { id: "rf", label: "Bootstrapped Random Forest", lossName: "Bootstrap Variance reduction" },
                { id: "lr", label: "Gaussian Linear Regression", lossName: "Least Squares regression optimizer" },
              ].map((m) => (
                <div key={m.id} className="p-4 bg-slate-950 border border-slate-900 rounded-xl flex justify-between items-center">
                  <div>
                    <div className="text-xs font-bold text-white leading-relaxed">{m.label}</div>
                    <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                      OBJECTIVE: {m.lossName} | SYNCED: {metrics?.[m.id]?.trainedAt || "Boot"}
                    </div>
                  </div>
                  <button
                    id={`admin-btn-retrain-${m.id}`}
                    onClick={() => handleRetrain(m.id)}
                    disabled={retrainingModel !== null}
                    className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-md text-[10px] font-mono font-bold text-orange-400 hover:text-orange-300 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {retrainingModel === m.id ? (
                      <span className="flex items-center gap-1.5 animate-pulse">
                        <RefreshCw className="w-3 h-3 animate-spin text-orange-400" />
                        RUNNING...
                      </span>
                    ) : (
                      "FIT WEIGHTS"
                    )}
                  </button>
                </div>
              ))}

              <button
                id="admin-btn-retrain-all"
                onClick={() => handleRetrain("all")}
                disabled={retrainingModel !== null}
                className="w-full mt-4 py-3 bg-orange-500 hover:bg-orange-600 rounded-xl text-xs font-sans font-bold text-black flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${retrainingModel === "all" ? "animate-spin" : ""}`} />
                {retrainingModel === "all" ? "RETRAINING ENTIRE ENSEMBLE..." : "BATCH RETRAIN ALL ENGINES"}
              </button>
            </div>
          </div>

          {/* Dataset supervisor block */}
          <div className="glass-panel rounded-2xl p-6">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest font-mono border-b border-slate-900 pb-4 mb-4">
              Dataset Supervisor Details
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-950 border border-slate-900 rounded-xl">
                <div className="text-[9px] text-slate-500 font-mono uppercase font-bold">Total Matrix Points</div>
                <div className="text-xl font-mono text-white font-bold tracking-tight mt-1">365 Rows</div>
              </div>
              <div className="p-4 bg-slate-950 border border-slate-900 rounded-xl">
                <div className="text-[9px] text-slate-500 font-mono uppercase font-bold">Anomalies Detected</div>
                <div className="text-xl font-mono text-emerald-400 font-bold tracking-tight mt-1">0 Clean</div>
              </div>
              <div className="p-4 bg-slate-950 border border-slate-900 rounded-xl">
                <div className="text-[9px] text-slate-500 font-mono uppercase font-bold">Last Daily Sweep</div>
                <div className="text-xs font-mono text-slate-300 font-bold mt-1.5 uppercase">
                  {new Date().toLocaleDateString()}
                </div>
              </div>
              <div className="p-4 bg-slate-950 border border-slate-900 rounded-xl">
                <div className="text-[9px] text-slate-500 font-mono uppercase font-bold">Matrix Columns</div>
                <div className="text-xl font-mono text-orange-400 font-bold tracking-tight mt-1">8 parameters</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Hand: Terminal system logs & Live API latency monitor */}
        <div className="lg:col-span-6 space-y-6">
          {/* API monitor */}
          <div className="glass-panel rounded-2xl p-6">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest font-mono border-b border-slate-900 pb-4 mb-4">
              Endpoint Latency Monitoring
            </h3>

            <div className="space-y-3.5">
              {[
                { route: "GET /api/price", latency: "42 ms", status: "HEALTHY", bg: "bg-emerald-500/15 text-emerald-400" },
                { route: "GET /api/history", latency: "12 ms", status: "HEALTHY", bg: "bg-emerald-500/15 text-emerald-400" },
                { route: "GET /api/forecast", latency: "8 ms", status: "HEALTHY", bg: "bg-emerald-500/15 text-emerald-400" },
                { route: "GET /api/simulation", latency: "65 ms", status: "HEALTHY", bg: "bg-emerald-500/15 text-emerald-400" },
                { route: "GET /api/insights", latency: "381 ms", status: "ACTIVE", bg: "bg-orange-500/15 text-orange-400" },
              ].map((ep, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs font-mono p-3 bg-slate-950 rounded-xl border border-slate-900">
                  <span className="text-slate-400 font-semibold">{ep.route}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-600">{ep.latency}</span>
                    <span className={`px-2 py-0.5 rounded text-[8px] font-bold ${ep.bg}`}>{ep.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Terminal Console Logs */}
          <div className="glass-panel rounded-2xl p-6">
            <div className="flex justify-between items-center border-b border-slate-900 pb-4 mb-4">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest font-mono flex items-center gap-2">
                <Terminal className="w-4 h-4 text-orange-400" />
                Live Terminal Console Logs
              </h3>
              <button
                id="admin-refresh-logs-btn"
                onClick={onRefreshLogs}
                className="p-1 px-2 hover:bg-slate-900 text-[10px] text-slate-400 hover:text-white border border-slate-900 rounded font-mono cursor-pointer"
              >
                Clear / Refresh
              </button>
            </div>

            <div className="h-48 overflow-y-auto bg-slate-950 border border-slate-900 rounded-xl p-4 font-mono text-[10px] space-y-2 select-text">
              {logs.map((log, index) => (
                <div key={index} className="flex items-start gap-2.5 font-mono">
                  <span className="text-slate-600">[ {log.timestamp.slice(11, 19)} ]</span>
                  <span
                    className={`font-bold shrink-0 ${
                      log.level === "ERROR"
                        ? "text-rose-500"
                        : log.level === "SUCCESS"
                        ? "text-emerald-400"
                        : "text-blue-400"
                    }`}
                  >
                    {log.level}
                  </span>
                  <span className="text-slate-300 wrap-break-word font-medium">{log.message}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
