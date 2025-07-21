// components/JobFilters.js
'use client';

import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { FiX } from 'react-icons/fi';
import { Skeleton } from '@/components/ui/skeleton';

export default function JobFilters({
  searchValue,
  sectorValue,
  locationValue,
  onSearchChange,
  onSectorChange,
  onLocationChange,
  onClear,
  loading = false,
  hasFilters = false
}) {
  const sectors = [
    'Mining',
    'Tourism',
    'Manufacturing'
  ];

  const locations = [
    'Johannesburg',
    'Cape Town',
    'Durban',
    'Pretoria',
    'Port Elizabeth'
  ];

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="font-medium text-lg">Filters</h2>
        {hasFilters && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClear}
            className="flex items-center gap-1"
          >
            <FiX className="h-4 w-4" />
            Clear
          </Button>
        )}
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <h3 className="font-medium">Search</h3>
          {loading ? (
            <Skeleton className="h-10 w-full" />
          ) : (
            <Input
              placeholder="Search jobs..."
              value={searchValue}
              onChange={onSearchChange}
            />
          )}
        </div>
        
        <div className="space-y-2">
          <h3 className="font-medium">Sector</h3>
          {loading ? (
            <Skeleton className="h-10 w-full" />
          ) : (
            <Select value={sectorValue} onValueChange={onSectorChange}>
              <SelectTrigger>
                <SelectValue placeholder="All Sectors" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sectors</SelectItem>
                {sectors.map((sector) => (
                  <SelectItem key={sector} value={sector}>
                    {sector}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
        
        <div className="space-y-2">
          <h3 className="font-medium">Location</h3>
          {loading ? (
            <Skeleton className="h-10 w-full" />
          ) : (
            <Select value={locationValue} onValueChange={onLocationChange}>
              <SelectTrigger>
                <SelectValue placeholder="All Locations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                {locations.map((location) => (
                  <SelectItem key={location} value={location}>
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>
    </div>
  );
}