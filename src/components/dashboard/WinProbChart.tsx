'use client';
import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

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

  return (
    <div className="w-full h-full min-h-[300px] bg-white/50 p-4 rounded-xl">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
          <XAxis 
            dataKey="time" 
            hide={true}
          />
          <YAxis 
            domain={[0, 100]} 
            stroke="#1e293b" 
            fontSize={10}
            tickFormatter={(value) => `${value}%`}
            label={{ value: 'Probability (%)', angle: -90, position: 'insideLeft', fill: '#1e293b', fontSize: 10, offset: 10, fontWeight: 700 }}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#ffffff', borderColor: '#00aeef', color: '#1e293b', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}
            itemStyle={{ color: '#00aeef', fontWeight: 'bold' }}
            labelStyle={{ display: 'none' }}
          />
          <Line 
            type="monotone" 
            dataKey="probability" 
            stroke="#00aeef" 
            strokeWidth={3} 
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WinProbChart;
