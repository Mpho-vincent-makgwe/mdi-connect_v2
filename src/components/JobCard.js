'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useJobs } from '@/context/JobsContext';

export default function JobCard({ job }) {
  const router = useRouter();
  const { hasAppliedToJob } = useJobs();
  
  // Check if the current user has applied to this job
  const hasApplied = hasAppliedToJob(job._id || job.id);

  return (
    <div className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-4 space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-bold text-lg">{job.title}</h3>
            <p className="text-gray-600">{job.company}</p>
          </div>
          <img 
            src={job.img} 
            alt={job.company} 
            className="h-12 w-12 object-contain rounded"
          />
        </div>
        
        <div className="space-y-2">
          <p className="text-sm text-gray-500">{job.location}</p>
          <p className="text-sm text-gray-500">{job.sector}</p>
          <p className="text-sm font-medium">{job.salary}</p>
        </div>
        
        <div className="flex justify-between items-center pt-2">
          <Button 
            variant="outline" 
            onClick={() => router.push(`/jobs/${job._id || job.id}`)}
          >
            View Details
          </Button>
          
          {hasApplied && (
            <span className="text-sm text-green-600 font-medium">
              Applied ✓
            </span>
          )}
        </div>
      </div>
    </div>
  );
}