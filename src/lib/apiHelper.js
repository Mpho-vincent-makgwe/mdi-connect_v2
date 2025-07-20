import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

const apiHelper = {
  request: async (method, endpoint, data = {}, config = {}) => {
    try {
      const response = await api({
        method,
        url: endpoint,
        data,
        ...config
      });
      return response.data;
    } catch (error) {
      console.error('API request error:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Request failed',
        status: error.response?.status
      };
    }
  },

  // Auth methods (unchanged)
  login: async (email, password) => {
    return apiHelper.request('POST', '/auth/login', { email, password });
  },

  register: async (name, email, password, role) => {
    return apiHelper.request('POST', '/auth/register', { 
      name, 
      email, 
      password, 
      role 
    });
  },

  getProfile: async () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    return apiHelper.request('GET', '/users/me', {}, {
      headers: { 
        Authorization: `Bearer ${token}` 
      }
    });
  },

  updateProfile: async (updates) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    return apiHelper.request('PUT', '/users/me', updates, {
      headers: { 
        Authorization: `Bearer ${token}` 
      }
    });
  },

  // New methods for applications
  getApplications: async () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    return apiHelper.request('GET', '/applications', {}, {
      headers: { 
        Authorization: `Bearer ${token}` 
      }
    });
  },

  // New methods for interviews
  getInterviews: async () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    return apiHelper.request('GET', '/interviews', {}, {
      headers: { 
        Authorization: `Bearer ${token}` 
      }
    });
  },

  // New methods for notifications
  getNotifications: async () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    return apiHelper.request('GET', '/notifications', {}, {
      headers: { 
        Authorization: `Bearer ${token}` 
      }
    });
  },

  markNotificationAsRead: async (id) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    return apiHelper.request('PATCH', `/notifications/${id}/read`, {}, {
      headers: { 
        Authorization: `Bearer ${token}` 
      }
    });
  }
};

export default apiHelper;