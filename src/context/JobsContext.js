'use client';

import { createContext, useContext, useEffect, useState } from 'react';

const JobsContext = createContext();

export function JobsProvider({ children }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [session, setSession] = useState(null); // Simple session state

  // Mock function to simulate getting user session
  const getSession = () => {
    // In a real app, you would get this from your auth system
    const user = localStorage.getItem('user');
    return user ? { user: JSON.parse(user) } : null;
  };

  const fetchJobs = async (params = {}) => {
    try {
      setLoading(true);
      const query = new URLSearchParams(params).toString();
      const response = await fetch(`/api/jobs?${query}`);
      const data = await response.json();
      console.log("data :", data)
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch jobs');
      }
      
      setJobs(data.jobs);
      setError(null);
    } catch (err) {
      setError(err.message);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const applyForJob = async (jobId, applicationData) => {
    try {
      const currentSession = getSession();
      if (!currentSession) {
        throw new Error('You must be logged in to apply for jobs');
      }
      
      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobId,
          userId: currentSession.user.id, // Assuming your user object has an id
          ...applicationData
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit application');
      }
      
      await fetchJobs();
      return data;
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    // Initialize session
    setSession(getSession());
    fetchJobs();
  }, []);

  const value = {
    jobs,
    loading,
    error,
    session, // Expose session to components
    fetchJobs,
    applyForJob,
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