// components/AdminDashboard/ApplicationDetail.js
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FiDownload, FiCalendar, FiMail, FiPhone, FiLinkedin, FiUser } from 'react-icons/fi';
import apiHelper from '@/lib/apiHelper';

export default function ApplicationDetail({ applicationId, onClose }) {
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (applicationId) {
      fetchApplicationDetails();
    }
  }, [applicationId]);

  const fetchApplicationDetails = async () => {
    try {
      setLoading(true);
      const response = await apiHelper.getApplicationDetail(applicationId);
      
      if (response.success) {
        setApplication(response.data);
      }
    } catch (error) {
      console.error('Error fetching application details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      setUpdating(true);
      const response = await apiHelper.updateApplicationStatus(applicationId, newStatus);
      
      if (response.success) {
        setApplication(prev => ({ ...prev, status: newStatus }));
        // You might want to refresh the applications list in the parent component
      }
    } catch (error) {
      console.error('Error updating application status:', error);
    } finally {
      setUpdating(false);
    }
  };

  const downloadResume = () => {
    if (application?.resume) {
      window.open(application.resume, '_blank');
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div>Loading application details...</div>
        </CardContent>
      </Card>
    );
  }

  if (!application) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div>Application not found</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Application Details</CardTitle>
          {onClose && (
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Applicant Information */}
          <div>
            <h3 className="text-lg font-medium mb-4">Applicant Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <FiUser className="text-gray-600" />
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium">{application.name}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <FiMail className="text-gray-600" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{application.email}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <FiPhone className="text-gray-600" />
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium">{application.phone}</p>
                </div>
              </div>
              
              {application.linkedin && (
                <div className="flex items-center gap-3">
                  <FiLinkedin className="text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-500">LinkedIn</p>
                    <a 
                      href={application.linkedin} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="font-medium text-blue-600 hover:underline"
                    >
                      View Profile
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Job Information */}
          <div>
            <h3 className="text-lg font-medium mb-4">Job Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Job Title</p>
                <p className="font-medium">{application.jobTitle}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Company</p>
                <p className="font-medium">{application.company}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Sector</p>
                <p className="font-medium capitalize">{application.sector}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p className="font-medium">{application.location}</p>
              </div>
            </div>
          </div>

          {/* Application Details */}
          <div>
            <h3 className="text-lg font-medium mb-4">Application Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="flex items-center gap-3">
                <FiCalendar className="text-gray-600" />
                <div>
                  <p className="text-sm text-gray-500">Applied Date</p>
                  <p className="font-medium">
                    {new Date(application.appliedDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <Select 
                  value={application.status} 
                  onValueChange={handleStatusChange}
                  disabled={updating}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="applied">Applied</SelectItem>
                    <SelectItem value="reviewed">Reviewed</SelectItem>
                    <SelectItem value="interview">Interview</SelectItem>
                    <SelectItem value="offered">Offered</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Resume */}
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-2">Resume</p>
              <Button 
                variant="outline" 
                onClick={downloadResume}
                disabled={!application.resume}
              >
                <FiDownload className="mr-2" />
                Download Resume
              </Button>
            </div>

            {/* Cover Letter */}
            {application.coverLetter && (
              <div>
                <p className="text-sm text-gray-500 mb-2">Cover Letter</p>
                <div className="p-4 bg-gray-50 rounded-md border">
                  <p className="whitespace-pre-wrap">{application.coverLetter}</p>
                </div>
              </div>
            )}
          </div>

          {/* User Information (if available) */}
          {application.user && (
            <div>
              <h3 className="text-lg font-medium mb-4">User Account Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">User Name</p>
                  <p className="font-medium">{application.user.name}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">User Email</p>
                  <p className="font-medium">{application.user.email}</p>
                </div>
                
                {application.user.phone && (
                  <div>
                    <p className="text-sm text-gray-500">User Phone</p>
                    <p className="font-medium">{application.user.phone}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}