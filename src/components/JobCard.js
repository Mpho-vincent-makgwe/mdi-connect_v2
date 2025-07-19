// components/JobCard.js
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FiBookmark, FiShare2, FiClock } from 'react-icons/fi';
import { format } from 'date-fns';

export default function JobCard({ job }) {
  const getSectorColor = (sector) => {
    switch (sector) {
      case 'Mining':
        return 'bg-orange-100 text-orange-800';
      case 'Tourism':
        return 'bg-blue-100 text-blue-800';
      case 'Manufacturing':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 hover:shadow-md transition-shadow">
      <div className="p-6 space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold">{job.title}</h3>
            <p className="text-gray-600">{job.company}</p>
          </div>
          <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-700">
            <FiBookmark className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Badge className={getSectorColor(job.sector)}>
            {job.sector}
          </Badge>
          <Badge variant="outline">
            {job.location}
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <FiClock className="h-3 w-3" />
            {format(new Date(job.deadline), 'MMM dd, yyyy')}
          </Badge>
        </div>
        
        <p className="text-gray-700 line-clamp-2">{job.description}</p>
        
        <div className="flex justify-between items-center pt-2">
          <span className="font-medium text-gray-900">{job.salary}</span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <FiShare2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button size="sm" asChild>
              <Link href={`/jobs/${job._id}`}>
                View Details
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}