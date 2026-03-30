/**
 * Admin API 配置
 * 管理后台API服务
 */

// 根据环境自动选择API基础URL
const getApiBaseUrl = () => {
  // 开发环境和生产环境都使用相对路径（通过代理）
  // Vite dev server 配置了 /api 代理到 localhost:3000
  // 生产环境由服务器配置代理
  return '/api';
};

const ADMIN_API_BASE_URL = getApiBaseUrl();

// Admin专用API封装
const adminApi = {
  // 基础请求方法
  async request(endpoint, options = {}) {
    const url = `${ADMIN_API_BASE_URL}/admin${endpoint}`;
    const token = localStorage.getItem('adminToken');

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    console.log('[AdminAPI] Request:', options.method || 'GET', url, { headers });

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      console.log('[AdminAPI] Response status:', response.status);

      const data = await response.json();
      console.log('[AdminAPI] Response data:', data);

      // 检查API返回的业务状态
      if (!response.ok || data.success === false) {
        throw new Error(data.error?.message || data.message || `请求失败 (${response.status})`);
      }

      // 返回data字段（如果存在），否则返回整个响应
      return data.data !== undefined ? data.data : data;
    } catch (error: any) {
      console.error('[AdminAPI] Error:', error.message);
      console.error('[AdminAPI] Error details:', error);

      // 区分不同类型的错误
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('无法连接到服务器，请确保后端服务正在运行');
      }

      throw error;
    }
  },

  // 管理员认证
  auth: {
    async login(username, password) {
      return adminApi.request('/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      });
    },

    async logout() {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
    },

    async getCurrentUser() {
      return adminApi.request('/profile');
    },
  },

  // 仪表盘统计
  stats: {
    async dashboard() {
      return adminApi.request('/stats/dashboard');
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

    async updateStatus(id, status) {
      return adminApi.request(`/products/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
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

    async updateStatus(id, status, note) {
      return adminApi.request(`/orders/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status, note }),
      });
    },

    async refund(id, reason) {
      return adminApi.request(`/orders/${id}/refund`, {
        method: 'POST',
        body: JSON.stringify({ reason }),
      });
    },
  },

  // 用户管理
  users: {
    async list(params = {}) {
      const query = new URLSearchParams(params).toString();
      return adminApi.request(`/users${query ? '?' + query : ''}`);
    },

    async detail(id) {
      return adminApi.request(`/users/${id}`);
    },

    async update(id, data) {
      return adminApi.request(`/users/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },

    async updateStatus(id, status) {
      return adminApi.request(`/users/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
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

  // 公告管理
  announcements: {
    async list() {
      return adminApi.request('/announcements');
    },

    async create(data) {
      return adminApi.request('/announcements', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },

    async updateStatus(id, status) {
      return adminApi.request(`/announcements/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
      });
    },

    async delete(id) {
      return adminApi.request(`/announcements/${id}`, {
        method: 'DELETE',
      });
    },
  },

  // 客服工单
  tickets: {
    async list() {
      return adminApi.request('/tickets');
    },

    async reply(id, content) {
      return adminApi.request(`/tickets/${id}/reply`, {
        method: 'POST',
        body: JSON.stringify({ content }),
      });
    },
  },

  // Banner管理
  banners: {
    async list() {
      return adminApi.request('/banners');
    },

    async create(data) {
      return adminApi.request('/banners', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },

    async update(id, data) {
      return adminApi.request(`/banners/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },

    async delete(id) {
      return adminApi.request(`/banners/${id}`, {
        method: 'DELETE',
      });
    },
  },

  // 积分规则管理
  pointsRules: {
    async list() {
      return adminApi.request('/points-rules');
    },

    async create(data) {
      return adminApi.request('/points-rules', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },

    async update(id, data) {
      return adminApi.request(`/points-rules/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },

    async delete(id) {
      return adminApi.request(`/points-rules/${id}`, {
        method: 'DELETE',
      });
    },
  },
};

export default adminApi;
