'use client';

import { useState, useEffect } from 'react';
import { useJobs } from '@/context/JobsContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import JobCard from '@/components/JobCard';
import { FiSearch, FiFilter, FiX } from 'react-icons/fi';

export default function JobBoard() {
  const { jobs, loading, error, fetchJobs } = useJobs();
  const [filters, setFilters] = useState({
    search: '',
    sector: 'all',
    location: 'all'
  });

  useEffect(() => {
    fetchJobs(filters);
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
            className="flex items-center gap-1"
          >
            <FiX className="h-4 w-4" />
            Clear filters
          </Button>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow-sm space-y-4">
          <div className="space-y-2">
            <h3 className="font-medium">Search</h3>
            <div className="relative">
              <FiSearch className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search jobs..."
                className="pl-10"
                value={filters.search}
                onChange={(e) => setFilters({...filters, search: e.target.value})}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="font-medium">Sector</h3>
            <Select 
              value={filters.sector}
              onValueChange={(value) => setFilters({...filters, sector: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Sectors" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sectors</SelectItem>
                <SelectItem value="Mining">Mining</SelectItem>
                <SelectItem value="Tourism">Tourism</SelectItem>
                <SelectItem value="Manufacturing">Manufacturing</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <h3 className="font-medium">Location</h3>
            <Select 
              value={filters.location}
              onValueChange={(value) => setFilters({...filters, location: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Locations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                <SelectItem value="Johannesburg">Johannesburg</SelectItem>
                <SelectItem value="Cape Town">Cape Town</SelectItem>
                <SelectItem value="Durban">Durban</SelectItem>
                <SelectItem value="Pretoria">Pretoria</SelectItem>
                <SelectItem value="Port Elizabeth">Port Elizabeth</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Job Listings */}
        <div className="md:col-span-2 space-y-4">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <p>Loading jobs...</p>
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
          ) : jobs.length > 0 ? (
            jobs.map(job => (
              <JobCard key={job._id} job={job} />
            ))
          ) : (
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <p className="text-gray-600">No jobs found matching your criteria</p>
              {hasFilters && (
                <Button 
                  variant="ghost" 
                  className="mt-2"
                  onClick={clearFilters}
                >
                  Clear filters
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}