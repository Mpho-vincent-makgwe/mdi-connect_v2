'use client';

import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import apiHelper from '@/lib/apiHelper';

const JobsContext = createContext();

export function JobsProvider({ children }) {
  const [state, setState] = useState({
    jobs: [],
    appliedJobs: [], // Changed from appliedJobIds to store full job objects
    loading: true,
    error: null,
    currentJob: null
  });

 const fetchAppliedJobs = useCallback(async () => {
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) return [];

    const response = await apiHelper.getApplications();
    
    if (!response || !response.success || !Array.isArray(response.data)) {
      console.error('Invalid applications response:', response);
      return [];
    }
    console.log('All Applications:', response.data);

    const userResponse = await apiHelper.getProfile();
    const currentUserId = userResponse.user?.id;

    if (!currentUserId) {
      console.error('No current user ID found');
      return [];
    }

    // Normalize and filter applications
    const appliedJobs = response.data
      .filter(app => {
        // Handle different user ID formats
        const appUserId = app.user?._id || app.user?.$oid || app.user?.id || app.user;
        return appUserId?.toString() === currentUserId.toString();
      })
      .map(app => {
        // Check if job is populated or just an ID
        const job = app.job || {};
        
        // If job is populated (has title, company, etc.)
        if (job.title) {
          return {
            id: job._id || job.$oid || job.id,
            _id: job._id || job.$oid || job.id,
            title: job.title,
            company: job.company,
            location: job.location,
            sector: job.sector,
            salary: job.salary,
            description: job.description,
            requirements: job.requirements,
            img: job.img,
            status: job.status,
            deadline: job.deadline,
            createdAt: job.createdAt
          };
        }
        
        // If job is just an ID, we'll need to fetch details later
        return {
          id: job,
          _id: job
        };
      })
      .filter(job => job.id); // Remove entries without job IDs

    return appliedJobs;
  } catch (err) {
    console.error('Error fetching applications:', err);
    return [];
  }
}, []);

 const fetchJobs = useCallback(async (filters = {}) => {
  setState(prev => ({ ...prev, loading: true, error: null }));
  
  try {
    const jobsResponse = await apiHelper.getJobs(filters);
    
    if (!jobsResponse) {
      throw new Error('No response received from server');
    }

    if (jobsResponse.success === false) {
      throw new Error(jobsResponse.message || 'Failed to fetch jobs');
    }

    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const appliedJobs = token ? await fetchAppliedJobs() : [];
    
    setState({
      jobs: jobsResponse.data || jobsResponse.jobs || [],
      appliedJobs, // Store full job objects
      loading: false,
      error: null
    });
  } catch (err) {
    console.error('Error fetching jobs:', err);
    setState({
      jobs: [],
      appliedJobs: [],
      loading: false,
      error: err.message || 'Failed to fetch jobs'
    });
  }
}, [fetchAppliedJobs]);

  const applyForJob = useCallback(async (jobId, formData) => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (!token) throw new Error('User not authenticated');

      const response = await apiHelper.applyForJob(jobId, formData);
      
      if (!response) {
        throw new Error('No response received from server');
      }

      if (response.success) {
        const appliedJobs = await fetchAppliedJobs();
        setState(prev => ({
          ...prev,
          appliedJobs
        }));
        return { success: true, message: response.message };
      }
      throw new Error(response.message || 'Failed to apply for job');
    } catch (err) {
      return { success: false, message: err.message };
    }
  }, [fetchAppliedJobs]);

  const fetchJobDetails = useCallback(async (jobId) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const jobResponse = await apiHelper.getJobDetails(jobId);
      
      if (!jobResponse) {
        throw new Error('No response received from server');
      }

      if (jobResponse.success === false) {
        throw new Error(jobResponse.message || 'Failed to fetch job details');
      }

      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const appliedJobs = token ? await fetchAppliedJobs() : [];

      setState(prev => ({
        ...prev,
        currentJob: jobResponse.data,
        appliedJobs,
        loading: false,
        error: null
      }));

      return jobResponse.data;
    } catch (err) {
      console.error('Error fetching job details:', err);
      setState(prev => ({
        ...prev,
        loading: false,
        error: err.message || 'Failed to fetch job details'
      }));
      throw err;
    }
  }, [fetchAppliedJobs]);

  // Helper function to check if a job has been applied to
  const hasAppliedToJob = useCallback((jobId) => {
  if (!jobId) return false;
  
  return state.appliedJobs.some(job => {
    // Compare both string representations to avoid type mismatches
    const appliedJobId = job._id || job.id;
    return appliedJobId?.toString() === jobId.toString();
  });
}, [state.appliedJobs]);

  return (
    <JobsContext.Provider value={{
      jobs: state.jobs,
      appliedJobs: state.appliedJobs,
      currentJob: state.currentJob,
      loading: state.loading,
      error: state.error,
      fetchJobs,
      fetchJobDetails,
      applyForJob,
      fetchAppliedJobs,
      hasAppliedToJob // Expose the helper function
    }}>
      {children}
    </JobsContext.Provider>
  );
}

export function useJobs() {
  const context = useContext(JobsContext);
  if (!context) {
    throw new Error('useJobs must be used within a JobsProvider');
  }
  return context;
}