import React, { useState } from 'react';
import { Search, Eye, CheckCircle, Truck, Clock, XCircle, Download, Edit } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { ConfirmDialog } from '../../components/ui/Modal';
import { useToast } from '@/components/Toast';

interface Order {
  id: string;
  userId: string;
  user: string;
  phone: string;
  total: number;
  status: '待支付' | '处理中' | '已发货' | '已完成' | '已取消';
  payment: string;
  items: number;
  date: string;
  address: string;
}

export default function AdminOrdersPage() {
  const { showToast } = useToast();
  const [orders, setOrders] = useState<Order[]>([
    { id: 'ORD20240315001', userId: 'U001', user: '张三', phone: '138****1234', total: 3280, status: '已完成', payment: '微信支付', items: 3, date: '2024-03-15 14:30', address: '北京市朝阳区xxx' },
    { id: 'ORD20240315002', userId: 'U002', user: '李四', phone: '139****5678', total: 1560, status: '处理中', payment: '支付宝', items: 2, date: '2024-03-15 15:20', address: '上海市浦东新区xxx' },
    { id: 'ORD20240315003', userId: 'U003', user: '王五', phone: '137****9012', total: 890, status: '待支付', payment: '微信支付', items: 1, date: '2024-03-15 16:45', address: '广州市天河区xxx' },
    { id: 'ORD20240315004', userId: 'U004', user: '赵六', phone: '136****3456', total: 4580, status: '已发货', payment: 'Visa', items: 4, date: '2024-03-15 18:10', address: '深圳市南山区xxx' },
    { id: 'ORD20240315005', userId: 'U005', user: '钱七', phone: '135****7890', total: 1299, status: '处理中', payment: '微信支付', items: 2, date: '2024-03-16 09:30', address: '杭州市西湖区xxx' },
    { id: 'ORD20240315006', userId: 'U001', user: '张三', phone: '138****1234', total: 560, status: '已取消', payment: '支付宝', items: 1, date: '2024-03-14 10:00', address: '北京市朝阳区xxx' },
  ]);

  const [searchKeyword, setSearchKeyword] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isActionDialogOpen, setIsActionDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<'confirm' | 'cancel' | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);

  const stats = {
    pending: 12,
    processing: 8,
    shipped: 5,
    completed: 156,
  };

  const getStatusStyle = (status: string) => {
    const styles: Record<string, string> = {
      '待支付': 'bg-orange-100 text-orange-700',
      '处理中': 'bg-blue-100 text-blue-700',
      '已发货': 'bg-purple-100 text-purple-700',
      '已完成': 'bg-green-100 text-green-700',
      '已取消': 'bg-gray-100 text-gray-700',
    };
    return styles[status] || 'bg-gray-100 text-gray-700';
  };

  const getStatusIcon = (status: string) => {
    const icons: Record<string, any> = {
      '待支付': Clock,
      '处理中': Clock,
      '已发货': Truck,
      '已完成': CheckCircle,
      '已取消': XCircle,
    };
    return icons[status] || Clock;
  };

  const handleExportOrders = async () => {
    setExportLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Filter data based on current filters
      let exportData = [...orders];
      if (searchKeyword) {
        exportData = exportData.filter(o =>
          o.id.includes(searchKeyword) ||
          o.user.includes(searchKeyword)
        );
      }
      if (filterStatus) {
        exportData = exportData.filter(o => o.status === filterStatus);
      }

      // Create CSV content
      const headers = ['订单号', '用户', '手机号', '金额', '支付方式', '状态', '商品数', '时间'];
      const csvContent = [
        headers.join(','),
        ...exportData.map(o => [
          o.id,
          o.user,
          o.phone,
          o.total,
          o.payment,
          o.status,
          o.items,
          o.date
        ].join(','))
      ].join('\n');

      // Download file
      const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `订单数据_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      showToast('success', `成功导出 ${exportData.length} 条订单数据`);
    } catch (error) {
      showToast('error', '导出失败，请重试');
    } finally {
      setExportLoading(false);
    }
  };

  const handleOrderAction = async () => {
    if (!selectedOrder || !actionType) return;

    setActionLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      if (actionType === 'confirm') {
        setOrders(prev => prev.map(o =>
          o.id === selectedOrder.id
            ? { ...o, status: '已完成' }
            : o
        ));
        showToast('success', '订单已确认完成');
      } else if (actionType === 'cancel') {
        setOrders(prev => prev.map(o =>
          o.id === selectedOrder.id
            ? { ...o, status: '已取消' }
            : o
        ));
        showToast('success', '订单已取消');
      }

      setIsActionDialogOpen(false);
    } catch (error) {
      showToast('error', '操作失败，请重试');
    } finally {
      setActionLoading(false);
    }
  };

  const openViewDialog = (order: Order) => {
    setSelectedOrder(order);
    setIsViewDialogOpen(true);
  };

  const openActionDialog = (order: Order, action: 'confirm' | 'cancel') => {
    setSelectedOrder(order);
    setActionType(action);
    setIsActionDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">订单管理</h2>
          <p className="text-gray-500 text-sm mt-1">查看和处理所有订单</p>
        </div>
        <Button
          variant="outline"
          onClick={handleExportOrders}
          loading={exportLoading}
          loadingText="导出中..."
          disabled={exportLoading}
        >
          <Download className="w-4 h-4 mr-2" />
          {exportLoading ? '导出中...' : '导出订单'}
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-orange-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.pending}</p>
              <p className="text-gray-500 text-sm">待支付</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Truck className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.processing}</p>
              <p className="text-gray-500 text-sm">处理中</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Truck className="w-6 h-6 text-purple-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.shipped}</p>
              <p className="text-gray-500 text-sm">已发货</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.completed}</p>
              <p className="text-gray-500 text-sm">已完成</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="搜索订单号或用户名..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary transition-all"
          >
            <option value="">全部状态</option>
            <option value="待支付">待支付</option>
            <option value="处理中">处理中</option>
            <option value="已发货">已发货</option>
            <option value="已完成">已完成</option>
            <option value="已取消">已取消</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">订单号</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">用户</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">金额</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">支付方式</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">状态</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">时间</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {orders.map((order) => {
              const StatusIcon = getStatusIcon(order.status);
              return (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-mono text-sm">{order.id}</td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium">{order.user}</p>
                      <p className="text-gray-500 text-sm">{order.phone}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-semibold text-orange-600">¥{order.total.toLocaleString()}</td>
                  <td className="px-6 py-4 text-gray-600">{order.payment}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(order.status)}`}>
                      <StatusIcon className="w-3 h-3" />
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600 text-sm">{order.date}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openViewDialog(order)}
                        className="hover:bg-blue-50 hover:text-blue-500"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      {order.status === '待支付' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openActionDialog(order, 'confirm')}
                          className="hover:bg-green-50 hover:text-green-500"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </Button>
                      )}
                      {(order.status === '待支付' || order.status === '处理中') && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openActionDialog(order, 'cancel')}
                          className="hover:bg-red-50 hover:text-red-500"
                        >
                          <XCircle className="w-4 h-4 text-red-500" />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* View Order Dialog */}
      {selectedOrder && isViewDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsViewDialogOpen(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg animate-scale-in">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold">订单详情</h3>
                <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusStyle(selectedOrder.status)}`}>
                  {selectedOrder.status}
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-500">订单号</span>
                  <span className="font-mono">{selectedOrder.id}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-500">用户</span>
                  <div className="text-right">
                    <p className="font-medium">{selectedOrder.user}</p>
                    <p className="text-sm text-gray-400">{selectedOrder.phone}</p>
                  </div>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-500">商品数量</span>
                  <span>{selectedOrder.items} 件</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-500">订单金额</span>
                  <span className="font-bold text-orange-600">¥{selectedOrder.total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-500">支付方式</span>
                  <span>{selectedOrder.payment}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-500">下单时间</span>
                  <span>{selectedOrder.date}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-500">收货地址</span>
                  <span className="text-right text-sm">{selectedOrder.address}</span>
                </div>
              </div>
              <Button variant="outline" className="w-full mt-6" onClick={() => setIsViewDialogOpen(false)}>
                关闭
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Action Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isActionDialogOpen}
        onClose={() => {
          setIsActionDialogOpen(false);
          setSelectedOrder(null);
          setActionType(null);
        }}
        onConfirm={handleOrderAction}
        title={actionType === 'confirm' ? '确认订单' : '取消订单'}
        message={
          actionType === 'confirm'
            ? `确认订单「${selectedOrder?.id}」已完成？确认后用户余额将增加。`
            : `确认取消订单「${selectedOrder?.id}」？取消后订单金额将退还用户。`
        }
        confirmText={actionType === 'confirm' ? '确认完成' : '确认取消'}
        cancelText="取消"
        variant={actionType === 'confirm' ? 'default' : 'danger'}
        loading={actionLoading}
      />
    </div>
  );
}
