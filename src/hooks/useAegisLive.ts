import { useState, useEffect } from 'react';
import { PlayerData, GameState, Anomaly } from '../types';
import { generateRandomAnomaly } from '../utils/simulation';

export const useAegisLive = () => {
  const [game, setGame] = useState<GameState>({ winProbability: 52, tempo: 65, anomalies: [] });
  const [players, setPlayers] = useState<PlayerData[]>([
    { id: 1, name: 'Zven', role: 'ADC', stress: 20, impact: 98, status: 'optimal', recentErrors: 0 },
    { id: 2, name: 'Blaber', role: 'Jungle', stress: 25, impact: 95, status: 'optimal', recentErrors: 0 },
    { id: 3, name: 'Jojopyun', role: 'Mid', stress: 30, impact: 92, status: 'optimal', recentErrors: 0 },
    { id: 4, name: 'Berserker', role: 'Top', stress: 22, impact: 96, status: 'optimal', recentErrors: 0 },
    { id: 5, name: 'Vulcan', role: 'Support', stress: 28, impact: 94, status: 'optimal', recentErrors: 0 },
  ]);

  useEffect(() => {
    // Regular interval for small fluctuations and state updates
    const regularTimer = setInterval(() => {
      setGame(prev => ({
        ...prev,
        winProbability: Math.min(Math.max(prev.winProbability + (Math.random() * 0.4 - 0.2), 5), 95),
        tempo: Math.min(Math.max(prev.tempo + (Math.random() * 2 - 1), 0), 100),
      }));

      setPlayers(prev => prev.map(p => {
        const stressDelta = (Math.random() * 2 - 0.8);
        const newStress = Math.min(Math.max(p.stress + stressDelta, 10), 100);
        return {
          ...p,
          stress: newStress,
          status: newStress > 75 ? 'critical' : newStress > 45 ? 'warning' : 'optimal'
        };
      }));
    }, 3000);

    // Simulation interval for Anomaly triggers (every 10-15 seconds)
    const triggerAnomaly = () => {
      const newAnomaly = generateRandomAnomaly(players);
      
      setGame(prev => ({
        ...prev,
        winProbability: Math.min(Math.max(prev.winProbability + newAnomaly.impact, 5), 95),
        anomalies: [...prev.anomalies, newAnomaly].slice(-50)
      }));

      setPlayers(prev => prev.map(p => 
        p.name === newAnomaly.playerTarget ? { ...p, recentErrors: p.recentErrors + 1, stress: Math.min(p.stress + 10, 100) } : p
      ));

      // Schedule next anomaly
      const nextDelay = Math.floor(Math.random() * 5000) + 10000; // 10-15 seconds
      setTimeout(triggerAnomaly, nextDelay);
    };

    const firstDelay = Math.floor(Math.random() * 5000) + 10000;
    const initialAnomalyTimeout = setTimeout(triggerAnomaly, firstDelay);

    return () => {
      clearInterval(regularTimer);
      clearTimeout(initialAnomalyTimeout);
    };
  }, []); // Empty dependency array because we use functional updates and we want the loop to manage itself

  return { game, players };
};
