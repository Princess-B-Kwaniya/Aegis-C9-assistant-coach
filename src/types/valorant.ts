export interface ValorantAnomaly {
  id: string;
  type: 'tactical' | 'mechanical';
  message: string;
  impact: number;
  timestamp: string;
  playerTarget?: string;
}

export interface ValorantPlayerData {
  id: number;
  name: string;
  agent: string;
  role: 'Duelist' | 'Controller' | 'Sentinel' | 'Initiator';
  kills: number;
  deaths: number;
  assists: number;
  adr: number; // Average Damage per Round
  hs: number;  // Headshot percentage
  firstBloods: number;
  clutches: number;
  status: 'optimal' | 'warning' | 'critical';
  acs: number; // Average Combat Score
  kast: number; // Kill/Assist/Survive/Trade percentage
}

export interface ValorantGameState {
  winProbability: number;
  currentRound: number;
  teamScore: number;
  enemyScore: number;
  economyRating: number;
  economyStatus: 'Full Buy' | 'Half Buy' | 'Eco' | 'Force Buy';
  currentSide: 'Attack' | 'Defense';
  mapName: string;
  firstBloods: number;
  clutches: number;
  aces: number;
  anomalies: ValorantAnomaly[];
}
