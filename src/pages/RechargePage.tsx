import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Coins,
  ArrowLeft,
  CreditCard,
  Wallet,
  History,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  RefreshCw,
  Building2
} from 'lucide-react';
import rechargeApi from '@/api/recharge';
import { useToast } from '@/components/Toast';

interface Currency {
  code: string;
  name: string;
  symbol: string;
  icon: string;
}

interface PaymentMethod {
  id: string;
  name: string;
  description: string;
}

interface RechargeOrder {
  id: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  createdAt: string;
  processedAt?: string;
  adminNote?: string;
}

export default function RechargePage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [activeTab, setActiveTab] = useState<'recharge' | 'history'>('recharge');
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [amount, setAmount] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState('CNY');
  const [selectedPayment, setSelectedPayment] = useState('');
  const [paymentAccount, setPaymentAccount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orders, setOrders] = useState<RechargeOrder[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);

  useEffect(() => {
    loadCurrencies();
    if (isLoggedIn) {
      loadPaymentMethods();
      loadOrders();
    }
  }, [isLoggedIn]);

  const loadCurrencies = async () => {
    try {
      const res = await rechargeApi.getCurrencies();
      setCurrencies(res.currencies);
    } catch (error) {
      console.error('Failed to load currencies:', error);
    }
  };

  const loadPaymentMethods = async () => {
    try {
      const res = await rechargeApi.getPaymentMethods();
      setPaymentMethods(res.paymentMethods);
    } catch (error) {
      console.error('Failed to load payment methods:', error);
    }
  };

  const loadOrders = async () => {
    setIsLoadingOrders(true);
    try {
      const res = await rechargeApi.getRechargeOrders();
      setOrders(res.orders);
    } catch (error) {
      console.error('Failed to load orders:', error);
    } finally {
      setIsLoadingOrders(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn) {
      showToast('error', '请先登录');
      navigate('/login');
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      showToast('error', '请输入有效的充值金额');
      return;
    }

    if (!selectedPayment) {
      showToast('error', '请选择支付方式');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await rechargeApi.createRecharge({
        amount: parseFloat(amount),
        currency: selectedCurrency,
        paymentMethod: selectedPayment,
        paymentAccount
      });

      if (res.success) {
        showToast('success', '充值申请已提交，等待管理员审核');
        setAmount('');
        setPaymentAccount('');
        setSelectedPayment('');
        setActiveTab('history');
        loadOrders();
      }
    } catch (error: any) {
      showToast('error', error.response?.data?.error || '提交失败');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const config: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
      pending: { bg: 'bg-yellow-100 text-yellow-700', text: '待处理', icon: <Clock className="w-4 h-4" /> },
      approved: { bg: 'bg-green-100 text-green-700', text: '已通过', icon: <CheckCircle className="w-4 h-4" /> },
      rejected: { bg: 'bg-red-100 text-red-700', text: '已拒绝', icon: <XCircle className="w-4 h-4" /> },
      cancelled: { bg: 'bg-gray-100 text-gray-600', text: '已取消', icon: <XCircle className="w-4 h-4" /> }
    };
    const { bg, text, icon } = config[status] || config.pending;
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${bg} ${text}`}>
        {icon} {text}
      </span>
    );
  };

  const getPaymentMethodName = (id: string) => {
    const method = paymentMethods.find(m => m.id === id);
    return method?.name || id;
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Wallet className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-medium text-gray-700 mb-2">请先登录</h2>
          <p className="text-gray-500 mb-4">登录后即可使用充值功能</p>
          <button
            onClick={() => navigate('/login')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            去登录
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="max-w-3xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/profile')} className="p-1">
              <ArrowLeftLeft className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-semibold">账户充值</h1>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4">
          <div className="flex">
            <button
              onClick={() => setActiveTab('recharge')}
              className={`flex-1 py-3 text-center font-medium border-b-2 transition-colors ${
                activeTab === 'recharge'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Coins className="w-5 h-5 mx-auto mb-1" />
              充值
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex-1 py-3 text-center font-medium border-b-2 transition-colors ${
                activeTab === 'history'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <History className="w-5 h-5 mx-auto mb-1" />
              充值记录
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6">
        {activeTab === 'recharge' ? (
          <div className="space-y-6">
            {/* Info Card */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">充值说明</p>
                  <ul className="space-y-1 text-blue-700">
                    <li>• 充值金额将添加到您的账户余额</li>
                    <li>• 提交申请后需管理员审核通过</li>
                    <li>• 审核通过后余额将实时到账</li>
                    <li>• 如有疑问请联系客服</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Recharge Form */}
            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 space-y-6">
              {/* Amount Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  充值金额
                </label>
                <div className="flex gap-3">
                  <div className="flex-1 relative">
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="请输入充值金额"
                      min="1"
                      step="0.01"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                      {currencies.find(c => c.code === selectedCurrency)?.symbol || '¥'}
                    </span>
                  </div>
                  <select
                    value={selectedCurrency}
                    onChange={(e) => setSelectedCurrency(e.target.value)}
                    className="px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-700"
                  >
                    {currencies.map(c => (
                      <option key={c.code} value={c.code}>
                        {c.icon} {c.code}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Quick Amount Buttons */}
              <div className="flex flex-wrap gap-2">
                {[100, 500, 1000, 2000, 5000].map(val => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setAmount(String(val))}
                    className={`px-4 py-2 rounded-lg border transition-colors ${
                      amount === String(val)
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
                    }`}
                  >
                    {val}
                  </button>
                ))}
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  选择支付方式
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {paymentMethods.map(method => (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setSelectedPayment(method.id)}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        selectedPayment === method.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${
                          selectedPayment === method.id ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {method.id.includes('bank') ? (
                            <Building2 className="w-5 h-5" />
                          ) : (
                            <CreditCard className="w-5 h-5" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{method.name}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{method.description}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Payment Account (optional) */}
              {selectedPayment && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {getPaymentMethodName(selectedPayment)}账号
                    <span className="text-gray-400 font-normal ml-1">(选填)</span>
                  </label>
                  <input
                    type="text"
                    value={paymentAccount}
                    onChange={(e) => setPaymentAccount(e.target.value)}
                    placeholder="请输入您的支付账号"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || !amount || !selectedPayment}
                className={`w-full py-4 rounded-xl font-medium text-lg transition-colors ${
                  isSubmitting || !amount || !selectedPayment
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    提交中...
                  </span>
                ) : (
                  '提交充值申请'
                )}
              </button>
            </form>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Orders List */}
            {isLoadingOrders ? (
              <div className="text-center py-12">
                <RefreshCw className="w-8 h-8 mx-auto text-gray-400 animate-spin" />
                <p className="text-gray-500 mt-2">加载中...</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl">
                <Wallet className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                <p className="text-gray-500">暂无充值记录</p>
                <button
                  onClick={() => setActiveTab('recharge')}
                  className="mt-4 text-blue-600 hover:underline"
                >
                  去充值
                </button>
              </div>
            ) : (
              orders.map(order => (
                <div key={order.id} className="bg-white rounded-xl shadow-sm p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-medium text-gray-900">
                        {currencies.find(c => c.code === order.currency)?.icon} {order.amount.toFixed(2)} {order.currency}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {getPaymentMethodName(order.paymentMethod)}
                      </p>
                    </div>
                    {getStatusBadge(order.status)}
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">{formatDate(order.createdAt)}</span>
                    <span className="text-gray-500 font-mono">{order.id}</span>
                  </div>
                  {order.adminNote && (
                    <div className="mt-2 pt-2 border-t border-gray-100">
                      <p className="text-sm text-gray-600">
                        <span className="text-gray-400">备注：</span>
                        {order.adminNote}
                      </p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
