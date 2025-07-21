// app/jobs/[id]/page.js
'use client';

import { useEffect, useState, use } from 'react';
import { useJobs } from '@/context/JobsContext';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import JobApplicationModal from '@/components/JobApplicationModal';
import { FiArrowLeft } from 'react-icons/fi';
import JobDetailsLoading from '@/components/JobDetailsLoading';

export default function JobDetailsPage({ params }) {
  const { id } = use(params);
  const { currentJob, loading, error, fetchJobDetails, hasAppliedToJob } = useJobs();
  const [applicationOpen, setApplicationOpen] = useState(false);
  const router = useRouter();

  // Check if the current user has applied to this job
  const hasApplied = hasAppliedToJob(id);

  useEffect(() => {
    if (id) {
      fetchJobDetails(id);
    }
  }, [id, fetchJobDetails]);

  if (loading) {
    return <JobDetailsLoading />;
  }

  if (error) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-sm text-center">
        <p className="text-red-500">{error}</p>
        <Button 
          variant="ghost" 
          className="mt-2"
          onClick={() => fetchJobDetails(id)}
        >
          Retry
        </Button>
      </div>
    );
  }

  if (!currentJob) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-sm text-center">
        <p>Job not found</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Button 
        variant="ghost" 
        onClick={() => router.push("/jobs")}
        className="mb-4 flex items-center gap-2"
      >
        <FiArrowLeft className="h-4 w-4" />
        Back to Jobs
      </Button>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-6 space-y-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">{currentJob.title}</h1>
              <p className="text-lg text-gray-600">{currentJob.company}</p>
            </div>
            <img 
              src={currentJob.img} 
              alt={currentJob.company} 
              className="h-16 w-16 object-contain rounded"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-2">Job Description</h2>
                <p className="text-gray-700 whitespace-pre-line">{currentJob.description}</p>
              </div>
              
              <div>
                <h2 className="text-xl font-semibold mb-2">Requirements</h2>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  {currentJob.requirements.map((req, i) => (
                    <li key={i}>{req}</li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Job Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Location:</span>
                    <span>{currentJob.loc}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sector:</span>
                    <span>{currentJob.sector}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Salary:</span>
                    <span>{currentJob.salary}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Deadline:</span>
                    <span>{new Date(currentJob.deadline).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              
              <div className="pt-2">
                {hasApplied ? (
                  <Button 
                    variant="outline"
                    className="w-full text-green-600 border-green-600 hover:bg-green-50"
                    disabled
                  >
                    Applied ✓
                  </Button>
                ) : (
                  <Button 
                    className="w-full"
                    onClick={() => setApplicationOpen(true)}
                  >
                    Apply Now
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <JobApplicationModal 
        job={currentJob}
        open={applicationOpen}
        onOpenChange={setApplicationOpen}
      />
    </div>
  );
}