"use client";

import React, { useState } from "react";
import { useAegisLive } from "../../../src/hooks/useAegisLive";
import PlayerCard from "../../../src/components/dashboard/PlayerCard";
import WinProbChart from "../../../src/components/dashboard/WinProbChart";
import TacticalComms from "../../../src/components/dashboard/TacticalComms";
import { Sidebar } from "../components/layout/Sidebar";
import { WelcomePage } from "../components/layout/WelcomePage";
import { Activity, ShieldCheck, Zap, BarChart3, Users, LayoutDashboard, FileText, Download, Menu } from "lucide-react";

export default function Home() {
  const { game, players } = useAegisLive();
  const [isStarted, setIsStarted] = useState(false);
  const [sessionData, setSessionData] = useState({ teamName: "", opponentName: "", game: "" });
  const [activeTab, setActiveTab] = useState("dashboard");

  const handleStart = (teamName: string, opponentName: string, selectedGame: string) => {
    setSessionData({ teamName, opponentName, game: selectedGame });
    setIsStarted(true);
  };

  if (!isStarted) {
    return <WelcomePage onStart={handleStart} />;
  }

  return (
    <div className="flex min-h-screen bg-background font-sans transition-all duration-500 text-foreground">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        teamName={sessionData.teamName} 
        game={sessionData.game} 
        onBackToHome={() => setIsStarted(false)}
      />
      
      <main className="flex-1 p-4 md:p-6 overflow-y-auto animate-in fade-in slide-in-from-right-4 duration-700">
        <div className="max-w-full mx-auto space-y-6">
          
          {/* Top Header */}
          <header className="flex flex-col lg:flex-row justify-between items-center bg-card border border-border-custom p-6 rounded-3xl shadow-sm">
            <div className="flex items-center gap-6 w-full lg:w-auto">
              <div className="w-14 h-14 bg-cloud9-blue rounded-2xl flex items-center justify-center shadow-lg shadow-cloud9-blue/20">
                <span className="text-2xl font-black text-white">C9</span>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <LayoutDashboard size={16} className="text-cloud9-blue" />
                  <h1 className="text-2xl font-black tracking-tight text-foreground uppercase italic">
                    Aegis-C9 <span className="text-cloud9-blue">Assistant Coach</span>
                  </h1>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-cloud9-blue rounded-full animate-pulse shadow-[0_0_8px_rgba(0,174,239,0.5)]"></span>
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                    {sessionData.teamName} VS {sessionData.opponentName} • LIVE
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 lg:mt-0 flex items-center gap-8 bg-slate-50 p-4 rounded-2xl border border-slate-100 w-full lg:w-auto justify-center lg:justify-start">
              <div className="text-right">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Live Win Prob</p>
                <div className="text-4xl font-black text-cloud9-blue tabular-nums">
                  {game.winProbability.toFixed(1)}<span className="text-xl ml-0.5">%</span>
                </div>
              </div>
              <div className="w-px h-10 bg-slate-200" />
              <div className="flex flex-col gap-1">
                 <div className="flex items-center gap-2">
                    <Activity size={14} className="text-cloud9-blue" />
                    <span className="text-[10px] font-bold text-slate-500 uppercase">System Nominal</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <ShieldCheck size={14} className="text-cloud9-blue" />
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Aegis Secure</span>
                 </div>
              </div>
            </div>
          </header>

          {/* Conditional Rendering based on activeTab */}
          {activeTab === "dashboard" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Player Cards */}
              <div className="lg:col-span-3 space-y-4 lg:max-h-[calc(100vh-250px)] lg:overflow-y-auto lg:pr-2 custom-scrollbar">
                <div className="flex items-center gap-2 mb-4 px-1">
                  <Users size={16} className="text-cloud9-blue" />
                  <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Squad Telemetry</h2>
                </div>
                {players.map((player) => (
                  <PlayerCard key={player.id} player={player} />
                ))}
              </div>

              {/* Center Column: WinProbChart */}
              <div className="lg:col-span-6 flex flex-col bg-card border border-border-custom rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-sm h-fit min-h-[500px]">
                <div className="flex justify-between items-center mb-8">
                  <div className="flex items-center gap-2">
                    <BarChart3 size={18} className="text-cloud9-blue" />
                    <h2 className="text-sm font-black text-foreground uppercase tracking-tight">Probability Matrix</h2>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-cloud9-blue"></span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Live Telemetry</span>
                    </div>
                  </div>
                </div>
                <div className="flex-1 bg-slate-50 rounded-2xl p-4 border border-slate-100">
                  <WinProbChart currentProb={game.winProbability} />
                </div>
              </div>

              {/* Right Column: General Stats */}
              <div className="lg:col-span-3 space-y-6">
                <div className="bg-card border border-border-custom rounded-3xl p-6 shadow-sm">
                  <div className="flex items-center gap-2 mb-6">
                     <Zap size={16} className="text-neon-orange" />
                     <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Macro Metrics</h2>
                  </div>
                  <div className="space-y-6">
                    <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                      <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Macro Efficiency</p>
                      <p className="text-3xl font-black text-foreground">{game.tempo}%</p>
                      <div className="w-full bg-slate-200 h-1.5 mt-4 rounded-full overflow-hidden">
                        <div className="bg-cloud9-blue h-full transition-all duration-1000 shadow-[0_0_8px_rgba(0,174,239,0.3)]" style={{ width: `${game.tempo}%` }}></div>
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-[9px] font-bold text-slate-400 uppercase">Tempo Sync</span>
                        <span className="text-[9px] font-bold text-cloud9-blue uppercase">In Progress</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-cloud9-blue/5 border border-cloud9-blue/10 rounded-2xl">
                        <p className="text-[9px] font-bold text-cloud9-blue uppercase mb-1">Status</p>
                        <p className="text-sm font-black text-cloud9-blue uppercase">Optimal</p>
                      </div>
                      <div className="p-4 bg-blue-500/5 border border-blue-500/10 rounded-2xl">
                        <p className="text-[9px] font-bold text-blue-500 uppercase mb-1">Neural</p>
                        <p className="text-sm font-black text-blue-500 uppercase">Syncing</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden group">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-cloud9-blue/10 blur-3xl -mr-16 -mt-16 group-hover:bg-cloud9-blue/20 transition-all duration-500"></div>
                   <div className="flex items-center gap-2 mb-4">
                      <FileText size={18} className="text-cloud9-blue" />
                      <h3 className="font-bold text-sm uppercase tracking-tight">Post-Match Drill Gen</h3>
                   </div>
                   <p className="text-xs text-slate-400 leading-relaxed mb-4">
                     AI is tracking {players.reduce((acc, p) => acc + p.recentErrors, 0)} micro-failures. A custom training plan is being compiled.
                   </p>
                   <div className="space-y-2">
                     <button className="w-full bg-cloud9-blue text-white hover:bg-[#009ed9] transition-colors py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-cloud9-blue/20">
                       <Download size={12} />
                       Export PDF Report
                     </button>
                   </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "comms" && (
            <div className="h-[700px] bg-card border border-border-custom rounded-3xl overflow-hidden shadow-sm">
              <TacticalComms />
            </div>
          )}

          {/* Placeholder for other tabs */}
          {activeTab !== "dashboard" && activeTab !== "comms" && (
            <div className="bg-white border border-slate-200 rounded-3xl p-20 flex flex-col items-center justify-center text-center">
               <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                  <Activity size={40} className="text-slate-300" />
               </div>
               <h2 className="text-2xl font-black text-slate-900 uppercase italic mb-2">{activeTab.replace('_', ' ')}</h2>
               <p className="text-slate-500 max-w-md">This module is currently calibrating. Live data telemetry will be available shortly.</p>
            </div>
          )}

        </div>
      </main>
      
      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slide-in-from-right {
          from { transform: translateX(20px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slide-in-from-left {
          from { transform: translateX(-20px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-in {
          animation: 0.6s ease-out forwards;
        }
        .fade-in { animation-name: fade-in; }
        .slide-in-from-right-4 { animation-name: slide-in-from-right; }
        .slide-in-from-left-2 { animation-name: slide-in-from-left; }

        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
      `}</style>
    </div>
  );
}
