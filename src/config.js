// Unified dynamic mapping for API targets depending on runtime environment
export const API_URL = import.meta.env.PROD
    ? 'https://codelearnhub-backend.onrender.com/api'
    : 'http://localhost:5000/api';
