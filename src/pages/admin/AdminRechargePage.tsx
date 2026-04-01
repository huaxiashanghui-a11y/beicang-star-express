import React, { useState } from 'react';
import { Search, Eye, CheckCircle, Clock, XCircle, Plus, Download, DollarSign, Wallet } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { FormModal } from '../../components/ui/FormModal';
import { ConfirmDialog } from '../../components/ui/Modal';
import { useToast } from '@/components/Toast';

interface RechargeOrder {
  id: string;
  orderNo: string;
  userId: string;
  userName: string;
  phone: string;
  amount: number;
  paymentMethod: string;
  status: '待支付' | '已支付' | '已取消' | '已退款';
  type: '用户充值' | '后台手动充值';
  remark: string;
  adminName: string;
  createdAt: string;
  paidAt: string;
}

interface User {
  id: string;
  name: string;
  phone: string;
  balance: number;
}

export default function AdminRechargePage() {
  const { showToast } = useToast();
  const [orders, setOrders] = useState<RechargeOrder[]>([
    { id: 'RC001', orderNo: 'RC20240315001', userId: 'U001', userName: '张三', phone: '138****1234', amount: 1000, paymentMethod: '微信支付', status: '已支付', type: '用户充值', remark: '', adminName: '', createdAt: '2024-03-15 10:00', paidAt: '2024-03-15 10:05' },
    { id: 'RC002', orderNo: 'RC20240315002', userId: 'U002', userName: '李四', phone: '139****5678', amount: 500, paymentMethod: '支付宝', status: '已支付', type: '用户充值', remark: '', adminName: '', createdAt: '2024-03-15 11:30', paidAt: '2024-03-15 11:32' },
    { id: 'RC003', orderNo: 'RC20240315003', userId: 'U003', userName: '王五', phone: '137****9012', amount: 2000, paymentMethod: '银行转账', status: '待支付', type: '用户充值', remark: '', adminName: '', createdAt: '2024-03-15 14:00', paidAt: '' },
    { id: 'RC004', orderNo: 'RC20240315004', userId: 'U001', userName: '张三', phone: '138****1234', amount: 5000, paymentMethod: '-', status: '已支付', type: '后台手动充值', remark: 'VIP客户福利', adminName: '管理员', createdAt: '2024-03-14 09:00', paidAt: '2024-03-14 09:00' },
    { id: 'RC005', orderNo: 'RC20240315005', userId: 'U004', userName: '赵六', phone: '136****3456', amount: 300, paymentMethod: '微信支付', status: '已取消', type: '用户充值', remark: '', adminName: '', createdAt: '2024-03-14 16:00', paidAt: '' },
    { id: 'RC006', orderNo: 'RC20240315006', userId: 'U005', userName: '钱七', phone: '135****7890', amount: 800, paymentMethod: '支付宝', status: '已支付', type: '用户充值', remark: '', adminName: '', createdAt: '2024-03-16 08:30', paidAt: '2024-03-16 08:35' },
  ]);

  const [users] = useState<User[]>([
    { id: 'U001', name: '张三', phone: '138****1234', balance: 6000 },
    { id: 'U002', name: '李四', phone: '139****5678', balance: 2500 },
    { id: 'U003', name: '王五', phone: '137****9012', balance: 800 },
    { id: 'U004', name: '赵六', phone: '136****3456', balance: 5000 },
    { id: 'U005', name: '钱七', phone: '135****7890', balance: 1800 },
  ]);

  const [searchKeyword, setSearchKeyword] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [isManualRechargeModalOpen, setIsManualRechargeModalOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isActionDialogOpen, setIsActionDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<'confirm' | 'cancel' | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<RechargeOrder | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);

  const stats = {
    todayCount: 12,
    todayAmount: 15680,
    totalCount: 8542,
    totalAmount: 1234567,
  };

  const manualRechargeFields = [
    {
      name: 'userId',
      label: '选择用户',
      type: 'select' as const,
      placeholder: '请搜索并选择用户',
      required: true,
      options: users.map(u => ({
        value: u.id,
        label: `${u.name} (${u.phone}) - 余额: ¥${u.balance}`
      })),
    },
    {
      name: 'amount',
      label: '充值金额',
      type: 'text' as const,
      placeholder: '请输入充值金额',
      required: true,
      validation: (value: string) => {
        const num = parseFloat(value);
        if (isNaN(num) || num <= 0) return '请输入正确的充值金额';
        return null;
      }
    },
    {
      name: 'remark',
      label: '备注',
      type: 'textarea' as const,
      placeholder: '请输入备注信息（可选）',
    }
  ];

  const getStatusStyle = (status: string) => {
    const styles: Record<string, string> = {
      '待支付': 'bg-orange-100 text-orange-700',
      '已支付': 'bg-green-100 text-green-700',
      '已取消': 'bg-gray-100 text-gray-700',
      '已退款': 'bg-red-100 text-red-700',
    };
    return styles[status] || 'bg-gray-100 text-gray-700';
  };

  const getStatusIcon = (status: string) => {
    const icons: Record<string, any> = {
      '待支付': Clock,
      '已支付': CheckCircle,
      '已取消': XCircle,
      '已退款': XCircle,
    };
    return icons[status] || Clock;
  };

  const handleManualRecharge = async (data: Record<string, string>) => {
    await new Promise(resolve => setTimeout(resolve, 800));

    const user = users.find(u => u.id === data.userId);
    const newOrder: RechargeOrder = {
      id: `RC${Date.now()}`,
      orderNo: `RC${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}${String(Date.now()).slice(-6)}`,
      userId: data.userId,
      userName: user?.name || '',
      phone: user?.phone || '',
      amount: parseFloat(data.amount),
      paymentMethod: '-',
      status: '已支付',
      type: '后台手动充值',
      remark: data.remark || '',
      adminName: '管理员',
      createdAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
      paidAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
    };

    setOrders(prev => [newOrder, ...prev]);
    showToast('success', `成功为用户「${user?.name}」充值 ¥${data.amount}`);
  };

  const handleExportOrders = async () => {
    setExportLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      let exportData = [...orders];
      if (searchKeyword) {
        exportData = exportData.filter(o =>
          o.orderNo.includes(searchKeyword) ||
          o.userName.includes(searchKeyword) ||
          o.userId.includes(searchKeyword)
        );
      }
      if (filterStatus) {
        exportData = exportData.filter(o => o.status === filterStatus);
      }

      const headers = ['订单号', '用户ID', '用户名', '手机号', '充值金额', '支付方式', '状态', '类型', '备注', '创建时间'];
      const csvContent = [
        headers.join(','),
        ...exportData.map(o => [
          o.orderNo,
          o.userId,
          o.userName,
          o.phone,
          o.amount,
          o.paymentMethod,
          o.status,
          o.type,
          o.remark,
          o.createdAt
        ].join(','))
      ].join('\n');

      const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `充值订单_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      showToast('success', `成功导出 ${exportData.length} 条充值订单`);
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
            ? { ...o, status: '已支付', paidAt: new Date().toISOString().slice(0, 16).replace('T', ' ') }
            : o
        ));
        showToast('success', '已确认充值到账');
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

  const openViewDialog = (order: RechargeOrder) => {
    setSelectedOrder(order);
    setIsViewDialogOpen(true);
  };

  const openActionDialog = (order: RechargeOrder, action: 'confirm' | 'cancel') => {
    setSelectedOrder(order);
    setActionType(action);
    setIsActionDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">充值管理</h2>
          <p className="text-gray-500 text-sm mt-1">管理用户充值订单和余额</p>
        </div>
        <div className="flex gap-3">
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
          <Button onClick={() => setIsManualRechargeModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            手动充值
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-orange-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.todayCount}</p>
              <p className="text-gray-500 text-sm">今日充值笔数</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">¥{stats.todayAmount.toLocaleString()}</p>
              <p className="text-gray-500 text-sm">今日充值金额</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Wallet className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.totalCount.toLocaleString()}</p>
              <p className="text-gray-500 text-sm">总充值笔数</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <span className="text-2xl">💰</span>
            </div>
            <div>
              <p className="text-2xl font-bold">¥{stats.totalAmount.toLocaleString()}</p>
              <p className="text-gray-500 text-sm">总充值金额</p>
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
              placeholder="搜索用户名、用户ID或订单号..."
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
            <option value="已支付">已支付</option>
            <option value="已取消">已取消</option>
            <option value="已退款">已退款</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">订单号</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">用户信息</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">充值金额</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">支付方式</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">状态</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">类型</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">创建时间</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {orders.map((order) => {
              const StatusIcon = getStatusIcon(order.status);
              return (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="font-mono text-sm">{order.orderNo}</span>
                    {order.type === '后台手动充值' && (
                      <span className="ml-2 text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded">后台</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium">{order.userName}</p>
                      <p className="text-gray-500 text-sm">{order.phone}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-green-600">+¥{order.amount.toLocaleString()}</span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{order.paymentMethod}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(order.status)}`}>
                      <StatusIcon className="w-3 h-3" />
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600 text-sm">{order.type}</td>
                  <td className="px-6 py-4 text-gray-600 text-sm">{order.createdAt}</td>
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
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openActionDialog(order, 'confirm')}
                            className="hover:bg-green-50 hover:text-green-500"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openActionDialog(order, 'cancel')}
                            className="hover:bg-red-50 hover:text-red-500"
                          >
                            <XCircle className="w-4 h-4 text-red-500" />
                          </Button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Manual Recharge Modal */}
      <FormModal
        isOpen={isManualRechargeModalOpen}
        onClose={() => setIsManualRechargeModalOpen(false)}
        onSubmit={handleManualRecharge}
        title="手动充值"
        fields={manualRechargeFields}
        submitText="确认充值"
        size="md"
      />

      {/* View Order Dialog */}
      {selectedOrder && isViewDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsViewDialogOpen(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md animate-scale-in">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold">充值详情</h3>
                <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusStyle(selectedOrder.status)}`}>
                  {selectedOrder.status}
                </span>
              </div>

              <div className="bg-green-50 rounded-xl p-4 mb-6 text-center">
                <p className="text-sm text-gray-500 mb-1">充值金额</p>
                <p className="text-3xl font-bold text-green-600">+¥{selectedOrder.amount.toLocaleString()}</p>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-500">订单号</span>
                  <span className="font-mono text-sm">{selectedOrder.orderNo}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-500">用户</span>
                  <div className="text-right">
                    <p className="font-medium">{selectedOrder.userName}</p>
                    <p className="text-sm text-gray-400">{selectedOrder.phone}</p>
                  </div>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-500">充值类型</span>
                  <span>
                    {selectedOrder.type}
                    {selectedOrder.type === '后台手动充值' && (
                      <span className="ml-1 text-xs text-purple-500">({selectedOrder.adminName})</span>
                    )}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-500">支付方式</span>
                  <span>{selectedOrder.paymentMethod}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-500">创建时间</span>
                  <span className="text-sm">{selectedOrder.createdAt}</span>
                </div>
                {selectedOrder.paidAt && (
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-500">到账时间</span>
                    <span className="text-sm text-green-600">{selectedOrder.paidAt}</span>
                  </div>
                )}
                {selectedOrder.remark && (
                  <div className="flex justify-between py-2">
                    <span className="text-gray-500">备注</span>
                    <span className="text-sm text-right">{selectedOrder.remark}</span>
                  </div>
                )}
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
        title={actionType === 'confirm' ? '确认到账' : '取消订单'}
        message={
          actionType === 'confirm'
            ? `确认用户「${selectedOrder?.userName}」的充值 ¥${selectedOrder?.amount} 已到账？确认后用户余额将增加。`
            : `确认取消该充值订单？取消后订单金额不会增加。`
        }
        confirmText={actionType === 'confirm' ? '确认到账' : '确认取消'}
        cancelText="取消"
        variant={actionType === 'confirm' ? 'default' : 'danger'}
        loading={actionLoading}
      />
    </div>
  );
}
