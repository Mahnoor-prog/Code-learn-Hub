import axios from 'axios';
import { API_URL } from '../config.js';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auto-redirect if token expires natively parsing 401 statuses globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/?expired=true';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

// Modules API
export const modulesAPI = {
  getAll: (params) => api.get('/modules', { params }),
  getById: (id) => api.get(`/modules/${id}`),
  getWithProgress: (id) => api.get(`/modules/${id}/progress`),
};

// Progress API
export const progressAPI = {
  getModuleProgress: (moduleId) => api.get(`/progress/module/${moduleId}`),
  updateProgress: (moduleId, data) => api.post(`/progress/module/${moduleId}`, data),
  getAllProgress: () => api.get('/progress/all'),
};

// Dashboard API
export const dashboardAPI = {
  getStats: () => api.get('/dashboard'),
};

// Chatbot API
export const chatbotAPI = {
  getHistory: () => api.get('/chatbot/history'),
  sendMessage: (text) => api.post('/chatbot/message', { text }),
  analyzePerformance: () => api.get('/chatbot/analyze-performance')
};

// Gamification API
export const gamificationAPI = {
  getBadges: () => api.get('/gamification/badges'),
  getLeaderboard: () => api.get('/gamification/leaderboard'),
  checkBadges: () => api.post('/gamification/check-badges'),
  getStatus: () => api.get('/gamification/status/me')
};

// AI Content API
export const aicontentAPI = {
  generate: (data) => api.post('/aicontent/generate', data),
};

// Personalization API
export const personalizationAPI = {
  getOnboardingStatus: () => api.get('/personalization/onboarding-status'),
  submitOnboarding: (data) => api.post('/personalization/onboarding', data),
  getRoadmap: () => api.get('/personalization/roadmap'),
  regenerateRoadmap: () => api.post('/personalization/roadmap/regenerate'),
};

// Performance API
export const performanceAPI = {
  getSummary: () => api.get('/performance/summary')
};

// Weekly reports API
export const weeklyReportsAPI = {
  getCurrent: () => api.get('/weekly-reports/current'),
  getHistory: () => api.get('/weekly-reports/history'),
  generate: () => api.post('/weekly-reports/generate')
};

export default api;


