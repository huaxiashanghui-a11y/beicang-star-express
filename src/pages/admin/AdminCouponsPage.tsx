import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Copy, Gift, Eye, X, Check, AlertTriangle } from 'lucide-react';
import { Button } from '../../components/ui/button';
import adminApi from '../../config/adminApi';

interface Coupon {
  id: string;
  name: string;
  type: '折扣' | '满减';
  discount: string;
  minAmount: number;
  maxDiscount: number;
  total: number;
  claimed: number;
  startDate: string;
  endDate: string;
  status: '进行中' | '已结束' | '未开始';
}

const initialCoupons: Coupon[] = [
  {
    id: '1',
    name: '新人专享券',
    type: '折扣',
    discount: '20%',
    minAmount: 100,
    maxDiscount: 50,
    total: 1000,
    claimed: 756,
    startDate: '2024-03-01',
    endDate: '2024-03-31',
    status: '进行中',
  },
  {
    id: '2',
    name: '满减优惠券',
    type: '满减',
    discount: '¥50',
    minAmount: 500,
    maxDiscount: 50,
    total: 500,
    claimed: 234,
    startDate: '2024-03-15',
    endDate: '2024-04-15',
    status: '进行中',
  },
  {
    id: '3',
    name: '限时折扣券',
    type: '折扣',
    discount: '15%',
    minAmount: 200,
    maxDiscount: 100,
    total: 200,
    claimed: 200,
    startDate: '2024-03-10',
    endDate: '2024-03-20',
    status: '已结束',
  },
  {
    id: '4',
    name: '节日特惠券',
    type: '满减',
    discount: '¥100',
    minAmount: 1000,
    maxDiscount: 100,
    total: 100,
    claimed: 45,
    startDate: '2024-04-01',
    endDate: '2024-04-07',
    status: '未开始',
  },
  {
    id: '5',
    name: 'VIP专属券',
    type: '折扣',
    discount: '30%',
    minAmount: 0,
    maxDiscount: 200,
    total: 50,
    claimed: 12,
    startDate: '2024-03-01',
    endDate: '2024-12-31',
    status: '进行中',
  },
];

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('全部');
  const [typeFilter, setTypeFilter] = useState('全部');

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [editingCoupon, setEditingCoupon] = useState<Partial<Coupon>>({});

  // Toast state
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({
    show: false,
    message: '',
    type: 'success',
  });
  const [loading, setLoading] = useState(true);

  // Load coupons from API
  useEffect(() => {
    loadCoupons();
  }, []);

  const loadCoupons = async () => {
    try {
      setLoading(true);
      const data = await adminApi.coupons.list();
      if (data.coupons) {
        setCoupons(data.coupons);
      } else if (Array.isArray(data)) {
        setCoupons(data);
      }
    } catch (error) {
      console.error('Failed to load coupons:', error);
      showToast('加载优惠券失败', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Form state
  const [formData, setFormData] = useState<Partial<Coupon>>({
    name: '',
    type: '满减',
    discount: '',
    minAmount: 0,
    maxDiscount: 0,
    total: 100,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  });

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ ...toast, show: false }), 3000);
  };

  const filteredCoupons = coupons.filter((coupon) => {
    const matchesSearch = coupon.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === '全部' || coupon.status === statusFilter;
    const matchesType = typeFilter === '全部' || coupon.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const getCouponStatus = (coupon: Coupon): Coupon['status'] => {
    const now = new Date();
    const start = new Date(coupon.startDate);
    const end = new Date(coupon.endDate);
    if (now < start) return '未开始';
    if (now > end) return '已结束';
    return '进行中';
  };

  const handleAdd = () => {
    setFormData({
      name: '',
      type: '满减',
      discount: '',
      minAmount: 0,
      maxDiscount: 0,
      total: 100,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    });
    setShowAddModal(true);
  };

  const handleEdit = (coupon: Coupon) => {
    setEditingCoupon({ ...coupon });
    setShowEditModal(true);
  };

  const handleView = (coupon: Coupon) => {
    setSelectedCoupon(coupon);
    setShowDetailModal(true);
  };

  const handleDelete = (coupon: Coupon) => {
    setSelectedCoupon(coupon);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (selectedCoupon) {
      try {
        await adminApi.coupons.delete(selectedCoupon.id);
        setCoupons(coupons.filter((c) => c.id !== selectedCoupon.id));
        showToast(`优惠券"${selectedCoupon.name}"已删除`);
      } catch (error) {
        console.error('Failed to delete coupon:', error);
        showToast('删除优惠券失败', 'error');
      }
      setShowDeleteModal(false);
      setSelectedCoupon(null);
    }
  };

  const handleSaveAdd = async () => {
    if (!formData.name || !formData.discount) {
      showToast('请填写优惠券名称和优惠额度', 'error');
      return;
    }
    try {
      const response = await adminApi.coupons.create(formData);
      const newCoupon: Coupon = {
        id: response.id || Date.now().toString(),
        name: formData.name || '',
        type: formData.type as Coupon['type'] || '满减',
        discount: formData.discount || '',
        minAmount: formData.minAmount || 0,
        maxDiscount: formData.maxDiscount || 0,
        total: formData.total || 100,
        claimed: 0,
        startDate: formData.startDate || '',
        endDate: formData.endDate || '',
        status: '未开始',
      };
      setCoupons([...coupons, newCoupon]);
      showToast(`优惠券"${newCoupon.name}"创建成功`);
      setShowAddModal(false);
    } catch (error) {
      console.error('Failed to create coupon:', error);
      showToast('创建优惠券失败', 'error');
    }
  };

  const handleSaveEdit = async () => {
    if (!editingCoupon.id || !editingCoupon.name || !editingCoupon.discount) {
      showToast('请填写完整信息', 'error');
      return;
    }
    try {
      await adminApi.coupons.update(editingCoupon.id, editingCoupon);
      setCoupons(
        coupons.map((c) =>
          c.id === editingCoupon.id
            ? {
                ...c,
                ...editingCoupon,
                status: getCouponStatus(editingCoupon as Coupon),
              }
            : c
        )
      );
      showToast(`优惠券"${editingCoupon.name}"更新成功`);
      setShowEditModal(false);
      setEditingCoupon({});
    } catch (error) {
      console.error('Failed to update coupon:', error);
      showToast('更新优惠券失败', 'error');
    }
  };

  const handleCopyCode = (id: string) => {
    navigator.clipboard.writeText(`COUPON${id}`);
    showToast('优惠券代码已复制');
  };

  const statusColors = {
    '进行中': 'bg-green-100 text-green-700',
    '已结束': 'bg-gray-100 text-gray-700',
    '未开始': 'bg-blue-100 text-blue-700',
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
          <h2 className="text-2xl font-bold text-gray-800">优惠券管理</h2>
          <p className="text-gray-500 text-sm mt-1">创建和管理促销活动优惠券</p>
        </div>
        <Button onClick={handleAdd} className="bg-gradient-to-r from-orange-500 to-blue-500 hover:from-orange-600 hover:to-blue-600">
          <Plus className="w-4 h-4 mr-2" />
          创建优惠券
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: '进行中', count: coupons.filter((c) => getCouponStatus(c) === '进行中').length, color: 'text-green-600' },
          { label: '已结束', count: coupons.filter((c) => getCouponStatus(c) === '已结束').length, color: 'text-gray-600' },
          { label: '未开始', count: coupons.filter((c) => getCouponStatus(c) === '未开始').length, color: 'text-blue-600' },
          { label: '发放总量', count: coupons.reduce((sum, c) => sum + c.total, 0), color: 'text-orange-600' },
        ].map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm p-4">
            <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.count}</p>
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
              placeholder="搜索优惠券名称..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option>全部</option>
              <option>进行中</option>
              <option>已结束</option>
              <option>未开始</option>
            </select>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option>全部</option>
              <option>折扣</option>
              <option>满减</option>
            </select>
          </div>
        </div>
      </div>

      {/* Coupons List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCoupons.map((coupon) => {
          const currentStatus = getCouponStatus(coupon);
          return (
            <div key={coupon.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              {/* Coupon Header */}
              <div className={`p-6 ${
                currentStatus === '进行中'
                  ? 'bg-gradient-to-r from-orange-500 to-blue-500'
                  : currentStatus === '未开始'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500'
                  : 'bg-gradient-to-r from-gray-400 to-gray-500'
              } text-white`}>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold mb-1">{coupon.name}</h3>
                    <p className="text-sm opacity-90">
                      {coupon.type === '折扣' ? '折扣券' : '满减券'}
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-white/20 rounded-full text-xs">
                    {currentStatus}
                  </span>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-bold">{coupon.discount}</p>
                  {coupon.minAmount > 0 && (
                    <p className="text-sm mt-2 opacity-90">
                      满¥{coupon.minAmount}可用
                    </p>
                  )}
                </div>
              </div>

              {/* Coupon Body */}
              <div className="p-6">
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">发行数量</span>
                    <span className="font-medium text-gray-800">{coupon.total}张</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">已领取</span>
                    <span className="font-medium text-green-600">{coupon.claimed}张</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">使用期限</span>
                    <span className="font-medium text-gray-800 text-right text-xs">
                      {coupon.startDate}<br />至 {coupon.endDate}
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-orange-500 to-blue-500 h-2 rounded-full transition-all"
                      style={{ width: `${(coupon.claimed / coupon.total) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 text-center">
                    领取率: {((coupon.claimed / coupon.total) * 100).toFixed(1)}%
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => handleCopyCode(coupon.id)}>
                    <Copy className="w-4 h-4 mr-2" />
                    复制
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => handleView(coupon)}>
                    <Eye className="w-4 h-4 mr-2" />
                    详情
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleEdit(coupon)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="text-red-600 hover:bg-red-50" onClick={() => handleDelete(coupon)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-800">创建优惠券</h3>
                <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">优惠券名称</label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="例如：新人专享券"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">优惠类型</label>
                <select
                  value={formData.type || '满减'}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as '折扣' | '满减' })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="满减">满减券</option>
                  <option value="折扣">折扣券</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">优惠额度</label>
                <input
                  type="text"
                  value={formData.discount || ''}
                  onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                  placeholder={formData.type === '折扣' ? '例如：20%' : '例如：¥50'}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">最低消费</label>
                  <input
                    type="number"
                    value={formData.minAmount || ''}
                    onChange={(e) => setFormData({ ...formData, minAmount: Number(e.target.value) })}
                    placeholder="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">最高优惠</label>
                  <input
                    type="number"
                    value={formData.maxDiscount || ''}
                    onChange={(e) => setFormData({ ...formData, maxDiscount: Number(e.target.value) })}
                    placeholder="不限制"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">发放数量</label>
                <input
                  type="number"
                  value={formData.total || ''}
                  onChange={(e) => setFormData({ ...formData, total: Number(e.target.value) })}
                  placeholder="100"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">开始日期</label>
                  <input
                    type="date"
                    value={formData.startDate || ''}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">结束日期</label>
                  <input
                    type="date"
                    value={formData.endDate || ''}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowAddModal(false)}>
                取消
              </Button>
              <Button onClick={handleSaveAdd} className="bg-gradient-to-r from-orange-500 to-blue-500">
                创建优惠券
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editingCoupon && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-800">编辑优惠券</h3>
                <button onClick={() => setShowEditModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">优惠券名称</label>
                <input
                  type="text"
                  value={editingCoupon.name || ''}
                  onChange={(e) => setEditingCoupon({ ...editingCoupon, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">优惠类型</label>
                <select
                  value={editingCoupon.type || '满减'}
                  onChange={(e) => setEditingCoupon({ ...editingCoupon, type: e.target.value as '折扣' | '满减' })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="满减">满减券</option>
                  <option value="折扣">折扣券</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">优惠额度</label>
                <input
                  type="text"
                  value={editingCoupon.discount || ''}
                  onChange={(e) => setEditingCoupon({ ...editingCoupon, discount: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">最低消费</label>
                  <input
                    type="number"
                  value={editingCoupon.minAmount || 0}
                    onChange={(e) => setEditingCoupon({ ...editingCoupon, minAmount: Number(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">最高优惠</label>
                  <input
                    type="number"
                    value={editingCoupon.maxDiscount || 0}
                    onChange={(e) => setEditingCoupon({ ...editingCoupon, maxDiscount: Number(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">发放数量</label>
                <input
                  type="number"
                  value={editingCoupon.total || 0}
                  onChange={(e) => setEditingCoupon({ ...editingCoupon, total: Number(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">开始日期</label>
                  <input
                    type="date"
                    value={editingCoupon.startDate || ''}
                    onChange={(e) => setEditingCoupon({ ...editingCoupon, startDate: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">结束日期</label>
                  <input
                    type="date"
                    value={editingCoupon.endDate || ''}
                    onChange={(e) => setEditingCoupon({ ...editingCoupon, endDate: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
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
      {showDetailModal && selectedCoupon && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-800">优惠券详情</h3>
                <button onClick={() => setShowDetailModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-gradient-to-r from-orange-500 to-blue-500 rounded-xl p-6 text-white text-center">
                <p className="text-4xl font-bold mb-2">{selectedCoupon.discount}</p>
                <p className="text-lg opacity-90">{selectedCoupon.name}</p>
                <p className="text-sm mt-2 opacity-80">
                  {selectedCoupon.type === '折扣' ? '折扣券' : '满减券'}
                  {selectedCoupon.minAmount > 0 && ` · 满¥${selectedCoupon.minAmount}可用`}
                </p>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">优惠券ID</span>
                  <span className="font-medium">{selectedCoupon.id}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">发行数量</span>
                  <span className="font-medium">{selectedCoupon.total}张</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">已领取</span>
                  <span className="font-medium text-green-600">{selectedCoupon.claimed}张</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">领取率</span>
                  <span className="font-medium">{((selectedCoupon.claimed / selectedCoupon.total) * 100).toFixed(1)}%</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">有效期</span>
                  <span className="font-medium">{selectedCoupon.startDate} 至 {selectedCoupon.endDate}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-500">当前状态</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs ${statusColors[getCouponStatus(selectedCoupon)]}`}>
                    {getCouponStatus(selectedCoupon)}
                  </span>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end">
              <Button variant="outline" onClick={() => setShowDetailModal(false)}>
                关闭
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedCoupon && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">确认删除</h3>
              <p className="text-gray-600">
                确定要删除优惠券 "{selectedCoupon.name}" 吗？此操作无法撤销。
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
