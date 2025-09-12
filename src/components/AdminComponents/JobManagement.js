// components/AdminDashboard/JobManagement.js
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  FiSearch, 
  FiPlus, 
  FiEdit, 
  FiTrash2,
  FiEye,
  FiCalendar
} from 'react-icons/fi';
import apiHelper from '@/lib/apiHelper';
import JobForm from '@/components/AdminComponents/JobForm';

export default function JobManagement() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingJob, setEditingJob] = useState(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await apiHelper.getAllJobs();
      
      if (response.success) {
        setJobs(response.data);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = jobs.filter(job =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditJob = (job) => {
    setEditingJob(job);
    setShowForm(true);
  };

  const handleDeleteJob = async (jobId) => {
    if (confirm('Are you sure you want to delete this job?')) {
      try {
        const response = await apiHelper.deleteJob(jobId);
        if (response.success) {
          fetchJobs(); // Refresh the list
        }
      } catch (error) {
        console.error('Error deleting job:', error);
      }
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingJob(null);
    fetchJobs(); // Refresh the list
  };

  if (loading) {
    return <div>Loading jobs...</div>;
  }

  return (
    <div>
      {showForm ? (
        <JobForm 
          job={editingJob} 
          onSuccess={handleFormSuccess}
          onCancel={() => {
            setShowForm(false);
            setEditingJob(null);
          }}
        />
      ) : (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Job Management</CardTitle>
              <Button onClick={() => setShowForm(true)}>
                <FiPlus className="mr-2" />
                Add New Job
              </Button>
            </div>
            <div className="flex gap-2 mt-4">
              <Input
                placeholder="Search jobs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
              />
              <Button variant="outline">
                <FiSearch className="mr-2" />
                Search
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Title</th>
                    <th className="text-left py-2">Company</th>
                    <th className="text-left py-2">Sector</th>
                    <th className="text-left py-2">Location</th>
                    <th className="text-left py-2">Status</th>
                    <th className="text-left py-2">Applications</th>
                    <th className="text-left py-2">Deadline</th>
                    <th className="text-left py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredJobs.map((job) => (
                    <tr key={job._id} className="border-b hover:bg-gray-50">
                      <td className="py-3 font-medium">{job.title}</td>
                      <td className="py-3">{job.company}</td>
                      <td className="py-3 capitalize">{job.sector}</td>
                      <td className="py-3">{job.location}</td>
                      <td className="py-3">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          job.status === 'Open' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {job.status}
                        </span>
                      </td>
                      <td className="py-3">{job.applicationCount || 0}</td>
                      <td className="py-3">
                        {new Date(job.deadline).toLocaleDateString()}
                      </td>
                      <td className="py-3">
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleEditJob(job)}
                          >
                            <FiEdit className="mr-1" />
                            Edit
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDeleteJob(job._id)}
                          >
                            <FiTrash2 className="mr-1" />
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredJobs.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No jobs found. {searchTerm ? 'Try a different search term.' : 'Create your first job.'}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}