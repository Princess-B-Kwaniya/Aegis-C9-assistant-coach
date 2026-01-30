'use client';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Area, AreaChart } from 'recharts';

interface ChartDataPoint {
  time: string;
  probability: number;
}

interface ValorantWinProbChartProps {
  probHistory: ChartDataPoint[];
  currentProb: number;
}

const ValorantWinProbChart = ({ probHistory, currentProb }: ValorantWinProbChartProps) => {
  // Use provided history or generate sample data
  const data = probHistory && probHistory.length > 0 ? probHistory : [
    { time: '12:00', probability: 45 },
    { time: '12:05', probability: 48 },
    { time: '12:10', probability: 52 },
    { time: '12:15', probability: 55 },
    { time: '12:20', probability: 58 },
    { time: '12:25', probability: 62 },
    { time: '12:30', probability: 65 },
    { time: '12:35', probability: currentProb },
  ];

  return (
    <div className="w-full h-full min-h-[300px] bg-white/50 p-4 rounded-xl">
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
            formatter={(value: number) => [`${value.toFixed(1)}%`, 'Win Probability']}
          />
          <Area 
            type="monotone" 
            dataKey="probability" 
            stroke="#00aeef" 
            strokeWidth={3} 
            fill="url(#colorProbability)"
            dot={{ fill: '#00aeef', strokeWidth: 2, r: 3, stroke: '#fff' }}
            activeDot={{ r: 6, fill: '#00aeef', stroke: '#fff', strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ValorantWinProbChart;
