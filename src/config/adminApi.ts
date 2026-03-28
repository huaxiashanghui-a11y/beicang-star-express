/**
 * Admin API 配置
 * 管理后台API服务
 */

const ADMIN_API_BASE_URL = 'http://localhost:3000/api';

// Admin专用API封装
const adminApi = {
  // 基础请求方法
  async request(endpoint, options = {}) {
    const url = `${ADMIN_API_BASE_URL}${endpoint}`;
    const token = localStorage.getItem('adminToken');

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
      console.error('Admin API Error:', error);
      throw error;
    }
  },

  // 管理员认证
  auth: {
    async login(username, password) {
      return adminApi.request('/admin/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      });
    },

    async logout() {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
    },

    async getCurrentUser() {
      return adminApi.request('/admin/profile');
    },
  },

  // 商品管理
  products: {
    async list(params = {}) {
      const query = new URLSearchParams(params).toString();
      return adminApi.request(`/products${query ? '?' + query : ''}`);
    },

    async detail(id) {
      return adminApi.request(`/products/${id}`);
    },

    async create(data) {
      return adminApi.request('/products', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },

    async update(id, data) {
      return adminApi.request(`/products/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },

    async delete(id) {
      return adminApi.request(`/products/${id}`, {
        method: 'DELETE',
      });
    },
  },

  // 订单管理
  orders: {
    async list(params = {}) {
      const query = new URLSearchParams(params).toString();
      return adminApi.request(`/orders${query ? '?' + query : ''}`);
    },

    async detail(id) {
      return adminApi.request(`/orders/${id}`);
    },

    async updateStatus(id, status) {
      return adminApi.request(`/orders/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
      });
    },
  },

  // 用户管理
  users: {
    async list(params = {}) {
      const query = new URLSearchParams(params).toString();
      return adminApi.request(`/admin/users${query ? '?' + query : ''}`);
    },

    async detail(id) {
      return adminApi.request(`/admin/users/${id}`);
    },

    async update(id, data) {
      return adminApi.request(`/admin/users/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },
  },

  // 优惠券管理
  coupons: {
    async list(params = {}) {
      const query = new URLSearchParams(params).toString();
      return adminApi.request(`/coupons${query ? '?' + query : ''}`);
    },

    async create(data) {
      return adminApi.request('/coupons', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },

    async update(id, data) {
      return adminApi.request(`/coupons/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },

    async delete(id) {
      return adminApi.request(`/coupons/${id}`, {
        method: 'DELETE',
      });
    },
  },

  // 分类管理
  categories: {
    async list() {
      return adminApi.request('/categories');
    },

    async create(data) {
      return adminApi.request('/categories', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },

    async update(id, data) {
      return adminApi.request(`/categories/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },

    async delete(id) {
      return adminApi.request(`/categories/${id}`, {
        method: 'DELETE',
      });
    },
  },

  // 统计概览
  stats: {
    async dashboard() {
      return adminApi.request('/admin/stats/dashboard');
    },

    async sales(params = {}) {
      const query = new URLSearchParams(params).toString();
      return adminApi.request(`/admin/stats/sales${query ? '?' + query : ''}`);
    },

    async products() {
      return adminApi.request('/admin/stats/products');
    },
  },
};

export default adminApi;
