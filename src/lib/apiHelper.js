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

  // Auth methods
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
    return apiHelper.request('GET', '/me', {}, {
      headers: { 
        Authorization: `Bearer ${token}` 
      }
    });
  },

  updateProfile: async (updates) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    return apiHelper.request('PUT', '/me', updates, {
      headers: { 
        Authorization: `Bearer ${token}` 
      }
    });
  },

  getApplications: async () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    return apiHelper.request('GET', '/applications', {}, {
      headers: { 
        Authorization: `Bearer ${token}` 
      }
    });
  },

  getInterviews: async () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    return apiHelper.request('GET', '/interviews', {}, {
      headers: { 
        Authorization: `Bearer ${token}` 
      }
    });
  },

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
  },

  getJobs: async (filters = {}) => {
    const query = new URLSearchParams();
    if (filters.search) query.append('search', filters.search);
    if (filters.sector && filters.sector !== 'all') query.append('sector', filters.sector);
    if (filters.location && filters.location !== 'all') query.append('location', filters.location);

    const response = await apiHelper.request('GET', `/jobs?${query.toString()}`);
    return {
      ...response,
      jobs: response.data || []
    };
  },

  applyForJob: async (jobId, formData) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    
    if (!token) {
      throw new Error('No authentication token found');
    }

    return apiHelper.request('POST', '/jobs', formData, {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    });
  },

  getJobDetails: async (jobId) => {
    return apiHelper.request('GET', `/jobs/${jobId}`);
  },
};

export default apiHelper;