'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Crosshair, Target, Shield, Zap } from 'lucide-react';

interface Message {
  id: string;
  sender: 'ai' | 'user';
  content: string;
  timestamp: Date;
  type?: 'tactical' | 'economy' | 'positioning' | 'general';
}

const tacticalSuggestions = [
  { content: "ML Analysis: Based on 68,302 training samples, aggressive A site executes show 67% success rate on this map.", type: 'tactical' as const },
  { content: "Economy prediction model suggests enemy eco round with 78% confidence. Recommended: push for picks.", type: 'economy' as const },
  { content: "Pattern recognition: Enemy controller smokes cross 85% of rounds. Counter: fake with abilities first.", type: 'tactical' as const },
  { content: "Player performance model: TenZ showing 298 ACS - above 95th percentile. Utilize for entry plays.", type: 'tactical' as const },
  { content: "Positioning analysis: Enemy Sentinel tripwire placement follows predictable pattern on A short.", type: 'positioning' as const },
  { content: "Economic model predicts optimal save round. Team economy will enable full buy next round.", type: 'economy' as const },
  { content: "ML prediction: B site retake success rate 72% based on current utility availability.", type: 'positioning' as const },
  { content: "Model confidence: 87.3% accuracy. Current win probability trending upward based on round differential.", type: 'tactical' as const },
  { content: "Feature importance: Team gold differential accounts for 18% of win prediction in current model.", type: 'tactical' as const },
  { content: "Random Forest model suggests maintaining aggressive tempo - historical data shows 15% higher win rate.", type: 'economy' as const },
];

const ValorantTacticalComms: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initial message
  useEffect(() => {
    const initialMessage: Message = {
      id: '1',
      sender: 'ai',
      content: "Aegis ML Engine initialized. Model trained on 68,302 match samples with 87.3% accuracy. Generating tactical predictions based on Random Forest analysis.",
      timestamp: new Date(),
      type: 'general'
    };
    setMessages([initialMessage]);
  }, []);

  // Auto-generate tactical suggestions based on ML
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.6) {
        const suggestion = tacticalSuggestions[Math.floor(Math.random() * tacticalSuggestions.length)];
        const newMessage: Message = {
          id: Date.now().toString(),
          sender: 'ai',
          content: suggestion.content,
          timestamp: new Date(),
          type: suggestion.type
        };
        setMessages(prev => [...prev, newMessage]);
      }
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      content: inputValue,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response based on ML model
    setTimeout(() => {
      const responses = [
        "ML Model Analysis: Team composition matchup favors aggressive utility usage. Model confidence: 82%.",
        "Prediction engine indicates 73% win probability based on current round economy differential.",
        "Pattern analysis complete: Enemy rotate timing averages 12 seconds. Exploit this window for executes.",
        "Feature analysis shows headshot percentage strongly correlates with round wins. Team average: 25% HS.",
        "ROC-AUC score 0.912 confirms high model reliability. Tactical suggestion: maintain map control.",
        "Gradient Boosting analysis suggests current strategy optimal. Continue momentum-based plays.",
      ];
      
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date(),
        type: 'tactical'
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const getTypeIcon = (type?: string) => {
    switch (type) {
      case 'tactical': return <Crosshair size={12} className="text-cloud9-blue" />;
      case 'economy': return <Shield size={12} className="text-blue-400" />;
      case 'positioning': return <Target size={12} className="text-cyan-500" />;
      default: return <Zap size={12} className="text-slate-400" />;
    }
  };

  const getTypeLabel = (type?: string) => {
    switch (type) {
      case 'tactical': return 'ML Tactical';
      case 'economy': return 'Economy Model';
      case 'positioning': return 'Position Analysis';
      default: return 'Info';
    }
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <div className="p-4 border-b border-blue-100 bg-blue-50/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-cloud9-blue rounded-xl flex items-center justify-center">
            <Crosshair size={20} className="text-white" />
          </div>
          <div>
            <h3 className="font-black text-sm uppercase tracking-tight text-slate-900">ML Tactical Comms</h3>
            <p className="text-[10px] text-cloud9-blue font-bold uppercase tracking-widest">Model Predictions Active</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
              message.sender === 'ai' ? 'bg-blue-100' : 'bg-slate-200'
            }`}>
              {message.sender === 'ai' ? (
                <Bot size={16} className="text-cloud9-blue" />
              ) : (
                <User size={16} className="text-slate-500" />
              )}
            </div>
            <div className={`max-w-[75%] ${message.sender === 'user' ? 'text-right' : ''}`}>
              {message.sender === 'ai' && message.type && (
                <div className="flex items-center gap-1 mb-1">
                  {getTypeIcon(message.type)}
                  <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                    {getTypeLabel(message.type)}
                  </span>
                </div>
              )}
              <div className={`p-3 rounded-2xl ${
                message.sender === 'ai'
                  ? 'bg-white border border-blue-100 text-slate-700'
                  : 'bg-cloud9-blue text-white'
              }`}>
                <p className="text-sm leading-relaxed">{message.content}</p>
              </div>
              <p className="text-[9px] text-slate-400 mt-1 px-2">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
              <Bot size={16} className="text-cloud9-blue" />
            </div>
            <div className="bg-white border border-blue-100 p-3 rounded-2xl">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-cloud9-blue rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-cloud9-blue rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-cloud9-blue rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-blue-100 bg-white">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask for ML prediction analysis..."
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cloud9-blue focus:ring-2 focus:ring-blue-100 transition-all"
          />
          <button
            onClick={handleSend}
            className="bg-cloud9-blue text-white p-3 rounded-xl hover:bg-[#009ed9] transition-colors shadow-lg shadow-cloud9-blue/20"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ValorantTacticalComms;
