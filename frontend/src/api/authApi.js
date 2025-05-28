import axiosInstance from './axiosInstance';

export const loginUserApi = async (credentials) => {
  // credentials: { email, password }
  return axiosInstance.post('/auth/login', credentials);
};

export const registerUserApi = async (userData) => {
  // userData: { name, email, password }
  return axiosInstance.post('/auth/register', userData);
};

export const getMeApi = async () => {
  return axiosInstance.get('/auth/me');
};