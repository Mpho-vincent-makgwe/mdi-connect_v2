// JobCard.js
'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useJobs } from '@/context/JobsContext';

export default function JobCard({ job }) {
  const router = useRouter();
  const { hasAppliedToJob } = useJobs();
  
  const hasApplied = hasAppliedToJob(job._id || job.id);

  return (
    <div style={{
      border: '1px solid rgba(140, 60, 30, 0.2)',
      borderRadius: '0.5rem',
      overflow: 'hidden',
      transition: 'box-shadow 0.3s',
      ':hover': {
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
      }
    }}>
      <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start'
        }}>
          <div>
            <h3 style={{
              fontWeight: 'bold',
              fontSize: '1.125rem',
              color: '#1A1A1A'
            }}>{job.title}</h3>
            <p style={{ color: 'rgba(140, 60, 30, 0.7)' }}>{job.company}</p>
          </div>
          <img 
            src={job.img} 
            alt={job.company} 
            style={{
              height: '3rem',
              width: '3rem',
              objectFit: 'contain',
              borderRadius: '0.25rem'
            }}
          />
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <p style={{ fontSize: '0.875rem', color: 'rgba(140, 60, 30, 0.7)' }}>{job.location}</p>
          <p style={{ fontSize: '0.875rem', color: 'rgba(140, 60, 30, 0.7)' }}>{job.sector}</p>
          <p style={{ fontSize: '0.875rem', fontWeight: '500' }}>{job.salary}</p>
        </div>
        
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: '0.5rem'
        }}>
          <Button 
            variant="outline" 
            onClick={() => router.push(`/jobs/${job._id || job.id}`)}
            style={{
              borderColor: '#8C3C1E',
              color: '#8C3C1E',
              backgroundColor: 'transparent'
            }}
          >
            View Details
          </Button>
          
          {hasApplied && (
            <span style={{
              fontSize: '0.875rem',
              color: '#014421',
              fontWeight: '500'
            }}>
              Applied ✓
            </span>
          )}
        </div>
      </div>
    </div>
  );
}