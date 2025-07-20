// src/context/JobsContext.js
'use client';

import { createContext, useContext, useState, useCallback } from 'react';

const JobsContext = createContext();

export function JobsProvider({ children }) {
  const [state, setState] = useState({
    jobs: [],
    loading: false,
    error: null
  });

  const fetchJobs = useCallback(async (filters = {}) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const query = {};
      if (filters.search) query.search = filters.search;
      if (filters.sector !== 'all') query.sector = filters.sector;
      if (filters.location !== 'all') query.location = filters.location;

      const response = await fetch(`/api/jobs?${new URLSearchParams(query)}`);
      const data = await response.json();
      
      setState({
        jobs: data.jobs || [], // Access the jobs array from the response
        loading: false,
        error: null
      });
    } catch (err) {
      setState({
        jobs: [],
        loading: false,
        error: err.message
      });
    }
  }, []);

  return (
    <JobsContext.Provider value={{
      jobs: state.jobs,
      loading: state.loading,
      error: state.error,
      fetchJobs
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