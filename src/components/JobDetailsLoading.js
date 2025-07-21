// components/JobDetailsLoading.js
'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { FiArrowLeft } from 'react-icons/fi';

export default function JobDetailsLoading() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Button 
        variant="ghost" 
        className="mb-4 flex items-center gap-2"
        disabled
      >
        <FiArrowLeft className="h-4 w-4" />
        Back to Jobs
      </Button>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-6 space-y-6">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <Skeleton className="h-8 w-3/4 rounded" />
              <Skeleton className="h-6 w-1/2 rounded" />
            </div>
            <Skeleton className="h-16 w-16 rounded" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <div className="space-y-3">
                <Skeleton className="h-7 w-1/3 rounded" />
                <Skeleton className="h-4 w-full rounded" />
                <Skeleton className="h-4 w-5/6 rounded" />
                <Skeleton className="h-4 w-4/6 rounded" />
                <Skeleton className="h-4 w-3/4 rounded" />
              </div>
              
              <div className="space-y-3">
                <Skeleton className="h-7 w-1/3 rounded" />
                <div className="space-y-2 pl-4">
                  <Skeleton className="h-4 w-full rounded" />
                  <Skeleton className="h-4 w-5/6 rounded" />
                  <Skeleton className="h-4 w-4/6 rounded" />
                  <Skeleton className="h-4 w-3/4 rounded" />
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                <Skeleton className="h-6 w-1/4 rounded" />
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-1/4 rounded" />
                    <Skeleton className="h-4 w-1/3 rounded" />
                  </div>
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-1/4 rounded" />
                    <Skeleton className="h-4 w-1/3 rounded" />
                  </div>
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-1/4 rounded" />
                    <Skeleton className="h-4 w-1/3 rounded" />
                  </div>
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-1/4 rounded" />
                    <Skeleton className="h-4 w-1/3 rounded" />
                  </div>
                </div>
              </div>
              
              <div className="pt-2">
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}