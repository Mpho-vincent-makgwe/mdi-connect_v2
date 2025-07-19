// context/JobsContext.js
'use client';

import { createContext, useContext, useEffect, useState } from 'react';

const JobsContext = createContext();

export function JobsProvider({ children }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        // In a real app, you would fetch from your API
        const response = await fetch('/api/jobs');
        const data = await response.json();
        
        if (data.error) {
          setError(data.error);
        } else {
          setJobs(data.jobs);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const value = {
    jobs,
    loading,
    error,
  };

  return (
    <JobsContext.Provider value={value}>
      {children}
    </JobsContext.Provider>
  );
}

export function useJobs() {
  const context = useContext(JobsContext);
  if (context === undefined) {
    throw new Error('useJobs must be used within a JobsProvider');
  }
  return context;
}