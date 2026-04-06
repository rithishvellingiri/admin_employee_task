import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api' });

// Add a request interceptor to include JWT token
API.interceptors.request.use((req) => {
  if (localStorage.getItem('userInfo')) {
    req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem('userInfo')).token}`;
  }
  return req;
});

export const login = (formData) => API.post('/auth/login', formData);
export const register = (formData) => API.post('/auth/register', formData);

export const fetchEmployees = () => API.get('/admin/employees');
export const approveEmployee = (id, isApproved) => API.put(`/admin/approve/${id}`, { isApproved });
export const assignTask = (taskData) => API.post('/admin/tasks', taskData);
export const fetchAllTasks = () => API.get('/admin/tasks');

export const fetchMyTasks = () => API.get('/employee/tasks');
export const updateTaskStatus = (id, status) => API.put(`/employee/tasks/${id}`, { status });

export default API;
