import { useState, useEffect } from 'react';
import { PlayerData, GameState, Anomaly } from '@/types';

const API_BASE_URL = 'https://aegis-c9-backend.onrender.com';

export const useAegisLive = () => {
  const [game, setGame] = useState<GameState>({ winProbability: 50, tempo: 50, anomalies: [] });
  const [players, setPlayers] = useState<PlayerData[]>([
    { id: 1, name: 'Zven', role: 'ADC', stress: 20, impact: 98, status: 'optimal', recentErrors: 0 },
    { id: 2, name: 'Blaber', role: 'Jungle', stress: 25, impact: 95, status: 'optimal', recentErrors: 0 },
    { id: 3, name: 'Jojopyun', role: 'Mid', stress: 30, impact: 92, status: 'optimal', recentErrors: 0 },
    { id: 4, name: 'Berserker', role: 'Top', stress: 22, impact: 96, status: 'optimal', recentErrors: 0 },
    { id: 5, name: 'Vulcan', role: 'Support', stress: 28, impact: 94, status: 'optimal', recentErrors: 0 },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/stats?series_id=2616372`);
        const data = await response.json();

        if (data.series) {
          // Map team names to player data if possible, or just update based on the series info
          // Since the API only returns series and teams currently, we'll keep the static player list 
          // but could update their status or other metrics if the API expands.
          
          // For now, let's fluctuate the existing data slightly based on the fact that we have live data
          // or just confirm the connection.
          
          setGame(prev => ({
            ...prev,
            // If the API provided real win prob, we'd use it here.
            // For now, let's keep it stable or use a dummy value from the live response if available.
            winProbability: data.status === 'simulated' ? 52.4 : prev.winProbability
          }));
        }
      } catch (error) {
        console.error("Error fetching Aegis live stats:", error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 10000); // Fetch every 10 seconds

    return () => clearInterval(interval);
  }, []);

  return { game, players };
};
