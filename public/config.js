// API Configuration
// Dynamically determine API URL based on environment
const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const API_BASE_URL = isDevelopment ? 'http://localhost:8000' : window.location.origin;

const API_CONFIG = {
  BASE_URL: window.location.origin,
  API_URL: window.location.origin + '/api',
  endpoints: {
    auth: {
      login: '/api/auth/login',
      me: '/api/auth/me',
      logout: '/api/auth/logout'
    },
    jobs: {
      list: '/api/jobs',
      single: (id) => `/api/jobs/${id}`,
      stats: '/api/jobs/stats/summary'
    },
    customers: {
      list: '/api/customers',
      single: (id) => `/api/customers/${id}`
    },
    employees: {
      list: '/api/employees',
      workload: '/api/employees/stats/workload'
    },
    inventory: {
      list: '/api/inventory',
      alerts: '/api/inventory/alerts/low'
    },
    production: {
      list: '/api/production',
      single: (id) => `/api/production/${id}`
    }
  }
};

// API Helper functions
const API = {
  token: null,

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('jwt_token', token);
    } else {
      localStorage.removeItem('jwt_token');
    }
  },

  getToken() {
    if (!this.token) {
      this.token = localStorage.getItem('jwt_token');
    }
    return this.token;
  },

  getHeaders() {
    const headers = {
      'Content-Type': 'application/json'
    };
    
    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
  },

  async request(url, options = {}) {
    const config = {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options.headers
      }
    };

    try {
      const response = await fetch(API_CONFIG.API_URL + url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      
      // If unauthorized, clear token and redirect to login
      if (error.message.includes('authorized') || error.message.includes('token')) {
        this.setToken(null);
        if (window.showLoginScreen) {
          window.showLoginScreen();
        }
      }
      
      throw error;
    }
  },

  async get(url) {
    return this.request(url, { method: 'GET' });
  },

  async post(url, data) {
    return this.request(url, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  async put(url, data) {
    return this.request(url, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },

  async delete(url) {
    return this.request(url, { method: 'DELETE' });
  }
};

