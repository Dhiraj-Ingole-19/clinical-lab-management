import axios from 'axios';

// Use production URL if in production, otherwise localhost
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to attach the JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const authApi = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getCurrentUser: () => api.get('/user/me'),
  updateProfile: (data) => api.put('/user/me', data),
};

export const labApi = {
  // Public/User
  getAllTests: () => api.get('/tests'),
  bookAppointment: (data) => api.post('/appointments/book', data),
  getMyAppointments: () => api.get('/appointments/my-history'),

  // Admin
  getAllAppointments: () => api.get('/admin/appointments'),
  updateAppointmentStatus: (id, status, reportUrl) => 
    api.put(`/admin/appointments/${id}/status`, { status, reportUrl }),
  
  // Admin Test Management
  createTest: (data) => api.post('/admin/tests', data),
  updateTest: (id, data) => api.put(`/admin/tests/${id}`, data),
  deleteTest: (id) => api.delete(`/admin/tests/${id}`),
};

export default api;