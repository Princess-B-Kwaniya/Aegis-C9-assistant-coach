'use client';
import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Anomaly } from '@/types';

interface CommsChartProps {
  anomalies: Anomaly[];
}

const CommsChart: React.FC<CommsChartProps> = ({ anomalies }) => {
  const [data, setData] = useState<{ time: string; count: number }[]>([]);

  useEffect(() => {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    
    setData(prev => {
      const newData = [...prev, { time: timestamp, count: anomalies.length }];
      if (newData.length > 20) return newData.slice(-20);
      return newData;
    });
  }, [anomalies]);

  return (
    <div className="w-full h-[150px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#00aeef" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#00aeef" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis dataKey="time" hide />
          <YAxis fontSize={10} fontWeight={700} axisLine={false} tickLine={false} />
          <Tooltip 
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: '10px' }}
          />
          <Area 
            type="monotone" 
            dataKey="count" 
            stroke="#00aeef" 
            fillOpacity={1} 
            fill="url(#colorCount)" 
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CommsChart;
