'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FiBriefcase, FiUsers, FiFileText, FiCalendar, FiDollarSign } from 'react-icons/fi';
import RecentApplications from '@/components/RecentApplications';
import UpcomingInterviews from '@/components/UpcomingInterviews';
import StatsChart from '@/components/StatsChart';

export default function Dashboard() {
  const stats = [
    { title: 'Total Jobs', value: '124', icon: <FiBriefcase className="h-5 w-5" />, change: '+12%' },
    { title: 'Active Candidates', value: '89', icon: <FiUsers className="h-5 w-5" />, change: '+5%' },
    { title: 'Applications', value: '342', icon: <FiFileText className="h-5 w-5" />, change: '+18%' },
    { title: 'Interviews', value: '28', icon: <FiCalendar className="h-5 w-5" />, change: '-2%' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard Overview</h1>
        <div className="flex gap-2">
          <Button variant="outline">Export Report</Button>
          <Button>Add New Job</Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                {stat.title}
              </CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-gray-500 mt-1">
                <span className={stat.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}>
                  {stat.change}
                </span>{' '}
                from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts and Data */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="md:col-span-4">
          <CardHeader>
            <CardTitle>Monthly Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <StatsChart />
          </CardContent>
        </Card>

        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Sector Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-60">
              <div className="text-gray-400">Pie chart will go here</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentApplications />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Interviews</CardTitle>
          </CardHeader>
          <CardContent>
            <UpcomingInterviews />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}