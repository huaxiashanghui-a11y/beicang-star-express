import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { DollarSign, ArrowRightLeft, Clock, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { exchangeApi } from '@/api/exchange';

// 货币配置
const CURRENCIES = [
  { code: 'USD', name: '美元', symbol: '$', flag: '🇺🇸' },
  { code: 'CNY', name: '人民币', symbol: '¥', flag: '🇨🇳' },
  { code: 'MMK', name: '缅元', symbol: 'K', flag: '🇲🇲' },
  { code: 'THB', name: '泰铢', symbol: '฿', flag: '🇹🇭' },
  { code: 'SGD', name: '新加坡元', symbol: 'S$', flag: '🇸🇬' },
  { code: 'MYR', name: '马来西亚林吉特', symbol: 'RM', flag: '🇲🇾' },
  { code: 'EUR', name: '欧元', symbol: '€', flag: '🇪🇺' },
  { code: 'VND', name: '越南盾', symbol: '₫', flag: '🇻🇳' },
];

// 状态配置
const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  pending: { label: '待处理', color: 'text-yellow-600 bg-yellow-50' },
  processing: { label: '处理中', color: 'text-blue-600 bg-blue-50' },
  completed: { label: '已完成', color: 'text-green-600 bg-green-50' },
  cancelled: { label: '已取消', color: 'text-gray-600 bg-gray-50' },
  rejected: { label: '已拒绝', color: 'text-red-600 bg-red-50' },
};

export default function ExchangePage() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState<'exchange' | 'orders'>('exchange');

  // 汇率数据
  const [rates, setRates] = useState<Record<string, number>>({});
  const [updateTime, setUpdateTime] = useState('');
  const [ratesLoading, setRatesLoading] = useState(true);

  // 换汇表单
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('CNY');
  const [fromAmount, setFromAmount] = useState('');
  const [calculatedResult, setCalculatedResult] = useState<any>(null);
  const [remark, setRemark] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // 订单列表
  const [orders, setOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [orderPage, setOrderPage] = useState(1);
  const [orderTotal, setOrderTotal] = useState(0);
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('');

  // 检查登录状态
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  // 获取实时汇率
  const fetchRates = useCallback(async () => {
    try {
      const data = await exchangeApi.getRates();
      setRates(data);
      setUpdateTime(data.updateTime);
    } catch (err) {
      console.error('获取汇率失败:', err);
    } finally {
      setRatesLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRates();
    const interval = setInterval(fetchRates, 30000);
    return () => clearInterval(interval);
  }, [fetchRates]);

  // 计算换汇金额
  const calculateExchange = useCallback(async () => {
    if (!fromAmount || parseFloat(fromAmount) <= 0) {
      setCalculatedResult(null);
      return;
    }

    try {
      const result = await exchangeApi.calculate({
        fromCurrency,
        toCurrency,
        amount: parseFloat(fromAmount),
      });
      setCalculatedResult(result);
    } catch (err) {
      console.error('计算失败:', err);
    }
  }, [fromCurrency, toCurrency, fromAmount]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (fromAmount && parseFloat(fromAmount) > 0) {
        calculateExchange();
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [fromAmount, fromCurrency, toCurrency, calculateExchange]);

  // 提交换汇订单
  const handleSubmit = async () => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    if (!calculatedResult) {
      alert('请输入换汇金额');
      return;
    }

    setSubmitting(true);
    try {
      await exchangeApi.createOrder({
        fromCurrency,
        toCurrency,
        fromAmount: parseFloat(fromAmount),
        toAmount: calculatedResult.toAmount,
        exchangeRate: calculatedResult.exchangeRate,
        fee: calculatedResult.fee,
        remark,
      });
      alert('换汇申请已提交，请等待管理员审核');
      setFromAmount('');
      setRemark('');
      setCalculatedResult(null);
      setActiveTab('orders');
      fetchOrders(1);
    } catch (err: any) {
      alert(err.message || '提交失败');
    } finally {
      setSubmitting(false);
    }
  };

  // 交换货币
  const swapCurrencies = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
  };

  // 获取货币信息
  const getCurrencyInfo = (code: string) =>
    CURRENCIES.find((c) => c.code === code) || CURRENCIES[0];

  // 获取订单列表
  const fetchOrders = async (page = 1) => {
    setOrdersLoading(true);
    try {
      const params: any = { page, pageSize: 10 };
      if (orderStatusFilter) params.status = orderStatusFilter;
      const data = await exchangeApi.getOrders(params);
      setOrders(data.list);
      setOrderTotal(data.total);
      setOrderPage(page);
    } catch (err) {
      console.error('获取订单失败:', err);
    } finally {
      setOrdersLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'orders' && isLoggedIn) {
      fetchOrders();
    }
  }, [activeTab, isLoggedIn, orderStatusFilter]);

  // 取消订单
  const handleCancelOrder = async (orderId: string) => {
    if (!confirm('确定要取消该订单吗？')) return;
    try {
      await exchangeApi.cancelOrder(orderId);
      fetchOrders(orderPage);
    } catch (err: any) {
      alert(err.message || '取消失败');
    }
  };

  // 格式化时间
  const formatTime = (time: string) => {
    if (!time) return '';
    const date = new Date(time);
    return date.toLocaleString('zh-CN');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 pt-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">货币兑换</h1>
            <p className="text-blue-100 text-sm mt-1">实时汇率 · 安全便捷</p>
          </div>
          <button
            onClick={() => fetchRates()}
            className="p-2 rounded-full bg-white/20 hover:bg-white/30"
          >
            <svg
              className={`w-5 h-5 ${ratesLoading ? 'animate-spin' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </button>
        </div>

        {updateTime && (
          <div className="text-xs text-blue-200 mt-2">
            更新时间: {formatTime(updateTime)}
          </div>
        )}
      </div>

      {/* Tab */}
      <div className="bg-white border-b border-gray-200">
        <div className="flex">
          <button
            onClick={() => setActiveTab('exchange')}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              activeTab === 'exchange'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500'
            }`}
          >
            立即兑换
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              activeTab === 'orders'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500'
            }`}
          >
            我的订单
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {activeTab === 'exchange' ? (
          <div className="space-y-4">
            {/* 实时汇率展示 */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-3">
                实时汇率 (USD 基准)
              </h3>
              <div className="grid grid-cols-4 gap-3">
                {CURRENCIES.map((currency) => {
                  const rate = rates[currency.code];
                  const displayRate = rate ? rate.toFixed(4) : '--';
                  return (
                    <div
                      key={currency.code}
                      className="bg-gray-50 rounded-lg p-2 text-center"
                    >
                      <div className="text-lg">{currency.flag}</div>
                      <div className="text-xs text-gray-500">{currency.code}</div>
                      <div className="font-semibold text-blue-600 text-sm">
                        {displayRate}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 换汇计算器 */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">换汇计算</h3>

              {/* From */}
              <div className="mb-4">
                <label className="block text-sm text-gray-600 mb-2">汇出货币</label>
                <div className="flex gap-2">
                  <select
                    value={fromCurrency}
                    onChange={(e) => {
                      setFromCurrency(e.target.value);
                      setCalculatedResult(null);
                    }}
                    className="flex-1 px-3 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                  >
                    {CURRENCIES.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.flag} {c.code} - {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <input
                  type="number"
                  value={fromAmount}
                  onChange={(e) => {
                    setFromAmount(e.target.value);
                    setCalculatedResult(null);
                  }}
                  placeholder="请输入金额"
                  className="mt-2 w-full px-3 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 text-lg"
                />
              </div>

              {/* Swap Button */}
              <div className="flex justify-center -my-2">
                <button
                  onClick={swapCurrencies}
                  className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  <ArrowRightLeft className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              {/* To */}
              <div className="mb-4">
                <label className="block text-sm text-gray-600 mb-2">汇入货币</label>
                <select
                  value={toCurrency}
                  onChange={(e) => {
                    setToCurrency(e.target.value);
                    setCalculatedResult(null);
                  }}
                  className="w-full px-3 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                >
                  {CURRENCIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.flag} {c.code} - {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Result */}
              {calculatedResult && (
                <div className="bg-blue-50 rounded-xl p-4 mb-4">
                  <div className="text-sm text-blue-600 mb-2">预计到账金额</div>
                  <div className="text-3xl font-bold text-blue-700">
                    {getCurrencyInfo(calculatedResult.toCurrency).symbol}
                    {calculatedResult.toAmount.toFixed(2)}
                  </div>
                  <div className="mt-3 text-sm text-gray-600 space-y-1">
                    <div className="flex justify-between">
                      <span>汇率</span>
                      <span>1 {fromCurrency} = {calculatedResult.exchangeRate.toFixed(4)} {toCurrency}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>手续费</span>
                      <span>{calculatedResult.fee.toFixed(2)} {fromCurrency}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>服务费比例</span>
                      <span>{calculatedResult.markupRate}%</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Remark */}
              <div className="mb-4">
                <label className="block text-sm text-gray-600 mb-2">
                  备注 (可选)
                </label>
                <textarea
                  value={remark}
                  onChange={(e) => setRemark(e.target.value)}
                  placeholder="请输入备注信息，如收款账户等"
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Notice */}
              <div className="bg-amber-50 rounded-lg p-3 mb-4">
                <div className="flex gap-2">
                  <svg className="w-5 h-5 text-amber-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <div className="text-sm text-amber-700">
                    <p className="font-medium">注意事项</p>
                    <ul className="mt-1 space-y-1 text-amber-600">
                      <li>1. 订单提交后需人工审核，请耐心等待</li>
                      <li>2. 汇率每30秒自动更新，以提交时为准</li>
                      <li>3. 系统绝不自动处理、自动到账</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={!calculatedResult || submitting}
                className={`w-full py-4 rounded-xl font-semibold text-white transition-colors ${
                  !calculatedResult || submitting
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 inline mr-2 animate-spin" />
                    提交中...
                  </>
                ) : isLoggedIn ? (
                  '提交换汇申请'
                ) : (
                  '登录后提交'
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Filter */}
            <div className="bg-white rounded-xl p-3 shadow-sm">
              <select
                value={orderStatusFilter}
                onChange={(e) => setOrderStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
              >
                <option value="">全部状态</option>
                <option value="pending">待处理</option>
                <option value="processing">处理中</option>
                <option value="completed">已完成</option>
                <option value="cancelled">已取消</option>
                <option value="rejected">已拒绝</option>
              </select>
            </div>

            {!isLoggedIn ? (
              <div className="bg-white rounded-xl p-6 shadow-sm text-center">
                <p className="text-gray-500 mb-4">请先登录查看订单记录</p>
                <button
                  onClick={() => navigate('/login')}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  去登录
                </button>
              </div>
            ) : ordersLoading ? (
              <div className="text-center py-10">
                <Loader2 className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto animate-spin" />
                <p className="text-gray-500 mt-2">加载中...</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="bg-white rounded-xl p-6 shadow-sm text-center">
                <DollarSign className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">暂无订单记录</p>
              </div>
            ) : (
              <div className="space-y-3">
                {orders.map((order) => (
                  <div key={order.id} className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="text-sm text-gray-500">订单号: {order.id}</div>
                        <div className="text-xs text-gray-400">{formatTime(order.createdAt)}</div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_CONFIG[order.status]?.color || 'text-gray-600 bg-gray-50'}`}>
                        {STATUS_CONFIG[order.status]?.label || order.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-lg">{getCurrencyInfo(order.fromCurrency).flag}</span>
                      <span className="font-medium">{order.fromAmount.toFixed(2)} {order.fromCurrency}</span>
                      <ArrowRightLeft className="w-5 h-5 text-gray-400" />
                      <span className="text-lg">{getCurrencyInfo(order.toCurrency).flag}</span>
                      <span className="font-medium text-blue-600">{order.toAmount.toFixed(2)} {order.toCurrency}</span>
                    </div>

                    <div className="text-sm text-gray-500 mb-3">汇率: {order.exchangeRate.toFixed(4)}</div>

                    {order.rejectReason && (
                      <div className="text-sm text-red-600 mb-3">拒绝原因: {order.rejectReason}</div>
                    )}

                    {order.status === 'pending' && (
                      <button
                        onClick={() => handleCancelOrder(order.id)}
                        className="w-full py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50"
                      >
                        取消订单
                      </button>
                    )}
                  </div>
                ))}

                {/* Pagination */}
                {orderTotal > 10 && (
                  <div className="flex justify-center gap-2 mt-4">
                    <button onClick={() => fetchOrders(orderPage - 1)} disabled={orderPage <= 1} className="px-4 py-2 border rounded-lg disabled:opacity-50">
                      上一页
                    </button>
                    <span className="px-4 py-2">{orderPage} / {Math.ceil(orderTotal / 10)}</span>
                    <button onClick={() => fetchOrders(orderPage + 1)} disabled={orderPage >= Math.ceil(orderTotal / 10)} className="px-4 py-2 border rounded-lg disabled:opacity-50">
                      下一页
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
