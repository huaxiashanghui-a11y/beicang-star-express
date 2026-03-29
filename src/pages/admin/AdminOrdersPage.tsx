import React, { useState } from 'react';
import { Search, Eye, CheckCircle, XCircle, Truck, Clock, Filter, X, Check, AlertCircle } from 'lucide-react';
import { Button } from '../../components/ui/button';

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  user: string;
  phone: string;
  items: OrderItem[];
  total: number;
  status: '待支付' | '处理中' | '已发货' | '已完成' | '已取消';
  payment: string;
  address: string;
  date: string;
  trackingNumber?: string;
}

const initialOrders: Order[] = [
  {
    id: 'ORD-2024-001',
    user: '张伟',
    phone: '+95 9 123 4567',
    items: [
      { name: 'iPhone 15 Pro Max', quantity: 1, price: 9999 },
      { name: 'AirPods Pro 2', quantity: 1, price: 1899 },
    ],
    total: 11898,
    status: '已完成',
    payment: '微信支付',
    address: '仰光市 敏格拉区 123号',
    date: '2024-03-20 14:30',
    trackingNumber: 'YD1234567890',
  },
  {
    id: 'ORD-2024-002',
    user: '李娜',
    phone: '+95 9 987 6543',
    items: [
      { name: 'MacBook Pro 14', quantity: 1, price: 14999 },
    ],
    total: 14999,
    status: '处理中',
    payment: '支付宝',
    address: '曼德勒市 中央区域 456号',
    date: '2024-03-20 13:20',
  },
  {
    id: 'ORD-2024-003',
    user: '王强',
    phone: '+95 9 555 1234',
    items: [
      { name: 'Nike Air Jordan 1', quantity: 2, price: 1599 },
    ],
    total: 3198,
    status: '已发货',
    payment: '银行卡',
    address: '内比都市 政府区 789号',
    date: '2024-03-20 11:45',
    trackingNumber: 'SF9876543210',
  },
  {
    id: 'ORD-2024-004',
    user: '赵敏',
    phone: '+95 9 888 9999',
    items: [
      { name: 'SK-II 护肤套装', quantity: 1, price: 2280 },
    ],
    total: 2280,
    status: '待支付',
    payment: 'PayPal',
    address: '仰光市 莱达雅区 321号',
    date: '2024-03-20 10:15',
  },
  {
    id: 'ORD-2024-005',
    user: '陈刚',
    phone: '+95 9 222 3333',
    items: [
      { name: 'iPad Pro 12.9', quantity: 1, price: 8999 },
      { name: 'Apple Pencil', quantity: 1, price: 999 },
    ],
    total: 9998,
    status: '已完成',
    payment: 'Visa',
    address: '勃固市 商业区 654号',
    date: '2024-03-20 09:30',
  },
];

const statusConfig = {
  '待支付': { color: 'bg-orange-100 text-orange-700', icon: Clock, nextAction: null },
  '处理中': { color: 'bg-blue-100 text-blue-700', icon: Clock, nextAction: { label: '发货', color: 'bg-purple-500' } },
  '已发货': { color: 'bg-purple-100 text-purple-700', icon: Truck, nextAction: { label: '完成', color: 'bg-green-500' } },
  '已完成': { color: 'bg-green-100 text-green-700', icon: CheckCircle, nextAction: null },
  '已取消': { color: 'bg-red-100 text-red-700', icon: XCircle, nextAction: null },
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('全部');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [trackingInput, setTrackingInput] = useState('');
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({ show: false, message: '', type: 'success' });

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          order.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          order.phone.includes(searchTerm);
    const matchesStatus = selectedStatus === '全部' || order.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const statusCounts = {
    '待支付': orders.filter(o => o.status === '待支付').length,
    '处理中': orders.filter(o => o.status === '处理中').length,
    '已发货': orders.filter(o => o.status === '已发货').length,
    '已完成': orders.filter(o => o.status === '已完成').length,
    '已取消': orders.filter(o => o.status === '已取消').length,
  };

  const handleViewDetail = (order: Order) => {
    setSelectedOrder(order);
    setTrackingInput(order.trackingNumber || '');
    setShowDetailModal(true);
  };

  const handleShip = (order: Order) => {
    setSelectedOrder(order);
    setShowDetailModal(true);
  };

  const confirmShip = () => {
    if (!trackingInput.trim()) {
      showToast('请输入快递单号', 'error');
      return;
    }
    if (selectedOrder) {
      setOrders(orders.map(o =>
        o.id === selectedOrder.id ? { ...o, status: '已发货', trackingNumber: trackingInput } : o
      ));
      showToast('订单已发货', 'success');
      setShowDetailModal(false);
    }
  };

  const handleComplete = (order: Order) => {
    setOrders(orders.map(o =>
      o.id === order.id ? { ...o, status: '已完成' } : o
    ));
    showToast('订单已完成', 'success');
  };

  const handleCancel = (order: Order) => {
    setSelectedOrder(order);
    setShowCancelConfirm(true);
  };

  const confirmCancel = () => {
    if (selectedOrder) {
      setOrders(orders.map(o =>
        o.id === selectedOrder.id ? { ...o, status: '已取消' } : o
      ));
      showToast('订单已取消', 'success');
      setShowCancelConfirm(false);
      setSelectedOrder(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast.show && (
        <div className={`fixed top-20 right-4 z-50 px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 animate-slide-in-down ${
          toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`}>
          {toast.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">订单管理</h2>
          <p className="text-gray-500 text-sm mt-1">查看和处理所有订单</p>
        </div>
        <Button variant="outline" className="border-red-300 text-red-600 hover:bg-red-50">
          导出数据
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {Object.entries(statusCounts).map(([status, count]) => (
          <div
            key={status}
            className={`bg-white rounded-xl shadow-sm p-4 cursor-pointer hover:shadow-md transition-shadow ${
              selectedStatus === status ? 'ring-2 ring-orange-500' : ''
            }`}
            onClick={() => setSelectedStatus(selectedStatus === status ? '全部' : status)}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">{status}</span>
              <div className={`w-3 h-3 rounded-full ${statusConfig[status as keyof typeof statusConfig].color.replace('bg-', 'bg-').split(' ')[0]}`}></div>
            </div>
            <p className="text-2xl font-bold text-gray-800">{count}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="搜索订单号、用户名或手机号..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="全部">全部</option>
              <option value="待支付">待支付</option>
              <option value="处理中">处理中</option>
              <option value="已发货">已发货</option>
              <option value="已完成">已完成</option>
              <option value="已取消">已取消</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center text-gray-500">
            暂无订单
          </div>
        ) : filteredOrders.map((order) => {
          const config = statusConfig[order.status];
          const StatusIcon = config.icon;
          return (
            <div key={order.id} className="bg-white rounded-xl shadow-sm p-6">
              {/* Order Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 pb-4 border-b border-gray-200">
                <div className="flex items-center gap-4">
                  <div>
                    <p className="font-semibold text-gray-800">{order.user}</p>
                    <p className="text-sm text-gray-500">{order.phone}</p>
                  </div>
                  <div className="h-8 w-px bg-gray-300 hidden sm:block"></div>
                  <div>
                    <p className="text-sm text-gray-600">订单号</p>
                    <p className="text-sm font-mono text-gray-800">{order.id}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 text-xs font-medium rounded-full flex items-center gap-1 ${config.color}`}>
                    <StatusIcon className="w-3 h-3" />
                    {order.status}
                  </span>
                  <span className="text-sm text-gray-500">{order.date}</span>
                </div>
              </div>

              {/* Order Items */}
              <div className="space-y-2 mb-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center text-sm">
                    <div>
                      <span className="text-gray-800">{item.name}</span>
                      <span className="text-gray-400 ml-2">x{item.quantity}</span>
                    </div>
                    <span className="text-gray-600">¥{item.price}</span>
                  </div>
                ))}
              </div>

              {/* Order Footer */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-4 border-t border-gray-200">
                <div className="text-sm text-gray-600">
                  <span className="mr-4">支付方式: {order.payment}</span>
                  <span>地址: {order.address}</span>
                  {order.trackingNumber && (
                    <span className="ml-4 text-purple-600">快递: {order.trackingNumber}</span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm text-gray-600">订单总额</p>
                    <p className="text-xl font-bold text-orange-600">¥{order.total}</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => handleViewDetail(order)}>
                    <Eye className="w-4 h-4 mr-2" />
                    详情
                  </Button>
                  {config.nextAction && (
                    <Button
                      size="sm"
                      className={config.nextAction.color}
                      onClick={() => {
                        if (order.status === '处理中') handleShip(order);
                        else if (order.status === '已发货') handleComplete(order);
                      }}
                    >
                      {order.status === '处理中' && <Truck className="w-4 h-4 mr-2" />}
                      {order.status === '已发货' && <Check className="w-4 h-4 mr-2" />}
                      {config.nextAction.label}
                    </Button>
                  )}
                  {(order.status === '待支付' || order.status === '处理中') && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-red-300 text-red-600 hover:bg-red-50"
                      onClick={() => handleCancel(order)}
                    >
                      取消
                    </Button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Order Detail Modal */}
      {showDetailModal && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowDetailModal(false)} />
          <div className="relative bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-bold">订单详情</h3>
              <button onClick={() => setShowDetailModal(false)} className="p-2 hover:bg-gray-100 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto max-h-[calc(90vh-140px)]">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">订单号</p>
                    <p className="font-mono font-medium">{selectedOrder.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">订单状态</p>
                    <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${
                      statusConfig[selectedOrder.status].color
                    }`}>
                      {selectedOrder.status}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">用户信息</p>
                  <p className="font-medium">{selectedOrder.user} | {selectedOrder.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">收货地址</p>
                  <p className="font-medium">{selectedOrder.address}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">支付方式</p>
                  <p className="font-medium">{selectedOrder.payment}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-2">商品清单</p>
                  <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                    {selectedOrder.items.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>{item.name} x{item.quantity}</span>
                        <span>¥{item.price}</span>
                      </div>
                    ))}
                    <div className="flex justify-between font-bold pt-2 border-t">
                      <span>总计</span>
                      <span className="text-orange-600">¥{selectedOrder.total}</span>
                    </div>
                  </div>
                </div>
                {selectedOrder.status === '处理中' && (
                  <div>
                    <p className="text-sm text-gray-500 mb-2">快递单号</p>
                    <input
                      type="text"
                      value={trackingInput}
                      onChange={(e) => setTrackingInput(e.target.value)}
                      placeholder="请输入快递单号"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                )}
                {selectedOrder.trackingNumber && (
                  <div>
                    <p className="text-sm text-gray-500">快递单号</p>
                    <p className="font-medium text-purple-600">{selectedOrder.trackingNumber}</p>
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-3 p-4 border-t">
              <Button variant="outline" className="flex-1" onClick={() => setShowDetailModal(false)}>
                关闭
              </Button>
              {selectedOrder.status === '处理中' && (
                <Button className="flex-1 bg-purple-500 hover:bg-purple-600" onClick={confirmShip}>
                  <Truck className="w-4 h-4 mr-2" />
                  确认发货
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Cancel Confirmation */}
      {showCancelConfirm && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowCancelConfirm(false)} />
          <div className="relative bg-white rounded-2xl w-full max-w-sm">
            <div className="p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-lg font-bold mb-2">确认取消订单</h3>
              <p className="text-gray-500 mb-4">
                确定要取消订单 <span className="font-medium text-gray-800">{selectedOrder.id}</span> 吗？
              </p>
            </div>
            <div className="flex gap-3 p-4 border-t">
              <Button variant="outline" className="flex-1" onClick={() => setShowCancelConfirm(false)}>
                取消
              </Button>
              <Button className="flex-1 bg-red-500 hover:bg-red-600" onClick={confirmCancel}>
                确认取消
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
