'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import JobForm from '@/components/AdminComponents/JobForm';
import apiHelper from '@/lib/apiHelper';

export default function EditJobPage() {
  const params = useParams();
  const router = useRouter();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJob();
  }, [params.id]);

  const fetchJob = async () => {
    try {
      const response = await apiHelper.getJobDetails(params.id);
      if (response.success) {
        setJob(response.data);
      }
    } catch (error) {
      console.error('Error fetching job:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSuccess = () => {
    router.push('/admin/jobs');
  };

  const handleCancel = () => {
    router.push('/admin/jobs');
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (!job) {
    return <div className="p-6">Job not found</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Edit Job: {job.title}</h1>
      <JobForm job={job} onSuccess={handleSuccess} onCancel={handleCancel} />
    </div>
  );
}
