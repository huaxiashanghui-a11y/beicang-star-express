import axios from 'axios';

// 使用相对路径，在Vercel部署时会通过vercel.json代理到后端
const getBaseURL = () => {
  // 生产环境使用相对路径（通过vercel.json代理）
  if (import.meta.env.PROD) {
    return '/api';
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
