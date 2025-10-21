
export type Language = 'en' | 'km';
export type View = 'dashboard' | 'vip' | 'admin' | 'settings';

export interface Signal {
  signal: 'BUY' | 'SELL' | 'WAIT';
  confidence: number;
  currentPrice: number;
  timeframe: 'Scalp' | 'Intraday' | 'Swing';
  summary: string;
  analysis: {
    rsi: string;
    ema: string;
    macd: string;
    supportResistance: string;
  };
  entry: number;
  stopLoss: number;
  takeProfit1: number;
  takeProfit2: number;
}

export interface MarketEvent {
  name: string;
  impact: 'high' | 'medium' | 'low';
  date: string;
}

export interface MarketSummaryData {
  news: string;
  dxy: string;
  events: MarketEvent[];
  lastUpdated: string;
}

export interface HistoricalSignal {
  id: number;
  type: 'BUY' | 'SELL';
  entry: number;
  sl: number;
  tp: number;
  result: 'WIN' | 'LOSS' | 'PENDING';
  pips: number;
  timestamp: string;
}

export type UserStatus = 'VIP' | 'Free';

export interface User {
  id: string; // Use string for MongoDB _id compatibility
  name: string;
  email: string;
  key: string;
  password?: string; // For auth, not sent to client
  status: UserStatus;
  analyses?: AnalysisRecord[];
  analysisCount: number;
  lastAnalysisTimestamp: string; // ISO string
}

export interface AnalysisRecord extends Signal {
  id: string; // Use string for MongoDB _id compatibility
  userId: string;
  timestamp: string;
}