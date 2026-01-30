"use client";

import React, { useState, useEffect } from "react";
import { useValorantData } from "@/hooks/useValorantData";
import ValorantPlayerCard from "@/components/dashboard/valorant/ValorantPlayerCard";
import ValorantWinProbChart from "@/components/dashboard/valorant/ValorantWinProbChart";
import ValorantTacticalComms from "@/components/dashboard/valorant/ValorantTacticalComms";
import { ValorantSidebar } from "@/components/layout/ValorantSidebar";
import { Activity, ShieldCheck, Zap, BarChart3, Users, LayoutDashboard, FileText, Download, Menu, Crosshair, Target } from "lucide-react";

export default function ValorantDashboard() {
  const [teamName, setTeamName] = useState('Cloud9');
  const [opponentName, setOpponentName] = useState('Opponent');
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Get team names from URL params or localStorage
    const params = new URLSearchParams(window.location.search);
    const team = params.get('team') || localStorage.getItem('valorantTeam') || 'Cloud9';
    const opponent = params.get('opponent') || localStorage.getItem('valorantOpponent') || 'Opponent';
    setTeamName(team);
    setOpponentName(opponent);
  }, []);

  // Use the hook with team names for team-specific data
  const { game, players, predictions } = useValorantData(teamName, opponentName);

  // Close mobile menu when window is resized to desktop size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex min-h-screen bg-background font-sans transition-all duration-500 text-foreground">
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden" 
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
      
      <ValorantSidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        teamName={teamName} 
        onBackToHome={() => window.location.href = '/'}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />
      
      <main className="flex-1 p-3 md:p-4 lg:p-6 overflow-y-auto animate-in fade-in slide-in-from-right-4 duration-700">
        <div className="max-w-full mx-auto space-y-4 md:space-y-6">
          
          {/* Mobile Menu Button */}
          <div className="lg:hidden mb-4">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-3 bg-white border border-slate-200 rounded-2xl shadow-sm"
            >
              <Menu size={20} className="text-slate-600" />
            </button>
          </div>
          
          {/* Top Header - Valorant Theme */}
          <header className="flex flex-col lg:flex-row justify-between items-center bg-gradient-to-r from-blue-50 to-white border border-blue-200 p-4 md:p-6 rounded-3xl shadow-sm">
            <div className="flex items-center gap-4 md:gap-6 w-full lg:w-auto">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-cloud9-blue to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-cloud9-blue/20">
                <Crosshair className="text-white w-6 h-6 md:w-7 md:h-7" />
              </div>
              <div className="flex-1 lg:flex-initial">
                <div className="flex items-center gap-2 mb-1">
                  <Target size={16} className="text-cloud9-blue" />
                  <h1 className="text-lg md:text-xl lg:text-2xl font-black tracking-tight text-foreground uppercase italic">
                    Aegis-C9 <span className="text-cloud9-blue hidden sm:inline">VALORANT</span>
                  </h1>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-cloud9-blue rounded-full animate-pulse shadow-[0_0_8px_rgba(0,174,239,0.5)]"></span>
                  <span className="text-[9px] md:text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                    {teamName} VS {opponentName} • ML ANALYSIS
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 lg:mt-0 flex flex-col sm:flex-row items-center gap-4 sm:gap-8 bg-blue-50 p-4 rounded-2xl border border-blue-100 w-full lg:w-auto">
              <div className="text-center sm:text-right">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Win Probability</p>
                <div className="text-3xl md:text-4xl font-black text-cloud9-blue tabular-nums">
                  {predictions.winProbability.toFixed(1)}<span className="text-lg md:text-xl ml-0.5">%</span>
                </div>
              </div>
              <div className="hidden sm:block w-px h-10 bg-blue-200" />
              <div className="w-full sm:w-auto h-px sm:h-auto bg-blue-200 sm:bg-transparent" />
              <div className="flex flex-row sm:flex-col gap-2 sm:gap-1">
                 <div className="flex items-center gap-2">
                    <Activity size={14} className="text-cloud9-blue" />
                    <span className="text-[9px] md:text-[10px] font-bold text-slate-500 uppercase">Round {game.currentRound}</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <ShieldCheck size={14} className="text-cloud9-blue" />
                    <span className="text-[9px] md:text-[10px] font-bold text-slate-500 uppercase">{game.teamScore} - {game.enemyScore}</span>
                 </div>
              </div>
            </div>
          </header>

          {/* Conditional Rendering based on activeTab */}
          {activeTab === "dashboard" && (
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 md:gap-6">
              {/* Left Column: Player Cards */}
              <div className="xl:col-span-3 order-2 xl:order-1 space-y-3 md:space-y-4 xl:max-h-[calc(100vh-250px)] xl:overflow-y-auto xl:pr-2 custom-scrollbar">
                <div className="flex items-center gap-2 mb-4 px-1">
                  <Users size={16} className="text-cloud9-blue" />
                  <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Agent Roster</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-3 md:gap-4">
                  {players.map((player) => (
                    <ValorantPlayerCard key={player.id} player={player} />
                  ))}
                </div>
              </div>

              {/* Center Column: WinProbChart */}
              <div className="xl:col-span-6 order-1 xl:order-2 flex flex-col bg-card border border-blue-100 rounded-3xl p-4 md:p-6 lg:p-8 relative overflow-hidden shadow-sm h-fit min-h-[400px] md:min-h-[500px]">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 md:mb-8 gap-4">
                  <div className="flex items-center gap-2">
                    <BarChart3 size={18} className="text-cloud9-blue" />
                    <h2 className="text-xs md:text-sm font-black text-foreground uppercase tracking-tight">ML Prediction Matrix</h2>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-cloud9-blue"></span>
                      <span className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase">Model: {predictions.modelName}</span>
                    </div>
                  </div>
                </div>
                <div className="flex-1 bg-blue-50/50 rounded-2xl p-3 md:p-4 border border-blue-100">
                  <ValorantWinProbChart probHistory={predictions.probabilityHistory} currentProb={predictions.winProbability} />
                </div>
              </div>

              {/* Right Column: General Stats */}
              <div className="xl:col-span-3 order-3 xl:order-3 space-y-4 md:space-y-6">
                <div className="bg-card border border-blue-100 rounded-3xl p-6 shadow-sm">
                  <div className="flex items-center gap-2 mb-6">
                     <Crosshair size={16} className="text-cloud9-blue" />
                     <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">ML Metrics</h2>
                  </div>
                  <div className="space-y-6">
                    <div className="p-5 bg-blue-50 rounded-2xl border border-blue-100">
                      <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Model Confidence</p>
                      <p className="text-3xl font-black text-foreground">{predictions.confidence.toFixed(1)}%</p>
                      <div className="w-full bg-blue-200 h-1.5 mt-4 rounded-full overflow-hidden">
                        <div className="bg-cloud9-blue h-full transition-all duration-1000 shadow-[0_0_8px_rgba(0,174,239,0.3)]" style={{ width: `${predictions.confidence}%` }}></div>
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-[9px] font-bold text-slate-400 uppercase">Risk Level</span>
                        <span className="text-[9px] font-bold text-cloud9-blue uppercase">{predictions.riskLevel}</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-cloud9-blue/5 border border-cloud9-blue/10 rounded-2xl">
                        <p className="text-[9px] font-bold text-cloud9-blue uppercase mb-1">Side</p>
                        <p className="text-sm font-black text-cloud9-blue uppercase">{game.currentSide}</p>
                      </div>
                      <div className="p-4 bg-blue-500/5 border border-blue-500/10 rounded-2xl">
                        <p className="text-[9px] font-bold text-blue-500 uppercase mb-1">Map</p>
                        <p className="text-sm font-black text-blue-500 uppercase">{game.mapName}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-center">
                        <p className="text-[8px] font-bold text-slate-400 uppercase mb-1">First Bloods</p>
                        <p className="text-lg font-black text-slate-900">{game.firstBloods}</p>
                      </div>
                      <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-center">
                        <p className="text-[8px] font-bold text-slate-400 uppercase mb-1">Clutches</p>
                        <p className="text-lg font-black text-slate-900">{game.clutches}</p>
                      </div>
                      <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-center">
                        <p className="text-[8px] font-bold text-slate-400 uppercase mb-1">Aces</p>
                        <p className="text-lg font-black text-slate-900">{game.aces}</p>
                      </div>
                    </div>

                    {/* Feature Importance */}
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <p className="text-[9px] font-bold text-slate-400 uppercase mb-3">Top Predictive Factors</p>
                      <div className="space-y-2">
                        {predictions.topFeatures.map((feature, idx) => (
                          <div key={idx} className="flex items-center justify-between">
                            <span className="text-[10px] font-medium text-slate-600">{feature.name}</span>
                            <div className="flex items-center gap-2">
                              <div className="w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                <div className="h-full bg-cloud9-blue" style={{ width: `${feature.importance}%` }}></div>
                              </div>
                              <span className="text-[9px] font-bold text-cloud9-blue">{feature.importance}%</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden group">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-cloud9-blue/10 blur-3xl -mr-16 -mt-16 group-hover:bg-cloud9-blue/20 transition-all duration-500"></div>
                   <div className="flex items-center gap-2 mb-4">
                      <FileText size={18} className="text-cloud9-blue" />
                      <h3 className="font-bold text-sm uppercase tracking-tight">ML Analysis Summary</h3>
                   </div>
                   <p className="text-xs text-slate-300 leading-relaxed mb-4">
                     Model analyzed {predictions.totalSamples.toLocaleString()} historical matches. Accuracy: {predictions.modelAccuracy}%. Prediction: <span className="text-cloud9-blue font-bold">{predictions.prediction}</span>
                   </p>
                   <div className="space-y-2">
                     <button className="w-full bg-cloud9-blue text-white hover:bg-[#009ed9] transition-colors py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-cloud9-blue/20">
                       <Download size={12} />
                       Export Analysis Report
                     </button>
                   </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "comms" && (
            <div className="h-[500px] md:h-[600px] lg:h-[700px] bg-card border border-blue-100 rounded-3xl overflow-hidden shadow-sm">
              <ValorantTacticalComms />
            </div>
          )}

          {activeTab === "analytics" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Model Performance */}
              <div className="bg-card border border-blue-100 rounded-3xl p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-6">
                  <BarChart3 size={16} className="text-cloud9-blue" />
                  <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Model Performance</h2>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 text-center">
                    <p className="text-3xl font-black text-cloud9-blue">{predictions.modelAccuracy}%</p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase mt-1">Accuracy</p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 text-center">
                    <p className="text-3xl font-black text-cloud9-blue">{predictions.rocAuc}</p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase mt-1">ROC-AUC</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-center">
                    <p className="text-3xl font-black text-slate-700">{predictions.totalSamples.toLocaleString()}</p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase mt-1">Training Samples</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-center">
                    <p className="text-3xl font-black text-slate-700">{predictions.topFeatures.length}</p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase mt-1">Features Used</p>
                  </div>
                </div>
              </div>

              {/* Feature Importance Chart */}
              <div className="bg-card border border-blue-100 rounded-3xl p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-6">
                  <Zap size={16} className="text-cloud9-blue" />
                  <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Feature Importance</h2>
                </div>
                <div className="space-y-3">
                  {predictions.allFeatures.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <span className="text-[10px] font-medium text-slate-600 w-32 truncate">{feature.name}</span>
                      <div className="flex-1 h-4 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-cloud9-blue to-blue-400 rounded-full transition-all duration-500" 
                          style={{ width: `${feature.importance}%` }}
                        ></div>
                      </div>
                      <span className="text-[10px] font-bold text-cloud9-blue w-10 text-right">{feature.importance}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Team Statistics */}
              <div className="bg-card border border-blue-100 rounded-3xl p-6 shadow-sm lg:col-span-2">
                <div className="flex items-center gap-2 mb-6">
                  <Users size={16} className="text-cloud9-blue" />
                  <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Team Performance Analysis</h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 text-center">
                    <p className="text-2xl font-black text-slate-800">{players.reduce((a, p) => a + p.kills, 0)}</p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase mt-1">Total Kills</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-center">
                    <p className="text-2xl font-black text-slate-800">{players.reduce((a, p) => a + p.deaths, 0)}</p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase mt-1">Total Deaths</p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 text-center">
                    <p className="text-2xl font-black text-slate-800">{players.reduce((a, p) => a + p.assists, 0)}</p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase mt-1">Total Assists</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-center">
                    <p className="text-2xl font-black text-cloud9-blue">{(players.reduce((a, p) => a + p.acs, 0) / players.length).toFixed(0)}</p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase mt-1">Avg ACS</p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 text-center">
                    <p className="text-2xl font-black text-slate-800">{(players.reduce((a, p) => a + p.hs, 0) / players.length).toFixed(0)}%</p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase mt-1">Avg HS%</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-center">
                    <p className="text-2xl font-black text-cloud9-blue">{(players.reduce((a, p) => a + p.kast, 0) / players.length).toFixed(0)}%</p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase mt-1">Avg KAST</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Placeholder for other tabs */}
          {activeTab !== "dashboard" && activeTab !== "comms" && activeTab !== "analytics" && (
            <div className="bg-white border border-blue-200 rounded-3xl p-20 flex flex-col items-center justify-center text-center">
               <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6">
                  <Crosshair size={40} className="text-blue-300" />
               </div>
               <h2 className="text-2xl font-black text-slate-900 uppercase italic mb-2">{activeTab.replace('_', ' ')}</h2>
               <p className="text-slate-500 max-w-md">This module uses ML predictions from the trained model. Additional analysis coming soon.</p>
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
          background: #bfdbfe;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #93c5fd;
        }
      `}</style>
    </div>
  );
}
