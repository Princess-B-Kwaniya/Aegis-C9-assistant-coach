import React, { useState } from 'react';
import { LayoutDashboard, Users, BarChart3, ShieldCheck, Settings, LogOut, MessageSquare, Zap, ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  teamName: string;
  game: string;
  onBackToHome?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, teamName, game, onBackToHome }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Command Center', icon: LayoutDashboard },
    { id: 'roster', label: 'Squad Telemetry', icon: Users },
    { id: 'analytics', label: 'Macro Metrics', icon: BarChart3 },
    { id: 'comms', label: 'Tactical Comms', icon: MessageSquare },
    { id: 'drills', label: 'Drill Generator', icon: Zap },
  ];

  return (
    <div className={`relative transition-all duration-500 ease-in-out bg-white border-r border-slate-200 h-screen flex flex-col sticky top-0 shadow-sm ${isCollapsed ? 'w-20' : 'w-64'}`}>
      {/* Collapse Toggle */}
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-10 bg-white border border-slate-200 rounded-full p-1 shadow-sm text-slate-400 hover:text-cloud9-blue transition-colors z-50"
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      <div className={`p-6 border-b border-slate-100 overflow-hidden ${isCollapsed ? 'px-4' : ''}`}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-cloud9-blue rounded-xl flex items-center justify-center shadow-lg shadow-cloud9-blue/20 shrink-0">
            <span className="text-white font-black text-xl">A</span>
          </div>
          {!isCollapsed && (
            <div className="animate-in fade-in duration-500">
              <h2 className="text-sm font-black text-slate-900 uppercase tracking-tight italic leading-none">Aegis-C9</h2>
              <p className="text-[10px] text-cloud9-blue font-bold uppercase tracking-widest mt-1">Coach Hub</p>
            </div>
          )}
        </div>
        
        {!isCollapsed && (
          <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 animate-in fade-in duration-500">
            <div className="flex items-center gap-2 mb-1">
               <div className="w-2 h-2 rounded-full bg-cloud9-blue animate-pulse shadow-[0_0_5px_rgba(0,174,239,0.5)]" />
               <span className="text-[10px] font-bold text-slate-400 uppercase">{game} Session</span>
            </div>
            <p className="text-xs font-black text-slate-900 truncate">{teamName || 'Global C9'}</p>
          </div>
        )}
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-hidden">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            title={isCollapsed ? item.label : ''}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative ${
              activeTab === item.id 
                ? 'bg-cloud9-blue text-white shadow-md shadow-cloud9-blue/20' 
                : 'text-slate-400 hover:bg-slate-50 hover:text-slate-900'
            } ${isCollapsed ? 'justify-center px-0' : ''}`}
          >
            <item.icon size={18} className={`${activeTab === item.id ? 'text-white' : 'text-slate-400 group-hover:text-cloud9-blue'} shrink-0`} />
            {!isCollapsed && <span className="text-sm font-bold uppercase tracking-wide whitespace-nowrap animate-in fade-in slide-in-from-left-2 duration-300">{item.label}</span>}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-100 space-y-2 overflow-hidden">
        {onBackToHome && (
          <button 
            onClick={onBackToHome}
            title={isCollapsed ? "Back to Home" : ""}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-cloud9-blue hover:bg-cloud9-blue/10 transition-all group ${isCollapsed ? 'justify-center px-0' : ''}`}
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            {!isCollapsed && <span className="text-sm font-bold uppercase tracking-wide animate-in fade-in duration-300">Exit to Home</span>}
          </button>
        )}
        <button 
          title={isCollapsed ? "Settings" : ""}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-slate-50 hover:text-slate-900 transition-all ${isCollapsed ? 'justify-center px-0' : ''}`}
        >
          <Settings size={18} />
          {!isCollapsed && <span className="text-sm font-bold uppercase tracking-wide animate-in fade-in duration-300">Settings</span>}
        </button>
        <button 
          title={isCollapsed ? "End Session" : ""}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-rose-500 hover:bg-rose-500/10 transition-all ${isCollapsed ? 'justify-center px-0' : ''}`}
        >
          <LogOut size={18} />
          {!isCollapsed && <span className="text-sm font-bold uppercase tracking-wide animate-in fade-in duration-300">End Session</span>}
        </button>
      </div>
    </div>
  );
};
