'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Shield, Zap, Target, Users, ArrowRight, Activity, AlertCircle, Sword, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { searchTeams, isValidTeam, valorantTeams, lolTeams } from '@/data/teams';

interface WelcomePageProps {
  onStart: (teamName: string, opponentName: string, game: string) => void;
}

interface AutocompleteInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  suggestions: string[];
  icon: React.ReactNode;
  iconActiveColor: string;
  label: string;
}

const AutocompleteInput: React.FC<AutocompleteInputProps> = ({
  value,
  onChange,
  placeholder,
  suggestions,
  icon,
  iconActiveColor,
  label
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value.length > 0) {
      const filtered = suggestions.filter(s => 
        s.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 8);
      setFilteredSuggestions(filtered);
      setIsOpen(filtered.length > 0);
    } else {
      setFilteredSuggestions([]);
      setIsOpen(false);
    }
  }, [value, suggestions]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (team: string) => {
    onChange(team);
    setIsOpen(false);
  };

  return (
    <div className="space-y-2" ref={wrapperRef}>
      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">{label}</label>
      <div className="relative group">
        <div className={`absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:${iconActiveColor} transition-colors`}>
          {icon}
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => value.length > 0 && filteredSuggestions.length > 0 && setIsOpen(true)}
          placeholder={placeholder}
          className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-5 pl-14 pr-12 text-sm font-bold text-slate-900 placeholder:text-slate-300 focus:outline-none focus:border-cloud9-blue/30 focus:bg-white transition-all uppercase tracking-widest shadow-inner"
        />
        {value && (
          <button
            onClick={() => onChange('')}
            className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors"
          >
            <X size={16} />
          </button>
        )}
        
        {/* Dropdown */}
        {isOpen && filteredSuggestions.length > 0 && (
          <div className="absolute z-50 w-full mt-2 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden">
            <div className="max-h-64 overflow-y-auto">
              {filteredSuggestions.map((team, index) => (
                <button
                  key={team}
                  onClick={() => handleSelect(team)}
                  className={`w-full text-left px-5 py-3 text-sm font-bold uppercase tracking-wider hover:bg-blue-50 hover:text-cloud9-blue transition-colors ${
                    index !== filteredSuggestions.length - 1 ? 'border-b border-slate-100' : ''
                  }`}
                >
                  {team}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const WelcomePage: React.FC<WelcomePageProps> = ({ onStart }) => {
  const [teamName, setTeamName] = useState('');
  const [opponentName, setOpponentName] = useState('');
  const [selectedGame, setSelectedGame] = useState('League of Legends');
  const [bgImage, setBgImage] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const router = useRouter();

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

  const currentTeamList = selectedGame === 'VALORANT' ? valorantTeams : lolTeams;

  useEffect(() => {
    setMounted(true);
    setBgImage(0);
    const interval = setInterval(() => {
      setBgImage((prev) => (prev !== null ? (prev + 1) % games.length : 0));
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  // Clear inputs when game changes
  useEffect(() => {
    setTeamName('');
    setOpponentName('');
  }, [selectedGame]);

  const handleStart = () => {
    const isValGame = selectedGame === 'VALORANT';
    const gameType = isValGame ? 'valorant' : 'lol';
    
    // Validate team name
    if (!teamName.trim()) {
      setAlertMessage('Please enter your team name.');
      setShowAlert(true);
      return;
    }
    
    if (!isValidTeam(teamName, gameType)) {
      setAlertMessage(`"${teamName}" is not found in our ${selectedGame} team database. Please select a valid team from the suggestions.`);
      setShowAlert(true);
      return;
    }
    
    // Validate opponent name
    if (!opponentName.trim()) {
      setAlertMessage('Please enter the opponent team name.');
      setShowAlert(true);
      return;
    }
    
    if (!isValidTeam(opponentName, gameType)) {
      setAlertMessage(`"${opponentName}" is not found in our ${selectedGame} team database. Please select a valid team from the suggestions.`);
      setShowAlert(true);
      return;
    }
    
    // Check if same team
    if (teamName.toLowerCase() === opponentName.toLowerCase()) {
      setAlertMessage('Your team and opponent team cannot be the same.');
      setShowAlert(true);
      return;
    }
    
    if (isValGame) {
      // Store in localStorage for the Valorant page
      localStorage.setItem('valorantTeam', teamName);
      localStorage.setItem('valorantOpponent', opponentName);
      // Navigate to Valorant dashboard
      router.push(`/valorant?team=${encodeURIComponent(teamName)}&opponent=${encodeURIComponent(opponentName)}`);
    } else {
      // Use the existing onStart for League of Legends
      onStart(teamName, opponentName, selectedGame);
    }
  };

  if (!mounted) {
    return <div className="min-h-screen bg-slate-50" />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 font-sans relative overflow-hidden text-slate-900">
      {/* Alert Modal */}
      {showAlert && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-8 max-w-md mx-4 shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-rose-100 rounded-2xl flex items-center justify-center shrink-0">
                <AlertCircle size={24} className="text-rose-500" />
              </div>
              <div className="flex-1">
                <h3 className="font-black text-lg uppercase tracking-tight text-slate-900 mb-2">Team Not Found</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{alertMessage}</p>
              </div>
            </div>
            <button
              onClick={() => setShowAlert(false)}
              className="w-full mt-6 bg-cloud9-blue text-white py-4 rounded-2xl font-black uppercase tracking-wider text-sm hover:bg-[#009ed9] transition-colors"
            >
              Got It
            </button>
          </div>
        </div>
      )}

      {/* Dynamic Background */}
      {games.map((game, index) => (
        <div 
          key={game.id}
          className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
          style={{ 
            backgroundImage: `linear-gradient(to bottom, rgba(248,250,252,0.8), rgba(248,250,252,1)), url(${game.img})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: bgImage !== null && bgImage === index ? 0.1 : 0
          }}
        />
      ))}

      <div className="max-w-4xl w-full z-10">
        {/* Header */}
        <div className="text-center mb-12 duration-700">
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
              LIVE SESSION CALIBRATION PENDING • AWAITING TEAM IDENTIFICATION • MIE ENGINE STATUS: READY • GRID DATA UPLINK: STANDBY • SELECT YOUR TEAM TO BEGIN • 
            </div>
          </div>
        </div>

        {/* Configuration Card */}
        <div className="bg-white/80 backdrop-blur-xl border border-slate-200 rounded-[40px] p-8 md:p-12 shadow-2xl shadow-blue-100/50 duration-700">
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

            {/* Team count info */}
            <div className="text-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                {currentTeamList.length} Teams Available for {selectedGame}
              </p>
            </div>

            {/* Inputs with Autocomplete */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AutocompleteInput
                value={teamName}
                onChange={setTeamName}
                placeholder="SEARCH YOUR TEAM"
                suggestions={currentTeamList}
                icon={<Shield size={20} />}
                iconActiveColor="text-cloud9-blue"
                label="Friendly Identification"
              />
              <AutocompleteInput
                value={opponentName}
                onChange={setOpponentName}
                placeholder="SEARCH OPPONENT"
                suggestions={currentTeamList}
                icon={<Sword size={20} />}
                iconActiveColor="text-rose-500"
                label="Hostile Identification"
              />
            </div>

            {/* Team Preview */}
            {(teamName || opponentName) && (
              <div className="flex items-center justify-center gap-6">
                <div className={`px-6 py-3 rounded-xl ${isValidTeam(teamName, selectedGame === 'VALORANT' ? 'valorant' : 'lol') ? 'bg-blue-50 border border-blue-200' : 'bg-slate-50 border border-slate-200'}`}>
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Your Team</p>
                  <p className={`text-sm font-black uppercase tracking-wide ${isValidTeam(teamName, selectedGame === 'VALORANT' ? 'valorant' : 'lol') ? 'text-cloud9-blue' : 'text-slate-400'}`}>
                    {teamName || '---'}
                    {teamName && !isValidTeam(teamName, selectedGame === 'VALORANT' ? 'valorant' : 'lol') && (
                      <span className="text-rose-500 text-[9px] block">Not found</span>
                    )}
                  </p>
                </div>
                <div className="text-2xl font-black text-slate-300">VS</div>
                <div className={`px-6 py-3 rounded-xl ${isValidTeam(opponentName, selectedGame === 'VALORANT' ? 'valorant' : 'lol') ? 'bg-rose-50 border border-rose-200' : 'bg-slate-50 border border-slate-200'}`}>
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Opponent</p>
                  <p className={`text-sm font-black uppercase tracking-wide ${isValidTeam(opponentName, selectedGame === 'VALORANT' ? 'valorant' : 'lol') ? 'text-rose-600' : 'text-slate-400'}`}>
                    {opponentName || '---'}
                    {opponentName && !isValidTeam(opponentName, selectedGame === 'VALORANT' ? 'valorant' : 'lol') && (
                      <span className="text-rose-500 text-[9px] block">Not found</span>
                    )}
                  </p>
                </div>
              </div>
            )}

            {/* CTA */}
            <div className="flex flex-col items-center">
              <button
                onClick={handleStart}
                disabled={!teamName || !opponentName}
                className={`group relative w-full max-w-md py-6 rounded-2xl font-black uppercase tracking-[0.2em] text-sm flex items-center justify-center gap-3 transition-all duration-300 overflow-hidden ${
                  teamName && opponentName
                    ? 'bg-cloud9-blue text-white hover:bg-[#009ed9] shadow-[0_20px_40px_-10px_rgba(0,174,239,0.4)]'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <div className={`absolute inset-0 w-1/2 h-full bg-white/20 skew-x-[-30deg] -translate-x-[200%] ${teamName && opponentName ? 'group-hover:translate-x-[300%]' : ''} transition-transform duration-1000`} />
                {teamName && opponentName ? 'ENTER COMMAND CENTER' : 'SELECT BOTH TEAMS'}
                <ArrowRight size={18} className={teamName && opponentName ? 'group-hover:translate-x-1 transition-transform' : ''} />
              </button>
              
              <div className="mt-8 p-4 rounded-2xl bg-blue-50 border border-blue-100 flex gap-3 max-w-lg">
                <AlertCircle size={18} className="text-cloud9-blue shrink-0" />
                <p className="text-[10px] text-slate-600 font-medium leading-relaxed">
                  {teamName && opponentName ? (
                    <>
                      SYSTEM READY: Calibrating MIE neural weights for <span className="text-cloud9-blue font-bold">{selectedGame}</span>. 
                      Tactical suggestions optimized for <span className="text-cloud9-blue font-bold">{teamName}</span> vs <span className="text-rose-600 font-bold">{opponentName}</span>.
                    </>
                  ) : (
                    <>
                      AWAITING INPUT: Start typing team names to see suggestions. Both teams must be selected from the {selectedGame} team database to proceed.
                    </>
                  )}
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
      `}</style>
    </div>
  );
};
