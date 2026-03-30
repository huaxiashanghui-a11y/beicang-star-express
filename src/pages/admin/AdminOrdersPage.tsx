import React, { useState, useEffect, useCallback } from 'react';
import { Search, Eye, CheckCircle, XCircle, Truck, Clock, X, Check, AlertCircle, Download, Loader2 } from 'lucide-react';
import { Button } from '../../components/ui/button';
import Modal, { ConfirmDialog } from '../../components/ui/Modal';
import adminApi from '../../config/adminApi';
import { useToast } from '../../components/Toast';

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

const statusConfig = {
  '待支付': { color: 'bg-orange-100 text-orange-700', icon: Clock, nextAction: null },
  '处理中': { color: 'bg-blue-100 text-blue-700', icon: Clock, nextAction: { label: '发货', color: 'bg-purple-500 hover:bg-purple-600' } },
  '已发货': { color: 'bg-purple-100 text-purple-700', icon: Truck, nextAction: { label: '完成', color: 'bg-green-500 hover:bg-green-600' } },
  '已完成': { color: 'bg-green-100 text-green-700', icon: CheckCircle, nextAction: null },
  '已取消': { color: 'bg-red-100 text-red-700', icon: XCircle, nextAction: null },
};

export default function AdminOrdersPage() {
  const { showToast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('全部');
  const [loading, setLoading] = useState(true);

  // Modal states
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [trackingInput, setTrackingInput] = useState('');

  // Loading states for buttons
  const [shippingOrder, setShippingOrder] = useState(false);
  const [completingOrder, setCompletingOrder] = useState<string | null>(null);
  const [cancellingOrder, setCancellingOrder] = useState(false);

  const loadOrders = useCallback(async () => {
    try {
      setLoading(true);
      const data = await adminApi.orders.list();
      let ordersArray: any[] = [];

      if (data.orders) {
        ordersArray = data.orders;
      } else if (Array.isArray(data)) {
        ordersArray = data;
      }

      // 转换后端数据格式
      const mappedOrders: Order[] = ordersArray.map((o: any) => ({
        id: o.id,
        user: o.userName || o.user_name || o.user?.name || '用户',
        phone: o.phone || o.user?.phone || '',
        items: Array.isArray(o.items) ? o.items : (o.products || []),
        total: Math.round((o.total || o.totalAmount || 0) / 100),
        status: o.status === 'pending' ? '待支付' :
                o.status === 'processing' ? '处理中' :
                o.status === 'shipped' ? '已发货' :
                o.status === 'completed' ? '已完成' :
                o.status === 'cancelled' ? '已取消' : '处理中',
        payment: o.paymentMethod || o.payment || '在线支付',
        address: o.shippingAddress || o.address || '暂无地址',
        date: o.createdAt || o.created_at || new Date().toISOString(),
        trackingNumber: o.trackingNumber || o.tracking_number,
      }));

      setOrders(mappedOrders);
    } catch (error: any) {
      console.error('Failed to load orders:', error);
      showToast(error.message || '加载订单失败', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

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

  const confirmShip = async () => {
    if (!trackingInput.trim()) {
      showToast('请输入快递单号', 'error');
      return;
    }

    if (!selectedOrder) return;

    try {
      setShippingOrder(true);
      // 将状态转换为后端格式
      const backendStatus = 'shipped';
      await adminApi.orders.updateStatus(selectedOrder.id, backendStatus, `快递单号: ${trackingInput}`);

      setOrders(orders.map(o =>
        o.id === selectedOrder.id ? { ...o, status: '已发货', trackingNumber: trackingInput } : o
      ));
      showToast('订单已发货', 'success');
      setShowDetailModal(false);
    } catch (error: any) {
      console.error('Failed to ship order:', error);
      showToast(error.message || '发货失败，请重试', 'error');
    } finally {
      setShippingOrder(false);
    }
  };

  const handleComplete = async (order: Order) => {
    try {
      setCompletingOrder(order.id);
      const backendStatus = 'completed';
      await adminApi.orders.updateStatus(order.id, backendStatus, '');

      setOrders(orders.map(o =>
        o.id === order.id ? { ...o, status: '已完成' } : o
      ));
      showToast('订单已完成', 'success');
    } catch (error: any) {
      console.error('Failed to complete order:', error);
      showToast(error.message || '操作失败，请重试', 'error');
    } finally {
      setCompletingOrder(null);
    }
  };

  const handleCancel = (order: Order) => {
    setSelectedOrder(order);
    setShowCancelConfirm(true);
  };

  const confirmCancel = async () => {
    if (!selectedOrder) return;

    try {
      setCancellingOrder(true);
      const backendStatus = 'cancelled';
      await adminApi.orders.updateStatus(selectedOrder.id, backendStatus, '管理员取消');

      setOrders(orders.map(o =>
        o.id === selectedOrder.id ? { ...o, status: '已取消' } : o
      ));
      showToast('订单已取消', 'success');
    } catch (error: any) {
      console.error('Failed to cancel order:', error);
      showToast(error.message || '取消失败，请重试', 'error');
    } finally {
      setCancellingOrder(false);
      setShowCancelConfirm(false);
      setSelectedOrder(null);
    }
  };

  const handleExport = async () => {
    try {
      showToast('正在导出数据...', 'info');
      // 模拟导出
      setTimeout(() => {
        showToast('数据导出成功', 'success');
      }, 1500);
    } catch (error) {
      showToast('导出失败，请重试', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">订单管理</h2>
          <p className="text-gray-500 text-sm mt-1">查看和处理所有订单</p>
        </div>
        <Button
          variant="outline"
          className="border-red-300 text-red-600 hover:bg-red-50"
          onClick={handleExport}
        >
          <Download className="w-4 h-4 mr-2" />
          导出数据
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {Object.entries(statusCounts).map(([status, count]) => (
          <div
            key={status}
            className={`bg-white rounded-xl shadow-sm p-4 cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all ${
              selectedStatus === status ? 'ring-2 ring-orange-500' : ''
            }`}
            onClick={() => setSelectedStatus(selectedStatus === status ? '全部' : status)}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">{status}</span>
              <div className={`w-3 h-3 rounded-full ${statusConfig[status as keyof typeof statusConfig].color.split(' ')[0]}`}></div>
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
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
            />
          </div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
          >
            <option value="全部">全部状态</option>
            <option value="待支付">待支付</option>
            <option value="处理中">处理中</option>
            <option value="已发货">已发货</option>
            <option value="已完成">已完成</option>
            <option value="已取消">已取消</option>
          </select>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {loading ? (
          // Loading skeleton
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
              <div className="flex justify-between items-start mb-4 pb-4 border-b">
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-24" />
                  <div className="h-3 bg-gray-100 rounded w-32" />
                </div>
                <div className="h-6 bg-gray-200 rounded-full w-16" />
              </div>
              <div className="space-y-2 mb-4">
                <div className="h-4 bg-gray-100 rounded w-48" />
                <div className="h-4 bg-gray-100 rounded w-36" />
              </div>
              <div className="flex gap-2">
                <div className="h-8 bg-gray-100 rounded w-16" />
                <div className="h-8 bg-gray-100 rounded w-16" />
              </div>
            </div>
          ))
        ) : filteredOrders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center text-gray-500">
            暂无订单
          </div>
        ) : (
          filteredOrders.map((order) => {
            const config = statusConfig[order.status];
            const StatusIcon = config.icon;
            return (
              <div key={order.id} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all">
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
                      <p className="text-sm font-mono text-gray-800">{order.id.slice(0, 12)}...</p>
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
                  {order.items.slice(0, 3).map((item, index) => (
                    <div key={index} className="flex justify-between items-center text-sm">
                      <div>
                        <span className="text-gray-800">{item.name}</span>
                        <span className="text-gray-400 ml-2">x{item.quantity}</span>
                      </div>
                      <span className="text-gray-600">¥{item.price}</span>
                    </div>
                  ))}
                  {order.items.length > 3 && (
                    <p className="text-xs text-gray-400">还有 {order.items.length - 3} 件商品...</p>
                  )}
                </div>

                {/* Order Footer */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-4 border-t border-gray-200">
                  <div className="text-sm text-gray-600">
                    <span className="mr-4">支付: {order.payment}</span>
                    <span>地址: {order.address.slice(0, 15)}...</span>
                    {order.trackingNumber && (
                      <span className="ml-4 text-purple-600">快递: {order.trackingNumber}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-sm text-gray-600">订单总额</p>
                      <p className="text-xl font-bold text-orange-600">¥{order.total}</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => handleViewDetail(order)} className="hover:-translate-y-0.5">
                      <Eye className="w-4 h-4 mr-2" />
                      详情
                    </Button>
                    {config.nextAction && (
                      <Button
                        size="sm"
                        className={config.nextAction.color}
                        disabled={completingOrder === order.id}
                        onClick={() => {
                          if (order.status === '处理中') handleShip(order);
                          else if (order.status === '已发货') handleComplete(order);
                        }}
                      >
                        {completingOrder === order.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            {order.status === '处理中' && <Truck className="w-4 h-4 mr-2" />}
                            {order.status === '已发货' && <Check className="w-4 h-4 mr-2" />}
                            {config.nextAction.label}
                          </>
                        )}
                      </Button>
                    )}
                    {(order.status === '待支付' || order.status === '处理中') && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-red-300 text-red-600 hover:bg-red-50 hover:-translate-y-0.5"
                        onClick={() => handleCancel(order)}
                      >
                        取消
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Order Detail Modal */}
      <Modal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        title="订单详情"
        size="md"
      >
        {selectedOrder && (
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
                <p className="text-sm text-gray-500 mb-2">快递单号 *</p>
                <input
                  type="text"
                  value={trackingInput}
                  onChange={(e) => setTrackingInput(e.target.value)}
                  placeholder="请输入快递单号"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                />
              </div>
            )}
            {selectedOrder.trackingNumber && (
              <div>
                <p className="text-sm text-gray-500">快递单号</p>
                <p className="font-medium text-purple-600">{selectedOrder.trackingNumber}</p>
              </div>
            )}
            <div className="flex gap-3 pt-4 border-t">
              <Button variant="outline" className="flex-1" onClick={() => setShowDetailModal(false)}>
                关闭
              </Button>
              {selectedOrder.status === '处理中' && (
                <Button
                  className="flex-1 bg-purple-500 hover:bg-purple-600"
                  onClick={confirmShip}
                  loading={shippingOrder}
                  loadingText="发货中..."
                >
                  <Truck className="w-4 h-4 mr-2" />
                  确认发货
                </Button>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* Cancel Confirmation */}
      <ConfirmDialog
        isOpen={showCancelConfirm}
        onClose={() => setShowCancelConfirm(false)}
        onConfirm={confirmCancel}
        title="确认取消订单"
        message={`确定要取消订单"${selectedOrder?.id}"吗？此操作不可撤销。`}
        confirmText="确认取消"
        cancelText="返回"
        variant="danger"
        loading={cancellingOrder}
      />
    </div>
  );
}
