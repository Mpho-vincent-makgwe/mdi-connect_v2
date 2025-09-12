// components/AdminDashboard/AdminDashboard.js
'use client';

import { useState, useEffect, useContext } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  FiUsers, 
  FiBriefcase, 
  FiFileText, 
  FiCalendar,
  FiDollarSign,
  FiTrendingUp,
  FiActivity,
  FiRefreshCw
} from 'react-icons/fi';
import AdminStatsChart from '@/components/AdminComponents/AdminStatsChart';
import RecentActivity from '@/components/AdminComponents/RecentActivity';
import UserManagement from '@/components/AdminComponents/UserManagement';
import JobManagement from '@/components/AdminComponents/JobManagement';
import ApplicationOverview from '@/components/AdminComponents/ApplicationOverview';
import InterviewManagement from '@/components/AdminComponents/InterviewManagement';
import { AdminContext } from '@/context/AdminContext';
import { useUser } from '@/context/UserContext';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const { 
    adminStats, 
    loading, 
    fetchAdminStats, 
    fetchAllUsers, 
    fetchAllJobs, 
    fetchAllApplications,
    fetchAllInterviews
  } = useContext(AdminContext);
  const { user } = useUser();

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchAdminStats();
    }
  }, [user, fetchAdminStats]);

  const handleTabChange = async (tabId) => {
    setActiveTab(tabId);
    
    // Fetch data for the selected tab if needed
    if (tabId === 'users') {
      await fetchAllUsers(1, 10);
    } else if (tabId === 'jobs') {
      await fetchAllJobs();
    } else if (tabId === 'applications') {
      await fetchAllApplications();
    } else if (tabId === 'interviews') {
      await fetchAllInterviews();
    }
  };

  const handleRefresh = async () => {
    await fetchAdminStats();
  };

  const statsData = [
    { 
      title: 'Total Users', 
      value: adminStats.totalUsers || 0, 
      icon: <FiUsers className="h-5 w-5 text-blue-600" />, 
      change: '+12%' 
    },
    { 
      title: 'Total Jobs', 
      value: adminStats.totalJobs || 0, 
      icon: <FiBriefcase className="h-5 w-5 text-green-600" />, 
      change: '+8%' 
    },
    { 
      title: 'Applications', 
      value: adminStats.totalApplications || 0, 
      icon: <FiFileText className="h-5 w-5 text-orange-600" />, 
      change: '+18%' 
    },
    { 
      title: 'Interviews', 
      value: adminStats.totalInterviews || 0, 
      icon: <FiCalendar className="h-5 w-5 text-purple-600" />, 
      change: '+5%' 
    },
    { 
      title: 'Active Jobs', 
      value: adminStats.activeJobs || 0, 
      icon: <FiActivity className="h-5 w-5 text-teal-600" />, 
      change: '+3%' 
    },
    { 
      title: 'Closed Jobs', 
      value: adminStats.closedJobs || 0, 
      icon: <FiTrendingUp className="h-5 w-5 text-red-600" />, 
      change: '-2%' 
    },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              {statsData.map((stat, index) => (
                <Card key={index}>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">
                      {stat.title}
                    </CardTitle>
                    {stat.icon}
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {loading ? '...' : stat.value}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      <span className={stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}>
                        {stat.change}
                      </span>{' '}
                      from last month
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Applications & Interviews</CardTitle>
                </CardHeader>
                <CardContent>
                  <AdminStatsChart />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <RecentActivity />
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Applications</CardTitle>
                </CardHeader>
                <CardContent>
                  <ApplicationOverview limit={5} />
                </CardContent>
              </Card>
            </div>
          </>
        );
      case 'users':
        return <UserManagement />;
      case 'jobs':
        return <JobManagement />;
      case 'applications':
        return <ApplicationOverview />;
      case 'interviews':
        return <InterviewManagement />;
      default:
        return <div>Select a tab to view content</div>;
    }
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="p-6 flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-700">Access Denied</h2>
          <p className="text-gray-500">You need administrator privileges to view this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Admin Dashboard
        </h1>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center gap-2"
          >
            <FiRefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh Data
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-gray-200 mb-6 overflow-x-auto">
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'users', label: 'User Management' },
          { id: 'jobs', label: 'Job Management' },
          { id: 'applications', label: 'Applications' },
          { id: 'interviews', label: 'Interviews' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${
              activeTab === tab.id
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {renderContent()}
    </div>
  );
}