// app/jobs/page.js
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
import { FiSearch, FiFilter } from 'react-icons/fi';

export default function JobBoard() {
  const { jobs, loading, error } = useJobs();
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sectorFilter, setSectorFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');

  useEffect(() => {
    if (jobs) {
      let results = jobs;
      
      // Apply search filter
      if (searchTerm) {
        results = results.filter(job => 
          job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      // Apply sector filter
      if (sectorFilter !== 'all') {
        results = results.filter(job => job.sector === sectorFilter);
      }
      
      // Apply location filter
      if (locationFilter !== 'all') {
        results = results.filter(job => job.location === locationFilter);
      }
      
      setFilteredJobs(results);
    }
  }, [jobs, searchTerm, sectorFilter, locationFilter]);

  if (loading) return <div className="p-6">Loading jobs...</div>;
  if (error) return <div className="p-6">Error loading jobs: {error.message}</div>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold">Job Opportunities</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <FiFilter className="mr-2 h-4 w-4" />
            Filters
          </Button>
        </div>
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
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="font-medium">Sector</h3>
            <Select onValueChange={setSectorFilter}>
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
            <Select onValueChange={setLocationFilter}>
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
          {filteredJobs.length > 0 ? (
            filteredJobs.map(job => (
              <JobCard key={job._id} job={job} />
            ))
          ) : (
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <p className="text-gray-600">No jobs found matching your criteria</p>
              <Button 
                variant="ghost" 
                className="mt-2"
                onClick={() => {
                  setSearchTerm('');
                  setSectorFilter('all');
                  setLocationFilter('all');
                }}
              >
                Clear filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}