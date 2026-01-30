import { useState, useEffect, useCallback } from 'react';
import { ValorantPlayerData, ValorantGameState } from '@/types/valorant';

// Valorant Agents by Role
const AGENTS = {
  Duelist: ['Jett', 'Reyna', 'Phoenix', 'Raze', 'Yoru', 'Neon', 'Iso'],
  Controller: ['Viper', 'Brimstone', 'Omen', 'Astra', 'Harbor', 'Clove'],
  Sentinel: ['Sage', 'Cypher', 'Killjoy', 'Chamber', 'Deadlock'],
  Initiator: ['Sova', 'Breach', 'Skye', 'KAY/O', 'Fade', 'Gekko']
};

const MAPS = ['Ascent', 'Bind', 'Haven', 'Split', 'Icebox', 'Breeze', 'Fracture', 'Pearl', 'Lotus', 'Sunset'];

const generateInitialPlayers = (): ValorantPlayerData[] => {
  const roles: Array<'Duelist' | 'Controller' | 'Sentinel' | 'Initiator'> = ['Duelist', 'Controller', 'Sentinel', 'Initiator', 'Duelist'];
  
  return [
    { id: 1, name: 'TenZ', role: 'Duelist' },
    { id: 2, name: 'Derrek', role: 'Initiator' },
    { id: 3, name: 'Zellsis', role: 'Controller' },
    { id: 4, name: 'mCe', role: 'Sentinel' },
    { id: 5, name: 'Jakee', role: 'Duelist' },
  ].map((base, index) => {
    const role = base.role as 'Duelist' | 'Controller' | 'Sentinel' | 'Initiator';
    const agentPool = AGENTS[role];
    const agent = agentPool[Math.floor(Math.random() * agentPool.length)];
    
    return {
      ...base,
      agent,
      role,
      kills: Math.floor(Math.random() * 15) + 5,
      deaths: Math.floor(Math.random() * 10) + 2,
      assists: Math.floor(Math.random() * 8) + 1,
      adr: Math.floor(Math.random() * 80) + 120,
      hs: Math.floor(Math.random() * 30) + 15,
      firstBloods: Math.floor(Math.random() * 4),
      clutches: Math.floor(Math.random() * 2),
      status: 'optimal' as const,
      acs: Math.floor(Math.random() * 100) + 180,
      kast: Math.floor(Math.random() * 25) + 65,
    };
  });
};

const generateInitialGameState = (): ValorantGameState => {
  const teamScore = Math.floor(Math.random() * 8) + 5;
  const enemyScore = Math.floor(Math.random() * 8) + 5;
  
  return {
    winProbability: 50 + (teamScore - enemyScore) * 3 + Math.random() * 10 - 5,
    currentRound: teamScore + enemyScore + 1,
    teamScore,
    enemyScore,
    economyRating: Math.floor(Math.random() * 40) + 60,
    economyStatus: 'Full Buy',
    currentSide: Math.random() > 0.5 ? 'Attack' : 'Defense',
    mapName: MAPS[Math.floor(Math.random() * MAPS.length)],
    firstBloods: Math.floor(Math.random() * 5) + 3,
    clutches: Math.floor(Math.random() * 3),
    aces: Math.floor(Math.random() * 2),
    anomalies: [],
  };
};

export const useValorantLive = () => {
  const [players, setPlayers] = useState<ValorantPlayerData[]>(generateInitialPlayers);
  const [game, setGame] = useState<ValorantGameState>(generateInitialGameState);

  const updatePlayerStatus = useCallback((player: ValorantPlayerData): 'optimal' | 'warning' | 'critical' => {
    const kd = player.kills / Math.max(player.deaths, 1);
    if (kd < 0.6 || player.adr < 100) return 'critical';
    if (kd < 0.9 || player.adr < 140) return 'warning';
    return 'optimal';
  }, []);

  const updateEconomyStatus = useCallback((rating: number): 'Full Buy' | 'Half Buy' | 'Eco' | 'Force Buy' => {
    if (rating >= 80) return 'Full Buy';
    if (rating >= 60) return 'Half Buy';
    if (rating >= 40) return 'Force Buy';
    return 'Eco';
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      // Update players
      setPlayers(prevPlayers =>
        prevPlayers.map(player => {
          // Random stat changes
          const killChange = Math.random() > 0.85 ? 1 : 0;
          const deathChange = Math.random() > 0.88 ? 1 : 0;
          const assistChange = Math.random() > 0.82 ? 1 : 0;
          
          const newKills = player.kills + killChange;
          const newDeaths = player.deaths + deathChange;
          const newAssists = player.assists + assistChange;
          
          const updatedPlayer = {
            ...player,
            kills: newKills,
            deaths: newDeaths,
            assists: newAssists,
            adr: player.adr + (Math.random() * 10 - 5),
            hs: Math.min(100, Math.max(0, player.hs + (Math.random() * 4 - 2))),
            acs: player.acs + (Math.random() * 20 - 10),
            kast: Math.min(100, Math.max(0, player.kast + (Math.random() * 4 - 2))),
            firstBloods: player.firstBloods + (Math.random() > 0.95 ? 1 : 0),
            clutches: player.clutches + (Math.random() > 0.97 ? 1 : 0),
          };
          
          return {
            ...updatedPlayer,
            status: updatePlayerStatus(updatedPlayer),
          };
        })
      );

      // Update game state
      setGame(prevGame => {
        const roundWon = Math.random() > 0.5;
        const newTeamScore = Math.random() > 0.92 ? prevGame.teamScore + (roundWon ? 1 : 0) : prevGame.teamScore;
        const newEnemyScore = Math.random() > 0.92 ? prevGame.enemyScore + (!roundWon ? 1 : 0) : prevGame.enemyScore;
        const economyRating = Math.min(100, Math.max(20, prevGame.economyRating + (Math.random() * 20 - 10)));
        
        // Calculate win probability based on score differential
        const scoreDiff = newTeamScore - newEnemyScore;
        const baseProb = 50 + scoreDiff * 4;
        const newWinProb = Math.min(95, Math.max(5, baseProb + (Math.random() * 10 - 5)));
        
        return {
          ...prevGame,
          winProbability: newWinProb,
          currentRound: newTeamScore + newEnemyScore + 1,
          teamScore: newTeamScore,
          enemyScore: newEnemyScore,
          economyRating,
          economyStatus: updateEconomyStatus(economyRating),
          firstBloods: prevGame.firstBloods + (Math.random() > 0.95 ? 1 : 0),
          clutches: prevGame.clutches + (Math.random() > 0.97 ? 1 : 0),
          aces: prevGame.aces + (Math.random() > 0.99 ? 1 : 0),
        };
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [updatePlayerStatus, updateEconomyStatus]);

  return { players, game };
};
