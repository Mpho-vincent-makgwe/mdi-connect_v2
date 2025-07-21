// components/StatsChart.js
'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Jan', applications: 20 },
  { name: 'Feb', applications: 35 },
  { name: 'Mar', applications: 28 },
  { name: 'Apr', applications: 45 },
  { name: 'May', applications: 52 },
  { name: 'Jun', applications: 60 },
  { name: 'Jul', applications: 48 },
  { name: 'Aug', applications: 65 },
  { name: 'Sep', applications: 70 },
  { name: 'Oct', applications: 85 },
  { name: 'Nov', applications: 92 },
  { name: 'Dec', applications: 110 },
];

export default function StatsChart() {
  return (
    <div style={{ height: '300px' }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#8C3C1E" strokeOpacity={0.1} />
          <XAxis 
            dataKey="name" 
            stroke="#4B2E12" 
            tick={{ fill: '#4B2E12' }}
            tickMargin={10}
          />
          <YAxis 
            stroke="#4B2E12" 
            tick={{ fill: '#4B2E12' }}
            tickMargin={10}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: '#F2ECE4',
              borderColor: '#8C3C1E',
              borderRadius: '0.5rem',
              color: '#132857',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}
            itemStyle={{ color: '#132857' }}
          />
          <Bar 
            dataKey="applications" 
            fill="#132857" 
            radius={[4, 4, 0, 0]} 
            opacity={0.9}
            animationDuration={1500}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}