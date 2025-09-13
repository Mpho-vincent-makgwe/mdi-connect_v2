// components/JobCard.js (fixed)
'use client';

import { useState } from 'react';
import { useUser } from '@/context/UserContext';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { FiEdit2, FiCalendar, FiMapPin, FiDollarSign, FiUsers } from 'react-icons/fi';
import JobApplicationModal from './JobApplicationModal';
import { useRouter } from 'next/navigation';

export default function JobCard({ job, onEdit, onStatusChange }) {
  const { user, loading, isAuthenticated } = useUser();
  const router = useRouter();
  const [applicationModalOpen, setApplicationModalOpen] = useState(false);
  
  // Check if user data is still loading
  if (loading) {
    return (
      <Card className="overflow-hidden">
        <div className="animate-pulse">
          <div className="h-48 bg-gray-200"></div>
          <CardContent className="space-y-4 p-6">
            <div className="h-6 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </CardContent>
        </div>
      </Card>
    );
  }

  const isAdmin = user?.role === 'admin';
  const isRegularUser = user?.role === 'user';
  const hasApplied = job.applications?.some(app => app.user === user?._id);

  // Calculate application progress
  const applicationProgress = Math.min(
    (job.applications?.length || 0) / job.requiredApplicants * 100,
    100
  );

  // Format deadline
  const formatDeadline = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Check if job is expired
  const isExpired = new Date(job.deadline) < new Date();

  const handleLoginRedirect = () => {
    router.push('/auth/login');
  };

  return (
    <>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        {/* Header with image */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={job.img || '/images/default-job.jpg'}
            alt={job.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 right-4">
            <Badge 
              variant={job.status === 'Open' && !isExpired ? 'default' : 'outline'}
              className={job.status === 'Open' && !isExpired 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
              }
            >
              {job.status === 'Open' && !isExpired ? 'Open' : 'Closed'}
            </Badge>
          </div>
        </div>

        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-xl font-semibold text-gray-900">
              {job.title}
            </CardTitle>
            {isAdmin && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(job)}
                  className="h-8 w-8 p-0"
                >
                  <FiEdit2 className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
          <p className="text-lg font-medium text-blue-900">{job.company}</p>
        </CardHeader>

        <CardContent className="space-y-3">
          {/* Job details */}
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <FiMapPin className="h-4 w-4" />
              <span>{job.location}</span>
            </div>
            <div className="flex items-center gap-1">
              <FiDollarSign className="h-4 w-4" />
              <span>{job.salary}</span>
            </div>
            <div className="flex items-center gap-1">
              <FiCalendar className="h-4 w-4" />
              <span>Apply by: {formatDeadline(job.deadline)}</span>
            </div>
          </div>

          {/* Sector */}
          <Badge variant="outline" className="bg-blue-50 text-blue-700">
            {job.sector}
          </Badge>

          {/* Description preview */}
          <p className="text-sm text-gray-600 line-clamp-2">
            {job.description}
          </p>

          {/* Admin-specific content */}
          {isAdmin && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-1 text-gray-600">
                  <FiUsers className="h-4 w-4" />
                  Applications: {job.applications?.length || 0} / {job.requiredApplicants}
                </span>
              </div>
              <Progress value={applicationProgress} className="h-2" />
            </div>
          )}

          {/* Requirements preview */}
          <div className="text-sm">
            <p className="font-medium text-gray-900">Key Requirements:</p>
            <ul className="text-gray-600 list-disc list-inside">
              {job.requirements.slice(0, 2).map((req, index) => (
                <li key={index} className="truncate">{req}</li>
              ))}
              {job.requirements.length > 2 && (
                <li className="text-blue-600">+{job.requirements.length - 2} more</li>
              )}
            </ul>
          </div>
        </CardContent>

        <CardFooter>
          {isAdmin ? (
            <div className="flex gap-2 w-full">
              <Button
                variant="outline"
                onClick={() => onStatusChange(job._id, job.status === 'Open' ? 'Closed' : 'Open')}
                className="flex-1"
              >
                {job.status === 'Open' ? 'Close Job' : 'Reopen Job'}
              </Button>
              <Button
                variant="outline"
                onClick={() => {/* Navigate to applications */}}
                className="flex-1"
              >
                View Applications ({job.applications?.length || 0})
              </Button>
            </div>
          ) : isRegularUser ? (
            <div className="w-full">
              {hasApplied ? (
                <Button variant="outline" className="w-full" disabled>
                  Already Applied
                </Button>
              ) : job.status === 'Open' && !isExpired ? (
                <Button 
                  onClick={() => setApplicationModalOpen(true)}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  Apply Now
                </Button>
              ) : (
                <Button variant="outline" className="w-full" disabled>
                  Applications Closed
                </Button>
              )}
            </div>
          ) : (
            <Button 
              onClick={handleLoginRedirect}
              variant="outline"
              className="w-full"
            >
              Login to Apply
            </Button>
          )}
        </CardFooter>
      </Card>

      {/* Application Modal */}
      {isRegularUser && (
        <JobApplicationModal
          job={job}
          open={applicationModalOpen}
          onOpenChange={setApplicationModalOpen}
        />
      )}
    </>
  );
}