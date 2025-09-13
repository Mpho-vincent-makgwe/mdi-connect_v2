// src/contexts/JobsContext.js
'use client';

import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import apiHelper from '@/lib/apiHelper';

const JobsContext = createContext();

export function JobsProvider({ children }) {
  const [state, setState] = useState({
    jobs: [],
    appliedJobs: [],
    loading: true,
    error: null,
    jobDetails: null
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

      return response.data.map(app => ({
        id: app._id,
        jobId: app.job?._id || app.job,
        title: app.job?.title || 'Unknown Position',
        company: app.job?.company || 'Unknown Company',
        status: app.status || 'applied',
        appliedDate: app.appliedDate,
        resume: app.resume,
        coverLetter: app.coverLetter
      }));
    } catch (err) {
      console.error('Error fetching applications:', err);
      return [];
    }
  }, []);

  const fetchInterviews = useCallback(async () => {
    try {
      const response = await apiHelper.getInterviews();
      return response.success ? response.data : [];
    } catch (err) {
      console.error('Error fetching interviews:', err);
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
        appliedJobs,
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
  // In your JobsContext.js
const fetchJobDetails = useCallback(async (jobId) => {
  setState(prev => ({ ...prev, loading: true, error: null }));
  
  try {
    const response = await apiHelper.getJobDetails(jobId);
    
    if (response.success) {
      setState(prev => ({
        ...prev,
        jobDetails: response.data,
        loading: false,
        error: null
      }));
    } else {
      throw new Error(response.message || 'Failed to fetch job details');
    }
  } catch (err) {
    console.error('Error fetching job details:', err);
    setState(prev => ({
      ...prev,
      loading: false,
      error: err.message || 'Failed to fetch job details'
    }));
  }
}, []);

  const hasAppliedToJob = useCallback((jobId) => {
    if (!jobId) return false;
    return state.appliedJobs.some(job => job.jobId?.toString() === jobId.toString());
  }, [state.appliedJobs]);

  return (
    <JobsContext.Provider value={{
      jobs: state.jobs,
      appliedJobs: state.appliedJobs,
      jobDetails: state.jobDetails,
      loading: state.loading,
      error: state.error,
      fetchJobs,
      applyForJob,
      fetchAppliedJobs,
      fetchInterviews,
      hasAppliedToJob,
      fetchJobDetails
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