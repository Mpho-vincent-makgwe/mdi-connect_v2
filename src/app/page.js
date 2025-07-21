// components/Dashboard.js
'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FiBriefcase, FiUsers, FiFileText, FiCalendar, FiDollarSign } from 'react-icons/fi';
import RecentApplications from '@/components/RecentApplications';
import UpcomingInterviews from '@/components/UpcomingInterviews';
import StatsChart from '@/components/StatsChart';

export default function Dashboard() {
  const stats = [
    { title: 'Total Jobs', value: '124', icon: <FiBriefcase style={{ height: '1.25rem', width: '1.25rem', color: '#132857' }} />, change: '+12%' },
    { title: 'Active Candidates', value: '89', icon: <FiUsers style={{ height: '1.25rem', width: '1.25rem', color: '#8C3C1E' }} />, change: '+5%' },
    { title: 'Applications', value: '342', icon: <FiFileText style={{ height: '1.25rem', width: '1.25rem', color: '#FF8000' }} />, change: '+18%' },
    { title: 'Interviews', value: '28', icon: <FiCalendar style={{ height: '1.25rem', width: '1.25rem', color: '#4FA89C' }} />, change: '-2%' },
  ];

  return (
    <div style={{ paddingTop: '1.5rem', paddingBottom: '1.5rem' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '1.5rem'
      }}>
        <h1 style={{ 
          fontSize: '1.5rem', 
          fontWeight: 'bold', 
          color: '#1A1A1A'
        }}>
          Dashboard Overview
        </h1>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Button 
            variant="outline" 
            style={{ 
              borderColor: '#8C3C1E', 
              color: '#8C3C1E',
              backgroundColor: 'transparent'
            }}
          >
            Export Report
          </Button>
          <Button style={{ 
            backgroundColor: '#132857',
            color: '#F2ECE4'
          }}>
            Add New Job
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={{ 
        display: 'grid',
        gap: '1rem',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        marginBottom: '1.5rem'
      }}>
        {stats.map((stat, index) => (
          <Card key={index} style={{ 
            backgroundColor: '#F2ECE4',
            border: '1px solid rgba(140, 60, 30, 0.2)',
            transition: 'box-shadow 0.3s ease'
          }}>
            <CardHeader style={{ 
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingBottom: '0.5rem'
            }}>
              <CardTitle style={{ 
                fontSize: '0.875rem',
                fontWeight: '500',
                color: 'rgba(140, 60, 30, 0.8)'
              }}>
                {stat.title}
              </CardTitle>
              <div style={{ 
                padding: '0.375rem',
                borderRadius: '0.375rem',
                backgroundColor: 'rgba(242, 236, 228, 0.8)'
              }}>
                {stat.icon}
              </div>
            </CardHeader>
            <CardContent>
              <div style={{ 
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: '#132857'
              }}>
                {stat.value}
              </div>
              <p style={{ 
                fontSize: '0.75rem',
                color: 'rgba(140, 60, 30, 0.8)',
                marginTop: '0.25rem'
              }}>
                <span style={{ 
                  color: stat.change.startsWith('+') ? '#014421' : '#8B0000'
                }}>
                  {stat.change}
                </span>{' '}
                from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts and Data */}
      <div style={{ 
        display: 'grid',
        gap: '1rem',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        marginBottom: '1.5rem'
      }}>
        <Card style={{ 
          gridColumn: 'span 4',
          backgroundColor: '#F2ECE4',
          border: '1px solid rgba(140, 60, 30, 0.2)',
          transition: 'box-shadow 0.3s ease'
        }}>
          <CardHeader>
            <CardTitle style={{ color: '#132857' }}>Monthly Applications</CardTitle>
          </CardHeader>
          <CardContent style={{ paddingTop: '0.5rem' }}>
            <StatsChart />
          </CardContent>
        </Card>

        <Card style={{ 
          gridColumn: 'span 3',
          backgroundColor: '#F2ECE4',
          border: '1px solid rgba(140, 60, 30, 0.2)',
          transition: 'box-shadow 0.3s ease'
        }}>
          <CardHeader>
            <CardTitle style={{ color: '#132857' }}>Sector Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '15rem',
              borderRadius: '0.5rem',
              backgroundColor: 'rgba(242, 236, 228, 0.5)',
              border: '1px solid rgba(140, 60, 30, 0.1)'
            }}>
              <div style={{ color: 'rgba(140, 60, 30, 0.4)' }}>Pie chart will go here</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div style={{ 
        display: 'grid',
        gap: '1rem',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))'
      }}>
        <Card style={{ 
          backgroundColor: '#F2ECE4',
          border: '1px solid rgba(140, 60, 30, 0.2)',
          transition: 'box-shadow 0.3s ease'
        }}>
          <CardHeader>
            <CardTitle style={{ color: '#132857' }}>Recent Applications</CardTitle>
          </CardHeader>
          <CardContent style={{ padding: 0 }}>
            <RecentApplications />
          </CardContent>
        </Card>

        <Card style={{ 
          backgroundColor: '#F2ECE4',
          border: '1px solid rgba(140, 60, 30, 0.2)',
          transition: 'box-shadow 0.3s ease'
        }}>
          <CardHeader>
            <CardTitle style={{ color: '#132857' }}>Upcoming Interviews</CardTitle>
          </CardHeader>
          <CardContent>
            <UpcomingInterviews />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}