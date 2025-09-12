// hooks/useJobSeeker.js
import { useState, useEffect, useCallback } from 'react';
import apiHelper from '@/lib/apiHelper';

export function useJobSeeker() {
  const [profile, setProfile] = useState(null);
  const [applications, setApplications] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProfile = useCallback(async () => {
    try {
      const response = await apiHelper.getProfile();
      if (response.success) {
        setProfile(response.user);
      }
    } catch (err) {
      setError(err.message);
    }
  }, []);

  const fetchApplications = useCallback(async () => {
    try {
      const response = await apiHelper.getApplications();
      if (response.success) {
        setApplications(response.data || []);
      }
    } catch (err) {
      setError(err.message);
    }
  }, []);

  const fetchInterviews = useCallback(async () => {
    try {
      const response = await apiHelper.getInterviews();
      if (response.success) {
        setInterviews(response.data || []);
      }
    } catch (err) {
      setError(err.message);
    }
  }, []);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      await Promise.all([fetchProfile(), fetchApplications(), fetchInterviews()]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [fetchProfile, fetchApplications, fetchInterviews]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    profile,
    applications,
    interviews,
    loading,
    error,
    refetch: loadData,
    updateProfile: async (updates) => {
      const response = await apiHelper.updateProfile(updates);
      if (response.success) {
        setProfile(response.user);
      }
      return response;
    }
  };
}