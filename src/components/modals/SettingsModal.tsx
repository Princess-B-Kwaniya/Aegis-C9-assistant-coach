"use client";

import React from 'react';
import { X, Bell, Globe, Database, RefreshCw, Users } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTeam?: string;
  currentOpponent?: string;
  onSave?: (team: string, opponent: string) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, currentTeam, currentOpponent, onSave }) => {
  const [notifications, setNotifications] = React.useState(true);
  const [autoRefresh, setAutoRefresh] = React.useState(true);
  const [refreshInterval, setRefreshInterval] = React.useState(3);
  const [backendUrl, setBackendUrl] = React.useState(
    typeof window !== 'undefined'
      ? localStorage.getItem('backendUrl') || process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'
      : ''
  );
  
  const [teamName, setTeamName] = React.useState(currentTeam || "Cloud9");
  const [opponentName, setOpponentName] = React.useState(currentOpponent || "Opponent");

  React.useEffect(() => {
     if (currentTeam) setTeamName(currentTeam);
     if (currentOpponent) setOpponentName(currentOpponent);
  }, [currentTeam, currentOpponent]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('notifications', notifications.toString());
      localStorage.setItem('autoRefresh', autoRefresh.toString());
      localStorage.setItem('refreshInterval', refreshInterval.toString());
      localStorage.setItem('backendUrl', backendUrl);

      // Reload to apply settings
      if (onSave) {
          onSave(teamName, opponentName);
          // If we are just updating session, maybe don't reload?
          // But existing logic reloads. Let's keep it but ideally we should optionally reload.
          // For now, let's allow reload BUT onSave should handle state update before/after.
          // The page reload might wipe the state if not persisted.
          // Given the structure, simple state update is better.
          // I will comment out reload if onSave is present to avoid clearing context.
          if (!onSave) window.location.reload(); 
      } else {
         window.location.reload();
      }
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-cloud9-blue to-blue-600 p-6 rounded-t-3xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black text-white uppercase italic tracking-tight">Settings</h2>
              <p className="text-xs text-white/80 font-medium mt-1">Configure your VALORANT dashboard</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-xl transition-colors"
            >
              <X size={24} className="text-white" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Match Config */}
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
            <div className="flex items-center gap-3 mb-3">
               <div className="w-10 h-10 bg-orange-500/10 rounded-xl flex items-center justify-center">
                   <Users size={20} className="text-orange-600" />
               </div>
               <div>
                  <h3 className="text-sm font-bold text-slate-900 uppercase">Match Configuration</h3>
                  <p className="text-xs text-slate-500">Update Team Names</p>
               </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
               <div>
                   <label className="text-[10px] font-bold text-slate-500 uppercase mb-1 block">Your Team</label>
                   <input 
                      type="text" 
                      value={teamName}
                      onChange={(e) => setTeamName(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold focus:outline-none focus:ring-2 focus:ring-cloud9-blue"
                   />
               </div>
               <div>
                   <label className="text-[10px] font-bold text-slate-500 uppercase mb-1 block">Opponent</label>
                   <input 
                      type="text" 
                      value={opponentName}
                      onChange={(e) => setOpponentName(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold focus:outline-none focus:ring-2 focus:ring-cloud9-blue"
                   />
               </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-cloud9-blue/10 rounded-xl flex items-center justify-center">
                  <Bell size={20} className="text-cloud9-blue" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 uppercase">Notifications</h3>
                  <p className="text-xs text-slate-500">Get alerts for critical events</p>
                </div>
              </div>
              <button
                onClick={() => setNotifications(!notifications)}
                className={`relative w-14 h-7 rounded-full transition-colors ${
                  notifications ? 'bg-cloud9-blue' : 'bg-slate-300'
                }`}
              >
                <div
                  className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${
                    notifications ? 'translate-x-7' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Auto Refresh */}
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center">
                  <RefreshCw size={20} className="text-green-600" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 uppercase">Auto Refresh</h3>
                  <p className="text-xs text-slate-500">Automatically update predictions</p>
                </div>
              </div>
              <button
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={`relative w-14 h-7 rounded-full transition-colors ${
                  autoRefresh ? 'bg-green-500' : 'bg-slate-300'
                }`}
              >
                <div
                  className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${
                    autoRefresh ? 'translate-x-7' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
            {autoRefresh && (
              <div className="mt-4 pt-4 border-t border-slate-200">
                <label className="text-xs font-bold text-slate-600 uppercase mb-2 block">
                  Refresh Interval: {refreshInterval}s
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={refreshInterval}
                  onChange={(e) => setRefreshInterval(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-cloud9-blue"
                />
                <div className="flex justify-between text-[9px] text-slate-400 font-medium mt-1">
                  <span>1s</span>
                  <span>5s</span>
                  <span>10s</span>
                </div>
              </div>
            )}
          </div>

          {/* Backend URL */}
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center">
                <Database size={20} className="text-blue-600" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase">Backend URL</h3>
                <p className="text-xs text-slate-500">Configure API endpoint</p>
              </div>
            </div>
            <input
              type="text"
              value={backendUrl}
              onChange={(e) => setBackendUrl(e.target.value)}
              placeholder="http://localhost:8000"
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-cloud9-blue focus:border-transparent"
            />
            <p className="text-[10px] text-slate-400 mt-2 font-medium">
              Default: {process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'}
            </p>
          </div>

          {/* Language (Coming Soon) */}
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 opacity-60">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center">
                <Globe size={20} className="text-purple-600" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase">Language</h3>
                <p className="text-xs text-slate-500">Coming soon: Multi-language support</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-slate-200 p-6 rounded-b-3xl flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm uppercase rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-6 py-3 bg-cloud9-blue hover:bg-[#009ed9] text-white font-bold text-sm uppercase rounded-xl transition-colors shadow-lg shadow-cloud9-blue/20"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};
