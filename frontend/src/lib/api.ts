import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor — attach JWT token
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Response interceptor — handle 401 and token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const { data } = await axios.post(`${API_BASE_URL}/api/auth/refresh`, { refreshToken });
          localStorage.setItem('accessToken', data.accessToken);
          localStorage.setItem('refreshToken', data.refreshToken);
          originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
          return api(originalRequest);
        }
      } catch {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        if (typeof window !== 'undefined') window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  },
);

export default api;

// ============================================================================
// API Functions
// ============================================================================

export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/api/auth/login', { email, password }),
  refresh: (refreshToken: string) =>
    api.post('/api/auth/refresh', { refreshToken }),
  getProfile: () => api.get('/api/auth/profile'),
};

export const employeeAPI = {
  getAll: (params?: Record<string, string>) =>
    api.get('/api/employees', { params }),
  getOne: (id: string) => api.get(`/api/employees/${id}`),
  create: (data: any) => api.post('/api/employees', data),
  update: (id: string, data: any) => api.patch(`/api/employees/${id}`, data),
  delete: (id: string) => api.delete(`/api/employees/${id}`),
  getCount: () => api.get('/api/employees/count'),
};

export const attendanceAPI = {
  clockIn: (latitude: number, longitude: number) =>
    api.post('/api/attendance/clock-in', { latitude, longitude }),
  clockOut: (latitude: number, longitude: number) =>
    api.post('/api/attendance/clock-out', { latitude, longitude }),
  getToday: () => api.get('/api/attendance/today'),
  getHistory: (params?: Record<string, string>) =>
    api.get('/api/attendance/history', { params }),
  getStats: (params?: Record<string, string>) =>
    api.get('/api/attendance/stats', { params }),
};

export const payrollAPI = {
  compute: (periodStart: string, periodEnd: string) =>
    api.post('/api/payroll/compute', { periodStart, periodEnd }),
  getByPeriod: (periodStart: string, periodEnd: string) =>
    api.get('/api/payroll', { params: { periodStart, periodEnd } }),
  getById: (id: string) => api.get(`/api/payroll/${id}`),
  getEmployeePayroll: (employeeId: string) =>
    api.get(`/api/payroll/employee/${employeeId}`),
  approve: (id: string) => api.patch(`/api/payroll/${id}/approve`),
  getStats: () => api.get('/api/payroll/stats'),
};

export const dashboardAPI = {
  getAdmin: () => api.get('/api/dashboard/admin'),
  getCrew: () => api.get('/api/dashboard/crew'),
};

export const disbursementAPI = {
  disburse: (payrollId: string) => api.post(`/api/disbursement/${payrollId}`),
  bulkDisburse: (periodStart: string, periodEnd: string) =>
    api.post('/api/disbursement/bulk/process', { periodStart, periodEnd }),
};
