import React, { useState } from "react";
import { Download, FileText, Printer, CheckCircle2, ShieldCheck, HelpCircle } from "lucide-react";
import { PredictionPayload, RiskAnalysisPayload } from "../types";

interface ReportsPageProps {
  forecastData: PredictionPayload | null;
  riskData: RiskAnalysisPayload | null;
  loading: boolean;
}

export default function ReportsPage({ forecastData, riskData, loading }: ReportsPageProps) {
  const [reportTitle, setReportTitle] = useState<string>("Institutional Bitcoin Volatility & Forecast Briefing");
  const [analystName, setAnalystName] = useState<string>("Advanced Oracle Analytics Core");
  const [customComments, setCustomComments] = useState<string>(
    "Volatility vectors suggest a consolidatory accumulation bound preceding further seasonal movements. Macro trends remain protected by immediate support bands."
  );

  const [downloadingCsv, setDownloadingCsv] = useState<boolean>(false);
  const [triggerPrintMessage, setTriggerPrintMessage] = useState<boolean>(false);

  const handleDownloadCsv = async () => {
    setDownloadingCsv(true);
    try {
      window.open("/api/report?type=csv", "_blank");
    } catch (err) {
      // safe fallback
    } finally {
      setTimeout(() => setDownloadingCsv(false), 1000);
    }
  };

  const handleTriggerPrint = () => {
    setTriggerPrintMessage(true);
    setTimeout(() => {
      window.print();
      setTriggerPrintMessage(false);
    }, 400);
  };

  const formatPrice = (val: number) => {
    return val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-6 py-8 font-sans">
      {/* Header, visible on screen only */}
      <div className="no-print flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">Institutional Research Reporting</h2>
          <p className="text-xs text-slate-500 font-light mt-1">
            Customise parameters, append narrative insights, and extract printable PDF briefs or forecast CSV grids.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            id="report-download-csv-btn"
            onClick={handleDownloadCsv}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg text-xs font-mono text-orange-400 flex items-center justify-center gap-2 cursor-pointer transition-all"
            disabled={downloadingCsv}
          >
            <Download className="w-4 h-4" />
            {downloadingCsv ? "EXPORTING CSV..." : "DOWNLOAD CSV FORECASTS"}
          </button>

          <button
            id="report-print-pdf-btn"
            onClick={handleTriggerPrint}
            className="px-4 py-2 bg-orange-500 hover:bg-orange-600 rounded-lg text-xs font-sans text-black font-bold uppercase flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <Printer className="w-4 h-4" />
            COMPILE PRINTABLE PDF
          </button>
        </div>
      </div>

      {triggerPrintMessage && (
        <div className="no-print p-3 bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-mono rounded-lg animate-pulse flex items-center gap-2 max-w-lg mx-auto">
          <CheckCircle2 className="w-4 h-4" />
          Synchronizing page styling definitions. Opening browser print configuration desk...
        </div>
      )}

      {/* Side-by-side editing workspace, visible on screen only */}
      <div className="no-print grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Editing parameters panel */}
        <div className="lg:col-span-4 glass-panel rounded-2xl p-6 space-y-6">
          <h3 className="text-xs font-bold text-white uppercase tracking-widest font-mono border-b border-slate-900 pb-3">
            Customise Brief Parameters
          </h3>

          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] text-slate-500 font-mono uppercase font-bold">Document Frame Title</label>
              <input
                type="text"
                value={reportTitle}
                onChange={(e) => setReportTitle(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-900 rounded-lg text-slate-200 text-xs outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-slate-500 font-mono uppercase font-bold">Signee / Analyst Header</label>
              <input
                type="text"
                value={analystName}
                onChange={(e) => setAnalystName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-900 rounded-lg text-slate-200 text-xs outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-slate-500 font-mono uppercase font-bold">Appended Executive Notes</label>
              <textarea
                rows={5}
                value={customComments}
                onChange={(e) => setCustomComments(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-900 rounded-lg text-slate-200 text-xs outline-none resize-none"
              />
            </div>
          </div>
        </div>

        {/* Mock Live PDF Preview */}
        <div className="lg:col-span-8 space-y-4">
          <div className="text-[10px] text-slate-500 font-mono uppercase tracking-wider flex items-center gap-1.5 pl-1.5">
            <FileText className="w-3.5 h-3.5" />
            A4 Document Rasterized Preview (Live Feed)
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 relative shadow-2xl max-h-160 overflow-y-auto">
            {/* Real printable document content */}
            <div className="bg-white text-slate-950 p-8 md:p-12 rounded-lg shadow-inner space-y-8 font-sans">
              {/* Header */}
              <div className="border-b-2 border-slate-850 pb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-1">
                  <div className="text-slate-500 text-[10px] font-mono uppercase tracking-widest font-bold">
                    SYSTEMS_REPORT_EXPORT
                  </div>
                  <h1 className="text-xl font-black text-slate-900 leading-tight">{reportTitle}</h1>
                  <p className="text-xs text-slate-500 font-mono">{analystName}</p>
                </div>
                <div className="text-right font-mono text-[9px] text-slate-400 space-y-0.5 shrink-0">
                  <div>DATE: {new Date().toLocaleDateString()}</div>
                  <div>PLATFORM: ORACLE_CORE_v1</div>
                </div>
              </div>

              {/* Status block */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-50 border border-slate-100 p-4 rounded-lg">
                <div>
                  <div className="text-[9px] text-slate-400 font-mono uppercase font-bold">Last Spot Evaluated</div>
                  <div className="text-lg font-mono font-bold text-slate-900 mt-1">
                    ${forecastData ? formatPrice(forecastData.currentPrice) : "$96,420.00"}
                  </div>
                </div>
                <div>
                  <div className="text-[9px] text-slate-400 font-mono uppercase font-bold">Calculated Volatility (1Y)</div>
                  <div className="text-lg font-mono font-bold text-orange-600 mt-1">
                    {riskData ? riskData.annualizedVolatility.toFixed(1) : "45.6"}%
                  </div>
                </div>
                <div>
                  <div className="text-[9px] text-slate-400 font-mono uppercase font-bold">Sharpe Ratio</div>
                  <div className="text-lg font-mono font-bold text-amber-700 mt-1">
                    {riskData ? riskData.sharpeRatio.toFixed(2) : "1.84"}
                  </div>
                </div>
              </div>

              {/* Forecaster Horizon scenario tables */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
                  I. Scenario Probability Horisons
                </h3>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-[11px] border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-400 uppercase font-mono text-[9px]">
                        <th className="pb-2">Horizon</th>
                        <th className="pb-2">Expected Case</th>
                        <th className="pb-2 text-emerald-700">Bullish Scenario (+1.28σ)</th>
                        <th className="pb-2 text-rose-700">Bearish Scenario (-1.28σ)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700 font-mono">
                      {forecastData?.predictions.map((p, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50">
                          <td className="py-2.5 font-sans font-medium text-slate-900">{p.horizonLabel}</td>
                          <td className="py-2.5 font-bold">${formatPrice(p.expectedPrice)}</td>
                          <td className="py-2.5 text-emerald-600 font-bold">${formatPrice(p.bullishScenario)}</td>
                          <td className="py-2.5 text-rose-500 font-bold">${formatPrice(p.bearishScenario)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Comments block */}
              <div className="space-y-2 border-t border-slate-100 pt-6">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
                  II. Executive Analyst Notes
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed font-light font-sans">{customComments}</p>
              </div>

              {/* Disclaimer */}
              <div className="p-3 bg-amber-500/5 border border-amber-500/15 text-slate-500 rounded text-[9px] leading-relaxed font-sans mt-8 flex gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5 font-bold" />
                <p>
                  Predictions are probabilistic estimates based on historical data and are not financial advice. Future Bitcoin prices cannot be predicted with certainty.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Complete print component - hidden on screen, visible only during print call */}
      <div className="print-only hidden p-10 bg-white text-slate-950 space-y-10">
        <div className="border-b-4 border-slate-900 pb-8 flex justify-between items-center">
          <div className="space-y-1">
            <div className="text-[10px] text-slate-400 font-mono tracking-widest font-black">
              ORACLE_FORECASTING_EXPORT
            </div>
            <h1 className="text-2xl font-black tracking-tight text-slate-950 uppercase">{reportTitle}</h1>
            <p className="text-xs font-mono text-slate-500">{analystName}</p>
          </div>
          <div className="text-right font-mono text-xs text-slate-400">
            <div>DATE: {new Date().toLocaleDateString()}</div>
            <div>COMPILER ID: ORACLE_v1_NODE</div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-8 bg-slate-50 p-6 rounded-xl border border-slate-200">
          <div>
            <div className="text-[10px] font-mono uppercase text-slate-400">Spot Asset Target</div>
            <div className="text-xl font-mono font-bold text-slate-950 mt-1">
              ${forecastData ? formatPrice(forecastData.currentPrice) : "$96,420.00"}
            </div>
          </div>
          <div>
            <div className="text-[10px] font-mono uppercase text-slate-400">Annual Volatility</div>
            <div className="text-xl font-mono font-bold text-orange-600 mt-1">
              {riskData ? riskData.annualizedVolatility.toFixed(1) : "45.6"}%
            </div>
          </div>
          <div>
            <div className="text-[10px] font-mono uppercase text-slate-400">Evaluation Sharpe</div>
            <div className="text-xl font-mono font-bold text-amber-800 mt-1">
              {riskData ? riskData.sharpeRatio.toFixed(2) : "1.84"}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-950 uppercase tracking-widest font-mono">
            I. Horizon Deviation Matrices
          </h3>
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b-2 border-slate-200 text-slate-400 uppercase font-mono text-[10px]">
                <th className="pb-3 text-slate-600">Period</th>
                <th className="pb-3 text-slate-600">Expected Value</th>
                <th className="pb-3 text-emerald-800">Bullish Upper Case</th>
                <th className="pb-3 text-rose-800">Bearish Support Case</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800 font-mono">
              {forecastData?.predictions.map((p, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="py-3 font-sans font-medium text-slate-950">{p.horizonLabel}</td>
                  <td className="py-3 font-bold">${formatPrice(p.expectedPrice)}</td>
                  <td className="py-3 text-emerald-700 font-bold">${formatPrice(p.bullishScenario)}</td>
                  <td className="py-3 text-rose-700 font-bold">${formatPrice(p.bearishScenario)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="space-y-3 pt-6 border-t border-slate-200">
          <h3 className="text-sm font-bold text-slate-950 uppercase tracking-widest font-mono">
            II. Narrative Market Review
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed font-sans">{customComments}</p>
        </div>

        <div className="p-4 bg-slate-50 border border-slate-200 text-[10px] leading-relaxed text-slate-500 rounded-lg">
          <strong>Mandatory Safety Notice:</strong> Predictions are probabilistic estimates based on historical data and are not financial advice. Future Bitcoin prices cannot be predicted with certainty.
        </div>
      </div>
    </div>
  );
}
