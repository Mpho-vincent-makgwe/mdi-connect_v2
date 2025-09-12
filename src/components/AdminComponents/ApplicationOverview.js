// components/AdminDashboard/ApplicationOverview.js - Updated
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FiEye, FiDownload, FiFilter } from 'react-icons/fi';
import apiHelper from '@/lib/apiHelper';
import ApplicationDetail from '@/components/AdminComponents/ApplicationDetail';

export default function ApplicationOverview({ limit }) {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showDetail, setShowDetail] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, []);

  // In the fetchApplications function:
const fetchApplications = async () => {
  try {
    setLoading(true);
    const response = await apiHelper.getAllApplications();
    
    if (response.success) {
      // Access response.data.applications instead of response.data
      setApplications(limit ? response.data.applications.slice(0, limit) : response.data.applications);
    }
  } catch (error) {
    console.error('Error fetching applications:', error);
  } finally {
    setLoading(false);
  }
};
  const getStatusBadge = (status) => {
    const statusConfig = {
      applied: { color: 'bg-blue-100 text-blue-800', text: 'Applied' },
      reviewed: { color: 'bg-purple-100 text-purple-800', text: 'Reviewed' },
      interview: { color: 'bg-yellow-100 text-yellow-800', text: 'Interview' },
      offered: { color: 'bg-green-100 text-green-800', text: 'Offered' },
      rejected: { color: 'bg-red-100 text-red-800', text: 'Rejected' }
    };

    const config = statusConfig[status] || { color: 'bg-gray-100 text-gray-800', text: status };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs ${config.color}`}>
        {config.text}
      </span>
    );
  };

  const viewApplicationDetails = (application) => {
    setSelectedApplication(application);
    setShowDetail(true);
  };

  const handleDetailClose = () => {
    setShowDetail(false);
    setSelectedApplication(null);
    // Optionally refresh the applications list to reflect any changes
    fetchApplications();
  };

  if (loading) {
    return <div className="text-center py-4">Loading applications...</div>;
  }

  return (
    <div>
      {showDetail ? (
        <ApplicationDetail 
          applicationId={selectedApplication?._id} 
          onClose={handleDetailClose}
        />
      ) : (
        <>
          {!limit && (
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>All Applications</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <FiFilter className="mr-2" />
                    Filter
                  </Button>
                  <Button variant="outline" size="sm">
                    <FiDownload className="mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
          )}
          
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Applicant</th>
                    <th className="text-left py-2">Job Position</th>
                    <th className="text-left py-2">Company</th>
                    <th className="text-left py-2">Applied Date</th>
                    <th className="text-left py-2">Status</th>
                    <th className="text-left py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((application) => (
                    <tr key={application._id} className="border-b hover:bg-gray-50">
                      <td className="py-3">
                        <div>
                          <p className="font-medium">{application.name}</p>
                          <p className="text-sm text-gray-600">{application.email}</p>
                        </div>
                      </td>
                      <td className="py-3">{application.jobTitle}</td>
                      <td className="py-3">{application.company}</td>
                      <td className="py-3">
                        {new Date(application.appliedDate).toLocaleDateString()}
                      </td>
                      <td className="py-3">
                        {getStatusBadge(application.status)}
                      </td>
                      <td className="py-3">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => viewApplicationDetails(application)}
                        >
                          <FiEye className="mr-1" />
                          View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {applications.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No applications found.
              </div>
            )}
          </CardContent>
        </>
      )}
    </div>
  );
}