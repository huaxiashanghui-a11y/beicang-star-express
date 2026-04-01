import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2, Eye, ToggleLeft, ToggleRight } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { FormModal } from '../../components/ui/FormModal';
import { ConfirmDialog } from '../../components/ui/Modal';
import { useToast } from '@/components/Toast';

interface CouponPopup {
  id: string;
  title: string;
  background: string;
  coupons: { amount: number; rule: string; link: string }[];
  startTime: string;
  endTime: string;
  frequency: 'once' | 'daily' | 'always';
  status: '启用' | '禁用';
  exposure: number;
  claimed: number;
  createdAt: string;
}

export default function AdminPopupPage() {
  const { showToast } = useToast();
  const [popups, setPopups] = useState<CouponPopup[]>([
    {
      id: '1',
      title: '天降优惠券',
      background: 'gradient',
      coupons: [
        { amount: 1, rule: '配送费立减', link: '/product/delivery' },
        { amount: 3, rule: '满30元可用', link: '/category/all' },
      ],
      startTime: '2024-01-01 00:00:00',
      endTime: '2024-12-31 23:59:59',
      frequency: 'once',
      status: '启用',
      exposure: 125680,
      claimed: 89234,
      createdAt: '2024-01-01 10:00:00',
    },
    {
      id: '2',
      title: '新用户专享',
      background: 'gradient-blue',
      coupons: [
        { amount: 10, rule: '全场通用', link: '/category/all' },
        { amount: 5, rule: '满50元可用', link: '/category/all' },
      ],
      startTime: '2024-02-01 00:00:00',
      endTime: '2024-06-30 23:59:59',
      frequency: 'daily',
      status: '禁用',
      exposure: 45678,
      claimed: 12345,
      createdAt: '2024-02-01 10:00:00',
    },
  ]);

  const [searchKeyword, setSearchKeyword] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedPopup, setSelectedPopup] = useState<CouponPopup | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const stats = {
    totalExposure: popups.reduce((sum, p) => sum + p.exposure, 0),
    totalClaimed: popups.reduce((sum, p) => sum + p.claimed, 0),
    rate: 0,
  };
  stats.rate = stats.totalExposure > 0 ? Math.round((stats.totalClaimed / stats.totalExposure) * 100) : 0;

  const addFields = [
    {
      name: 'title',
      label: '弹窗标题',
      type: 'text' as const,
      placeholder: '如：天降优惠券',
      required: true,
    },
    {
      name: 'couponAmount1',
      label: '优惠券1金额',
      type: 'text' as const,
      placeholder: '如：1',
      required: true,
    },
    {
      name: 'couponRule1',
      label: '优惠券1规则',
      type: 'text' as const,
      placeholder: '如：配送费立减',
      required: true,
    },
    {
      name: 'couponLink1',
      label: '优惠券1跳转链接',
      type: 'text' as const,
      placeholder: '如：/category/all',
    },
    {
      name: 'couponAmount2',
      label: '优惠券2金额',
      type: 'text' as const,
      placeholder: '如：3',
    },
    {
      name: 'couponRule2',
      label: '优惠券2规则',
      type: 'text' as const,
      placeholder: '如：满30元可用',
    },
    {
      name: 'couponLink2',
      label: '优惠券2跳转链接',
      type: 'text' as const,
      placeholder: '如：/category/all',
    },
    {
      name: 'startTime',
      label: '生效时间',
      type: 'text' as const,
      placeholder: '格式：YYYY-MM-DD HH:MM:SS',
      required: true,
    },
    {
      name: 'endTime',
      label: '过期时间',
      type: 'text' as const,
      placeholder: '格式：YYYY-MM-DD HH:MM:SS',
      required: true,
    },
    {
      name: 'frequency',
      label: '弹出频次',
      type: 'select' as const,
      placeholder: '请选择频次',
      required: true,
      options: [
        { value: 'once', label: '仅首次进入弹出' },
        { value: 'daily', label: '每日弹出一次' },
        { value: 'always', label: '每次进入都弹出' },
      ],
    },
  ];

  const handleAddPopup = async (data: Record<string, string>) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    const coupons = [];
    if (data.couponAmount1) {
      coupons.push({
        amount: parseFloat(data.couponAmount1),
        rule: data.couponRule1 || '',
        link: data.couponLink1 || '/',
      });
    }
    if (data.couponAmount2) {
      coupons.push({
        amount: parseFloat(data.couponAmount2),
        rule: data.couponRule2 || '',
        link: data.couponLink2 || '/',
      });
    }

    const newPopup: CouponPopup = {
      id: `${Date.now()}`,
      title: data.title,
      background: 'gradient',
      coupons,
      startTime: data.startTime,
      endTime: data.endTime,
      frequency: data.frequency as 'once' | 'daily' | 'always',
      status: '启用',
      exposure: 0,
      claimed: 0,
      createdAt: new Date().toLocaleString('zh-CN'),
    };
    setPopups(prev => [newPopup, ...prev]);
    showToast('success', '弹窗创建成功');
  };

  const handleEditPopup = async (data: Record<string, string>) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    const coupons = [];
    if (data.couponAmount1) {
      coupons.push({
        amount: parseFloat(data.couponAmount1),
        rule: data.couponRule1 || '',
        link: data.couponLink1 || '/',
      });
    }
    if (data.couponAmount2) {
      coupons.push({
        amount: parseFloat(data.couponAmount2),
        rule: data.couponRule2 || '',
        link: data.couponLink2 || '/',
      });
    }

    setPopups(prev => prev.map(p =>
      p.id === selectedPopup?.id
        ? {
            ...p,
            title: data.title,
            coupons,
            startTime: data.startTime,
            endTime: data.endTime,
            frequency: data.frequency as 'once' | 'daily' | 'always',
          }
        : p
    ));
    showToast('success', '弹窗修改成功');
  };

  const handleDeletePopup = async () => {
    setDeleteLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setPopups(prev => prev.filter(p => p.id !== selectedPopup?.id));
      showToast('success', '弹窗删除成功');
      setIsDeleteDialogOpen(false);
    } catch (error) {
      showToast('error', '删除失败，请重试');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleToggleStatus = async (popup: CouponPopup) => {
    const newStatus = popup.status === '启用' ? '禁用' : '启用';
    setPopups(prev => prev.map(p =>
      p.id === popup.id ? { ...p, status: newStatus } : p
    ));
    showToast('success', `弹窗已${newStatus}`);
  };

  const openEditModal = (popup: CouponPopup) => {
    setSelectedPopup(popup);
    setIsEditModalOpen(true);
  };

  const openDeleteDialog = (popup: CouponPopup) => {
    setSelectedPopup(popup);
    setIsDeleteDialogOpen(true);
  };

  const getFrequencyText = (freq: string) => {
    const map: Record<string, string> = {
      'once': '仅首次',
      'daily': '每日一次',
      'always': '每次进入',
    };
    return map[freq] || freq;
  };

  const filteredPopups = popups.filter(p => {
    if (searchKeyword && !p.title.includes(searchKeyword)) return false;
    if (filterStatus && p.status !== filterStatus) return false;
    return true;
  });

  // 构建编辑字段默认值
  const getEditFields = () => {
    if (!selectedPopup) return addFields;
    return addFields.map(field => {
      if (field.name === 'couponAmount1') {
        return { ...field, defaultValue: selectedPopup.coupons[0]?.amount.toString() || '' };
      }
      if (field.name === 'couponRule1') {
        return { ...field, defaultValue: selectedPopup.coupons[0]?.rule || '' };
      }
      if (field.name === 'couponLink1') {
        return { ...field, defaultValue: selectedPopup.coupons[0]?.link || '' };
      }
      if (field.name === 'couponAmount2') {
        return { ...field, defaultValue: selectedPopup.coupons[1]?.amount.toString() || '' };
      }
      if (field.name === 'couponRule2') {
        return { ...field, defaultValue: selectedPopup.coupons[1]?.rule || '' };
      }
      if (field.name === 'couponLink2') {
        return { ...field, defaultValue: selectedPopup.coupons[1]?.link || '' };
      }
      return { ...field, defaultValue: selectedPopup[field.name as keyof CouponPopup]?.toString() || field.defaultValue };
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">首页弹窗</h2>
          <p className="text-gray-500 text-sm mt-1">管理商城首页优惠券弹窗</p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          新增弹窗
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <span className="text-2xl">👁️</span>
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.totalExposure.toLocaleString()}</p>
              <p className="text-gray-500 text-sm">总曝光量</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <span className="text-2xl">🎁</span>
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.totalClaimed.toLocaleString()}</p>
              <p className="text-gray-500 text-sm">总领取量</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <span className="text-2xl">📊</span>
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.rate}%</p>
              <p className="text-gray-500 text-sm">领取转化率</p>
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
              placeholder="搜索弹窗标题..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary transition-all"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary transition-all"
          >
            <option value="">全部状态</option>
            <option value="启用">启用</option>
            <option value="禁用">禁用</option>
          </select>
        </div>
      </div>

      {/* Popups Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">弹窗标题</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">优惠券</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">生效时间</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">过期时间</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">频次</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">曝光/领取</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">状态</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredPopups.map((popup) => (
              <tr key={popup.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-mono text-sm">{popup.id}</td>
                <td className="px-6 py-4 font-semibold">{popup.title}</td>
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    {popup.coupons.map((c, i) => (
                      <div key={i} className="text-sm">
                        <span className="text-orange-500 font-medium">{c.amount}元</span>
                        <span className="text-gray-500 ml-1">- {c.rule}</span>
                      </div>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-600 text-sm">{popup.startTime}</td>
                <td className="px-6 py-4 text-gray-600 text-sm">{popup.endTime}</td>
                <td className="px-6 py-4 text-gray-600">{getFrequencyText(popup.frequency)}</td>
                <td className="px-6 py-4">
                  <div className="text-sm">
                    <span className="text-gray-600">{popup.exposure.toLocaleString()}</span>
                    <span className="text-gray-400 mx-1">/</span>
                    <span className="text-green-600 font-medium">{popup.claimed.toLocaleString()}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleToggleStatus(popup)}
                    className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      popup.status === '启用'
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {popup.status === '启用' ? (
                      <ToggleRight className="w-4 h-4" />
                    ) : (
                      <ToggleLeft className="w-4 h-4" />
                    )}
                    {popup.status}
                  </button>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => openEditModal(popup)} className="hover:bg-orange-50 hover:text-orange-500">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => openDeleteDialog(popup)} className="hover:bg-red-50 hover:text-red-500">
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Modal */}
      <FormModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddPopup}
        title="新增弹窗"
        fields={addFields}
        submitText="确认创建"
        size="lg"
      />

      {/* Edit Modal */}
      <FormModal
        isOpen={isEditModalOpen}
        onClose={() => { setIsEditModalOpen(false); setSelectedPopup(null); }}
        onSubmit={handleEditPopup}
        title="编辑弹窗"
        fields={getEditFields()}
        submitText="保存修改"
        size="lg"
      />

      {/* Delete Dialog */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => { setIsDeleteDialogOpen(false); setSelectedPopup(null); }}
        onConfirm={handleDeletePopup}
        title="确认删除"
        message={`确认删除弹窗「${selectedPopup?.title}」？删除后不可恢复。`}
        confirmText="确认删除"
        cancelText="取消"
        variant="danger"
        loading={deleteLoading}
      />
    </div>
  );
}
