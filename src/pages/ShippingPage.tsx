import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Truck, ArrowLeft, Clock, CheckCircle, XCircle, AlertCircle,
  RefreshCw, Package, MapPin, Globe
} from 'lucide-react';
import shippingApi from '@/api/shipping';
import { useToast } from '@/components/Toast';

interface Service {
  id: string;
  name: string;
  description: string;
  baseFee: number;
}

interface Order {
  id: string;
  type: string;
  sender: any;
  receiver: any;
  shippingFee: number;
  serviceFee: number;
  totalAmount: number;
  status: string;
  trackingNumber: string;
  createdAt: string;
  adminNote?: string;
}

export default function ShippingPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [activeTab, setActiveTab] = useState<'create' | 'orders'>('create');
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState('');
  const [senderName, setSenderName] = useState('');
  const [senderPhone, setSenderPhone] = useState('');
  const [senderAddress, setSenderAddress] = useState('');
  const [receiverName, setReceiverName] = useState('');
  const [receiverPhone, setReceiverPhone] = useState('');
  const [receiverAddress, setReceiverAddress] = useState('');
  const [weight, setWeight] = useState('1');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [calculatedFee, setCalculatedFee] = useState<any>(null);

  useEffect(() => {
    loadInfo();
    if (isLoggedIn) loadOrders();
  }, [isLoggedIn]);

  useEffect(() => {
    if (selectedService && weight) {
      calculateFee();
    }
  }, [selectedService, weight]);

  const loadInfo = async () => {
    try {
      const res = await shippingApi.getShippingInfo();
      setServices(res.data.services);
    } catch (error) {
      console.error('Failed to load info:', error);
    }
  };

  const loadOrders = async () => {
    setIsLoadingOrders(true);
    try {
      const res = await shippingApi.getShippingOrders();
      setOrders(res.orders);
    } catch (error) {
      console.error('Failed to load orders:', error);
    } finally {
      setIsLoadingOrders(false);
    }
  };

  const calculateFee = async () => {
    try {
      const res = await shippingApi.calculateShipping({
        type: selectedService,
        weight: parseFloat(weight)
      });
      setCalculatedFee(res.data);
    } catch (error) {
      console.error('Failed to calculate fee:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn) {
      showToast('error', '请先登录');
      navigate('/login');
      return;
    }

    if (!selectedService) {
      showToast('error', '请选择物流服务');
      return;
    }

    if (!senderName || !senderPhone || !senderAddress) {
      showToast('error', '请填写完整发货信息');
      return;
    }

    if (!receiverName || !receiverPhone || !receiverAddress) {
      showToast('error', '请填写完整收货信息');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await shippingApi.createShippingOrder({
        type: selectedService,
        sender: { name: senderName, phone: senderPhone, address: senderAddress },
        receiver: { name: receiverName, phone: receiverPhone, address: receiverAddress },
        weight: parseFloat(weight)
      });

      if (res.success) {
        showToast('success', '物流订单已创建');
        resetForm();
        setActiveTab('orders');
        loadOrders();
      }
    } catch (error: any) {
      showToast('error', error.response?.data?.error || '提交失败');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setSenderName('');
    setSenderPhone('');
    setSenderAddress('');
    setReceiverName('');
    setReceiverPhone('');
    setReceiverAddress('');
    setWeight('1');
    setCalculatedFee(null);
  };

  const getStatusBadge = (status: string) => {
    const config: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
      pending: { bg: 'bg-yellow-100 text-yellow-700', text: '待取件', icon: <Clock className="w-4 h-4" /> },
      picked_up: { bg: 'bg-blue-100 text-blue-700', text: '已取件', icon: <Package className="w-4 h-4" /> },
      in_transit: { bg: 'bg-purple-100 text-purple-700', text: '运输中', icon: <Truck className="w-4 h-4" /> },
      delivered: { bg: 'bg-green-100 text-green-700', text: '已送达', icon: <CheckCircle className="w-4 h-4" /> },
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

  const getServiceName = (id: string) => {
    return services.find(s => s.id === id)?.name || id;
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Truck className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-medium text-gray-700 mb-2">请先登录</h2>
          <p className="text-gray-500 mb-4">登录后即可使用物流服务</p>
          <button onClick={() => navigate('/login')} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
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
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-semibold">物流服务</h1>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 flex">
          <button
            onClick={() => setActiveTab('create')}
            className={`flex-1 py-3 text-center font-medium border-b-2 ${
              activeTab === 'create' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500'
            }`}
          >
            <Truck className="w-5 h-5 mx-auto mb-1" />
            下单寄件
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex-1 py-3 text-center font-medium border-b-2 ${
              activeTab === 'orders' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500'
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
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">物流说明</p>
                  <ul className="space-y-1 text-blue-700">
                    <li>支持国内、国际快递服务</li>
                    <li>服务费为运费的3%</li>
                    <li>可实时追踪物流进度</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 space-y-6">
              {/* Service Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">选择服务类型</label>
                <div className="grid grid-cols-3 gap-3">
                  {services.map(service => (
                    <button
                      key={service.id}
                      type="button"
                      onClick={() => setSelectedService(service.id)}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        selectedService === service.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <p className="font-medium text-gray-900">{service.name}</p>
                      <p className="text-xs text-gray-500 mt-1">{service.description}</p>
                      <p className="text-sm text-blue-600 mt-2">起步价 ¥{service.baseFee}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Weight */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">包裹重量</label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    min="0.1"
                    step="0.1"
                    className="w-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-gray-500">公斤 (kg)</span>
                </div>
              </div>

              {/* Sender Info */}
              <div className="border-t pt-6">
                <h3 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-red-500" />
                  发货人信息
                </h3>
                <div className="space-y-3">
                  <input
                    type="text"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    placeholder="发货人姓名"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="tel"
                    value={senderPhone}
                    onChange={(e) => setSenderPhone(e.target.value)}
                    placeholder="发货人电话"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    value={senderAddress}
                    onChange={(e) => setSenderAddress(e.target.value)}
                    placeholder="发货人地址"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Receiver Info */}
              <div className="border-t pt-6">
                <h3 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-green-500" />
                  收货人信息
                </h3>
                <div className="space-y-3">
                  <input
                    type="text"
                    value={receiverName}
                    onChange={(e) => setReceiverName(e.target.value)}
                    placeholder="收货人姓名"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="tel"
                    value={receiverPhone}
                    onChange={(e) => setReceiverPhone(e.target.value)}
                    placeholder="收货人电话"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    value={receiverAddress}
                    onChange={(e) => setReceiverAddress(e.target.value)}
                    placeholder="收货人地址"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Fee Summary */}
              {calculatedFee && (
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">运费</span>
                    <span className="font-medium">¥{calculatedFee.shippingFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">服务费 (3%)</span>
                    <span className="font-medium">¥{calculatedFee.serviceFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">预计时效</span>
                    <span className="font-medium">{calculatedFee.estimatedDays}天</span>
                  </div>
                  <div className="flex justify-between text-base font-medium border-t pt-2">
                    <span>应付总额</span>
                    <span className="text-blue-600">¥{calculatedFee.totalFee.toFixed(2)}</span>
                  </div>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting || !selectedService}
                className={`w-full py-4 rounded-xl font-medium text-lg transition-colors ${
                  isSubmitting || !selectedService
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
                  '提交物流订单'
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
                <p className="text-gray-500">暂无物流订单</p>
                <button onClick={() => setActiveTab('create')} className="mt-4 text-blue-600 hover:underline">
                  去下单
                </button>
              </div>
            ) : (
              orders.map(order => (
                <div key={order.id} className="bg-white rounded-xl shadow-sm p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-medium text-gray-900">{getServiceName(order.type)}</p>
                      <p className="text-sm text-gray-500 mt-1">运单号: {order.trackingNumber}</p>
                    </div>
                    {getStatusBadge(order.status)}
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 text-sm space-y-2">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-red-500 mt-0.5" />
                      <div>
                        <p className="text-gray-500">发货人</p>
                        <p className="font-medium">{order.sender?.name}</p>
                        <p className="text-gray-600">{order.sender?.address}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Globe className="w-4 h-4 text-green-500 mt-0.5" />
                      <div>
                        <p className="text-gray-500">收货人</p>
                        <p className="font-medium">{order.receiver?.name}</p>
                        <p className="text-gray-600">{order.receiver?.address}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-3 pt-3 border-t">
                    <span className="text-gray-400 text-sm">{formatDate(order.createdAt)}</span>
                    <span className="text-blue-600 font-medium">¥{order.totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
