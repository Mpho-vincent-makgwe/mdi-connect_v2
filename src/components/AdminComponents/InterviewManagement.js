'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FiCalendar, FiVideo, FiPhone, FiMapPin, FiMail, FiUser } from 'react-icons/fi';
import apiHelper from '@/lib/apiHelper';

export default function InterviewManagement() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchInterviews();
  }, [statusFilter]);

  const fetchInterviews = async () => {
    try {
      setLoading(true);
      const response = await apiHelper.getAllInterviews({ status: statusFilter });
      
      if (response.success) {
        setInterviews(response.data);
      }
    } catch (error) {
      console.error('Error fetching interviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      scheduled: { color: 'bg-blue-100 text-blue-800', text: 'Scheduled' },
      completed: { color: 'bg-green-100 text-green-800', text: 'Completed' },
      canceled: { color: 'bg-red-100 text-red-800', text: 'Canceled' },
      rescheduled: { color: 'bg-yellow-100 text-yellow-800', text: 'Rescheduled' }
    };

    const config = statusConfig[status] || { color: 'bg-gray-100 text-gray-800', text: status };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs ${config.color}`}>
        {config.text}
      </span>
    );
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'video': return <FiVideo className="text-blue-600" />;
      case 'phone': return <FiPhone className="text-green-600" />;
      case 'in-person': return <FiMapPin className="text-orange-600" />;
      default: return <FiCalendar className="text-gray-600" />;
    }
  };

  if (loading) {
    return <div>Loading interviews...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Interview Management</CardTitle>
          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="canceled">Canceled</SelectItem>
                <SelectItem value="rescheduled">Rescheduled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Candidate</th>
                <th className="text-left py-2">Job Position</th>
                <th className="text-left py-2">Company</th>
                <th className="text-left py-2">Interview Date</th>
                <th className="text-left py-2">Type</th>
                <th className="text-left py-2">Interviewer</th>
                <th className="text-left py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {interviews.map((interview) => (
                <tr key={interview._id} className="border-b hover:bg-gray-50">
                  <td className="py-3">
                    <div>
                      <p className="font-medium">{interview.userName}</p>
                      <p className="text-sm text-gray-600">{interview.userEmail}</p>
                    </div>
                  </td>
                  <td className="py-3">{interview.jobTitle}</td>
                  <td className="py-3">{interview.company}</td>
                  <td className="py-3">
                    {new Date(interview.date).toLocaleDateString()} at{' '}
                    {new Date(interview.date).toLocaleTimeString()}
                  </td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(interview.type)}
                      <span className="capitalize">{interview.type}</span>
                    </div>
                  </td>
                  <td className="py-3">
                    <div>
                      <p className="font-medium">{interview.interviewerName}</p>
                      <p className="text-sm text-gray-600">{interview.interviewerEmail}</p>
                    </div>
                  </td>
                  <td className="py-3">
                    {getStatusBadge(interview.status)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {interviews.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No interviews found.
          </div>
        )}
      </CardContent>
    </Card>
  );
}