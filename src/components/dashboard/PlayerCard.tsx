import React from 'react';
import { PlayerData } from '@/types';
import { User, Zap, AlertTriangle } from 'lucide-react';

interface PlayerCardProps {
  player: PlayerData;
}

export const PlayerCard: React.FC<PlayerCardProps> = ({ player }) => {
  const isCritical = player.status === 'critical';

  return (
    <div
      className={`p-4 rounded-xl bg-white border transition-all duration-300 shadow-sm ${
        isCritical ? 'border-neon-orange ring-4 ring-neon-orange/10' : 'border-slate-100 hover:border-cloud9-blue'
      }`}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${isCritical ? 'bg-neon-orange/10 text-neon-orange' : 'bg-cloud9-blue/10 text-cloud9-blue'}`}>
            <User size={18} />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 leading-none mb-1">{player.name}</h3>
            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">{player.role}</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
           {isCritical && <AlertTriangle size={12} className="text-neon-orange" />}
           <span
            className={`text-[9px] px-2 py-0.5 rounded-full uppercase font-black ${
              player.status === 'critical'
                ? 'bg-neon-orange text-white'
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
        <div className="flex justify-between text-xs items-center">
          <div className="flex items-center gap-1.5 text-slate-400">
            <Zap size={12} className="text-cloud9-blue" />
            <span className="font-medium">Stress Level</span>
          </div>
          <span
            className={`font-bold ${
              isCritical ? 'text-neon-orange' : 'text-slate-900'
            }`}
          >
            {Math.round(player.stress)}%
          </span>
        </div>
        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ease-out ${
              player.status === 'critical'
                ? 'bg-neon-orange'
                : player.status === 'warning'
                ? 'bg-amber-400'
                : 'bg-cloud9-blue'
            }`}
            style={{ width: `${player.stress}%` }}
          />
        </div>
        <div className="flex justify-between items-center pt-2 border-t border-slate-50">
          <div className="flex flex-col">
            <span className="text-[9px] text-slate-400 font-bold uppercase">Impact Score</span>
            <span className="text-xs font-black text-slate-900">{player.impact}</span>
          </div>
          <div className="flex flex-col text-right">
            <span className="text-[9px] text-slate-400 font-bold uppercase">Errors</span>
            <span className={`text-xs font-black ${player.recentErrors > 2 ? 'text-neon-orange' : 'text-slate-900'}`}>{player.recentErrors}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerCard;
