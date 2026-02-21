import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

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
};

// Gamification API
export const gamificationAPI = {
  getBadges: () => api.get('/gamification/badges'),
  getLeaderboard: () => api.get('/gamification/leaderboard'),
  checkBadges: () => api.post('/gamification/check-badges'),
};

// AI Content API
export const aicontentAPI = {
  generate: (data) => api.post('/aicontent/generate', data),
};

export default api;


