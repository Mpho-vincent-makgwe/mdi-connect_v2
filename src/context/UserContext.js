'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import apiHelper from '@/lib/apiHelper';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // context/UserContext.js
useEffect(() => {
  const fetchUser = async () => {
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
        // Only redirect if not already on questionnaire page
        if (!response.user.completedQuestionnaire && !window.location.pathname.includes('/questionnaire')) {
          router.push('/questionnaire');
        }
      } else {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
        }
        setUser(null);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
      }
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  fetchUser();
}, [router]);

  const login = async (email, password) => {
    try {
      const response = await apiHelper.login(email, password);
      
      if (!response.success) {
        throw new Error(response.message || 'Login failed');
      }
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', response.token);
      }
      setUser(response.user);
      
      if (!response.user.completedQuestionnaire) {
        router.push('/questionnaire');
      } else {
        router.push('/');
      }
      
      return response.user;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const response = await apiHelper.register(
        userData.name,
        userData.email,
        userData.password,
        userData.role
      );
      
      if (!response.success) {
        throw new Error(response.message || 'Registration failed');
      }
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', response.token);
      }
      setUser(response.user);
      router.push('/auth/login');
      return response.user;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
    setUser(null);
    router.push('/auth/login');
  };

  const updateUser = async (updates) => {
  try {
    const response = await apiHelper.updateProfile(updates);
    
    if (!response.success) {
      throw new Error(response.message || 'Update failed');
    }
    
    setUser(response.user);
    return response.user;
  } catch (error) {
    console.error('Update error:', error);
    throw error;
  }
};

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateUser
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