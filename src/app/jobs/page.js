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

  // Initialize with empty filters
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

  // Debounce the filter changes
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
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold">Job Opportunities</h1>
        {hasFilters && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearFilters}
          >
            Clear all filters
          </Button>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
        <div className="md:col-span-2 space-y-4">
          {loading ? (
            <div className="grid grid-cols-1 gap-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <div className="space-y-2">
                        <Skeleton className="h-6 w-48" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                      <Skeleton className="h-12 w-12 rounded" />
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                    <div className="flex justify-between pt-2">
                      <Skeleton className="h-9 w-24" />
                      <Skeleton className="h-5 w-20" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <p className="text-red-500">Error: {error}</p>
              <Button 
                variant="ghost" 
                className="mt-2"
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
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <p className="text-gray-600">No jobs found</p>
              <Button 
                variant="ghost" 
                className="mt-2"
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