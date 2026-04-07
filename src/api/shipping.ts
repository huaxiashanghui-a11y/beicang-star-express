import axios from 'axios';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const api = axios.create({
  baseURL: 'http://localhost:3000/api'
});

export const getShippingInfo = async () => {
  const response = await api.get('/shipping/info');
  return response.data;
};

export const calculateShipping = async (data: {
  type: string;
  weight?: number;
  distance?: number;
}) => {
  const response = await api.post('/shipping/calculate', data, {
    headers: getAuthHeader()
  });
  return response.data;
};

export const createShippingOrder = async (data: {
  type: string;
  sender: any;
  receiver: any;
  package?: any;
  weight?: number;
}) => {
  const response = await api.post('/shipping/create', data, {
    headers: getAuthHeader()
  });
  return response.data;
};

export const getShippingOrders = async () => {
  const response = await api.get('/shipping/orders', {
    headers: getAuthHeader()
  });
  return response.data;
};

export const getShippingOrder = async (orderId: string) => {
  const response = await api.get(`/shipping/${orderId}`, {
    headers: getAuthHeader()
  });
  return response.data;
};

export const cancelShippingOrder = async (orderId: string) => {
  const response = await api.post(`/shipping/${orderId}/cancel`, {}, {
    headers: getAuthHeader()
  });
  return response.data;
};

export default {
  getShippingInfo,
  calculateShipping,
  createShippingOrder,
  getShippingOrders,
  getShippingOrder,
  cancelShippingOrder
};
