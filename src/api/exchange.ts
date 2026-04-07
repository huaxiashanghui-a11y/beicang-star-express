/**
 * 换汇 API 客户端
 */

const API_BASE = '/api';

// 获取 token
function getToken() {
  return localStorage.getItem('token') || '';
}

// 通用请求方法
async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();

  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(`${API_BASE}${endpoint}`, config);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || '请求失败');
  }

  return data;
}

// 换汇 API
export const exchangeApi = {
  // 获取支持货币列表
  getCurrencies: () => request<any[]>('/exchange/currencies'),

  // 获取实时汇率
  getRates: () => request<any>('/exchange/rates'),

  // 获取指定货币对汇率
  getPairRate: (pair: string) => request<any>(`/exchange/rate/${pair}`),

  // 计算换汇金额
  calculate: (data: { fromCurrency: string; toCurrency: string; amount: number }) =>
    request<any>('/exchange/calculate', { method: 'POST', body: JSON.stringify(data) }),

  // 创建换汇订单
  createOrder: (data: {
    fromCurrency: string;
    toCurrency: string;
    fromAmount: number;
    toAmount: number;
    exchangeRate: number;
    fee: number;
    remark?: string;
  }) => request<any>('/exchange/create', { method: 'POST', body: JSON.stringify(data) }),

  // 获取用户换汇订单列表
  getOrders: (params?: { page?: number; pageSize?: number; status?: string }) => {
    const query = new URLSearchParams();
    if (params?.page) query.set('page', String(params.page));
    if (params?.pageSize) query.set('pageSize', String(params.pageSize));
    if (params?.status) query.set('status', params.status);
    return request<{ list: any[]; total: number }>(`/exchange/orders?${query}`);
  },

  // 获取换汇订单详情
  getOrderById: (orderId: string) => request<any>(`/exchange/order/${orderId}`),

  // 取消换汇订单
  cancelOrder: (orderId: string) => request<any>(`/exchange/cancel/${orderId}`, { method: 'PUT' }),
};

export default exchangeApi;
