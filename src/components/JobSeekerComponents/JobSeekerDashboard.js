// src/components/JobSeekerComponents/JobSeekerDashboard/page.js
'use client';

import { useState, useEffect, useContext } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FiBriefcase, FiClock, FiCheckCircle, FiCalendar, FiTrendingUp, FiSearch } from 'react-icons/fi';
import { useJobs } from '@/context/JobsContext';
import RecentApplications from '@/components/RecentApplications';
import UpcomingInterviews from '@/components/UpcomingInterviews';
import JobSearch from '@/components/JobSearch';

export default function JobSeekerDashboard() {
  const { appliedJobs, fetchInterviews, interviews } = useJobs();
  const [stats, setStats] = useState({
    applied: 0,
    interviews: 0,
    pending: 0,
    offers: 0
  });

  useEffect(() => {
    fetchInterviews();
  }, [fetchInterviews]);

  useEffect(() => {
    if (appliedJobs && interviews) {
      const applied = appliedJobs.length;
      const interviewCount = interviews.length;
      const pending = appliedJobs.filter(job => job.status === 'applied' || job.status === 'review').length;
      const offers = appliedJobs.filter(job => job.status === 'accepted').length;
      
      setStats({ applied, interviews: interviewCount, pending, offers });
    }
  }, [appliedJobs, interviews]);

  const statCards = [
    { 
      title: 'Applications', 
      value: stats.applied, 
      icon: <FiBriefcase className="h-5 w-5 text-blue-600" />, 
      change: '+5 this week' 
    },
    { 
      title: 'Interviews', 
      value: stats.interviews, 
      icon: <FiCalendar className="h-5 w-5 text-green-600" />, 
      change: '+2 scheduled' 
    },
    { 
      title: 'Pending', 
      value: stats.pending, 
      icon: <FiClock className="h-5 w-5 text-amber-600" />, 
      change: 'Awaiting response' 
    },
    { 
      title: 'Offers', 
      value: stats.offers, 
      icon: <FiCheckCircle className="h-5 w-5 text-emerald-600" />, 
      change: 'Congratulations!' 
    },
  ];

  return (
    <div className="py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Job Seeker Dashboard
          </h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's your job search overview.</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          <FiSearch className="mr-2 h-4 w-4" />
          Find Jobs
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <div className="p-1.5 rounded-md bg-gray-100">
                {stat.icon}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {stat.value}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {stat.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Job Search & Applications */}
        <div className="lg:col-span-2 space-y-6">
          {/* Job Search Component */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FiSearch className="h-5 w-5" />
                Find Your Next Opportunity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <JobSearch />
            </CardContent>
          </Card>

          {/* Recent Applications */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Applications</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <RecentApplications />
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Interviews & Recommendations */}
        <div className="space-y-6">
          {/* Upcoming Interviews */}
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Interviews</CardTitle>
            </CardHeader>
            <CardContent>
              <UpcomingInterviews />
            </CardContent>
          </Card>

          {/* Skills Development */}
          <Card>
            <CardHeader>
              <CardTitle>Skills to Improve</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">React.js</span>
                    <span className="text-sm font-medium">75%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Node.js</span>
                    <span className="text-sm font-medium">60%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '60%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">TypeScript</span>
                    <span className="text-sm font-medium">45%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-600 h-2 rounded-full" style={{ width: '45%' }}></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}