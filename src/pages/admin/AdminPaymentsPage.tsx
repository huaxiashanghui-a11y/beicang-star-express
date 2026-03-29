import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, CreditCard, CheckCircle, XCircle, Eye, X, Check, AlertTriangle } from 'lucide-react';
import { Button } from '../../components/ui/button';

interface Payment {
  id: string;
  name: string;
  description: string;
  icon: string;
  status: '启用' | '禁用';
  transactionFee: number;
  minAmount: number;
  maxAmount: number;
  dailyLimit: number;
  todayVolume: number;
  orderCount: number;
  color: string;
}

const initialPayments: Payment[] = [
  {
    id: '1',
    name: 'KBZ Pay',
    description: '缅甸KBZ银行移动支付',
    icon: '💳',
    status: '启用',
    transactionFee: 0,
    minAmount: 1000,
    maxAmount: 5000000,
    dailyLimit: 10000000,
    todayVolume: 2560000,
    orderCount: 1234,
    color: 'bg-blue-500',
  },
  {
    id: '2',
    name: 'Wave Pay',
    description: '缅甸Wave移动支付',
    icon: '📱',
    status: '启用',
    transactionFee: 0,
    minAmount: 500,
    maxAmount: 3000000,
    dailyLimit: 5000000,
    todayVolume: 1890000,
    orderCount: 892,
    color: 'bg-green-500',
  },
  {
    id: '3',
    name: 'Visa',
    description: '国际信用卡支付',
    icon: '💳',
    status: '启用',
    transactionFee: 2.5,
    minAmount: 5000,
    maxAmount: 10000000,
    dailyLimit: 50000000,
    todayVolume: 5600000,
    orderCount: 456,
    color: 'bg-purple-500',
  },
  {
    id: '4',
    name: 'Mastercard',
    description: '万事达卡支付',
    icon: '💳',
    status: '启用',
    transactionFee: 2.5,
    minAmount: 5000,
    maxAmount: 10000000,
    dailyLimit: 50000000,
    todayVolume: 4200000,
    orderCount: 389,
    color: 'bg-orange-500',
  },
  {
    id: '5',
    name: 'PayPal',
    description: '国际在线支付平台',
    icon: '🌐',
    status: '启用',
    transactionFee: 3.5,
    minAmount: 10000,
    maxAmount: 50000000,
    dailyLimit: 100000000,
    todayVolume: 8900000,
    orderCount: 567,
    color: 'bg-blue-600',
  },
  {
    id: '6',
    name: 'COD',
    description: '货到付款',
    icon: '💵',
    status: '禁用',
    transactionFee: 0,
    minAmount: 0,
    maxAmount: 1000000,
    dailyLimit: 2000000,
    todayVolume: 450000,
    orderCount: 234,
    color: 'bg-gray-500',
  },
];

const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 'bg-red-500', 'bg-teal-500', 'bg-pink-500', 'bg-indigo-500'];
const icons = ['💳', '📱', '🌐', '💵', '🏦', '📲', '🔒', '💰'];

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>(initialPayments);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('全部');

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [editingPayment, setEditingPayment] = useState<Partial<Payment>>({});

  // Toast state
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({
    show: false,
    message: '',
    type: 'success',
  });

  // Form state
  const [formData, setFormData] = useState<Partial<Payment>>({
    name: '',
    description: '',
    icon: '💳',
    status: '禁用',
    transactionFee: 0,
    minAmount: 0,
    maxAmount: 10000000,
    dailyLimit: 50000000,
    color: 'bg-blue-500',
  });

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ ...toast, show: false }), 3000);
  };

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === '全部' || payment.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const totalVolume = payments.reduce((sum, p) => sum + p.todayVolume, 0);
  const totalOrders = payments.reduce((sum, p) => sum + p.orderCount, 0);

  const handleAdd = () => {
    setFormData({
      name: '',
      description: '',
      icon: '💳',
      status: '禁用',
      transactionFee: 0,
      minAmount: 0,
      maxAmount: 10000000,
      dailyLimit: 50000000,
      color: 'bg-blue-500',
    });
    setShowAddModal(true);
  };

  const handleEdit = (payment: Payment) => {
    setEditingPayment({ ...payment });
    setShowEditModal(true);
  };

  const handleView = (payment: Payment) => {
    setSelectedPayment(payment);
    setShowDetailModal(true);
  };

  const handleDelete = (payment: Payment) => {
    setSelectedPayment(payment);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (selectedPayment) {
      setPayments(payments.filter(p => p.id !== selectedPayment.id));
      showToast(`支付方式"${selectedPayment.name}"已删除`);
      setShowDeleteModal(false);
      setSelectedPayment(null);
    }
  };

  const handleToggleStatus = (payment: Payment) => {
    setPayments(
      payments.map(p =>
        p.id === payment.id ? { ...p, status: p.status === '启用' ? '禁用' : '启用' } : p
      )
    );
    showToast(`支付方式"${payment.name}"已${payment.status === '启用' ? '禁用' : '启用'}`);
  };

  const handleSaveAdd = () => {
    if (!formData.name) {
      showToast('请填写支付方式名称', 'error');
      return;
    }
    const newPayment: Payment = {
      id: Date.now().toString(),
      name: formData.name || '',
      description: formData.description || '',
      icon: formData.icon || '💳',
      status: (formData.status as Payment['status']) || '禁用',
      transactionFee: formData.transactionFee || 0,
      minAmount: formData.minAmount || 0,
      maxAmount: formData.maxAmount || 10000000,
      dailyLimit: formData.dailyLimit || 50000000,
      todayVolume: 0,
      orderCount: 0,
      color: formData.color || 'bg-blue-500',
    };
    setPayments([...payments, newPayment]);
    showToast(`支付方式"${newPayment.name}"创建成功`);
    setShowAddModal(false);
  };

  const handleSaveEdit = () => {
    if (!editingPayment.id || !editingPayment.name) {
      showToast('请填写完整信息', 'error');
      return;
    }
    setPayments(
      payments.map(p =>
        p.id === editingPayment.id ? { ...p, ...editingPayment } as Payment : p
      )
    );
    showToast(`支付方式"${editingPayment.name}"更新成功`);
    setShowEditModal(false);
    setEditingPayment({});
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast.show && (
        <div
          className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 ${
            toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
          }`}
        >
          {toast.type === 'success' ? <Check className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">支付管理</h2>
          <p className="text-gray-500 text-sm mt-1">配置和管理支付渠道</p>
        </div>
        <Button onClick={handleAdd} className="bg-gradient-to-r from-orange-500 to-blue-500">
          <Plus className="w-4 h-4 mr-2" />
          添加支付方式
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-4">
          <p className="text-sm text-gray-600 mb-1">今日交易总额</p>
          <p className="text-2xl font-bold text-orange-600">
            ¥{(totalVolume / 10000).toFixed(0)}万
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <p className="text-sm text-gray-600 mb-1">今日订单数</p>
          <p className="text-2xl font-bold text-blue-600">{totalOrders}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <p className="text-sm text-gray-600 mb-1">启用支付方式</p>
          <p className="text-2xl font-bold text-green-600">
            {payments.filter(p => p.status === '启用').length}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <p className="text-sm text-gray-600 mb-1">平均手续费</p>
          <p className="text-2xl font-bold text-purple-600">
            {(payments.filter(p => p.status === '启用').reduce((sum, p) => sum + p.transactionFee, 0) / Math.max(payments.filter(p => p.status === '启用').length, 1)).toFixed(1)}%
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="搜索支付方式..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option>全部</option>
            <option>启用</option>
            <option>禁用</option>
          </select>
        </div>
      </div>

      {/* Payment Methods Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPayments.map((payment) => (
          <div
            key={payment.id}
            className={`bg-white rounded-xl shadow-sm overflow-hidden border-2 ${
              payment.status === '启用' ? 'border-transparent' : 'border-gray-200'
            }`}
          >
            {/* Header */}
            <div className={`${payment.color} p-4 text-white`}>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl">
                    {payment.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{payment.name}</h3>
                    <p className="text-sm opacity-90">{payment.description}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  payment.status === '启用'
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-400 text-white'
                }`}>
                  {payment.status}
                </span>
              </div>
            </div>

            {/* Body */}
            <div className="p-4">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center p-2 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">今日交易额</p>
                  <p className="font-bold text-gray-800">
                    ¥{(payment.todayVolume / 10000).toFixed(1)}万
                  </p>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">订单数</p>
                  <p className="font-bold text-gray-800">{payment.orderCount}</p>
                </div>
              </div>

              <div className="space-y-2 text-sm mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-500">手续费率</span>
                  <span className="font-medium">{payment.transactionFee}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">单笔限额</span>
                  <span className="font-medium">
                    ¥{payment.minAmount.toLocaleString()} - ¥{payment.maxAmount.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">日限额</span>
                  <span className="font-medium">¥{(payment.dailyLimit / 10000).toFixed(0)}万</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1" onClick={() => handleView(payment)}>
                  <Eye className="w-4 h-4 mr-2" />
                  详情
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleEdit(payment)}>
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleToggleStatus(payment)}
                  className={payment.status === '启用' ? 'text-red-600' : 'text-green-600'}
                >
                  {payment.status === '启用' ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                </Button>
                <Button variant="outline" size="sm" className="text-red-600 hover:bg-red-50" onClick={() => handleDelete(payment)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-800">添加支付方式</h3>
                <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">支付方式名称</label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="例如：KBZ Pay"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">描述</label>
                <input
                  type="text"
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="例如：缅甸KBZ银行移动支付"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">选择图标</label>
                  <div className="grid grid-cols-4 gap-2">
                    {icons.map((icon) => (
                      <button
                        key={icon}
                        onClick={() => setFormData({ ...formData, icon })}
                        className={`w-10 h-10 text-xl rounded-lg border-2 ${
                          formData.icon === icon
                            ? 'border-orange-500 bg-orange-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">选择颜色</label>
                  <div className="grid grid-cols-4 gap-2">
                    {colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setFormData({ ...formData, color })}
                        className={`h-10 rounded-lg ${color} ${
                          formData.color === color ? 'ring-2 ring-offset-2 ring-gray-400' : ''
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">手续费率(%)</label>
                  <input
                    type="number"
                    value={formData.transactionFee || 0}
                    onChange={(e) => setFormData({ ...formData, transactionFee: Number(e.target.value) })}
                    step={0.1}
                    min={0}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">最低金额</label>
                  <input
                    type="number"
                    value={formData.minAmount || 0}
                    onChange={(e) => setFormData({ ...formData, minAmount: Number(e.target.value) })}
                    min={0}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">最高金额</label>
                  <input
                    type="number"
                    value={formData.maxAmount || 0}
                    onChange={(e) => setFormData({ ...formData, maxAmount: Number(e.target.value) })}
                    min={0}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">日限额</label>
                <input
                  type="number"
                  value={formData.dailyLimit || 0}
                  onChange={(e) => setFormData({ ...formData, dailyLimit: Number(e.target.value) })}
                  min={0}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">状态</label>
                <select
                  value={formData.status || '禁用'}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as '启用' | '禁用' })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="禁用">禁用</option>
                  <option value="启用">启用</option>
                </select>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowAddModal(false)}>
                取消
              </Button>
              <Button onClick={handleSaveAdd} className="bg-gradient-to-r from-orange-500 to-blue-500">
                添加支付方式
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editingPayment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-800">编辑支付方式</h3>
                <button onClick={() => setShowEditModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">支付方式名称</label>
                <input
                  type="text"
                  value={editingPayment.name || ''}
                  onChange={(e) => setEditingPayment({ ...editingPayment, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">描述</label>
                <input
                  type="text"
                  value={editingPayment.description || ''}
                  onChange={(e) => setEditingPayment({ ...editingPayment, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">选择图标</label>
                  <div className="grid grid-cols-4 gap-2">
                    {icons.map((icon) => (
                      <button
                        key={icon}
                        onClick={() => setEditingPayment({ ...editingPayment, icon })}
                        className={`w-10 h-10 text-xl rounded-lg border-2 ${
                          editingPayment.icon === icon
                            ? 'border-orange-500 bg-orange-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">选择颜色</label>
                  <div className="grid grid-cols-4 gap-2">
                    {colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setEditingPayment({ ...editingPayment, color })}
                        className={`h-10 rounded-lg ${color} ${
                          editingPayment.color === color ? 'ring-2 ring-offset-2 ring-gray-400' : ''
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">手续费率(%)</label>
                  <input
                    type="number"
                    value={editingPayment.transactionFee || 0}
                    onChange={(e) => setEditingPayment({ ...editingPayment, transactionFee: Number(e.target.value) })}
                    step={0.1}
                    min={0}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">最低金额</label>
                  <input
                    type="number"
                    value={editingPayment.minAmount || 0}
                    onChange={(e) => setEditingPayment({ ...editingPayment, minAmount: Number(e.target.value) })}
                    min={0}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">最高金额</label>
                  <input
                    type="number"
                    value={editingPayment.maxAmount || 0}
                    onChange={(e) => setEditingPayment({ ...editingPayment, maxAmount: Number(e.target.value) })}
                    min={0}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">日限额</label>
                <input
                  type="number"
                  value={editingPayment.dailyLimit || 0}
                  onChange={(e) => setEditingPayment({ ...editingPayment, dailyLimit: Number(e.target.value) })}
                  min={0}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">状态</label>
                <select
                  value={editingPayment.status || '禁用'}
                  onChange={(e) => setEditingPayment({ ...editingPayment, status: e.target.value as '启用' | '禁用' })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="禁用">禁用</option>
                  <option value="启用">启用</option>
                </select>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowEditModal(false)}>
                取消
              </Button>
              <Button onClick={handleSaveEdit} className="bg-gradient-to-r from-orange-500 to-blue-500">
                保存修改
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedPayment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-800">支付方式详情</h3>
                <button onClick={() => setShowDetailModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className={`${selectedPayment.color} p-6 rounded-xl text-white mb-4`}>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center text-3xl">
                    {selectedPayment.icon}
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold">{selectedPayment.name}</h4>
                    <p className="opacity-90">{selectedPayment.description}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">支付方式ID</span>
                  <span className="font-medium">{selectedPayment.id}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">状态</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs ${
                    selectedPayment.status === '启用' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {selectedPayment.status}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">手续费率</span>
                  <span className="font-medium">{selectedPayment.transactionFee}%</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">单笔限额</span>
                  <span className="font-medium">
                    ¥{selectedPayment.minAmount.toLocaleString()} - ¥{selectedPayment.maxAmount.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">日限额</span>
                  <span className="font-medium">¥{(selectedPayment.dailyLimit / 10000).toFixed(0)}万</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">今日交易额</span>
                  <span className="font-medium text-orange-600">¥{(selectedPayment.todayVolume / 10000).toFixed(1)}万</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-500">今日订单数</span>
                  <span className="font-medium text-blue-600">{selectedPayment.orderCount}</span>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowDetailModal(false)}>
                关闭
              </Button>
              <Button onClick={() => { setShowDetailModal(false); handleEdit(selectedPayment); }} className="bg-gradient-to-r from-orange-500 to-blue-500">
                编辑支付方式
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedPayment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">确认删除</h3>
              <p className="text-gray-600">
                确定要删除支付方式 "{selectedPayment.name}" 吗？此操作无法撤销。
              </p>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
                取消
              </Button>
              <Button onClick={confirmDelete} className="bg-red-500 hover:bg-red-600 text-white">
                确认删除
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
