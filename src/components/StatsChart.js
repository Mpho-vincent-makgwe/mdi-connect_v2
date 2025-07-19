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
    <div className="h-[300px]">
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
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="applications" fill="#3b82f6" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}