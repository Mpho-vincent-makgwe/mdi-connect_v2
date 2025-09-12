// components/RecentApplications.js
'use client';

import { useJobs } from '@/context/JobsContext';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { FiExternalLink, FiClock, FiCheckCircle, FiXCircle, FiEye } from 'react-icons/fi';

export default function RecentApplications() {
  const { appliedJobs, loading } = useJobs();

  if (loading) {
    return (
      <div className="p-4 space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse flex space-x-4">
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-3 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const statusVariants = {
    applied: { backgroundColor: 'rgba(255, 165, 0, 0.1)', color: 'rgba(255, 165, 0, 1)' },
    interview: { backgroundColor: 'rgba(70, 130, 180, 0.1)', color: 'rgba(70, 130, 180, 1)' },
    accepted: { backgroundColor: '#014421', color: '#F2ECE4' },
    rejected: { backgroundColor: 'rgba(139, 0, 0, 0.1)', color: 'rgba(139, 0, 0, 1)' },
    review: { backgroundColor: 'rgba(70, 130, 180, 0.1)', color: 'rgba(70, 130, 180, 1)' },
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'applied':
        return <FiClock className="h-3 w-3 mr-1" />;
      case 'interview':
        return <FiEye className="h-3 w-3 mr-1" />;
      case 'accepted':
        return <FiCheckCircle className="h-3 w-3 mr-1" />;
      case 'rejected':
        return <FiXCircle className="h-3 w-3 mr-1" />;
      default:
        return <FiEye className="h-3 w-3 mr-1" />;
    }
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
            Position
          </TableHead>
          <TableHead style={{ 
            color: '#8C3C1E', 
            fontWeight: '500', 
            borderBottom: '1px solid rgba(140, 60, 30, 0.2)',
            padding: '0.75rem 1rem'
          }}>
            Company
          </TableHead>
          <TableHead style={{ 
            color: '#8C3C1E', 
            fontWeight: '500', 
            borderBottom: '1px solid rgba(140, 60, 30, 0.2)',
            padding: '0.75rem 1rem'
          }}>
            Applied Date
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
        {appliedJobs.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5} style={{ 
              textAlign: 'center', 
              color: 'rgba(140, 60, 30, 0.6)',
              padding: '2rem 1rem',
              borderBottom: '1px solid rgba(140, 60, 30, 0.1)'
            }}>
              No applications yet. Start applying to jobs!
            </TableCell>
          </TableRow>
        ) : (
          appliedJobs.slice(0, 5).map((app) => (
            <TableRow key={app.id} style={{ backgroundColor: 'transparent' }}>
              <TableCell style={{ 
                fontWeight: '500', 
                color: '#132857', 
                borderBottom: '1px solid rgba(140, 60, 30, 0.1)',
                padding: '0.75rem 1rem'
              }}>
                {app.title}
              </TableCell>
              <TableCell style={{ 
                color: '#1A1A1A', 
                borderBottom: '1px solid rgba(140, 60, 30, 0.1)',
                padding: '0.75rem 1rem'
              }}>
                {app.company}
              </TableCell>
              <TableCell style={{ 
                color: 'rgba(140, 60, 30, 0.8)',
                borderBottom: '1px solid rgba(140, 60, 30, 0.1)',
                padding: '0.75rem 1rem'
              }}>
                {new Date(app.appliedDate).toLocaleDateString()}
              </TableCell>
              <TableCell style={{ 
                borderBottom: '1px solid rgba(140, 60, 30, 0.1)',
                padding: '0.75rem 1rem'
              }}>
                <Badge style={{ 
                  ...statusVariants[app.status],
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem'
                }}>
                  {getStatusIcon(app.status)}
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
          ))
        )}
      </TableBody>
    </Table>
  );
}