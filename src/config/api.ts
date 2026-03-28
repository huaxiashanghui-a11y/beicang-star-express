/**
 * API 配置
 * 北苍星际速充 - 后端API服务
 */

const API_BASE_URL = 'http://localhost:3000/api';

// API接口封装
const api = {
  // 基础请求方法
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = localStorage.getItem('token');
    
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error?.message || '请求失败');
      }
      
      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  // 认证相关
  auth: {
    async login(phone, password) {
      return api.request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ phone, password }),
      });
    },
    
    async register(phone, password, name) {
      return api.request('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ phone, password, name }),
      });
    },
    
    async getProfile() {
      return api.request('/auth/profile');
    },
    
    async updateProfile(data) {
      return api.request('/auth/profile', {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },
    
    async sendCode(phone) {
      return api.request('/auth/send-code', {
        method: 'POST',
        body: JSON.stringify({ phone }),
      });
    },
    
    async socialLogin(provider, openId, name, avatar) {
      return api.request('/auth/social-login', {
        method: 'POST',
        body: JSON.stringify({ provider, openId, name, avatar }),
      });
    },
  },

  // 商品相关
  products: {
    async list(params = {}) {
      const query = new URLSearchParams(params).toString();
      return api.request(`/products${query ? '?' + query : ''}`);
    },
    
    async detail(id) {
      return api.request(`/products/${id}`);
    },
    
    async hot(limit = 10) {
      return api.request(`/products/hot?limit=${limit}`);
    },
    
    async news(limit = 10) {
      return api.request(`/products/new?limit=${limit}`);
    },
    
    async recommend(limit = 10) {
      return api.request(`/products/recommend?limit=${limit}`);
    },
    
    async reviews(productId) {
      return api.request(`/products/${productId}/reviews`);
    },
  },

  // 分类相关
  categories: {
    async list() {
      return api.request('/categories');
    },
  },

  // 购物车
  cart: {
    async get() {
      return api.request('/cart');
    },
    
    async add(productId, quantity, specifications) {
      return api.request('/cart', {
        method: 'POST',
        body: JSON.stringify({ productId, quantity, specifications }),
      });
    },
    
    async update(itemId, quantity) {
      return api.request(`/cart/${itemId}`, {
        method: 'PUT',
        body: JSON.stringify({ quantity }),
      });
    },
    
    async remove(itemId) {
      return api.request(`/cart/${itemId}`, {
        method: 'DELETE',
      });
    },
    
    async clear() {
      return api.request('/cart', {
        method: 'DELETE',
      });
    },
    
    async toggleSelect(itemId, selected) {
      return api.request(`/cart/${itemId}/select`, {
        method: 'PUT',
        body: JSON.stringify({ selected }),
      });
    },
    
    async selectAll(selected) {
      return api.request('/cart/select-all', {
        method: 'PUT',
        body: JSON.stringify({ selected }),
      });
    },
  },

  // 订单
  orders: {
    async list(status) {
      const query = status ? `?status=${status}` : '';
      return api.request(`/orders${query}`);
    },
    
    async detail(id) {
      return api.request(`/orders/${id}`);
    },
    
    async create(addressId, paymentMethod, items) {
      return api.request('/orders', {
        method: 'POST',
        body: JSON.stringify({ addressId, paymentMethod, items }),
      });
    },
    
    async cancel(id) {
      return api.request(`/orders/${id}/cancel`, {
        method: 'PUT',
      });
    },
    
    async confirm(id) {
      return api.request(`/orders/${id}/confirm`, {
        method: 'PUT',
      });
    },
    
    async pay(id, method) {
      return api.request(`/orders/${id}/pay`, {
        method: 'POST',
        body: JSON.stringify({ method }),
      });
    },
  },

  // 收货地址
  addresses: {
    async list() {
      return api.request('/addresses');
    },
    
    async create(data) {
      return api.request('/addresses', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    
    async update(id, data) {
      return api.request(`/addresses/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },
    
    async remove(id) {
      return api.request(`/addresses/${id}`, {
        method: 'DELETE',
      });
    },
    
    async setDefault(id) {
      return api.request(`/addresses/${id}/default`, {
        method: 'PUT',
      });
    },
  },

  // 优惠券
  coupons: {
    async list(status) {
      const query = status ? `?status=${status}` : '';
      return api.request(`/coupons${query}`);
    },
    
    async claim(couponId) {
      return api.request('/coupons/claim', {
        method: 'POST',
        body: JSON.stringify({ couponId }),
      });
    },
    
    async verify(couponId, amount, category) {
      return api.request('/coupons/verify', {
        method: 'POST',
        body: JSON.stringify({ couponId, amount, category }),
      });
    },
    
    async available() {
      return api.request('/coupons/available');
    },
  },

  // 消息通知
  notifications: {
    async list() {
      return api.request('/notifications');
    },
    
    async unreadCount() {
      return api.request('/notifications/unread-count');
    },
    
    async markRead(id) {
      return api.request(`/notifications/${id}/read`, {
        method: 'PUT',
      });
    },
    
    async markAllRead() {
      return api.request('/notifications/read-all', {
        method: 'PUT',
      });
    },
    
    async remove(id) {
      return api.request(`/notifications/${id}`, {
        method: 'DELETE',
      });
    },
  },

  // 支付
  payments: {
    async methods() {
      return api.request('/payment-methods');
    },
    
    async create(orderId, method) {
      return api.request('/payments/create', {
        method: 'POST',
        body: JSON.stringify({ orderId, method }),
      });
    },
  },

  // 其他
  banners() {
    return api.request('/banners');
  },
};

export default api;
