import axios from 'axios';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const api = axios.create({
  baseURL: 'http://localhost:3000/api'
});

// 获取用户资料
export const getProfile = async () => {
  const response = await api.get('/auth/profile', {
    headers: getAuthHeader()
  });
  return response.data;
};

// 更新用户资料
export const updateProfile = async (data: {
  name?: string;
  email?: string;
  avatar?: string;
}) => {
  const response = await api.put('/auth/profile', data, {
    headers: getAuthHeader()
  });
  return response.data;
};

export default {
  getProfile,
  updateProfile
};
