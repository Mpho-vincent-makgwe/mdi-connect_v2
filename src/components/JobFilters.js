// JobFilters.js
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
    <div style={{
      backgroundColor: '#F2ECE4',
      padding: '1rem',
      borderRadius: '0.5rem',
      boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h2 style={{
          fontWeight: '500',
          fontSize: '1.125rem',
          color: '#1A1A1A'
        }}>Filters</h2>
        {hasFilters && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClear}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem'
            }}
          >
            <FiX style={{ height: '1rem', width: '1rem' }} />
            Clear
          </Button>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <h3 style={{ fontWeight: '500', color: '#1A1A1A' }}>Search</h3>
          {loading ? (
            <Skeleton style={{ height: '2.5rem', width: '100%' }} />
          ) : (
            <Input
              placeholder="Search jobs..."
              value={searchValue}
              onChange={onSearchChange}
            />
          )}
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <h3 style={{ fontWeight: '500', color: '#1A1A1A' }}>Sector</h3>
          {loading ? (
            <Skeleton style={{ height: '2.5rem', width: '100%' }} />
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
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <h3 style={{ fontWeight: '500', color: '#1A1A1A' }}>Location</h3>
          {loading ? (
            <Skeleton style={{ height: '2.5rem', width: '100%' }} />
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