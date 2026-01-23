import { Anomaly, PlayerData } from '@/types';

export const generateRandomAnomaly = (players: PlayerData[]): Anomaly => {
  const anomalies = [
    "Missed Smite on Baron Nashor",
    "Failed Flash over Dragon pit wall",
    "Overextended in bottom lane without vision",
    "Poor ultimate timing in teamfight",
    "Missed Cannon minion under pressure",
    "Inefficient Jungle pathing detected",
    "Late TP response to top side skirmish",
    "Vision denial failure in Baron area"
  ];

  const randomMessage = anomalies[Math.floor(Math.random() * anomalies.length)];
  const randomPlayer = players[Math.floor(Math.random() * players.length)];
  const randomImpact = -(Math.random() * 4 + 1); // -1% to -5%

  return {
    id: `anomaly-${Date.now()}`,
    type: Math.random() > 0.7 ? 'macro' : 'micro',
    message: randomMessage,
    impact: parseFloat(randomImpact.toFixed(1)),
    timestamp: new Date().toLocaleTimeString(),
    playerTarget: randomPlayer.name
  };
};
