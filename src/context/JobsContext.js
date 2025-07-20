// src/context/JobsContext.js
'use client';

import { createContext, useContext, useState, useCallback } from 'react';
import apiHelper from '@/lib/apiHelper';

const JobsContext = createContext();

export function JobsProvider({ children }) {
  const [state, setState] = useState({
    jobs: [],
    loading: true, // Start with loading true
    error: null
  });

  const fetchJobs = useCallback(async (filters = {}) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await apiHelper.getJobs(filters);
      
      if (response.success === false) {
        throw new Error(response.message || 'Failed to fetch jobs');
      }

      setState({
        jobs: response.jobs || [], // Ensure we always have an array
        loading: false,
        error: null
      });
    } catch (err) {
      console.error('Error fetching jobs:', err);
      setState({
        jobs: [],
        loading: false,
        error: err.message || 'Failed to fetch jobs'
      });
    }
  }, []);

  const applyForJob = useCallback(async (jobId, applicationData) => {
    try {
      const response = await apiHelper.applyForJob(jobId, applicationData);
      
      if (response.success === false) {
        throw new Error(response.message || 'Failed to apply for job');
      }

      return { success: true, message: response.message };
    } catch (err) {
      console.error('Error applying for job:', err);
      return { success: false, message: err.message || 'Failed to apply for job' };
    }
  }, []);

  return (
    <JobsContext.Provider value={{
      jobs: state.jobs,
      loading: state.loading,
      error: state.error,
      fetchJobs,
      applyForJob
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