import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

const apiHelper = {
  request: async (method, endpoint, data = {}, config = {}) => {
    try {
      const isFormData = data instanceof FormData;
      
      const response = await api({
        method,
        url: endpoint,
        data: !isFormData ? data : data,
        headers: {
          ...config.headers,
          ...(isFormData && { 'Content-Type': 'multipart/form-data' })
        },
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

  register: async (userData) => {
    return apiHelper.request('POST', '/auth/register', userData);
  },

  getProfile: async () => {
    return apiHelper.request('GET', '/me');
  },

  updateProfile: async (updates) => {
    return apiHelper.request('PUT', '/me', updates);
  },

  getApplications: async () => {
    return apiHelper.request('GET', '/applications');
  },

  getInterviews: async () => {
    return apiHelper.request('GET', '/interviews');
  },

  getNotifications: async () => {
    return apiHelper.request('GET', '/notifications');
  },

  markNotificationAsRead: async (id) => {
    return apiHelper.request('PATCH', `/notifications/${id}/read`);
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
    return apiHelper.request('POST', `/jobs/${jobId}/apply`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },

  getJobDetails: async (jobId) => {
    return apiHelper.request('GET', `/jobs/${jobId}`);
  },

  // Admin methods
  getAdminStats: async () => {
    return apiHelper.request('GET', '/admin/stats');
  },

  getAllUsers: async (page = 1, limit = 10) => {
    return apiHelper.request('GET', `/admin/users?page=${page}&limit=${limit}`);
  },

  getUserDetail: async (userId) => {
    return apiHelper.request('GET', `/admin/users/${userId}`);
  },

  getAllJobs: async (filters = {}) => {
    const query = new URLSearchParams(filters).toString();
    return apiHelper.request('GET', `/admin/jobs?${query}`);
  },

  createJob: async (jobData) => {
    return apiHelper.request('POST', '/admin/jobs', jobData);
  },

  updateJob: async (jobId, updates) => {
    return apiHelper.request('PUT', `/admin/jobs/${jobId}`, updates);
  },

  deleteJob: async (jobId) => {
    return apiHelper.request('DELETE', `/admin/jobs/${jobId}`);
  },

  getAllApplications: async (filters = {}) => {
  const query = new URLSearchParams(filters).toString();
  const response = await apiHelper.request('GET', `/admin/applications?${query}`);
  
  // Ensure we return the proper structure
  if (response.success) {
    return {
      ...response,
      data: response.data // This should contain the applications array
    };
  }
  return response;
},

 getApplicationDetail: async (applicationId) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  return apiHelper.request('GET', `/admin/applications/${applicationId}`, {}, {
    headers: { 
      Authorization: `Bearer ${token}` 
    }
  });
},

updateApplicationStatus: async (applicationId, status) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  return apiHelper.request('PATCH', `/admin/applications/${applicationId}`, { status }, {
    headers: { 
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
},

  getAllInterviews: async (filters = {}) => {
    const query = new URLSearchParams(filters).toString();
    return apiHelper.request('GET', `/admin/interviews?${query}`);
  }
};

export default apiHelper;