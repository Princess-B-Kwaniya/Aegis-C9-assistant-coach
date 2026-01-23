import React, { useEffect, useRef, useState } from 'react';
import { useAegisLive } from '@/hooks/useAegisLive';
import { Terminal, Shield, MessageSquare } from 'lucide-react';

import { Anomaly } from '@/types';

interface CommMessage extends Anomaly {}

export const TacticalComms: React.FC = () => {
  const { game } = useAegisLive();
  const [messages, setMessages] = useState<CommMessage[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (game.anomalies.length > 0) {
      const latestAnomaly = game.anomalies[game.anomalies.length - 1];
      
      setMessages((prev) => {
        const lastMsg = prev[prev.length - 1];
        if (!lastMsg || lastMsg.id !== latestAnomaly.id) {
          return [
            ...prev,
            latestAnomaly,
          ].slice(-50);
        }
        return prev;
      });
    }
  }, [game.anomalies]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-full bg-white border border-slate-100 rounded-xl overflow-hidden font-sans shadow-sm">
      {/* Terminal Header */}
      <div className="bg-slate-50 px-4 py-3 border-b border-slate-100 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-cloud9-blue rounded-md text-white">
            <Terminal size={14} />
          </div>
          <span className="text-slate-900 font-bold text-xs uppercase tracking-tight">Tactical Suggestions</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Uplink Stable</span>
          </div>
          <Shield size={14} className="text-slate-300" />
        </div>
      </div>

      {/* Terminal Content */}
      <div 
        ref={scrollRef}
        className="flex-1 p-4 overflow-y-auto space-y-3 bg-transparent"
      >
        {messages.length === 0 && (
          <div className="flex items-center justify-center h-full text-slate-400 gap-2">
            <MessageSquare size={16} />
            <span className="text-xs font-medium italic">Waiting for tactical data...</span>
          </div>
        )}
        {messages.map((msg: any) => (
          <div key={msg.id} className="flex gap-3 items-start animate-in fade-in slide-in-from-left-2 duration-300">
             <div className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${msg.type === 'macro' ? 'bg-neon-orange shadow-[0_0_8px_rgba(255,95,31,0.5)]' : 'bg-cloud9-blue shadow-[0_0_8px_rgba(0,174,239,0.5)]'}`} />
             <div className="flex flex-col flex-1">
               <div className="flex items-center justify-between mb-0.5">
                 <div className="flex items-center gap-2">
                    <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded ${msg.type === 'macro' ? 'bg-neon-orange/10 text-neon-orange' : 'bg-cloud9-blue/10 text-cloud9-blue'}`}>
                      {msg.type} Anomaly
                    </span>
                    {msg.playerTarget && (
                      <span className="text-[10px] font-bold text-slate-700">
                        @{msg.playerTarget}
                      </span>
                    )}
                 </div>
                 <span className="text-[9px] text-slate-400 font-bold">{msg.timestamp}</span>
               </div>
               <p className="text-xs text-slate-600 font-medium leading-relaxed">{msg.message}</p>
               <div className="mt-1 flex items-center gap-1">
                  <span className="text-[9px] font-bold text-slate-400 uppercase">Est. Impact:</span>
                  <span className={`text-[9px] font-black ${msg.impact < 0 ? 'text-rose-500' : 'text-emerald-600'}`}>
                    {msg.impact > 0 ? '+' : ''}{msg.impact}% Win Prob
                  </span>
               </div>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TacticalComms;
