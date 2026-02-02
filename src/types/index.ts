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
  // Extended LoL Stats
  champion?: string;
  kills?: number;
  deaths?: number;
  assists?: number;
  kda?: number;
  cs?: number;
  csPerMin?: number;
  gold?: number;
  goldShare?: number;
  damageShare?: number;
  visionScore?: number;
  dpm?: number;
  killParticipation?: number;
}

export interface GameState {
  winProbability: number;
  tempo: number;
  anomalies: Anomaly[];
}

export interface SquadMetric {
  name: string;
  kda: string;
  cs: number;
  gold_diff: number;
  vision_score: number;
}

export interface ProbabilityMetrics {
  site_retake_success: string;
  baron_contest_rate: string;
  clutch_potential: string;
  tempo_deviation: string;
}

export interface MieAnalysis {
  summary: string;
  squad_telemetry: SquadMetric[];
  probability_metrics: ProbabilityMetrics;
  recommendation: string;
}

export interface TelemetryData {
  win_prob: number;
  predictions: any[];
  mie_analysis: MieAnalysis;
}

// LoL Game State Interface
export interface LoLGameData {
  currentTime: string;
  teamKills: number;
  enemyKills: number;
  teamGold: number;
  enemyGold: number;
  goldDiff: number;
  mapName: string;
  teamDragons: number;
  enemyDragons: number;
  teamBarons: number;
  enemyBarons: number;
  teamTowers: number;
  enemyTowers: number;
  teamInhibitors: number;
  enemyInhibitors: number;
  dragonSoul: string | null;
  elderDragon: boolean;
}

export interface LoLPrediction {
  win_probability: number;
  confidence: number;
  prediction: string;
  risk_level: string;
  model_accuracy: number;
  roc_auc: number;
  total_samples: number;
  model_name: string;
}

export interface FeatureImportance {
  name: string;
  importance: number;
}
