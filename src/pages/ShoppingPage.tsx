import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShoppingBag, ArrowLeft, Clock, CheckCircle, XCircle, AlertCircle,
  RefreshCw, Plus, Package, ChevronRight
} from 'lucide-react';
import shoppingApi from '@/api/shopping';
import { useToast } from '@/components/Toast';

interface Category {
  id: string;
  name: string;
  icon: string;
}

interface Order {
  id: string;
  description: string;
  budget: number;
  serviceFee: number;
  totalAmount: number;
  status: string;
  createdAt: string;
  completedAt?: string;
  adminNote?: string;
}

export default function ShoppingPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [activeTab, setActiveTab] = useState<'create' | 'orders'>('create');
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);

  useEffect(() => {
    loadInfo();
    if (isLoggedIn) loadOrders();
  }, [isLoggedIn]);

  const loadInfo = async () => {
    try {
      const res = await shoppingApi.getShoppingInfo();
      setCategories(res.data.categories);
    } catch (error) {
      console.error('Failed to load info:', error);
    }
  };

  const loadOrders = async () => {
    setIsLoadingOrders(true);
    try {
      const res = await shoppingApi.getShoppingOrders();
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

    if (!description) {
      showToast('error', '请填写代购需求');
      return;
    }

    if (!budget || parseFloat(budget) < 10) {
      showToast('error', '预算至少10元');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await shoppingApi.createShoppingOrder({
        description,
        budget: parseFloat(budget),
        category: selectedCategory
      });

      if (res.success) {
        showToast('success', '代购订单已创建，等待接单');
        setDescription('');
        setBudget('');
        setSelectedCategory('');
        setActiveTab('orders');
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
      pending: { bg: 'bg-yellow-100 text-yellow-700', text: '待接单', icon: <Clock className="w-4 h-4" /> },
      processing: { bg: 'bg-blue-100 text-blue-700', text: '进行中', icon: <RefreshCw className="w-4 h-4 animate-spin" /> },
      completed: { bg: 'bg-green-100 text-green-700', text: '已完成', icon: <CheckCircle className="w-4 h-4" /> },
      cancelled: { bg: 'bg-gray-100 text-gray-600', text: '已取消', icon: <XCircle className="w-4 h-4" /> }
    };
    const { bg, text, icon } = config[status] || config.pending;
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${bg}`}>
        {icon} {text}
      </span>
    );
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

  const serviceFee = budget ? Math.round(parseFloat(budget) * 0.05 * 100) / 100 : 0;

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-medium text-gray-700 mb-2">请先登录</h2>
          <p className="text-gray-500 mb-4">登录后即可使用代购服务</p>
          <button onClick={() => navigate('/login')} className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700">
            去登录
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white">
        <div className="max-w-3xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/profile')} className="p-1">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-semibold">代购服务</h1>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 flex">
          <button
            onClick={() => setActiveTab('create')}
            className={`flex-1 py-3 text-center font-medium border-b-2 ${
              activeTab === 'create' ? 'border-green-600 text-green-600' : 'border-transparent text-gray-500'
            }`}
          >
            <Plus className="w-5 h-5 mx-auto mb-1" />
            发起代购
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex-1 py-3 text-center font-medium border-b-2 ${
              activeTab === 'orders' ? 'border-green-600 text-green-600' : 'border-transparent text-gray-500'
            }`}
          >
            <Package className="w-5 h-5 mx-auto mb-1" />
            我的订单
          </button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6">
        {activeTab === 'create' ? (
          <div className="space-y-6">
            {/* Info Card */}
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-green-800">
                  <p className="font-medium mb-1">代购说明</p>
                  <ul className="space-y-1 text-green-700">
                    <li>填写您需要购买的商品信息和预算</li>
                    <li>服务费为预算的5%</li>
                    <li>代购员接单后会与您联系确认</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 space-y-6">
              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">选择类别</label>
                <div className="flex flex-wrap gap-2">
                  {categories.map(cat => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`px-4 py-2 rounded-lg border transition-colors ${
                        selectedCategory === cat.id
                          ? 'bg-green-600 text-white border-green-600'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-green-400'
                      }`}
                    >
                      <span className="mr-1">{cat.icon}</span>
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">代购需求</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="请详细描述需要购买的商品，如：商品名称、品牌、规格、数量、购买地点等"
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                />
              </div>

              {/* Budget */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">预算金额</label>
                <div className="relative">
                  <input
                    type="number"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    placeholder="请输入预算金额"
                    min="10"
                    className="w-full px-4 py-3 pr-16 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">元</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">最低预算10元</p>
              </div>

              {/* Fee Summary */}
              {budget && parseFloat(budget) >= 10 && (
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">预算金额</span>
                    <span className="font-medium">¥{parseFloat(budget).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">服务费 (5%)</span>
                    <span className="font-medium">¥{serviceFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-base font-medium border-t pt-2">
                    <span>应付总额</span>
                    <span className="text-green-600">¥{(parseFloat(budget) + serviceFee).toFixed(2)}</span>
                  </div>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting || !description || !budget}
                className={`w-full py-4 rounded-xl font-medium text-lg transition-colors ${
                  isSubmitting || !description || !budget
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    提交中...
                  </span>
                ) : (
                  '发布代购需求'
                )}
              </button>
            </form>
          </div>
        ) : (
          <div className="space-y-4">
            {isLoadingOrders ? (
              <div className="text-center py-12">
                <RefreshCw className="w-8 h-8 mx-auto text-gray-400 animate-spin" />
                <p className="text-gray-500 mt-2">加载中...</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl">
                <Package className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                <p className="text-gray-500">暂无代购订单</p>
                <button onClick={() => setActiveTab('create')} className="mt-4 text-green-600 hover:underline">
                  发起代购
                </button>
              </div>
            ) : (
              orders.map(order => (
                <div key={order.id} className="bg-white rounded-xl shadow-sm p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-medium text-gray-900 line-clamp-2">{order.description}</p>
                      <p className="text-sm text-gray-500 mt-1">预算: ¥{order.budget.toFixed(2)}</p>
                    </div>
                    {getStatusBadge(order.status)}
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">{formatDate(order.createdAt)}</span>
                    <span className="text-green-600 font-medium">¥{order.totalAmount.toFixed(2)}</span>
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
