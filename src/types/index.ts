export interface Anomaly {
  id: string;
  type: 'micro' | 'macro';
  message: string;
  impact: number; // e.g., -5 for 5% drop
  timestamp: string;
  playerTarget?: string;
}

export interface PlayerData {
  id: number;
  name: string;
  role: string;
  stress: number;      // Stress & Fatigue Monitoring (4.4)
  impact: number;      // Macro-Impact Score (3.0)
  status: 'optimal' | 'warning' | 'critical';
  recentErrors: number;
}

export interface GameState {
  winProbability: number;
  tempo: number;
  anomalies: Anomaly[];
}
