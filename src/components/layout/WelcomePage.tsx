import React, { useState, useEffect } from 'react';
import { Shield, Zap, Target, Users, ArrowRight, Activity, AlertCircle, Sword } from 'lucide-react';

interface WelcomePageProps {
  onStart: (teamName: string, opponentName: string, game: string) => void;
}

export const WelcomePage: React.FC<WelcomePageProps> = ({ onStart }) => {
  const [teamName, setTeamName] = useState('');
  const [opponentName, setOpponentName] = useState('');
  const [selectedGame, setSelectedGame] = useState('League of Legends');
  const [bgImage, setBgImage] = useState(0);

  const games = [
    { 
      id: 'lol', 
      name: 'League of Legends', 
      players: 5, 
      color: 'text-blue-400', 
      bg: 'bg-blue-900/20',
      img: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop'
    },
    { 
      id: 'val', 
      name: 'VALORANT', 
      players: 5, 
      color: 'text-rose-400', 
      bg: 'bg-rose-900/20',
      img: 'https://images.unsplash.com/photo-1552824236-fa2e8969424c?q=80&w=2070&auto=format&fit=crop'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setBgImage((prev) => (prev + 1) % games.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 font-sans relative overflow-hidden text-slate-900">
      {/* Dynamic Background */}
      {games.map((game, index) => (
        <div 
          key={game.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${bgImage === index ? 'opacity-10' : 'opacity-0'}`}
          style={{ 
            backgroundImage: `linear-gradient(to bottom, rgba(248,250,252,0.8), rgba(248,250,252,1)), url(${game.img})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
      ))}

      <div className="max-w-4xl w-full z-10">
        {/* Header */}
        <div className="text-center mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-md rounded-full border border-slate-200 shadow-sm mb-6">
            <Shield size={16} className="text-blue-600" />
            <span className="text-[10px] font-black text-blue-900 uppercase tracking-[0.2em]">Next-Gen Neural Uplink</span>
          </div>
          <div className="flex flex-col items-center mb-4">
            <h1 className="text-7xl font-black tracking-tighter uppercase italic leading-none mb-2">
              <span className="text-slate-900">AEGIS-</span><span className="text-cloud9-blue">C9</span>
            </h1>
            <p className="text-cloud9-blue/60 font-bold uppercase tracking-[0.3em] text-sm">
              Assistant Coach
            </p>
          </div>
          <p className="text-slate-500 font-medium text-lg max-w-2xl mx-auto leading-relaxed">
            The Real-Time AI Advantage for Elite Esports Coaching
          </p>
          
          {/* Ticker */}
          <div className="mt-6 overflow-hidden bg-cloud9-blue/5 border-y border-cloud9-blue/10 py-2">
            <div className="animate-marquee whitespace-nowrap text-[10px] font-black uppercase tracking-widest text-cloud9-blue">
              LIVE SESSION CALIBRATION PENDING • AWAITING TEAM IDENTIFICATION • MIE ENGINE STATUS: READY • GRID DATA UPLINK: STANDBY • CLOUD9 VS TSM - HISTORICAL DATA LOADED • 
            </div>
          </div>
        </div>

        {/* Configuration Card */}
        <div className="bg-white/80 backdrop-blur-xl border border-slate-200 rounded-[40px] p-8 md:p-12 shadow-2xl shadow-blue-100/50 animate-in zoom-in-95 duration-700">
          <div className="space-y-10">
            {/* Game Selector */}
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 text-center">Operation Theater Selection</label>
              <div className="flex justify-center gap-4">
                {games.map((game) => (
                  <button
                    key={game.id}
                    onClick={() => setSelectedGame(game.name)}
                    className={`flex-1 max-w-[240px] flex items-center justify-center gap-3 p-5 rounded-2xl border-2 transition-all duration-300 font-black uppercase tracking-wider text-xs ${
                      selectedGame === game.name 
                      ? 'border-cloud9-blue bg-blue-50 text-cloud9-blue shadow-[0_10px_25px_-5px_rgba(0,174,239,0.2)]' 
                      : 'border-slate-100 bg-slate-50 text-slate-400 hover:border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <Target size={18} className={selectedGame === game.name ? 'text-cloud9-blue' : 'text-slate-300'} />
                    {game.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Friendly Identification</label>
                <div className="relative group">
                  <Shield className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-cloud9-blue transition-colors" size={20} />
                  <input
                    type="text"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    placeholder="ENTER YOUR TEAM NAME"
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-5 pl-14 pr-6 text-sm font-bold text-slate-900 placeholder:text-slate-300 focus:outline-none focus:border-cloud9-blue/30 focus:bg-white transition-all uppercase tracking-widest shadow-inner"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Hostile Identification</label>
                <div className="relative group">
                  <Sword className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-rose-500 transition-colors" size={20} />
                  <input
                    type="text"
                    value={opponentName}
                    onChange={(e) => setOpponentName(e.target.value)}
                    placeholder="ENTER OPPONENT NAME"
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-5 pl-14 pr-6 text-sm font-bold text-slate-900 placeholder:text-slate-300 focus:outline-none focus:border-rose-500/30 focus:bg-white transition-all uppercase tracking-widest shadow-inner"
                  />
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="flex flex-col items-center">
              <button
                onClick={() => onStart(teamName || 'CLOU9', opponentName || 'OPPONENT', selectedGame)}
                className="group relative w-full max-w-md bg-cloud9-blue text-white py-6 rounded-2xl font-black uppercase tracking-[0.2em] text-sm flex items-center justify-center gap-3 hover:bg-[#009ed9] transition-all duration-300 shadow-[0_20px_40px_-10px_rgba(0,174,239,0.4)] overflow-hidden"
              >
                <div className="absolute inset-0 w-1/2 h-full bg-white/20 skew-x-[-30deg] -translate-x-[200%] group-hover:translate-x-[300%] transition-transform duration-1000" />
                GET STARTED
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
              
              <div className="mt-8 p-4 rounded-2xl bg-blue-50 border border-blue-100 flex gap-3 max-w-lg">
                <AlertCircle size={18} className="text-cloud9-blue shrink-0" />
                <p className="text-[10px] text-slate-600 font-medium leading-relaxed">
                  SYSTEM READY: Calibrating MIE neural weights for <span className="text-cloud9-blue font-bold">{selectedGame}</span>. Tactical suggestions will be optimized for <span className="text-cloud9-blue font-bold">{teamName || 'CLOU9'}</span> vs <span className="text-rose-600 font-bold">{opponentName || 'OPPONENT'}</span>.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-center mt-12 flex items-center justify-center gap-8">
           <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Systems Online</span>
           </div>
           <div className="text-[10px] font-black text-slate-200 uppercase tracking-widest">•</div>
           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Aegis Core v4.2.0-STABLE</span>
        </div>
      </div>

      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          display: inline-block;
          animation: marquee 30s linear infinite;
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slide-in-from-top {
          from { transform: translateY(-20px); }
          to { transform: translateY(0); }
        }
        @keyframes zoom-in {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-in {
          animation: 0.5s ease-out forwards;
        }
        .fade-in { animation-name: fade-in; }
        .slide-in-from-top-4 { animation-name: fade-in, slide-in-from-top; }
        .zoom-in-95 { animation-name: zoom-in; }
      `}</style>
    </div>
  );
};
