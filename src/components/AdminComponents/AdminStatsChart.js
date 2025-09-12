// components/AdminDashboard/AdminStatsChart.js
'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const data = [
  { name: 'Jan', applications: 45, interviews: 12 },
  { name: 'Feb', applications: 52, interviews: 15 },
  { name: 'Mar', applications: 48, interviews: 18 },
  { name: 'Apr', applications: 65, interviews: 22 },
  { name: 'May', applications: 70, interviews: 25 },
  { name: 'Jun', applications: 85, interviews: 30 },
];

const sectorData = [
  { name: 'Mining', value: 35 },
  { name: 'Tourism', value: 25 },
  { name: 'Manufacturing', value: 40 },
];

const COLORS = ['#132857', '#8C3C1E', '#FF8000'];

export default function AdminStatsChart() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="h-64">
        <h3 className="text-sm font-medium text-gray-600 mb-4">Applications & Interviews Trend</h3>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
            <XAxis dataKey="name" stroke="#6B7280" />
            <YAxis stroke="#6B7280" />
            <Tooltip />
            <Line type="monotone" dataKey="applications" stroke="#132857" strokeWidth={2} />
            <Line type="monotone" dataKey="interviews" stroke="#8C3C1E" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="h-64">
        <h3 className="text-sm font-medium text-gray-600 mb-4">Applications by Sector</h3>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={sectorData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              fill="#8884d8"
              paddingAngle={5}
              dataKey="value"
            >
              {sectorData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}