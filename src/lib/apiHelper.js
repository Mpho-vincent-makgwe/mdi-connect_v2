import axios from 'axios';

const api = axios.create({
  baseURL: '/api/auth',
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

  login: async (email, password) => {
    return apiHelper.request('POST', '/login', { email, password });
  },

  register: async (name, email, password, role) => {
    return apiHelper.request('POST', '/register', { 
      name, 
      email, 
      password, 
      role 
    });
  },

  getProfile: async () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    return apiHelper.request('GET', '/profile', {}, {
      headers: { 
        Authorization: `Bearer ${token}` 
      }
    });
  },

  updateProfile: async (updates) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  return apiHelper.request('PUT', '/profile', updates, {
    headers: { 
      Authorization: `Bearer ${token}` 
    }
  });
}
};

export default apiHelper;