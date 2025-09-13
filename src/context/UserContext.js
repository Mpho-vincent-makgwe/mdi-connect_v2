'use client';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import apiHelper from '@/lib/apiHelper';
import { toast } from 'react-toastify';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const fetchUser = useCallback(async () => {
    try {
      setLoading(true);
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await apiHelper.getProfile();
      
      if (response.success) {
        setUser(response.user);
        
        // Skip redirection logic for auth routes and invitation routes
        if (pathname?.startsWith('/auth/') || pathname?.includes('token=')) {
          setLoading(false);
          return;
        }

        // Redirect logic based on user role
        if (response.user.role === 'admin') {
          if (!pathname?.startsWith('/admin')) {
            router.push('/admin/dashboard');
          }
        } else {
          if (pathname?.startsWith('/admin')) {
            router.push('/');
          } else if (!response.user.completedQuestionnaire && 
                    !pathname?.includes('/questionnaire')) {
            router.push('/questionnaire');
          }
        }
      } else {
        localStorage.removeItem('token');
        setUser(null);
        if (!pathname?.startsWith('/auth/')) {
          toast.error(response.message || 'Session expired, please login again');
        }
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      localStorage.removeItem('token');
      setUser(null);
      if (!pathname?.startsWith('/auth/')) {
        toast.error('Failed to load user profile');
      }
    } finally {
      setLoading(false);
    }
  }, [router, pathname]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = async (email, password) => {
    try {
      const response = await apiHelper.login(email, password);
      
      if (!response.success) {
        throw new Error(response.message || 'Login failed');
      }
      
      localStorage.setItem('token', response.token);
      setUser(response.user);
      
      if (response.user.role === 'admin') {
        router.push('/admin/dashboard');
      } else if (!response.user.completedQuestionnaire) {
        router.push('/questionnaire');
      } else {
        router.push('/');
      }
      
      toast.success('Login successful!');
      return response.user;
    } catch (error) {
      toast.error(error.message || 'Login failed');
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const response = await apiHelper.register(userData);
      
      if (!response.success) {
        throw new Error(response.message || 'Registration failed');
      }
      
      localStorage.setItem('token', response.token);
      setUser(response.user);
      router.push('/auth/login');
      toast.success('Registration successful! Please login.');
      return response.user;
    } catch (error) {
      toast.error(error.message || 'Registration failed');
      throw error;
    }
  };

  const completeRegistration = async (invitationData) => {
    try {
      const response = await apiHelper.completeRegistration(invitationData);
      
      if (!response.success) {
        throw new Error(response.message || 'Registration completion failed');
      }
      
      if (response.token) {
        localStorage.setItem('token', response.token);
      }
      
      setUser(response.user);
      
      if (response.user.role === 'admin') {
        router.push('/admin/dashboard');
      } else {
        router.push('/questionnaire');
      }
      
      toast.success('Registration completed successfully!');
      return response.user;
    } catch (error) {
      toast.error(error.message || 'Registration completion failed');
      throw error;
    }
  };

  const validateInvitation = async (token) => {
    try {
      const response = await apiHelper.validateInvitation(token);
      return response;
    } catch (error) {
      console.error('Error validating invitation:', error);
      return {
        success: false,
        message: error.message || 'Failed to validate invitation'
      };
    }
  };

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setUser(null);
    router.push('/auth/login');
    toast.info('You have been logged out');
  }, [router]);

  const updateUser = async (updates) => {
    try {
      const response = await apiHelper.updateProfile(updates);
      
      if (!response.success) {
        throw new Error(response.message || 'Update failed');
      }
      
      setUser(response.user);
      return response.user;
    } catch (error) {
      toast.error(error.message || 'Update failed');
      throw error;
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    completeRegistration,
    validateInvitation,
    logout,
    updateUser,
    refreshUser: fetchUser,
    isAuthenticated: !!user
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}