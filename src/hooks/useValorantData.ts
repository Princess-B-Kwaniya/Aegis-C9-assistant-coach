import { useState, useEffect, useMemo } from 'react';
import { ValorantPlayerData, ValorantGameState } from '@/types/valorant';

// Role type matching ValorantPlayerData
type ValorantRole = 'Duelist' | 'Controller' | 'Sentinel' | 'Initiator';

// ML Model Predictions Interface
interface MLPredictions {
  winProbability: number;
  confidence: number;
  prediction: 'Win' | 'Loss';
  riskLevel: 'Low' | 'Medium' | 'High';
  modelName: string;
  modelAccuracy: number;
  rocAuc: number;
  totalSamples: number;
  probabilityHistory: { time: string; probability: number }[];
  topFeatures: { name: string; importance: number }[];
  allFeatures: { name: string; importance: number }[];
}

// Team rosters database
const teamRosters: Record<string, { name: string; agent: string; role: ValorantRole }[]> = {
  'Cloud9': [
    { name: 'TenZ', agent: 'Jett', role: 'Duelist' },
    { name: 'Derrek', agent: 'Sova', role: 'Initiator' },
    { name: 'Zellsis', agent: 'Omen', role: 'Controller' },
    { name: 'mCe', agent: 'Killjoy', role: 'Sentinel' },
    { name: 'Jakee', agent: 'Raze', role: 'Duelist' },
  ],
  'Sentinels': [
    { name: 'TenZ', agent: 'Raze', role: 'Duelist' },
    { name: 'zekken', agent: 'Jett', role: 'Duelist' },
    { name: 'Zellsis', agent: 'Gekko', role: 'Initiator' },
    { name: 'Sacy', agent: 'Fade', role: 'Initiator' },
    { name: 'johnqt', agent: 'Omen', role: 'Controller' },
  ],
  'Fnatic': [
    { name: 'Derke', agent: 'Jett', role: 'Duelist' },
    { name: 'Alfajer', agent: 'Raze', role: 'Duelist' },
    { name: 'Boaster', agent: 'Astra', role: 'Controller' },
    { name: 'Chronicle', agent: 'Cypher', role: 'Sentinel' },
    { name: 'Leo', agent: 'Skye', role: 'Initiator' },
  ],
  'LOUD': [
    { name: 'aspas', agent: 'Jett', role: 'Duelist' },
    { name: 'Less', agent: 'Chamber', role: 'Sentinel' },
    { name: 'Saadhak', agent: 'Fade', role: 'Initiator' },
    { name: 'tuyz', agent: 'Harbor', role: 'Controller' },
    { name: 'cauanzin', agent: 'Raze', role: 'Duelist' },
  ],
  'DRX': [
    { name: 'BuZz', agent: 'Chamber', role: 'Sentinel' },
    { name: 'MaKo', agent: 'Viper', role: 'Controller' },
    { name: 'Rb', agent: 'Jett', role: 'Duelist' },
    { name: 'stax', agent: 'KAY/O', role: 'Initiator' },
    { name: 'Foxy9', agent: 'Raze', role: 'Duelist' },
  ],
  'Paper Rex': [
    { name: 'f0rsakeN', agent: 'Jett', role: 'Duelist' },
    { name: 'Jinggg', agent: 'Raze', role: 'Duelist' },
    { name: 'd4v41', agent: 'Fade', role: 'Initiator' },
    { name: 'mindfreak', agent: 'Omen', role: 'Controller' },
    { name: 'Monyet', agent: 'Killjoy', role: 'Sentinel' },
  ],
  'NRG Esports': [
    { name: 's0m', agent: 'Jett', role: 'Duelist' },
    { name: 'Ethan', agent: 'Skye', role: 'Initiator' },
    { name: 'FNS', agent: 'Astra', role: 'Controller' },
    { name: 'crashies', agent: 'Sova', role: 'Initiator' },
    { name: 'Victor', agent: 'Raze', role: 'Duelist' },
  ],
  '100 Thieves': [
    { name: 'Asuna', agent: 'Raze', role: 'Duelist' },
    { name: 'Cryocells', agent: 'Jett', role: 'Duelist' },
    { name: 'bang', agent: 'Omen', role: 'Controller' },
    { name: 'Stellar', agent: 'Sova', role: 'Initiator' },
    { name: 'Boostio', agent: 'Killjoy', role: 'Sentinel' },
  ],
  'Evil Geniuses': [
    { name: 'Demon1', agent: 'Jett', role: 'Duelist' },
    { name: 'jawgemo', agent: 'Raze', role: 'Duelist' },
    { name: 'Boostio', agent: 'Killjoy', role: 'Sentinel' },
    { name: 'C0M', agent: 'Fade', role: 'Initiator' },
    { name: 'Potter', agent: 'Omen', role: 'Controller' },
  ],
  'T1': [
    { name: 'Sayaplayer', agent: 'Jett', role: 'Duelist' },
    { name: 'xeta', agent: 'Sova', role: 'Initiator' },
    { name: 'Carpe', agent: 'Raze', role: 'Duelist' },
    { name: 'ban', agent: 'Omen', role: 'Controller' },
    { name: 'Munchkin', agent: 'Cypher', role: 'Sentinel' },
  ],
  'Gen.G': [
    { name: 'TS', agent: 'Jett', role: 'Duelist' },
    { name: 'Meteor', agent: 'Sova', role: 'Initiator' },
    { name: 'Lakia', agent: 'Viper', role: 'Controller' },
    { name: 'k1ng', agent: 'Raze', role: 'Duelist' },
    { name: 'Secret', agent: 'Killjoy', role: 'Sentinel' },
  ],
  'Team Liquid': [
    { name: 'Jamppi', agent: 'Jett', role: 'Duelist' },
    { name: 'nAts', agent: 'Cypher', role: 'Sentinel' },
    { name: 'Sayf', agent: 'Raze', role: 'Duelist' },
    { name: 'soulcas', agent: 'Skye', role: 'Initiator' },
    { name: 'dimasick', agent: 'Omen', role: 'Controller' },
  ],
  'G2 Esports': [
    { name: 'mixwell', agent: 'Chamber', role: 'Sentinel' },
    { name: 'nukkye', agent: 'Raze', role: 'Duelist' },
    { name: 'hoody', agent: 'Fade', role: 'Initiator' },
    { name: 'AvovA', agent: 'Omen', role: 'Controller' },
    { name: 'Meddo', agent: 'Jett', role: 'Duelist' },
  ],
  'FaZe Clan': [
    { name: 'babybay', agent: 'Jett', role: 'Duelist' },
    { name: 'dicey', agent: 'Raze', role: 'Duelist' },
    { name: 'supamen', agent: 'Sova', role: 'Initiator' },
    { name: 'flyuh', agent: 'Omen', role: 'Controller' },
    { name: 'POISED', agent: 'Killjoy', role: 'Sentinel' },
  ],
  'TSM': [
    { name: 'corey', agent: 'Jett', role: 'Duelist' },
    { name: 'Rossy', agent: 'Fade', role: 'Initiator' },
    { name: 'seven', agent: 'Omen', role: 'Controller' },
    { name: 'gMd', agent: 'Cypher', role: 'Sentinel' },
    { name: 'Subroza', agent: 'Raze', role: 'Duelist' },
  ],
};

// Default roster for teams not in database
const defaultRoster: { name: string; agent: string; role: ValorantRole }[] = [
  { name: 'Player 1', agent: 'Jett', role: 'Duelist' },
  { name: 'Player 2', agent: 'Sova', role: 'Initiator' },
  { name: 'Player 3', agent: 'Omen', role: 'Controller' },
  { name: 'Player 4', agent: 'Killjoy', role: 'Sentinel' },
  { name: 'Player 5', agent: 'Raze', role: 'Duelist' },
];

// Simulated ML Model Data (based on trained model from notebook)
const generateMLPredictions = (teamName: string, opponentName: string): MLPredictions => {
  // Generate base probability based on team matchup (simulated)
  const teamStrength = getTeamStrength(teamName);
  const oppStrength = getTeamStrength(opponentName);
  const strengthDiff = teamStrength - oppStrength;
  
  const baseProb = 50 + strengthDiff * 5 + (Math.random() * 10 - 5);
  const winProb = Math.min(95, Math.max(25, baseProb));
  
  // Generate historical probability data
  const historyLength = 25;
  const probabilityHistory: { time: string; probability: number }[] = [];
  let currentProb = 45 + strengthDiff * 3;
  
  for (let i = 0; i < historyLength; i++) {
    const time = new Date(Date.now() - (historyLength - i) * 60000);
    currentProb = Math.min(95, Math.max(25, currentProb + (Math.random() * 8 - 3)));
    probabilityHistory.push({
      time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      probability: Math.round(currentProb * 10) / 10
    });
  }
  // Add current prediction
  probabilityHistory.push({
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    probability: winProb
  });

  return {
    winProbability: winProb,
    confidence: 78.5 + Math.random() * 10,
    prediction: winProb >= 50 ? 'Win' : 'Loss',
    riskLevel: winProb >= 65 ? 'Low' : winProb >= 45 ? 'Medium' : 'High',
    modelName: 'Random Forest',
    modelAccuracy: 87.3,
    rocAuc: 0.912,
    totalSamples: 68302,
    probabilityHistory,
    topFeatures: [
      { name: 'First Blood Rate', importance: 18 },
      { name: 'Round Win Streak', importance: 16 },
      { name: 'Economy Control', importance: 14 },
      { name: 'Trade Efficiency', importance: 12 },
      { name: 'Clutch Win Rate', importance: 10 },
    ],
    allFeatures: [
      { name: 'First Blood Rate', importance: 18 },
      { name: 'Round Win Streak', importance: 16 },
      { name: 'Economy Control', importance: 14 },
      { name: 'Trade Efficiency', importance: 12 },
      { name: 'Clutch Win Rate', importance: 10 },
      { name: 'Utility Damage', importance: 9 },
      { name: 'Team ACS', importance: 8 },
      { name: 'HS Percentage', importance: 6 },
      { name: 'KAST Average', importance: 4 },
      { name: 'ADR Diff', importance: 3 },
    ],
  };
};

// Get team strength rating (0-10 scale)
function getTeamStrength(teamName: string): number {
  const tierS = ['Fnatic', 'LOUD', 'Sentinels', 'DRX', 'Paper Rex'];
  const tierA = ['Cloud9', 'NRG Esports', 'Evil Geniuses', 'Gen.G', 'Team Liquid', 'G2 Esports'];
  const tierB = ['100 Thieves', 'T1', 'FaZe Clan', 'TSM', 'OpTic Gaming'];
  
  const normalizedName = teamName.toLowerCase();
  
  if (tierS.some(t => t.toLowerCase() === normalizedName)) return 9 + Math.random();
  if (tierA.some(t => t.toLowerCase() === normalizedName)) return 7 + Math.random();
  if (tierB.some(t => t.toLowerCase() === normalizedName)) return 5 + Math.random();
  return 4 + Math.random() * 2;
}

// Player Data with full stats (no blanks)
const generatePlayers = (teamName: string): ValorantPlayerData[] => {
  // Find team roster or use default
  const rosterKey = Object.keys(teamRosters).find(
    key => key.toLowerCase() === teamName.toLowerCase()
  );
  const roster = rosterKey ? teamRosters[rosterKey] : defaultRoster;
  
  // Generate random but consistent stats for each player
  return roster.map((player, index): ValorantPlayerData => {
    const isStarPlayer = index === 0;
    const baseKills = isStarPlayer ? 20 : 12 + Math.floor(Math.random() * 8);
    const deaths = 10 + Math.floor(Math.random() * 8);
    const assists = 4 + Math.floor(Math.random() * 8);
    const statusValue = Math.random();
    
    return {
      id: index + 1,
      name: player.name,
      agent: player.agent,
      role: player.role,
      kills: baseKills + Math.floor(Math.random() * 5),
      deaths,
      assists,
      adr: 110 + Math.random() * 80,
      hs: 18 + Math.floor(Math.random() * 15),
      firstBloods: isStarPlayer ? 5 + Math.floor(Math.random() * 3) : Math.floor(Math.random() * 4),
      clutches: Math.floor(Math.random() * 3),
      status: statusValue > 0.2 ? 'optimal' : 'warning',
      acs: 150 + Math.floor(Math.random() * 150),
      kast: 60 + Math.floor(Math.random() * 25),
    };
  });
};

// Game State with full data
const generateGameState = (teamName: string, opponentName: string): ValorantGameState => {
  const maps = ['Ascent', 'Haven', 'Bind', 'Split', 'Icebox', 'Breeze', 'Fracture', 'Pearl', 'Lotus', 'Sunset'];
  const teamScore = 8 + Math.floor(Math.random() * 5);
  const enemyScore = 6 + Math.floor(Math.random() * 5);
  
  return {
    winProbability: 50 + (teamScore - enemyScore) * 3,
    currentRound: teamScore + enemyScore + 1,
    teamScore,
    enemyScore,
    economyRating: 60 + Math.floor(Math.random() * 35),
    economyStatus: Math.random() > 0.3 ? 'Full Buy' : Math.random() > 0.5 ? 'Half Buy' : 'Eco',
    currentSide: Math.random() > 0.5 ? 'Attack' : 'Defense',
    mapName: maps[Math.floor(Math.random() * maps.length)],
    firstBloods: 5 + Math.floor(Math.random() * 8),
    clutches: Math.floor(Math.random() * 6),
    aces: Math.floor(Math.random() * 2),
    anomalies: [],
  };
};

export const useValorantData = (teamName: string = 'Cloud9', opponentName: string = 'Opponent') => {
  const players = useMemo(() => generatePlayers(teamName), [teamName]);
  const game = useMemo(() => generateGameState(teamName, opponentName), [teamName, opponentName]);
  const [predictions, setPredictions] = useState<MLPredictions>(() => 
    generateMLPredictions(teamName, opponentName)
  );

  // Regenerate predictions when teams change
  useEffect(() => {
    setPredictions(generateMLPredictions(teamName, opponentName));
  }, [teamName, opponentName]);

  // Update predictions periodically to simulate model updates
  useEffect(() => {
    const interval = setInterval(() => {
      setPredictions(prev => {
        const newProb = Math.min(95, Math.max(25, prev.winProbability + (Math.random() * 4 - 2)));
        const newHistory = [...prev.probabilityHistory.slice(1), {
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          probability: Math.round(newProb * 10) / 10
        }];
        
        return {
          ...prev,
          winProbability: newProb,
          confidence: Math.min(95, Math.max(60, prev.confidence + (Math.random() * 2 - 1))),
          prediction: newProb >= 50 ? 'Win' : 'Loss',
          riskLevel: newProb >= 65 ? 'Low' : newProb >= 45 ? 'Medium' : 'High',
          probabilityHistory: newHistory,
        };
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return { players, game, predictions };
};
