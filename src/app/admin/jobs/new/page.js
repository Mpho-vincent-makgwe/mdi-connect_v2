'use client';

import JobForm from '@/components/AdminComponents/JobForm';
import { useRouter } from 'next/navigation';

export default function NewJobPage() {
  const router = useRouter();

  const handleSuccess = () => {
    router.push('/admin/jobs');
  };

  const handleCancel = () => {
    router.push('/admin/jobs');
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Create New Job</h1>
      <JobForm onSuccess={handleSuccess} onCancel={handleCancel} />
    </div>
  );
}