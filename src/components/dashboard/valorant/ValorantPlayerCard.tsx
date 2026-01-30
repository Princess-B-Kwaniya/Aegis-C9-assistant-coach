import React from 'react';
import { ValorantPlayerData } from '@/types/valorant';
import { User, Crosshair, AlertTriangle, Target, Skull } from 'lucide-react';

interface ValorantPlayerCardProps {
  player: ValorantPlayerData;
}

// Agent icons/colors mapping - using blue theme
const agentColors: Record<string, string> = {
  // Duelists
  'Jett': 'text-cloud9-blue',
  'Reyna': 'text-blue-400',
  'Phoenix': 'text-blue-500',
  'Raze': 'text-blue-400',
  'Yoru': 'text-blue-600',
  'Neon': 'text-cyan-400',
  'Iso': 'text-blue-500',
  // Controllers
  'Viper': 'text-blue-400',
  'Brimstone': 'text-blue-500',
  'Omen': 'text-blue-600',
  'Astra': 'text-blue-400',
  'Harbor': 'text-cyan-500',
  'Clove': 'text-blue-400',
  // Sentinels
  'Sage': 'text-cyan-400',
  'Cypher': 'text-blue-400',
  'Killjoy': 'text-blue-500',
  'Chamber': 'text-blue-400',
  'Deadlock': 'text-blue-500',
  // Initiators
  'Sova': 'text-cloud9-blue',
  'Breach': 'text-blue-500',
  'Skye': 'text-blue-400',
  'KAY/O': 'text-blue-400',
  'Fade': 'text-blue-600',
  'Gekko': 'text-cyan-400',
};

const roleColors: Record<string, string> = {
  'Duelist': 'bg-cloud9-blue/10 text-cloud9-blue border-cloud9-blue/20',
  'Controller': 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  'Sentinel': 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20',
  'Initiator': 'bg-blue-400/10 text-blue-400 border-blue-400/20',
};

export const ValorantPlayerCard: React.FC<ValorantPlayerCardProps> = ({ player }) => {
  const isCritical = player.status === 'critical';
  const isWarning = player.status === 'warning';
  const kd = (player.kills / Math.max(player.deaths, 1)).toFixed(2);

  return (
    <div
      className={`p-3 md:p-4 rounded-xl bg-white border transition-all duration-300 shadow-sm ${
        isCritical ? 'border-amber-500 ring-4 ring-amber-500/10' : isWarning ? 'border-amber-400' : 'border-slate-100 hover:border-cloud9-blue'
      }`}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
          <div className={`p-1.5 md:p-2 rounded-lg shrink-0 ${isCritical ? 'bg-amber-500/10 text-amber-500' : 'bg-blue-100 text-cloud9-blue'}`}>
            <Crosshair size={16} className="md:w-[18px] md:h-[18px]" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-slate-900 leading-none mb-1 text-sm md:text-base truncate">{player.name}</h3>
            <div className="flex items-center gap-2">
              <span className={`text-[9px] md:text-[10px] uppercase font-bold ${agentColors[player.agent] || 'text-cloud9-blue'}`}>
                {player.agent}
              </span>
              <span className={`text-[8px] px-1.5 py-0.5 rounded border ${roleColors[player.role]}`}>
                {player.role}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
           {isCritical && <AlertTriangle size={10} className="md:w-3 md:h-3 text-amber-500" />}
           <span
            className={`text-[8px] md:text-[9px] px-1.5 md:px-2 py-0.5 rounded-full uppercase font-black ${
              player.status === 'critical'
                ? 'bg-amber-500 text-white'
                : player.status === 'warning'
                ? 'bg-amber-400 text-black'
                : 'bg-cloud9-blue text-white'
            }`}
          >
            {player.status}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        {/* K/D/A Stats */}
        <div className="flex justify-between items-center bg-slate-50 rounded-lg p-2">
          <div className="text-center flex-1">
            <p className="text-lg font-black text-cloud9-blue">{player.kills}</p>
            <p className="text-[8px] font-bold text-slate-400 uppercase">Kills</p>
          </div>
          <div className="w-px h-8 bg-slate-200" />
          <div className="text-center flex-1">
            <p className="text-lg font-black text-slate-500">{player.deaths}</p>
            <p className="text-[8px] font-bold text-slate-400 uppercase">Deaths</p>
          </div>
          <div className="w-px h-8 bg-slate-200" />
          <div className="text-center flex-1">
            <p className="text-lg font-black text-blue-400">{player.assists}</p>
            <p className="text-[8px] font-bold text-slate-400 uppercase">Assists</p>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
            <span className="text-[9px] font-bold text-slate-400 uppercase">ACS</span>
            <span className="text-xs font-black text-slate-900">{Math.round(player.acs)}</span>
          </div>
          <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
            <span className="text-[9px] font-bold text-slate-400 uppercase">K/D</span>
            <span className={`text-xs font-black ${Number(kd) >= 1 ? 'text-cloud9-blue' : 'text-slate-500'}`}>{kd}</span>
          </div>
          <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
            <span className="text-[9px] font-bold text-slate-400 uppercase">HS%</span>
            <span className="text-xs font-black text-slate-900">{player.hs.toFixed(0)}%</span>
          </div>
          <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
            <span className="text-[9px] font-bold text-slate-400 uppercase">KAST</span>
            <span className="text-xs font-black text-slate-900">{player.kast.toFixed(0)}%</span>
          </div>
        </div>

        {/* Impact Stats */}
        <div className="flex justify-between items-center pt-2 border-t border-slate-100">
          <div className="flex items-center gap-1">
            <Target size={10} className="text-cloud9-blue" />
            <span className="text-[9px] font-bold text-slate-400">FB: {player.firstBloods}</span>
          </div>
          <div className="flex items-center gap-1">
            <Skull size={10} className="text-blue-400" />
            <span className="text-[9px] font-bold text-slate-400">Clutches: {player.clutches}</span>
          </div>
          <div className="text-[9px] font-black text-cloud9-blue">
            ADR: {player.adr.toFixed(0)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ValorantPlayerCard;
