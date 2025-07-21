// components/RecentApplications.js
'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { FiExternalLink } from 'react-icons/fi';

export default function RecentApplications() {
  const applications = [
    {
      id: 'APL-1024',
      candidate: 'John Smith',
      position: 'Mining Engineer',
      date: '2023-11-15',
      status: 'review',
      sector: 'Mining'
    },
    {
      id: 'APL-1023',
      candidate: 'Sarah Johnson',
      position: 'Tour Guide',
      date: '2023-11-14',
      status: 'interview',
      sector: 'Tourism'
    },
    {
      id: 'APL-1022',
      candidate: 'Michael Chen',
      position: 'Production Supervisor',
      date: '2023-11-12',
      status: 'hired',
      sector: 'Manufacturing'
    },
    {
      id: 'APL-1021',
      candidate: 'Emma Wilson',
      position: 'Geologist',
      date: '2023-11-10',
      status: 'rejected',
      sector: 'Mining'
    },
  ];

  const statusVariants = {
    review: { backgroundColor: 'rgba(255, 165, 0, 0.1)', color: 'rgba(255, 165, 0, 1)' },
    interview: { backgroundColor: 'rgba(70, 130, 180, 0.1)', color: 'rgba(70, 130, 180, 1)' },
    hired: { backgroundColor: '#014421', color: '#F2ECE4' },
    rejected: { backgroundColor: 'rgba(139, 0, 0, 0.1)', color: 'rgba(139, 0, 0, 1)' },
  };

  return (
    <Table style={{ borderSpacing: 0 }}>
      <TableHeader style={{ backgroundColor: 'transparent' }}>
        <TableRow style={{ backgroundColor: 'transparent' }}>
          <TableHead style={{ 
            color: '#8C3C1E', 
            fontWeight: '500', 
            borderBottom: '1px solid rgba(140, 60, 30, 0.2)',
            padding: '0.75rem 1rem'
          }}>
            Application ID
          </TableHead>
          <TableHead style={{ 
            color: '#8C3C1E', 
            fontWeight: '500', 
            borderBottom: '1px solid rgba(140, 60, 30, 0.2)',
            padding: '0.75rem 1rem'
          }}>
            Candidate
          </TableHead>
          <TableHead style={{ 
            color: '#8C3C1E', 
            fontWeight: '500', 
            borderBottom: '1px solid rgba(140, 60, 30, 0.2)',
            padding: '0.75rem 1rem'
          }}>
            Position
          </TableHead>
          <TableHead style={{ 
            color: '#8C3C1E', 
            fontWeight: '500', 
            borderBottom: '1px solid rgba(140, 60, 30, 0.2)',
            padding: '0.75rem 1rem'
          }}>
            Sector
          </TableHead>
          <TableHead style={{ 
            color: '#8C3C1E', 
            fontWeight: '500', 
            borderBottom: '1px solid rgba(140, 60, 30, 0.2)',
            padding: '0.75rem 1rem'
          }}>
            Date
          </TableHead>
          <TableHead style={{ 
            color: '#8C3C1E', 
            fontWeight: '500', 
            borderBottom: '1px solid rgba(140, 60, 30, 0.2)',
            padding: '0.75rem 1rem'
          }}>
            Status
          </TableHead>
          <TableHead style={{ 
            color: '#8C3C1E', 
            fontWeight: '500', 
            borderBottom: '1px solid rgba(140, 60, 30, 0.2)',
            padding: '0.75rem 1rem',
            textAlign: 'right'
          }}>
            Action
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {applications.map((app) => (
          <TableRow key={app.id} style={{ backgroundColor: 'transparent' }}>
            <TableCell style={{ 
              fontWeight: '500', 
              color: '#132857', 
              borderBottom: '1px solid rgba(140, 60, 30, 0.1)',
              padding: '0.75rem 1rem'
            }}>
              {app.id}
            </TableCell>
            <TableCell style={{ 
              color: '#1A1A1A', 
              borderBottom: '1px solid rgba(140, 60, 30, 0.1)',
              padding: '0.75rem 1rem'
            }}>
              {app.candidate}
            </TableCell>
            <TableCell style={{ 
              color: '#1A1A1A', 
              borderBottom: '1px solid rgba(140, 60, 30, 0.1)',
              padding: '0.75rem 1rem'
            }}>
              {app.position}
            </TableCell>
            <TableCell style={{ 
              borderBottom: '1px solid rgba(140, 60, 30, 0.1)',
              padding: '0.75rem 1rem'
            }}>
              <Badge style={{ 
                borderColor: 'rgba(140, 60, 30, 0.5)',
                color: '#8C3C1E',
                backgroundColor: 'rgba(242, 236, 228, 0.5)'
              }}>
                {app.sector}
              </Badge>
            </TableCell>
            <TableCell style={{ 
              color: 'rgba(140, 60, 30, 0.8)',
              borderBottom: '1px solid rgba(140, 60, 30, 0.1)',
              padding: '0.75rem 1rem'
            }}>
              {new Date(app.date).toLocaleDateString()}
            </TableCell>
            <TableCell style={{ 
              borderBottom: '1px solid rgba(140, 60, 30, 0.1)',
              padding: '0.75rem 1rem'
            }}>
              <Badge style={{ 
                ...statusVariants[app.status],
                fontWeight: '500'
              }}>
                {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
              </Badge>
            </TableCell>
            <TableCell style={{ 
              textAlign: 'right',
              borderBottom: '1px solid rgba(140, 60, 30, 0.1)',
              padding: '0.75rem 1rem'
            }}>
              <button style={{ 
                color: '#132857',
                transition: 'color 0.2s'
              }}>
                <FiExternalLink style={{ height: '1rem', width: '1rem' }} />
              </button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}