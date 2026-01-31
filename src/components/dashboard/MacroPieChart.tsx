'use client';
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface MacroPieChartProps {
  data: {
    site_retake_success: string;
    baron_contest_rate: string;
    clutch_potential: string;
    tempo_deviation: string;
  };
}

const MacroPieChart: React.FC<MacroPieChartProps> = ({ data }) => {
  const parsePercent = (val: string) => parseInt(val.replace('%', '')) || 0;

  const chartData = [
    { name: 'Retake', value: parsePercent(data.site_retake_success) },
    { name: 'Baron', value: parsePercent(data.baron_contest_rate) },
    { name: 'Clutch', value: parsePercent(data.clutch_potential) },
  ];

  const COLORS = ['#00aeef', '#8b5cf6', '#fbbf24'];

  return (
    <div className="w-full h-[200px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
          />
          <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MacroPieChart;
