// context/AdminContext.js
'use client';

import { createContext, useContext, useState, useCallback } from 'react';
import { useUser } from './UserContext';
import apiHelper from '@/lib/apiHelper';
import { toast } from 'react-toastify';

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [adminStats, setAdminStats] = useState({
    totalUsers: 0,
    totalJobs: 0,
    totalApplications: 0,
    totalInterviews: 0,
    activeJobs: 0,
    closedJobs: 0
  });
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    users: { page: 1, limit: 10, totalPages: 1, total: 0 },
    jobs: { page: 1, limit: 10, totalPages: 1, total: 0 },
    applications: { page: 1, limit: 10, totalPages: 1, total: 0 },
    interviews: { page: 1, limit: 10, totalPages: 1, total: 0 }
  });

  const { user } = useUser();

  const fetchAdminStats = useCallback(async () => {
    if (!user || user.role !== 'admin') return;
    
    try {
      setLoading(true);
      const response = await apiHelper.getAdminStats();
      
      if (response.success) {
        setAdminStats(response.data);
      } else {
        toast.error(response.message || 'Failed to fetch admin statistics');
      }
    } catch (error) {
      console.error('Error fetching admin stats:', error);
      toast.error('Failed to fetch admin statistics');
    } finally {
      setLoading(false);
    }
  }, [user]);


  const fetchAllJobs = useCallback(async (filters = {}, page = 1, limit = 10) => {
  if (!user || user.role !== 'admin') return;
  
  try {
    setLoading(true);
    // Build query string from filters
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...filters
    });
    
    const response = await apiHelper.getAllJobs(Object.fromEntries(queryParams));
    
    if (response.success) {
      setJobs(response.data);
      setPagination(prev => ({
        ...prev,
        jobs: {
          page,
          limit,
          totalPages: response.pagination?.totalPages || 1,
          total: response.pagination?.total || response.data?.length || 0
        }
      }));
    } else {
      toast.error(response.message || 'Failed to fetch jobs');
    }
  } catch (error) {
    console.error('Error fetching jobs:', error);
    toast.error('Failed to fetch jobs');
  } finally {
    setLoading(false);
  }
}, [user]);

  const fetchAllApplications = useCallback(async (filters = {}, page = 1, limit = 10) => {
    if (!user || user.role !== 'admin') return;
    
    try {
      setLoading(true);
      const response = await apiHelper.getAllApplications({ ...filters, page, limit });
      
      if (response.success) {
        setApplications(response.data);
        setPagination(prev => ({
          ...prev,
          applications: {
            page,
            limit,
            totalPages: response.data.totalPages || 1,
            total: response.data.total || response.data.length || 0
          }
        }));
      } else {
        toast.error(response.message || 'Failed to fetch applications');
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast.error('Failed to fetch applications');
    } finally {
      setLoading(false);
    }
  }, [user]);

  const fetchAllInterviews = useCallback(async (filters = {}, page = 1, limit = 10) => {
    if (!user || user.role !== 'admin') return;
    
    try {
      setLoading(true);
      const response = await apiHelper.getAllInterviews({ ...filters, page, limit });
      
      if (response.success) {
        setInterviews(response.data);
        setPagination(prev => ({
          ...prev,
          interviews: {
            page,
            limit,
            totalPages: response.data.totalPages || 1,
            total: response.data.total || response.data.length || 0
          }
        }));
      } else {
        toast.error(response.message || 'Failed to fetch interviews');
      }
    } catch (error) {
      console.error('Error fetching interviews:', error);
      toast.error('Failed to fetch interviews');
    } finally {
      setLoading(false);
    }
  }, [user]);

  const updateApplicationStatus = useCallback(async (applicationId, status) => {
    if (!user || user.role !== 'admin') return;
    
    try {
      setLoading(true);
      const response = await apiHelper.updateApplicationStatus(applicationId, status);
      
      if (response.success) {
        // Update local state
        setApplications(prev => 
          prev.map(app => 
            app._id === applicationId ? { ...app, status } : app
          )
        );
        toast.success('Application status updated successfully');
        return true;
      } else {
        toast.error(response.message || 'Failed to update application status');
        return false;
      }
    } catch (error) {
      console.error('Error updating application status:', error);
      toast.error('Failed to update application status');
      return false;
    } finally {
      setLoading(false);
    }
  }, [user]);

  const updateJob = useCallback(async (jobId, updates) => {
    if (!user || user.role !== 'admin') return;
    
    try {
      setLoading(true);
      const response = await apiHelper.updateJob(jobId, updates);
      
      if (response.success) {
        // Update local state
        setJobs(prev => 
          prev.map(job => 
            job._id === jobId ? response.data : job
          )
        );
        toast.success('Job updated successfully');
        return true;
      } else {
        toast.error(response.message || 'Failed to update job');
        return false;
      }
    } catch (error) {
      console.error('Error updating job:', error);
      toast.error('Failed to update job');
      return false;
    } finally {
      setLoading(false);
    }
  }, [user]);

  const deleteJob = useCallback(async (jobId) => {
    if (!user || user.role !== 'admin') return;
    
    try {
      setLoading(true);
      const response = await apiHelper.deleteJob(jobId);
      
      if (response.success) {
        // Update local state
        setJobs(prev => prev.filter(job => job._id !== jobId));
        toast.success('Job deleted successfully');
        return true;
      } else {
        toast.error(response.message || 'Failed to delete job');
        return false;
      }
    } catch (error) {
      console.error('Error deleting job:', error);
      toast.error('Failed to delete job');
      return false;
    } finally {
      setLoading(false);
    }
  }, [user]);

  const createJob = useCallback(async (jobData) => {
    if (!user || user.role !== 'admin') return;
    
    try {
      setLoading(true);
      const response = await apiHelper.createJob(jobData);
      
      if (response.success) {
        // Update local state
        setJobs(prev => [...prev, response.data]);
        toast.success('Job created successfully');
        return response.data;
      } else {
        toast.error(response.message || 'Failed to create job');
        return null;
      }
    } catch (error) {
      console.error('Error creating job:', error);
      toast.error('Failed to create job');
      return null;
    } finally {
      setLoading(false);
    }
  }, [user]);

  const fetchAllUsers = useCallback(async (page = 1, limit = 10) => {
    if (!user || user.role !== 'admin') return;
    
    try {
      setLoading(true);
      const response = await apiHelper.getAllUsers(page, limit);
      
      if (response.success) {
        setUsers(response.data.users);
        setPagination(prev => ({
          ...prev,
          users: {
            page: response.data.currentPage,
            limit,
            totalPages: response.data.totalPages,
            total: response.data.totalUsers
          }
        }));
      } else {
        toast.error(response.message || 'Failed to fetch users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  }, [user]);

  const fetchUserDetails = useCallback(async (userId) => {
    if (!user || user.role !== 'admin') return;
    
    try {
      setLoading(true);
      const response = await apiHelper.getUserDetail(userId);
      
      if (response.success) {
        return response.data;
      } else {
        toast.error(response.message || 'Failed to fetch user details');
        return null;
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
      toast.error('Failed to fetch user details');
      return null;
    } finally {
      setLoading(false);
    }
  }, [user]);

  const value = {
    adminStats,
    users,
    jobs,
    applications,
    interviews,
    loading,
    pagination,
    fetchAdminStats,
    fetchAllUsers,
    fetchUserDetails, // Add this function
    fetchAllJobs,
    fetchAllApplications,
    fetchAllInterviews,
    updateApplicationStatus,
    updateJob,
    deleteJob,
    createJob
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}

export { AdminContext };