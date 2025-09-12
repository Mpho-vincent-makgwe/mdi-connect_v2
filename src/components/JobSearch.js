// src/components/JobSearch.js
'use client';

import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FiSearch, FiFilter, FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useSearch } from '@/context/SearchContext';
import { useJobs } from '@/context/JobsContext';
import { Skeleton } from '@/components/ui/skeleton';

// Simplified JobCard for carousel
const SimpleJobCard = ({ job, hasApplied }) => {
  const { applyForJob } = useJobs();
  
  const handleQuickApply = async () => {
    if (!hasApplied) {
      const formData = new FormData();
      await applyForJob(job._id || job.id, formData);
    }
  };

  return (
    <div style={{
      border: '1px solid rgba(140, 60, 30, 0.2)',
      borderRadius: '0.5rem',
      padding: '1rem',
      minWidth: '180px',
      height: '180px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      background: 'white',
      transition: 'transform 0.2s, box-shadow 0.2s',
      ':hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
      }
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: '0.5rem'
      }}>
        <div style={{ flex: 1 }}>
          <h3 style={{
            fontWeight: 'bold',
            fontSize: '1rem',
            color: '#1A1A1A',
            marginBottom: '0.25rem',
            lineHeight: '1.2',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>{job.title}</h3>
          <p style={{ 
            fontSize: '0.875rem', 
            color: 'rgba(140, 60, 30, 0.7)',
            marginBottom: '0.5rem'
          }}>{job.salary || 'Salary not disclosed'}</p>
        </div>
        
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '0.25rem',
          background: 'linear-gradient(135deg, #F2ECE4, #E8D9C8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          border: '1px solid rgba(140, 60, 30, 0.1)'
        }}>
          {job.img ? (
            <img 
              src={job.img} 
              alt={job.company} 
              style={{
                width: '30px',
                height: '30px',
                objectFit: 'contain'
              }}
            />
          ) : (
            <span style={{ 
              fontWeight: 'bold', 
              color: '#8C3C1E',
              fontSize: '0.875rem'
            }}>
              {job.company?.charAt(0) || 'J'}
            </span>
          )}
        </div>
      </div>
      
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <span style={{
          fontSize: '0.75rem',
          color: 'rgba(140, 60, 30, 0.6)'
        }}>
          {job.location || 'Remote'}
        </span>
        
        <Button 
          size="sm" 
          onClick={handleQuickApply}
          disabled={hasApplied}
          style={{
            backgroundColor: hasApplied ? '#014421' : '#8C3C1E',
            color: 'white',
            fontSize: '0.75rem',
            padding: '0.25rem 0.75rem',
            height: 'auto',
            minHeight: 'unset'
          }}
        >
          {hasApplied ? 'Applied ✓' : 'Apply Now'}
        </Button>
      </div>
    </div>
  );
};

const JobSearch = () => {
  const [localFilters, setLocalFilters] = useState({
    search: '',
    sector: 'all',
    location: 'all'
  });
  
  const [currentSlide, setCurrentSlide] = useState(0);
  const carouselRef = useRef(null);
  
  const { searchTerm, setSearchTerm } = useSearch();
  const { jobs, loading, error, fetchJobs, hasAppliedToJob } = useJobs();

  // Initialize with all jobs
  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleSearch = () => {
    setSearchTerm(localFilters.search);
    fetchJobs(localFilters);
    setCurrentSlide(0); // Reset to first slide when new search
  };

  const handleClear = () => {
    setLocalFilters({
      search: '',
      sector: 'all',
      location: 'all'
    });
    setSearchTerm('');
    fetchJobs({});
    setCurrentSlide(0);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const hasActiveFilters = searchTerm || localFilters.sector !== 'all' || localFilters.location !== 'all';

  // Filter jobs based on search term and filters
  const filteredJobs = jobs.filter(job => {
    const matchesSearch = !searchTerm || 
      job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSector = localFilters.sector === 'all' || 
      job.sector?.toLowerCase() === localFilters.sector.toLowerCase();

    const matchesLocation = localFilters.location === 'all' || 
      job.location?.toLowerCase().includes(localFilters.location.toLowerCase());

    return matchesSearch && matchesSector && matchesLocation;
  });

  const sectors = [
    'Mining',
    'Tourism',
    'Manufacturing',
    'Technology',
    'Healthcare',
    'Finance',
    'Education'
  ];

  const locations = [
    'Johannesburg',
    'Cape Town',
    'Durban',
    'Pretoria',
    'Port Elizabeth',
    'Remote'
  ];

  // Carousel navigation
  const nextSlide = () => {
    if (filteredJobs.length > 4 && currentSlide < Math.ceil(filteredJobs.length / 4) - 1) {
      setCurrentSlide(prev => prev + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(prev => prev - 1);
    }
  };

  // Calculate visible jobs for current slide
  const getVisibleJobs = () => {
    const startIndex = currentSlide * 4;
    return filteredJobs.slice(startIndex, startIndex + 4);
  };

  return (
    <div className="space-y-6">
      {/* Search Filters Card */}
      <Card style={{
        backgroundColor: '#F2ECE4',
        border: 'none',
        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
      }}>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg" style={{ color: '#1A1A1A' }}>
              Find Your Next Opportunity
            </CardTitle>
            {hasActiveFilters && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleClear}
                className="flex items-center gap-1 h-8"
              >
                <FiX className="h-4 w-4" />
                Clear
              </Button>
            )}
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                placeholder="Job title, keywords, or company"
                value={localFilters.search}
                onChange={(e) => setLocalFilters({ ...localFilters, search: e.target.value })}
                onKeyPress={handleKeyPress}
                className="flex-1"
                style={{ minHeight: '2.5rem' }}
              />
              
              <Select 
                value={localFilters.sector} 
                onValueChange={(value) => setLocalFilters({ ...localFilters, sector: value })}
              >
                <SelectTrigger className="w-full sm:w-[180px]" style={{ minHeight: '2.5rem' }}>
                  <SelectValue placeholder="All Sectors" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sectors</SelectItem>
                  {sectors.map((sector) => (
                    <SelectItem key={sector} value={sector.toLowerCase()}>
                      {sector}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select 
                value={localFilters.location} 
                onValueChange={(value) => setLocalFilters({ ...localFilters, location: value })}
              >
                <SelectTrigger className="w-full sm:w-[180px]" style={{ minHeight: '2.5rem' }}>
                  <SelectValue placeholder="All Locations" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  {locations.map((location) => (
                    <SelectItem key={location} value={location.toLowerCase()}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button 
                onClick={handleSearch} 
                className="bg-[#8C3C1E] hover:bg-[#6B2D16] text-white"
                style={{ minHeight: '2.5rem' }}
                disabled={loading}
              >
                <FiSearch className="mr-2 h-4 w-4" />
                {loading ? 'Searching...' : 'Search'}
              </Button>
            </div>
            
            {hasActiveFilters && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm text-muted-foreground">Active filters:</span>
                {searchTerm && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    Search: {searchTerm}
                    <FiX 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => {
                        setLocalFilters({ ...localFilters, search: '' });
                        setSearchTerm('');
                      }} 
                    />
                  </Badge>
                )}
                {localFilters.sector !== 'all' && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    Sector: {localFilters.sector}
                    <FiX 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => setLocalFilters({ ...localFilters, sector: 'all' })} 
                    />
                  </Badge>
                )}
                {localFilters.location !== 'all' && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    Location: {localFilters.location}
                    <FiX 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => setLocalFilters({ ...localFilters, location: 'all' })} 
                    />
                  </Badge>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Search Results with Carousel */}
      <div>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-36 rounded-lg" />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-destructive">Error loading jobs: {error}</p>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {searchTerm || hasActiveFilters 
                ? `No jobs found matching your criteria${searchTerm ? ` for "${searchTerm}"` : ''}`
                : 'No jobs available at the moment'
              }
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                Showing {filteredJobs.length} job{filteredJobs.length !== 1 ? 's' : ''}
                {searchTerm && ` for "${searchTerm}"`}
              </p>
              
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="text-xs h-8">
                  <FiFilter className="mr-1 h-3 w-3" />
                  Remote
                </Button>
                <Button variant="outline" size="sm" className="text-xs h-8">
                  <FiFilter className="mr-1 h-3 w-3" />
                  Full-time
                </Button>
              </div>
            </div>
            
            {/* Carousel Container */}
            <div className="relative">
              {/* Left Navigation Button */}
              {filteredJobs.length > 4 && currentSlide > 0 && (
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 z-10 bg-white shadow-md"
                  onClick={prevSlide}
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%'
                  }}
                >
                  <FiChevronLeft className="h-5 w-5" />
                </Button>
              )}
              
              {/* Right Navigation Button */}
              {filteredJobs.length > 4 && currentSlide < Math.ceil(filteredJobs.length / 4) - 1 && (
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 z-10 bg-white shadow-md"
                  onClick={nextSlide}
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%'
                  }}
                >
                  <FiChevronRight className="h-5 w-5" />
                </Button>
              )}
              
              {/* Jobs Carousel */}
              <div 
                ref={carouselRef}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 transition-all duration-300"
              >
                {getVisibleJobs().map(job => (
                  <SimpleJobCard 
                    key={job._id || job.id} 
                    job={job} 
                    hasApplied={hasAppliedToJob(job._id || job.id)}
                  />
                ))}
              </div>
            </div>
            
            {/* Carousel Indicators */}
            {filteredJobs.length > 4 && (
              <div className="flex justify-center gap-2 mt-4">
                {Array.from({ length: Math.ceil(filteredJobs.length / 4) }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentSlide ? 'bg-[#8C3C1E]' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobSearch;