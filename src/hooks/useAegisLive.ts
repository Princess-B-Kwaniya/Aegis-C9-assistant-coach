import { useState, useEffect, useCallback } from 'react';
import { PlayerData, GameState, Anomaly } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

// LoL Game State Interface (matching Valorant structure)
interface LoLGameData {
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

interface LoLPrediction {
  win_probability: number;
  confidence: number;
  prediction: string;
  risk_level: string;
  model_accuracy: number;
  roc_auc: number;
  total_samples: number;
  model_name: string;
}

interface FeatureImportance {
  name: string;
  importance: number;
}

export const useAegisLive = (teamName: string = 'Cloud9', opponentName: string = 'Opponent', game: string = 'lol') => {
  const [gameState, setGameState] = useState<GameState>({ winProbability: 50, tempo: 50, anomalies: [] });
  const [telemetry, setTelemetry] = useState<any>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [players, setPlayers] = useState<PlayerData[]>([
    { id: 1, name: 'Thanatos', role: 'Top', stress: 20, impact: 98, status: 'optimal', recentErrors: 0 },
    { id: 2, name: 'Blaber', role: 'Jungle', stress: 25, impact: 95, status: 'optimal', recentErrors: 0 },
    { id: 3, name: 'Jojopyun', role: 'Mid', stress: 30, impact: 92, status: 'optimal', recentErrors: 0 },
    { id: 4, name: 'Berserker', role: 'Bot', stress: 22, impact: 96, status: 'optimal', recentErrors: 0 },
    { id: 5, name: 'Vulcan', role: 'Support', stress: 28, impact: 94, status: 'optimal', recentErrors: 0 },
  ]);
  const [lolGameData, setLolGameData] = useState<LoLGameData | null>(null);
  const [prediction, setPrediction] = useState<LoLPrediction | null>(null);
  const [featureImportance, setFeatureImportance] = useState<FeatureImportance[]>([]);

  const fetchLolPredictions = useCallback(async () => {
    try {
      const endpoint = game.toLowerCase() === 'valorant' ? 'valorant-predictions' : 'lol-predictions';
      const response = await fetch(
        `${API_BASE_URL}/${endpoint}?team=${encodeURIComponent(teamName)}&opponent=${encodeURIComponent(opponentName)}`
      );
      
      if (!response.ok) throw new Error('Backend unavailable');
      
      const data = await response.json();
      setIsConnected(true);
      setTelemetry(data);

      // Update prediction
      if (data.prediction) {
        setPrediction(data.prediction);
        setGameState(prev => ({
          ...prev,
          winProbability: data.prediction.win_probability
        }));
      }

      // Update game data
      if (data.game) {
        setLolGameData(data.game);
      }
      
      // Update anomalies from backend
      if (data.anomalies && data.anomalies.length > 0) {
        setGameState(prev => ({
            ...prev,
            anomalies: data.anomalies
        }));
      }

      // Update feature importance
      if (data.feature_importance) {
        setFeatureImportance(data.feature_importance);
      }

      // Update players
      if (data.players && data.players.length > 0) {
        setPlayers(data.players.map((p: any) => ({
          id: p.id,
          name: p.name,
          role: p.position || p.role,
          champion: p.champion,
          stress: Math.floor(Math.random() * 30) + 10,
          impact: p.impact,
          status: p.status,
          recentErrors: 0,
          kills: p.kills,
          deaths: p.deaths,
          assists: p.assists,
          kda: p.kda,
          cs: p.cs,
          csPerMin: p.csPerMin,
          gold: p.gold,
          goldShare: p.goldShare,
          damageShare: p.damageShare,
          visionScore: p.visionScore,
          dpm: p.dpm,
          killParticipation: p.killParticipation,
        })));
      }
    } catch (error) {
      console.log('Using local predictions (backend unavailable)');
      setIsConnected(false);
      
      // Fallback: random win prob
      setGameState(prev => ({
        ...prev,
        winProbability: Math.min(95, Math.max(5, prev.winProbability + (Math.random() * 4 - 2)))
      }));
    }
  }, [teamName, opponentName, game]);

  useEffect(() => {
    // Initial fetch
    fetchLolPredictions();
    
    // Poll for updates every 3 seconds (similar to Valorant)
    const interval = setInterval(fetchLolPredictions, 3000);
    
    return () => clearInterval(interval);
  }, [fetchLolPredictions]);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const connectToStream = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/stream-telemetry`, {
          signal: controller.signal
        });
        
        if (!response.ok) {
          throw new Error(`Stream connection failed: ${response.status}`);
        }
        
        const reader = response.body?.getReader();
        if (!reader) return;

        const decoder = new TextDecoder();

        while (isMounted) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (!line.trim()) continue;
            try {
              const data = JSON.parse(line);
              if (!isMounted) break;

              setTelemetry(data);

              // Update game state with real-time win probability
              if (data.win_prob) {
                setGameState(prev => ({
                  ...prev,
                  winProbability: data.win_prob
                }));
              }

              // If predictions are available, we could update players' impact/status
              if (data.predictions) {
                const newAnomalies: Anomaly[] = [];
                
                setPlayers(prev => prev.map((p, idx) => {
                  const pred = data.predictions[idx];
                  if (pred) {
                    const impactValue = Math.round(pred.high_assist_probability * 100);
                    
                    // Generate a tactical suggestion (anomaly) if probability is high/low
                    if (pred.high_assist_probability > 0.8) {
                        newAnomalies.push({
                            id: `anom-${Date.now()}-${p.id}`,
                            type: 'macro',
                            message: `${pred.name}: ${pred.recommendation}. Model predicts high utility impact.`,
                            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
                            impact: 5,
                            playerTarget: pred.name
                        });
                    }

                    return {
                      ...p,
                      impact: impactValue,
                      status: pred.high_assist_probability > 0.6 ? 'optimal' : (pred.high_assist_probability > 0.3 ? 'warning' : 'critical')
                    };
                  }
                  return p;
                }));

                if (newAnomalies.length > 0) {
                    setGameState(prev => ({
                        ...prev,
                        anomalies: [...prev.anomalies, ...newAnomalies].slice(-10)
                    }));
                }
              }
            } catch (e) {
              console.error("Error parsing telemetry line:", e);
            }
          }
        }
      } catch (error: any) {
        if (error.name !== 'AbortError') {
          if (isMounted) {
            console.log("Stream connection unavailable, retrying in 10s...");
            // Retry after a longer delay to be less aggressive if backend is down
            setTimeout(() => {
              if (isMounted) connectToStream();
            }, 10000);
          }
        }
      }
    };

    connectToStream();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  return { game: gameState, players, telemetry, isConnected, lolGameData, prediction, featureImportance };
};
