import axios from 'axios';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const api = axios.create({
  baseURL: 'http://localhost:3000/api'
});

export const getShoppingInfo = async () => {
  const response = await api.get('/shopping/info');
  return response.data;
};

export const createShoppingOrder = async (data: {
  description: string;
  budget: number;
  items?: any[];
  category?: string;
}) => {
  const response = await api.post('/shopping/create', data, {
    headers: getAuthHeader()
  });
  return response.data;
};

export const getShoppingOrders = async () => {
  const response = await api.get('/shopping/orders', {
    headers: getAuthHeader()
  });
  return response.data;
};

export const getShoppingOrder = async (orderId: string) => {
  const response = await api.get(`/shopping/${orderId}`, {
    headers: getAuthHeader()
  });
  return response.data;
};

export const cancelShoppingOrder = async (orderId: string) => {
  const response = await api.post(`/shopping/${orderId}/cancel`, {}, {
    headers: getAuthHeader()
  });
  return response.data;
};

export default {
  getShoppingInfo,
  createShoppingOrder,
  getShoppingOrders,
  getShoppingOrder,
  cancelShoppingOrder
};
