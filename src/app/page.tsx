"use client";

import React, { useState, useEffect } from "react";
import { useAegisLive } from "@/hooks/useAegisLive";
import { PlayerCard } from "@/components/dashboard/PlayerCard";
import WinProbChart from "@/components/dashboard/WinProbChart";
import SquadMetricsChart from "@/components/dashboard/SquadMetricsChart";
import CommsChart from "@/components/dashboard/CommsChart";
import MacroPieChart from "@/components/dashboard/MacroPieChart";
import { SquadMetric } from "@/types";
import { TacticalComms } from "@/components/dashboard/TacticalComms";
import { Sidebar } from "@/components/layout/Sidebar";
import { WelcomePage } from "@/components/layout/WelcomePage";
import { SettingsModal } from "@/components/modals/SettingsModal";
import { Activity, ShieldCheck, Zap, BarChart3, Users, LayoutDashboard, FileText, Download, Menu, MessageSquare, Settings } from "lucide-react";

export default function Home() {
  const [isStarted, setIsStarted] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [sessionData, setSessionData] = useState({ teamName: "", opponentName: "", game: "" });
  const { game, players, telemetry, isConnected, lolGameData, prediction, featureImportance } = useAegisLive(sessionData.teamName, sessionData.opponentName, sessionData.game);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Export analysis report as JSON (like Valorant)
  const exportAnalysisReport = () => {
    const report = {
      metadata: {
        exportDate: new Date().toISOString(),
        teamName: sessionData.teamName,
        opponentName: sessionData.opponentName,
        game: "League of Legends",
        currentTime: lolGameData?.currentTime || "N/A",
      },
      predictions: prediction ? {
        winProbability: prediction.win_probability,
        confidence: prediction.confidence,
        prediction: prediction.prediction,
        riskLevel: prediction.risk_level,
        modelAccuracy: prediction.model_accuracy,
        modelName: prediction.model_name,
      } : null,
      gameState: lolGameData ? {
        currentTime: lolGameData.currentTime,
        teamKills: lolGameData.teamKills,
        enemyKills: lolGameData.enemyKills,
        goldDiff: lolGameData.goldDiff,
        teamDragons: lolGameData.teamDragons,
        enemyDragons: lolGameData.enemyDragons,
        teamBarons: lolGameData.teamBarons,
        enemyBarons: lolGameData.enemyBarons,
      } : null,
      players: players.map(p => ({
        name: p.name,
        role: p.role,
        champion: p.champion,
        kills: p.kills,
        deaths: p.deaths,
        assists: p.assists,
        kda: p.kda,
        cs: p.cs,
        gold: p.gold,
        visionScore: p.visionScore,
        status: p.status,
      })),
      featureImportance: featureImportance,
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `LoL_Analysis_${sessionData.teamName}_vs_${sessionData.opponentName}_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleStart = (teamName: string, opponentName: string, selectedGame: string) => {
    setSessionData({ teamName, opponentName, game: selectedGame });
    setIsStarted(true);
  };

  // Close mobile menu when window is resized to desktop size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) { // lg breakpoint
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!mounted) {
    return <div className="min-h-screen bg-slate-50" />;
  }

  if (!isStarted) {
    return <WelcomePage onStart={handleStart} />;
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
      
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        teamName={sessionData.teamName} 
        game={sessionData.game} 
        onBackToHome={() => setIsStarted(false)}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />
      
      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        currentTeam={sessionData.teamName}
        currentOpponent={sessionData.opponentName}
        onSave={(team, opponent) => setSessionData(prev => ({ ...prev, teamName: team, opponentName: opponent }))}
      />

      <main className="flex-1 p-3 md:p-4 lg:p-6 overflow-y-auto animate-in fade-in slide-in-from-right-4 duration-700">
        <div className="max-w-full mx-auto space-y-4 md:space-y-6">
          
          {/* Mobile Menu Button */}
          <div className="lg:hidden mb-4 flex justify-between items-center">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-3 bg-white border border-slate-200 rounded-2xl shadow-sm"
            >
              <Menu size={20} className="text-slate-600" />
            </button>
            <button 
              onClick={() => setIsSettingsOpen(true)}
              className="p-3 bg-white border border-slate-200 rounded-2xl shadow-sm"
            >
              <Settings size={20} className="text-slate-600" />
            </button>
          </div>
          
          {/* Top Header */}
          <header className="flex flex-col lg:flex-row justify-between items-center bg-card border border-border-custom p-4 md:p-6 rounded-3xl shadow-sm">
            <div className="flex items-center gap-4 md:gap-6 w-full lg:w-auto">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-cloud9-blue rounded-2xl flex items-center justify-center shadow-lg shadow-cloud9-blue/20">
                <span className="text-xl md:text-2xl font-black text-white">C9</span>
              </div>
              <div className="flex-1 lg:flex-initial">
                <div className="flex items-center gap-2 mb-1">
                  <LayoutDashboard size={16} className="text-cloud9-blue" />
                  <h1 className="text-lg md:text-xl lg:text-2xl font-black tracking-tight text-foreground uppercase italic">
                    Aegis-C9 <span className="text-cloud9-blue hidden sm:inline">Assistant Coach</span>
                  </h1>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-cloud9-blue rounded-full animate-pulse shadow-[0_0_8px_rgba(0,174,239,0.5)]"></span>
                  <span className="text-[9px] md:text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                    {sessionData.teamName} VS {sessionData.opponentName} • LIVE
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 lg:mt-0 flex flex-col sm:flex-row items-center gap-4 sm:gap-8 bg-slate-50 p-4 rounded-2xl border border-slate-100 w-full lg:w-auto">
              <div className="text-center sm:text-right">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Live Win Prob</p>
                <div className="text-3xl md:text-4xl font-black text-cloud9-blue tabular-nums">
                  {game.winProbability.toFixed(1)}<span className="text-lg md:text-xl ml-0.5">%</span>
                </div>
              </div>
              <div className="hidden sm:block w-px h-10 bg-slate-200" />
              <div className="w-full sm:w-auto h-px sm:h-auto bg-slate-200 sm:bg-transparent" />
              <div className="flex flex-row sm:flex-col gap-2 sm:gap-1">
                 <div className="flex gap-2">
                   <button 
                     onClick={() => setIsSettingsOpen(true)}
                     className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                   >
                      <Settings size={14} className="text-slate-400" />
                      <span className="text-[9px] md:text-[10px] font-bold text-slate-500 uppercase">Config</span>
                   </button>
                   <button 
                     onClick={exportAnalysisReport}
                     className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                   >
                      <FileText size={14} className="text-slate-400" />
                      <span className="text-[9px] md:text-[10px] font-bold text-slate-500 uppercase">Export</span>
                   </button>
                 </div>
                 <div className="flex items-center gap-2 px-3 py-1.5">
                    <Activity size={14} className="text-cloud9-blue" />
                    <span className="text-[9px] md:text-[10px] font-bold text-slate-500 uppercase">System Nominal</span>
                 </div>
              </div>
            </div>
          </header>

          {/* Conditional Rendering based on activeTab */}
          {activeTab === "dashboard" && (
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 md:gap-6">
              {/* Left Column: Player Cards */}
              <div className="xl:col-span-3 order-2 xl:order-1 space-y-3 md:space-y-4 xl:max-h-[calc(100vh-250px)] xl:overflow-y-auto xl:pr-2 custom-scrollbar">
                <div className="flex items-center justify-between mb-4 px-1">
                  <div className="flex items-center gap-2">
                    <Users size={16} className="text-cloud9-blue" />
                    <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Squad Status</h2>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-amber-500'} animate-pulse`}></div>
                    <span className="text-[9px] font-bold text-slate-400">{isConnected ? 'Live' : 'Local'}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-3 md:gap-4">
                  {players.map((player, idx) => {
                    const squadMetrics: SquadMetric[] = telemetry?.mie_analysis?.squad_telemetry || [];
                    const metric = squadMetrics.find((m: SquadMetric) => m.name === player.name) || squadMetrics[idx];
                    return <PlayerCard key={player.id} player={player} squadMetric={metric} />;
                  })}
                </div>
              </div>

              {/* Center Column: WinProbChart */}
              <div className="xl:col-span-6 order-1 xl:order-2 space-y-4 md:space-y-6">
                <div className="flex flex-col bg-card border border-border-custom rounded-3xl p-4 md:p-6 lg:p-8 relative overflow-hidden shadow-sm h-fit min-h-[400px]">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 md:mb-8 gap-4">
                    <div className="flex items-center gap-2">
                      <BarChart3 size={18} className="text-cloud9-blue" />
                      <h2 className="text-xs md:text-sm font-black text-foreground uppercase tracking-tight">Probability Matrix</h2>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-cloud9-blue"></span>
                        <span className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase">Live Telemetry</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 bg-slate-50 rounded-2xl p-3 md:p-4 border border-slate-100">
                    <WinProbChart currentProb={game.winProbability} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
                      <div className="flex items-center justify-between mb-4">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Comms Density</p>
                        <MessageSquare size={14} className="text-cloud9-blue" />
                      </div>
                      <CommsChart anomalies={game.anomalies} />
                   </div>
                   <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
                      <div className="flex items-center justify-between mb-4">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Macro Balance</p>
                        <Zap size={14} className="text-neon-orange" />
                      </div>
                      <div className="h-[250px] w-full">
                        {telemetry?.mie_analysis?.probability_metrics ? (
                          <MacroPieChart data={telemetry.mie_analysis.probability_metrics} />
                        ) : (
                          <div className="h-full flex items-center justify-center text-[10px] font-bold text-slate-300 uppercase">Awaiting Macro Data...</div>
                        )}
                      </div>
                   </div>
                </div>
              </div>

              {/* Right Column: General Stats */}
              <div className="xl:col-span-3 order-3 xl:order-3 space-y-4 md:space-y-6">
                <div className="bg-card border border-border-custom rounded-3xl p-6 shadow-sm">
                  <div className="flex items-center gap-2 mb-6">
                     <Zap size={16} className="text-neon-orange" />
                     <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">
                       {lolGameData ? 'Match Overview' : 'Macro Metrics'}
                     </h2>
                  </div>
                  <div className="space-y-6">
                    {/* LoL Game Stats Display */}
                    {lolGameData ? (
                      <>
                        <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                          <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Game Time</p>
                          <p className="text-3xl font-black text-foreground">{lolGameData.currentTime}</p>
                          <div className="mt-3 flex items-center justify-between text-[10px] font-bold">
                            <span className="text-cloud9-blue">{sessionData.teamName}: {lolGameData.teamKills}</span>
                            <span className="text-slate-400">vs</span>
                            <span className="text-red-500">{sessionData.opponentName}: {lolGameData.enemyKills}</span>
                          </div>
                        </div>
                        
                        <div className="p-4 bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200/50 rounded-2xl">
                          <p className="text-[10px] font-bold text-yellow-700 uppercase mb-2">Gold Difference</p>
                          <p className={`text-2xl font-black ${lolGameData.goldDiff >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                            {lolGameData.goldDiff >= 0 ? '+' : ''}{(lolGameData.goldDiff / 1000).toFixed(1)}k
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="p-4 bg-purple-500/5 border border-purple-500/10 rounded-2xl">
                            <p className="text-[9px] font-bold text-purple-600 uppercase mb-1">Dragons</p>
                            <p className="text-lg font-black text-purple-600">{lolGameData.teamDragons} - {lolGameData.enemyDragons}</p>
                          </div>
                          <div className="p-4 bg-orange-500/5 border border-orange-500/10 rounded-2xl">
                            <p className="text-[9px] font-bold text-orange-600 uppercase mb-1">Barons</p>
                            <p className="text-lg font-black text-orange-600">{lolGameData.teamBarons} - {lolGameData.enemyBarons}</p>
                          </div>
                          <div className="p-4 bg-blue-500/5 border border-blue-500/10 rounded-2xl">
                            <p className="text-[9px] font-bold text-blue-600 uppercase mb-1">Towers</p>
                            <p className="text-lg font-black text-blue-600">{lolGameData.teamTowers} - {lolGameData.enemyTowers}</p>
                          </div>
                          <div className="p-4 bg-red-500/5 border border-red-500/10 rounded-2xl">
                            <p className="text-[9px] font-bold text-red-600 uppercase mb-1">Inhibitors</p>
                            <p className="text-lg font-black text-red-600">{lolGameData.teamInhibitors} - {lolGameData.enemyInhibitors}</p>
                          </div>
                        </div>

                        {lolGameData.dragonSoul && (
                          <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200/50 rounded-2xl">
                            <p className="text-[9px] font-bold text-indigo-600 uppercase mb-1">Dragon Soul</p>
                            <p className="text-sm font-black text-indigo-700">{lolGameData.dragonSoul}</p>
                          </div>
                        )}
                      </>
                    ) : (
                      <>
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
                        
                        <div className="grid grid-cols-2 gap-3">
                          <div className="p-4 bg-cloud9-blue/5 border border-cloud9-blue/10 rounded-2xl">
                            <p className="text-[9px] font-bold text-cloud9-blue uppercase mb-1">Site Hold</p>
                            <p className="text-sm font-black text-cloud9-blue uppercase">
                              {telemetry?.mie_analysis?.probability_metrics?.site_retake_success || '---'}
                            </p>
                          </div>
                          <div className="p-4 bg-blue-500/5 border border-blue-500/10 rounded-2xl">
                            <p className="text-[9px] font-bold text-blue-500 uppercase mb-1">Obj. Rate</p>
                            <p className="text-sm font-black text-blue-500 uppercase">
                              {telemetry?.mie_analysis?.probability_metrics?.baron_contest_rate || '---'}
                            </p>
                          </div>
                          <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                            <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">Clutch Prob</p>
                            <p className="text-sm font-black text-slate-900 uppercase">
                              {telemetry?.mie_analysis?.probability_metrics?.clutch_potential || '---'}
                            </p>
                          </div>
                          <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                            <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">Tempo Dev.</p>
                            <p className="text-sm font-black text-slate-900 uppercase">
                              {telemetry?.mie_analysis?.probability_metrics?.tempo_deviation || '---'}
                            </p>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Model Info Panel */}
                {prediction && (
                  <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200/50 rounded-3xl p-6 shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                      <ShieldCheck size={16} className="text-emerald-600" />
                      <h3 className="text-[11px] font-black text-emerald-700 uppercase tracking-[0.2em]">ML Model</h3>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-emerald-600 uppercase">Model</span>
                        <span className="text-[10px] font-black text-emerald-800">{prediction.model_name}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-emerald-600 uppercase">Accuracy</span>
                        <span className="text-[10px] font-black text-emerald-800">{prediction.model_accuracy}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-emerald-600 uppercase">ROC-AUC</span>
                        <span className="text-[10px] font-black text-emerald-800">{prediction.roc_auc}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-emerald-600 uppercase">Confidence</span>
                        <span className="text-[10px] font-black text-emerald-800">{prediction.confidence}%</span>
                      </div>
                    </div>
                  </div>
                )}

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
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[700px]">
              <div className="lg:col-span-8 bg-card border border-border-custom rounded-3xl overflow-hidden shadow-sm">
                <TacticalComms />
              </div>
              <div className="lg:col-span-4 space-y-6">
                <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
                   <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Sentiment Analysis</p>
                   <CommsChart anomalies={game.anomalies} />
                </div>
                <div className="bg-slate-900 rounded-3xl p-6 text-white">
                   <h3 className="text-sm font-black uppercase mb-4 text-cloud9-blue">Live Analysis</h3>
                   <p className="text-xs text-slate-400 leading-relaxed">
                     Tactical uplink is processing {game.anomalies.length} active threads. 
                     {game.anomalies.length > 5 ? " High volume of tactical shifts detected." : " Comm frequency is within nominal range."}
                   </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "roster" && (
            <div className="space-y-6">
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm col-span-1 lg:col-span-2">
                     <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Squad Gold Distribution</p>
                     {telemetry?.mie_analysis?.squad_telemetry ? (
                       <SquadMetricsChart data={telemetry.mie_analysis.squad_telemetry} type="gold" />
                     ) : (
                       <div className="h-[250px] flex items-center justify-center text-slate-300">Awaiting Gold Data...</div>
                     )}
                  </div>
                  <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
                     <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Vision Control</p>
                     {telemetry?.mie_analysis?.squad_telemetry ? (
                       <SquadMetricsChart data={telemetry.mie_analysis.squad_telemetry} type="vision" />
                     ) : (
                       <div className="h-[250px] flex items-center justify-center text-slate-300">Awaiting Vision Data...</div>
                     )}
                  </div>
               </div>
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                  {players.map((player, idx) => {
                    const squadMetrics: SquadMetric[] = telemetry?.mie_analysis?.squad_telemetry || [];
                    const metric = squadMetrics.find((m: SquadMetric) => m.name === player.name) || squadMetrics[idx];
                    return <PlayerCard key={player.id} player={player} squadMetric={metric} />;
                  })}
               </div>
            </div>
          )}

          {activeTab === "analytics" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Model Performance */}
              <div className="bg-card border border-slate-100 rounded-3xl p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-6">
                  <BarChart3 size={16} className="text-cloud9-blue" />
                  <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Model Performance</h2>
                </div>
                {prediction ? (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 text-center">
                      <p className="text-3xl font-black text-cloud9-blue">{prediction.model_accuracy}%</p>
                      <p className="text-[9px] font-bold text-slate-400 uppercase mt-1">Accuracy</p>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 text-center">
                      <p className="text-3xl font-black text-cloud9-blue">{prediction.roc_auc}</p>
                      <p className="text-[9px] font-bold text-slate-400 uppercase mt-1">ROC-AUC</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-center">
                      <p className="text-3xl font-black text-slate-700">{prediction.total_samples.toLocaleString()}</p>
                      <p className="text-[9px] font-bold text-slate-400 uppercase mt-1">Training Samples</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-center">
                      <p className="text-3xl font-black text-slate-700">{featureImportance.length}</p>
                      <p className="text-[9px] font-bold text-slate-400 uppercase mt-1">Features Used</p>
                    </div>
                  </div>
                ) : (
                  <div className="h-[200px] flex items-center justify-center text-slate-300 font-bold uppercase text-[10px]">
                    Waiting for model data...
                  </div>
                )}
              </div>

              {/* Feature Importance Chart */}
              <div className="bg-card border border-slate-100 rounded-3xl p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-6">
                  <Zap size={16} className="text-cloud9-blue" />
                  <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Feature Importance</h2>
                </div>
                <div className="space-y-3">
                  {featureImportance.length > 0 ? (
                    featureImportance.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <span className="text-[10px] font-medium text-slate-600 w-32 truncate">{feature.name}</span>
                        <div className="flex-1 h-4 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-cloud9-blue to-blue-400 rounded-full transition-all duration-500" 
                            style={{ width: `${feature.importance * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-[10px] font-bold text-cloud9-blue w-10 text-right">{(feature.importance * 100).toFixed(1)}%</span>
                      </div>
                    ))
                  ) : (
                    <div className="h-[200px] flex items-center justify-center text-slate-300 font-bold uppercase text-[10px]">
                      Analyzing predictive factors...
                    </div>
                  )}
                </div>
              </div>

              {/* Win Probability History (Large) */}
              <div className="bg-card border border-slate-100 rounded-3xl p-8 shadow-sm lg:col-span-2">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="text-cloud9-blue" size={20} />
                    <h2 className="text-lg font-black uppercase italic">Probability Trends Analysis</h2>
                  </div>
                  <div className="px-4 py-2 bg-blue-50 rounded-2xl border border-blue-100">
                    <span className="text-[10px] font-black text-cloud9-blue uppercase tracking-widest">
                      Current: {game.winProbability.toFixed(1)}%
                    </span>
                  </div>
                </div>
                <div className="h-[400px]">
                  <WinProbChart currentProb={game.winProbability} />
                </div>
              </div>
            </div>
          )}

          {activeTab === "drills" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
               <div className="lg:col-span-4 bg-slate-900 rounded-3xl p-8 text-white flex flex-col justify-between">
                  <div>
                    <Zap className="text-neon-orange mb-6" size={32} />
                    <h2 className="text-2xl font-black uppercase italic mb-4">Drill Generator</h2>
                    <p className="text-slate-400 text-sm leading-relaxed mb-8">
                      Aegis is identifying performance gaps in real-time. Training modules are generated based on micro-failures detected during the live session.
                    </p>
                  </div>
                  <div className="space-y-3">
                    <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                       <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Errors Tracked</p>
                       <p className="text-2xl font-black">{players.reduce((acc, p) => acc + (p.recentErrors || 0), 0)}</p>
                    </div>
                    <button className="w-full bg-cloud9-blue text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-cloud9-blue/90 transition-colors">
                      Generate Custom Plan
                    </button>
                  </div>
               </div>
               <div className="lg:col-span-8 bg-white border border-slate-100 rounded-3xl p-8 shadow-sm">
                  <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-8">Performance Gap Analysis</p>
                  <div className="h-[400px]">
                    {telemetry?.mie_analysis?.squad_telemetry ? (
                      <SquadMetricsChart data={telemetry.mie_analysis.squad_telemetry} type="cs" />
                    ) : (
                      <div className="h-full flex items-center justify-center text-slate-300">Awaiting Telemetry...</div>
                    )}
                  </div>
                  <div className="mt-6 p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                     <span className="text-xs font-bold text-slate-500 uppercase">Recommended Focus:</span>
                     <span className="text-xs font-black text-cloud9-blue uppercase">Wave Management & Objective Rotation</span>
                  </div>
               </div>
            </div>
          )}

          {/* Placeholder for other tabs */}
          {activeTab !== "dashboard" && activeTab !== "comms" && activeTab !== "roster" && activeTab !== "analytics" && activeTab !== "drills" && (
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
