'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        if (!token) {
          setLoading(false);
          return;
        }

        const response = await fetch('/api/auth', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'get-user',
            token
          }),
        });

        const data = await response.json();
        
        if (data.error) {
          localStorage.removeItem('token');
          setUser(null);
        } else {
          setUser(data.user);
          if (!data.user.completedQuestionnaire) {
            router.push('/questionnaire');
          }
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        localStorage.removeItem('token');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  const login = async (email, password) => {
    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'login',
          email,
          password
        }),
      });

      const data = await response.json();
    console.log('Login response data:', data); // Add this line
    
    if (!response.ok) {
      throw new Error(data.error || 'Login failed');
    }
    
    localStorage.setItem('token', data.token);
    setUser(data.user);
    return data.user;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
  };

  const register = async (userData) => {
    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'register',
          ...userData
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        localStorage.setItem('token', data.token);
        setUser(data.user);
        return data.user;
      } else {
        throw new Error(data.error || 'Registration failed');
      }
    } catch (error) {
      throw error;
    }
  };

  const updateUser = async (updates) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'update-user',
          token,
          updates
        }),
      });

      const data = await response.json();
      
      if (data.user) {
        setUser(data.user);
        return data.user;
      } else {
        throw new Error(data.error || 'Update failed');
      }
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    router.push('/auth/login');
  };

  const value = {
    user,
    loading,
    login,
    register,
    updateUser,
    logout
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