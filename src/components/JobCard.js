'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import JobApplicationModal from './JobApplicationModal';

export default function JobCard({ job }) {
  const [applicationOpen, setApplicationOpen] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="p-6 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold">{job.title}</h3>
            <p className="text-gray-600">{job.company}</p>
          </div>
          <img 
            src={job.img} 
            alt={job.company} 
            className="h-12 w-12 object-contain rounded"
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-600">{job.location}</span>
            <span className="text-gray-400">•</span>
            <span className="text-gray-600">{job.sector}</span>
            <span className="text-gray-400">•</span>
            <span className="text-gray-600">{job.salary}</span>
          </div>
          
          <p className="text-gray-700 line-clamp-3">{job.description}</p>
          
          <div className="pt-2">
            <h4 className="font-medium text-sm">Requirements:</h4>
            <ul className="list-disc list-inside text-sm text-gray-600">
              {job.requirements.map((req, i) => (
                <li key={i}>{req}</li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="flex justify-between items-center pt-2">
          <p className="text-sm text-gray-500">
            Closes: {new Date(job.deadline).toLocaleDateString()}
          </p>
          <Button 
            size="sm" 
            onClick={() => setApplicationOpen(true)}
          >
            Apply Now
          </Button>
        </div>
      </div>
      
      <JobApplicationModal 
        job={job}
        open={applicationOpen}
        onOpenChange={setApplicationOpen}
      />
    </div>
  );
}