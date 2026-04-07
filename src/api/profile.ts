import axios from 'axios';

// 根据环境获取API基础URL
const getBaseURL = () => {
  // 生产环境使用相对路径或Vercel环境变量
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  // 开发环境使用localhost
  return 'http://localhost:3000/api';
};

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const api = axios.create({
  baseURL: getBaseURL(),
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 添加响应拦截器用于调试
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API错误:', error.message);
    console.error('API URL:', error.config?.url);
    console.error('API BaseURL:', error.config?.baseURL);
    return Promise.reject(error);
  }
);

// 获取用户资料
export const getProfile = async () => {
  try {
    const response = await api.get('/auth/profile', {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    console.error('获取用户资料失败:', error);
    throw error;
  }
};

// 更新用户资料
export const updateProfile = async (data: {
  name?: string;
  email?: string;
  avatar?: string;
}) => {
  try {
    const response = await api.put('/auth/profile', data, {
      headers: getAuthHeader()
    });
    console.log('更新资料成功:', response.data);
    return response.data;
  } catch (error) {
    console.error('更新用户资料失败:', error);
    throw error;
  }
};

export default {
  getProfile,
  updateProfile
};
