'use client';
import { useState, useEffect } from 'react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart, ReferenceLine } from 'recharts';

// Define the type for the chart data points
interface ChartDataPoint {
  time: string;
  probability: number;
}

const WinProbChart = ({ currentProb }: { currentProb: number }) => {
  const [data, setData] = useState<ChartDataPoint[]>([]);

  useEffect(() => {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    
    setData(prevData => {
      const newData = [...prevData, { time: timestamp, probability: currentProb }];
      if (newData.length > 30) {
        return newData.slice(newData.length - 30);
      }
      return newData;
    });
  }, [currentProb]);

  if (data.length === 0) {
    return (
      <div className="w-full h-[300px] flex items-center justify-center bg-blue-50/30 rounded-2xl border border-dashed border-blue-200 animate-pulse">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-cloud9-blue border-t-transparent rounded-full animate-spin"></div>
          <p className="text-[10px] font-black text-cloud9-blue uppercase tracking-[0.2em]">Synchronizing Uplink...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-[300px] bg-white/50 p-4 rounded-xl">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
          <defs>
            <linearGradient id="colorProbability" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#00aeef" stopOpacity={0.4}/>
              <stop offset="95%" stopColor="#00aeef" stopOpacity={0.05}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
          <XAxis 
            dataKey="time" 
            stroke="#64748b"
            fontSize={10}
            tickLine={false}
            axisLine={{ stroke: '#e2e8f0' }}
            hide={data.length > 10}
          />
          <YAxis 
            domain={[0, 100]} 
            stroke="#64748b" 
            fontSize={10}
            tickFormatter={(value) => `${value}%`}
            tickLine={false}
            axisLine={{ stroke: '#e2e8f0' }}
            label={{ value: 'Win Probability', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10, offset: 10, fontWeight: 600 }}
          />
          <ReferenceLine y={50} stroke="#94a3b8" strokeDasharray="5 5" label={{ value: '50%', position: 'right', fill: '#94a3b8', fontSize: 9 }} />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#ffffff', 
              borderColor: '#00aeef', 
              color: '#1e293b', 
              borderRadius: '12px', 
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
              padding: '12px 16px'
            }}
            itemStyle={{ color: '#00aeef', fontWeight: 'bold' }}
            labelStyle={{ color: '#64748b', fontWeight: 'bold', marginBottom: '4px' }}
            formatter={(value) => [`${Number(value).toFixed(1)}%`, 'Win Probability']}
          />
          <Area 
            type="monotone" 
            dataKey="probability" 
            stroke="#00aeef" 
            strokeWidth={3} 
            fill="url(#colorProbability)"
            dot={data.length < 20 ? { fill: '#00aeef', strokeWidth: 2, r: 3, stroke: '#fff' } : false}
            activeDot={{ r: 6, fill: '#00aeef', stroke: '#fff', strokeWidth: 2 }}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WinProbChart;
