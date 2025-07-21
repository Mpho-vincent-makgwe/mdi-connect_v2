// JobBoard.js
'use client';

import { useState, useEffect } from 'react';
import { useJobs } from '@/context/JobsContext';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import JobCard from '@/components/JobCard';
import JobFilters from '@/components/JobFilters';

export default function JobBoard() {
  const { 
    jobs, 
    appliedJobs, 
    loading, 
    error, 
    fetchJobs,
    hasAppliedToJob 
  } = useJobs();
  
  const [filters, setFilters] = useState({
    search: '',
    sector: 'all',
    location: 'all'
  });

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleSearchChange = (e) => {
    setFilters(prev => ({...prev, search: e.target.value}));
  };

  const handleSectorChange = (value) => {
    setFilters(prev => ({...prev, sector: value}));
  };

  const handleLocationChange = (value) => {
    setFilters(prev => ({...prev, location: value}));
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchJobs(filters);
    }, 500);

    return () => clearTimeout(timer);
  }, [filters, fetchJobs]);

  const clearFilters = () => {
    setFilters({
      search: '',
      sector: 'all',
      location: 'all'
    });
  };

  const hasFilters = filters.search || filters.sector !== 'all' || filters.location !== 'all';

  return (
    <div style={{
      padding: '1.5rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem'
    }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        alignItems: 'flex-start'
      }}>
        <h1 style={{
          fontSize: '1.5rem',
          fontWeight: 'bold',
          color: '#1A1A1A'
        }}>Job Opportunities</h1>
        {hasFilters && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearFilters}
            style={{
              borderColor: '#8C3C1E',
              color: '#8C3C1E',
              backgroundColor: 'transparent'
            }}
          >
            Clear all filters
          </Button>
        )}
      </div>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: '1rem'
      }}>
        {/* Filters */}
        <JobFilters
          searchValue={filters.search}
          sectorValue={filters.sector}
          locationValue={filters.location}
          onSearchChange={handleSearchChange}
          onSectorChange={handleSectorChange}
          onLocationChange={handleLocationChange}
          onClear={clearFilters}
          loading={loading}
          hasFilters={hasFilters}
        />
        
        {/* Job Listings */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          {loading ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr',
              gap: '1rem'
            }}>
              {[...Array(5)].map((_, i) => (
                <div key={i} style={{
                  backgroundColor: '#F2ECE4',
                  padding: '1rem',
                  borderRadius: '0.5rem',
                  boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
                }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <Skeleton style={{ height: '1.5rem', width: '12rem', backgroundColor: 'rgba(140, 60, 30, 0.1)' }} />
                        <Skeleton style={{ height: '1rem', width: '8rem', backgroundColor: 'rgba(140, 60, 30, 0.1)' }} />
                      </div>
                      <Skeleton style={{ height: '3rem', width: '3rem', borderRadius: '0.25rem', backgroundColor: 'rgba(140, 60, 30, 0.1)' }} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <Skeleton style={{ height: '1rem', width: '100%', backgroundColor: 'rgba(140, 60, 30, 0.1)' }} />
                      <Skeleton style={{ height: '1rem', width: '75%', backgroundColor: 'rgba(140, 60, 30, 0.1)' }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.5rem' }}>
                      <Skeleton style={{ height: '2.25rem', width: '6rem', backgroundColor: 'rgba(140, 60, 30, 0.1)' }} />
                      <Skeleton style={{ height: '1.25rem', width: '5rem', backgroundColor: 'rgba(140, 60, 30, 0.1)' }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div style={{
              backgroundColor: '#F2ECE4',
              padding: '1.5rem',
              borderRadius: '0.5rem',
              boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
              textAlign: 'center'
            }}>
              <p style={{ color: '#8B0000' }}>Error: {error}</p>
              <Button 
                variant="ghost" 
                style={{
                  marginTop: '0.5rem',
                  borderColor: '#8C3C1E',
                  color: '#8C3C1E',
                  backgroundColor: 'transparent'
                }}
                onClick={() => fetchJobs()}
              >
                Retry
              </Button>
            </div>
          ) : jobs?.length > 0 ? (
            jobs.map(job => {
              if (!job?._id && !job?.id) {
                console.error('Invalid job data:', job);
                return null;
              }
              return (
                <JobCard 
                  key={job._id || job.id} 
                  job={job}
                  hasApplied={hasAppliedToJob(job._id || job.id)}
                />
              );
            })
          ) : (
            <div style={{
              backgroundColor: '#F2ECE4',
              padding: '1.5rem',
              borderRadius: '0.5rem',
              boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
              textAlign: 'center'
            }}>
              <p style={{ color: 'rgba(140, 60, 30, 0.7)' }}>No jobs found</p>
              <Button 
                variant="ghost" 
                style={{
                  marginTop: '0.5rem',
                  borderColor: '#8C3C1E',
                  color: '#8C3C1E',
                  backgroundColor: 'transparent'
                }}
                onClick={() => fetchJobs()}
              >
                Refresh
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}