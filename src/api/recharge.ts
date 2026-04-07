import axios from 'axios';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const api = axios.create({
  baseURL: 'http://localhost:3000/api'
});

// 获取支持的货币
export const getCurrencies = async () => {
  const response = await api.get('/recharge/currencies');
  return response.data;
};

// 获取支付方式
export const getPaymentMethods = async () => {
  const response = await api.get('/recharge/payment-methods', {
    headers: getAuthHeader()
  });
  return response.data;
};

// 创建充值订单
export const createRecharge = async (data: {
  amount: number;
  currency: string;
  paymentMethod: string;
  paymentAccount?: string;
}) => {
  const response = await api.post('/recharge/create', data, {
    headers: getAuthHeader()
  });
  return response.data;
};

// 获取充值订单列表
export const getRechargeOrders = async () => {
  const response = await api.get('/recharge/orders', {
    headers: getAuthHeader()
  });
  return response.data;
};

// 取消充值订单
export const cancelRecharge = async (orderId: string) => {
  const response = await api.post(`/recharge/cancel/${orderId}`, {}, {
    headers: getAuthHeader()
  });
  return response.data;
};

// Admin: 获取所有充值订单
export const adminGetRechargeOrders = async (params?: {
  status?: string;
  page?: number;
  limit?: number;
}) => {
  const response = await api.get('/recharge/admin/orders', {
    headers: getAuthHeader(),
    params
  });
  return response.data;
};

// Admin: 审核通过
export const adminApproveRecharge = async (orderId: string, adminNote?: string) => {
  const response = await api.post(`/recharge/admin/approve/${orderId}`, { adminNote }, {
    headers: getAuthHeader()
  });
  return response.data;
};

// Admin: 拒绝
export const adminRejectRecharge = async (orderId: string, adminNote?: string) => {
  const response = await api.post(`/recharge/admin/reject/${orderId}`, { adminNote }, {
    headers: getAuthHeader()
  });
  return response.data;
};

export default {
  getCurrencies,
  getPaymentMethods,
  createRecharge,
  getRechargeOrders,
  cancelRecharge,
  adminGetRechargeOrders,
  adminApproveRecharge,
  adminRejectRecharge
};
