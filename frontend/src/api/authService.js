import axiosClient from './axiosClient';

const authService = {
  login: async (email, password) => {
    const response = await axiosClient.post('/Auth/login', { email, password });
    return response.data;
  },

  register: async (userData) => {
    const response = await axiosClient.post('/Auth/register', userData);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};

export default authService;
