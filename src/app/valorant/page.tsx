"use client";

import React, { useState, useEffect } from "react";
import { useValorantData } from "@/hooks/useValorantData";
import ValorantPlayerCard from "@/components/dashboard/valorant/ValorantPlayerCard";
import ValorantWinProbChart from "@/components/dashboard/valorant/ValorantWinProbChart";
import ValorantTacticalComms from "@/components/dashboard/valorant/ValorantTacticalComms";
import { ValorantSidebar } from "@/components/layout/ValorantSidebar";
import { Activity, ShieldCheck, Zap, BarChart3, Users, LayoutDashboard, FileText, Download, Menu, Crosshair, Target } from "lucide-react";

export default function ValorantDashboard() {
  const [mounted, setMounted] = useState(false);
  const [teamName, setTeamName] = useState('Cloud9');
  const [opponentName, setOpponentName] = useState('Opponent');
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Handle hydration - only render after client mount
  useEffect(() => {
    setMounted(true);
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

  // Show loading state until client-side hydration is complete
  if (!mounted) {
    return (
      <div className="flex min-h-screen bg-background items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-cloud9-blue border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Loading VALORANT Dashboard...</p>
        </div>
      </div>
    );
  }

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

          {/* Roster Tab */}
          {activeTab === "roster" && (
            <div className="space-y-6">
              <div className="bg-card border border-blue-100 rounded-3xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <Users size={18} className="text-cloud9-blue" />
                    <h2 className="text-sm font-black text-foreground uppercase tracking-tight">Team Roster Analysis</h2>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-lg border border-blue-100">
                    <span className="w-2 h-2 bg-cloud9-blue rounded-full animate-pulse"></span>
                    <span className="text-[10px] font-bold text-slate-500 uppercase">{players.length} Active Players</span>
                  </div>
                </div>

                {/* Player Stats Table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-blue-100">
                        <th className="text-left py-3 px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Player</th>
                        <th className="text-left py-3 px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Agent</th>
                        <th className="text-center py-3 px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">K/D/A</th>
                        <th className="text-center py-3 px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">ACS</th>
                        <th className="text-center py-3 px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">ADR</th>
                        <th className="text-center py-3 px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">HS%</th>
                        <th className="text-center py-3 px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">KAST</th>
                        <th className="text-center py-3 px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">FB</th>
                        <th className="text-center py-3 px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">CL</th>
                        <th className="text-center py-3 px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {players.map((player, idx) => (
                        <tr key={player.id} className={`border-b border-blue-50 hover:bg-blue-50/50 transition-colors ${idx === 0 ? 'bg-blue-50/30' : ''}`}>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-gradient-to-br from-cloud9-blue to-blue-600 rounded-lg flex items-center justify-center text-white font-black text-xs">
                                {player.name.substring(0, 2).toUpperCase()}
                              </div>
                              <div>
                                <p className="text-sm font-bold text-foreground">{player.name}</p>
                                <p className="text-[9px] font-medium text-slate-400 uppercase">{player.role}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-slate-100 rounded-lg text-[10px] font-bold text-slate-700">
                              {player.agent}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-center">
                            <span className="text-sm font-bold text-foreground">{player.kills}</span>
                            <span className="text-slate-400 mx-1">/</span>
                            <span className="text-sm font-bold text-foreground">{player.deaths}</span>
                            <span className="text-slate-400 mx-1">/</span>
                            <span className="text-sm font-bold text-foreground">{player.assists}</span>
                          </td>
                          <td className="py-4 px-4 text-center">
                            <span className="text-sm font-bold text-cloud9-blue">{player.acs}</span>
                          </td>
                          <td className="py-4 px-4 text-center">
                            <span className="text-sm font-bold text-foreground">{player.adr.toFixed(0)}</span>
                          </td>
                          <td className="py-4 px-4 text-center">
                            <span className="text-sm font-bold text-foreground">{player.hs}%</span>
                          </td>
                          <td className="py-4 px-4 text-center">
                            <span className="text-sm font-bold text-foreground">{player.kast}%</span>
                          </td>
                          <td className="py-4 px-4 text-center">
                            <span className="text-sm font-bold text-foreground">{player.firstBloods}</span>
                          </td>
                          <td className="py-4 px-4 text-center">
                            <span className="text-sm font-bold text-foreground">{player.clutches}</span>
                          </td>
                          <td className="py-4 px-4 text-center">
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[9px] font-bold uppercase ${
                              player.status === 'optimal' ? 'bg-green-100 text-green-700' :
                              player.status === 'warning' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {player.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Team Composition Analysis */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-card border border-blue-100 rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Target size={14} className="text-cloud9-blue" />
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Duelists</h3>
                  </div>
                  <p className="text-3xl font-black text-foreground mb-2">{players.filter(p => p.role === 'Duelist').length}</p>
                  <div className="space-y-1">
                    {players.filter(p => p.role === 'Duelist').map(p => (
                      <p key={p.id} className="text-[10px] font-medium text-slate-500">{p.name} ({p.agent})</p>
                    ))}
                  </div>
                </div>

                <div className="bg-card border border-blue-100 rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Zap size={14} className="text-cloud9-blue" />
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Initiators</h3>
                  </div>
                  <p className="text-3xl font-black text-foreground mb-2">{players.filter(p => p.role === 'Initiator').length}</p>
                  <div className="space-y-1">
                    {players.filter(p => p.role === 'Initiator').map(p => (
                      <p key={p.id} className="text-[10px] font-medium text-slate-500">{p.name} ({p.agent})</p>
                    ))}
                  </div>
                </div>

                <div className="bg-card border border-blue-100 rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Activity size={14} className="text-cloud9-blue" />
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Controllers</h3>
                  </div>
                  <p className="text-3xl font-black text-foreground mb-2">{players.filter(p => p.role === 'Controller').length}</p>
                  <div className="space-y-1">
                    {players.filter(p => p.role === 'Controller').map(p => (
                      <p key={p.id} className="text-[10px] font-medium text-slate-500">{p.name} ({p.agent})</p>
                    ))}
                  </div>
                </div>

                <div className="bg-card border border-blue-100 rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <ShieldCheck size={14} className="text-cloud9-blue" />
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sentinels</h3>
                  </div>
                  <p className="text-3xl font-black text-foreground mb-2">{players.filter(p => p.role === 'Sentinel').length}</p>
                  <div className="space-y-1">
                    {players.filter(p => p.role === 'Sentinel').map(p => (
                      <p key={p.id} className="text-[10px] font-medium text-slate-500">{p.name} ({p.agent})</p>
                    ))}
                  </div>
                </div>
              </div>

              {/* Performance Insights */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-cloud9-blue to-blue-600 rounded-3xl p-6 text-white">
                  <div className="flex items-center gap-2 mb-4">
                    <BarChart3 size={16} className="text-white" />
                    <h3 className="text-sm font-black uppercase">Top Performer</h3>
                  </div>
                  {players.length > 0 && (() => {
                    const topPlayer = [...players].sort((a, b) => b.acs - a.acs)[0];
                    return (
                      <div>
                        <p className="text-2xl font-black mb-2">{topPlayer.name}</p>
                        <p className="text-sm opacity-90 mb-4">{topPlayer.agent} • {topPlayer.role}</p>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-white/10 rounded-xl p-3">
                            <p className="text-[9px] font-bold uppercase opacity-80 mb-1">ACS</p>
                            <p className="text-2xl font-black">{topPlayer.acs}</p>
                          </div>
                          <div className="bg-white/10 rounded-xl p-3">
                            <p className="text-[9px] font-bold uppercase opacity-80 mb-1">K/D</p>
                            <p className="text-2xl font-black">{(topPlayer.kills / Math.max(1, topPlayer.deaths)).toFixed(2)}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>

                <div className="bg-card border border-blue-100 rounded-3xl p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Users size={16} className="text-cloud9-blue" />
                    <h3 className="text-sm font-black uppercase text-foreground">Team Averages</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-blue-50 rounded-xl p-3 border border-blue-100">
                      <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">Avg ACS</p>
                      <p className="text-2xl font-black text-foreground">{(players.reduce((a, p) => a + p.acs, 0) / players.length).toFixed(0)}</p>
                    </div>
                    <div className="bg-blue-50 rounded-xl p-3 border border-blue-100">
                      <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">Avg K/D</p>
                      <p className="text-2xl font-black text-foreground">{(players.reduce((a, p) => a + (p.kills / Math.max(1, p.deaths)), 0) / players.length).toFixed(2)}</p>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                      <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">Avg HS%</p>
                      <p className="text-2xl font-black text-foreground">{(players.reduce((a, p) => a + p.hs, 0) / players.length).toFixed(0)}%</p>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                      <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">Avg KAST</p>
                      <p className="text-2xl font-black text-foreground">{(players.reduce((a, p) => a + p.kast, 0) / players.length).toFixed(0)}%</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Strats Tab */}
          {activeTab === "strats" && (
            <div className="space-y-6">
              <div className="bg-card border border-blue-100 rounded-3xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <Target size={18} className="text-cloud9-blue" />
                    <h2 className="text-sm font-black text-foreground uppercase tracking-tight">Strategy Library</h2>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-lg border border-blue-100">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">{game.mapName}</span>
                  </div>
                </div>

                {/* Strategy Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Attack Strats */}
                  <div className="bg-gradient-to-br from-red-50 to-orange-50 border border-red-200 rounded-2xl p-5 hover:shadow-md transition-shadow cursor-pointer group">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                          <Crosshair size={16} className="text-white" />
                        </div>
                        <h3 className="text-sm font-black text-slate-900 uppercase">A Site Rush</h3>
                      </div>
                      <span className="text-[8px] font-bold px-2 py-1 bg-red-500 text-white rounded-md uppercase">Attack</span>
                    </div>
                    <p className="text-xs text-slate-600 mb-3 leading-relaxed">Fast 5-man execute with smokes and flashes. Duelist entry, Controller smoke crossfires.</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-bold text-slate-400 uppercase">Win Rate</span>
                        <span className="text-sm font-black text-red-600">68%</span>
                      </div>
                      <span className="text-[8px] font-medium text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">Click to view →</span>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-red-50 to-orange-50 border border-red-200 rounded-2xl p-5 hover:shadow-md transition-shadow cursor-pointer group">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                          <Zap size={16} className="text-white" />
                        </div>
                        <h3 className="text-sm font-black text-slate-900 uppercase">B Split Push</h3>
                      </div>
                      <span className="text-[8px] font-bold px-2 py-1 bg-red-500 text-white rounded-md uppercase">Attack</span>
                    </div>
                    <p className="text-xs text-slate-600 mb-3 leading-relaxed">2-3 split with utility coordination. Pincer movement to trap defenders.</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-bold text-slate-400 uppercase">Win Rate</span>
                        <span className="text-sm font-black text-red-600">72%</span>
                      </div>
                      <span className="text-[8px] font-medium text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">Click to view →</span>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-red-50 to-orange-50 border border-red-200 rounded-2xl p-5 hover:shadow-md transition-shadow cursor-pointer group">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                          <Activity size={16} className="text-white" />
                        </div>
                        <h3 className="text-sm font-black text-slate-900 uppercase">Mid Control</h3>
                      </div>
                      <span className="text-[8px] font-bold px-2 py-1 bg-red-500 text-white rounded-md uppercase">Attack</span>
                    </div>
                    <p className="text-xs text-slate-600 mb-3 leading-relaxed">Slow default with mid control. Info gathering then rotate based on defender setup.</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-bold text-slate-400 uppercase">Win Rate</span>
                        <span className="text-sm font-black text-red-600">65%</span>
                      </div>
                      <span className="text-[8px] font-medium text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">Click to view →</span>
                    </div>
                  </div>

                  {/* Defense Strats */}
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-2xl p-5 hover:shadow-md transition-shadow cursor-pointer group">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                          <ShieldCheck size={16} className="text-white" />
                        </div>
                        <h3 className="text-sm font-black text-slate-900 uppercase">A Site Stack</h3>
                      </div>
                      <span className="text-[8px] font-bold px-2 py-1 bg-blue-500 text-white rounded-md uppercase">Defense</span>
                    </div>
                    <p className="text-xs text-slate-600 mb-3 leading-relaxed">3-player A hold with crossfire setups. Sentinel lockdown, fast rotate on B pressure.</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-bold text-slate-400 uppercase">Win Rate</span>
                        <span className="text-sm font-black text-blue-600">74%</span>
                      </div>
                      <span className="text-[8px] font-medium text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">Click to view →</span>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-2xl p-5 hover:shadow-md transition-shadow cursor-pointer group">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                          <Users size={16} className="text-white" />
                        </div>
                        <h3 className="text-sm font-black text-slate-900 uppercase">Retake Setup</h3>
                      </div>
                      <span className="text-[8px] font-bold px-2 py-1 bg-blue-500 text-white rounded-md uppercase">Defense</span>
                    </div>
                    <p className="text-xs text-slate-600 mb-3 leading-relaxed">Give site, regroup for coordinated retake. Smoke plant, flash in, trade kills efficiently.</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-bold text-slate-400 uppercase">Win Rate</span>
                        <span className="text-sm font-black text-blue-600">58%</span>
                      </div>
                      <span className="text-[8px] font-medium text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">Click to view →</span>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-2xl p-5 hover:shadow-md transition-shadow cursor-pointer group">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                          <Target size={16} className="text-white" />
                        </div>
                        <h3 className="text-sm font-black text-slate-900 uppercase">Aggressive Push</h3>
                      </div>
                      <span className="text-[8px] font-bold px-2 py-1 bg-blue-500 text-white rounded-md uppercase">Defense</span>
                    </div>
                    <p className="text-xs text-slate-600 mb-3 leading-relaxed">Early aggression to catch attackers off-guard. Info play into fallback or commitment.</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-bold text-slate-400 uppercase">Win Rate</span>
                        <span className="text-sm font-black text-blue-600">61%</span>
                      </div>
                      <span className="text-[8px] font-medium text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">Click to view →</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ML Strategy Recommendations */}
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-3xl p-6 text-white">
                <div className="flex items-center gap-2 mb-4">
                  <BarChart3 size={18} className="text-cloud9-blue" />
                  <h3 className="text-sm font-black uppercase">ML Strategy Recommendations</h3>
                </div>
                <p className="text-sm text-slate-300 mb-6 leading-relaxed">
                  Based on {predictions.totalSamples.toLocaleString()} analyzed matches and current game state, our ML model suggests:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <p className="text-xs font-black uppercase text-green-400">Highest Win Probability</p>
                    </div>
                    <p className="text-lg font-black mb-1">{game.currentSide === 'Attack' ? 'B Split Push' : 'A Site Stack'}</p>
                    <p className="text-[10px] text-slate-400">Predicted success rate: 76% based on current economy and team comp</p>
                  </div>
                  <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                      <p className="text-xs font-black uppercase text-yellow-400">Counter-Strategy Alert</p>
                    </div>
                    <p className="text-lg font-black mb-1">Opponent Tendency</p>
                    <p className="text-[10px] text-slate-400">Enemy team favors {game.currentSide === 'Attack' ? 'aggressive defense' : 'slow defaults'} on this map</p>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-card border border-blue-100 rounded-2xl p-5 text-center">
                  <p className="text-3xl font-black text-foreground mb-1">6</p>
                  <p className="text-[9px] font-bold text-slate-400 uppercase">Total Strategies</p>
                </div>
                <div className="bg-card border border-blue-100 rounded-2xl p-5 text-center">
                  <p className="text-3xl font-black text-cloud9-blue mb-1">67%</p>
                  <p className="text-[9px] font-bold text-slate-400 uppercase">Avg Win Rate</p>
                </div>
                <div className="bg-card border border-blue-100 rounded-2xl p-5 text-center">
                  <p className="text-3xl font-black text-foreground mb-1">{game.mapName}</p>
                  <p className="text-[9px] font-bold text-slate-400 uppercase">Current Map</p>
                </div>
                <div className="bg-card border border-blue-100 rounded-2xl p-5 text-center">
                  <p className="text-3xl font-black text-cloud9-blue mb-1">{game.currentSide}</p>
                  <p className="text-[9px] font-bold text-slate-400 uppercase">Current Side</p>
                </div>
              </div>
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
