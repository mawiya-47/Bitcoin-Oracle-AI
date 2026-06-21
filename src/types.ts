export interface HistoricalPoint {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  sma20?: number;
  sma50?: number;
  ema12?: number;
  ema26?: number;
  rsi?: number;
  macd?: number;
  macdSignal?: number;
  macdHist?: number;
  bbUpper?: number;
  bbLower?: number;
  bbMiddle?: number;
}

export interface PredictionHorizon {
  horizonDays: number;
  horizonLabel: string;
  expectedPrice: number;
  bullishScenario: number;
  bearishScenario: number;
  confidenceIntervalLow: number;
  confidenceIntervalHigh: number;
}

export interface PredictionPayload {
  model: string;
  modelName: string;
  currentPrice: number;
  predictions: PredictionHorizon[];
  metrics: {
    mse: number;
    rmse: number;
    mae: number;
    r2: number;
    trainedAt: string;
  };
}

export interface MonteCarloHorizon {
  bearish: number;
  median: number;
  bullish: number;
}

export interface MonteCarloPayload {
  description: string;
  initialPrice: number;
  annualizedDrift: number;
  annualizedVol: number;
  horizons: {
    "1 Year": MonteCarloHorizon;
    "5 Year": MonteCarloHorizon;
    "10 Year": MonteCarloHorizon;
  };
  samplePaths: Array<{
    pathId: number;
    points: Array<{
      month: number;
      price: number;
    }>;
  }>;
}

export interface RiskAnalysisPayload {
  annualizedVolatility: number;
  maxDrawdown: number;
  sharpeRatio: number;
  valueAtRisk95: number;
  betaEstimate: number;
  riskRating: string;
  distribution: Array<{
    binLabel: string;
    midpoint: number;
    countKey: number;
  }>;
}

export interface LivePricePayload {
  price: number;
  change24h: number;
  high24h: number;
  low24h: number;
  volume24h: number;
  timestamp: string;
}

export interface TechnicalIndicatorsPayload {
  price: number;
  sma20: number;
  sma50: number;
  rsi: number;
  rsiStatus: string;
  macd: {
    line: number;
    signal: number;
    histogram: number;
    trend: string;
  };
  bollingerBands: {
    upper: number;
    lower: number;
    middle: number;
    bandwidth: number;
  };
  trend: string;
}

export interface SystemLog {
  timestamp: string;
  level: string;
  message: string;
}

export interface SystemLogsPayload {
  logs: SystemLog[];
  metrics: Record<string, {
    mse: number;
    rmse: number;
    mae: number;
    r2: number;
    trainedAt: string;
  }>;
}
