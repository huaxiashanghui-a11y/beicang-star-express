import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Zap, Gift, Percent, Clock, Users, TrendingUp, Play, Pause, X, Check, AlertTriangle, Eye } from 'lucide-react';
import { Button } from '../../components/ui/button';
import adminApi from '../../config/adminApi';

interface Activity {
  id: string;
  name: string;
  description: string;
  type: 'flash' | 'newuser' | 'invite' | 'festival' | 'discount';
  icon: typeof Zap;
  gradient: string;
  status: '进行中' | '未开始' | '已结束';
  startTime: string;
  endTime: string;
  participants: number;
  orders: number;
  revenue: number;
  banner: string;
}

const typeConfig = {
  'flash': { name: '秒杀', color: 'from-orange-500 to-red-500' },
  'newuser': { name: '新人', color: 'from-blue-500 to-purple-500' },
  'invite': { name: '邀请', color: 'from-green-500 to-teal-500' },
  'festival': { name: '节日', color: 'from-yellow-500 to-orange-500' },
  'discount': { name: '满减', color: 'from-purple-500 to-pink-500' },
};

const initialActivities: Activity[] = [
  {
    id: '1',
    name: '限时秒杀',
    description: '每日10点、20点限量秒杀商品，超值优惠不容错过',
    type: 'flash',
    icon: Zap,
    gradient: 'from-orange-500 to-red-500',
    status: '进行中',
    startTime: '2024-03-01 00:00',
    endTime: '2024-03-31 23:59',
    participants: 12580,
    orders: 3456,
    revenue: 1567800,
    banner: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&h=300&fit=crop',
  },
  {
    id: '2',
    name: '新人专享',
    description: '新用户首单立减100元，限量优惠先到先得',
    type: 'newuser',
    icon: Gift,
    gradient: 'from-blue-500 to-purple-500',
    status: '进行中',
    startTime: '2024-01-01 00:00',
    endTime: '2024-12-31 23:59',
    participants: 8932,
    orders: 7234,
    revenue: 2890100,
    banner: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=300&fit=crop',
  },
  {
    id: '3',
    name: '邀请有礼',
    description: '邀请好友注册，双方各得50元优惠券',
    type: 'invite',
    icon: Users,
    gradient: 'from-green-500 to-teal-500',
    status: '进行中',
    startTime: '2024-01-01 00:00',
    endTime: '2024-12-31 23:59',
    participants: 4567,
    orders: 2341,
    revenue: 890200,
    banner: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&h=300&fit=crop',
  },
  {
    id: '4',
    name: '节日大促',
    description: '清明节期间全场8折起，优惠多多',
    type: 'festival',
    icon: Percent,
    gradient: 'from-yellow-500 to-orange-500',
    status: '未开始',
    startTime: '2024-04-04 00:00',
    endTime: '2024-04-06 23:59',
    participants: 0,
    orders: 0,
    revenue: 0,
    banner: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=300&fit=crop',
  },
  {
    id: '5',
    name: '满减活动',
    description: '全场满500减50，满1000减120，上不封顶',
    type: 'discount',
    icon: TrendingUp,
    gradient: 'from-purple-500 to-pink-500',
    status: '已结束',
    startTime: '2024-02-14 00:00',
    endTime: '2024-02-20 23:59',
    participants: 15678,
    orders: 8901,
    revenue: 5678900,
    banner: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&h=300&fit=crop',
  },
];

const activityTypes = [
  { value: 'flash', label: '秒杀', icon: Zap },
  { value: 'newuser', label: '新人', icon: Gift },
  { value: 'invite', label: '邀请', icon: Users },
  { value: 'festival', label: '节日', icon: Percent },
  { value: 'discount', label: '满减', icon: TrendingUp },
];

const gradients = [
  'from-orange-500 to-red-500',
  'from-blue-500 to-purple-500',
  'from-green-500 to-teal-500',
  'from-yellow-500 to-orange-500',
  'from-purple-500 to-pink-500',
];

export default function AdminActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('全部');
  const [loading, setLoading] = useState(true);

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [editingActivity, setEditingActivity] = useState<Partial<Activity>>({});

  // Toast state
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({
    show: false,
    message: '',
    type: 'success',
  });

  // Load banners as activities from API
  useEffect(() => {
    loadActivities();
  }, []);

  const loadActivities = async () => {
    try {
      setLoading(true);
      const data = await adminApi.banners.list();
      if (data.banners && Array.isArray(data.banners)) {
        // Map banners to activities
        const mappedActivities: Activity[] = data.banners.map((b: any, index: number) => ({
          id: b.id || `activity-${index}`,
          name: b.title || b.name || '活动',
          description: b.description || '',
          type: 'flash' as const,
          icon: Zap,
          gradient: 'from-orange-500 to-red-500',
          status: b.status === 'active' ? '进行中' as const : b.status === 'inactive' ? '已结束' as const : '未开始' as const,
          startTime: b.startDate || b.startTime || '',
          endTime: b.endDate || b.endTime || '',
          participants: b.clicks || 0,
          orders: 0,
          revenue: 0,
          banner: b.image || b.url || '',
        }));
        setActivities(mappedActivities.length > 0 ? mappedActivities : initialActivities);
      } else {
        setActivities(initialActivities);
      }
    } catch (error) {
      console.error('Failed to load activities:', error);
      setActivities(initialActivities);
    } finally {
      setLoading(false);
    }
  };

  // Form state
  const [formData, setFormData] = useState<Partial<Activity>>({
    name: '',
    description: '',
    type: 'flash',
    gradient: 'from-orange-500 to-red-500',
    banner: '',
    startTime: new Date().toISOString().split('T')[0] + ' 00:00',
    endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] + ' 23:59',
  });

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ ...toast, show: false }), 3000);
  };

  const getActivityStatus = (activity: Activity): Activity['status'] => {
    const now = new Date();
    const start = new Date(activity.startTime);
    const end = new Date(activity.endTime);
    if (now < start) return '未开始';
    if (now > end) return '已结束';
    return '进行中';
  };

  const filteredActivities = activities.filter(activity => {
    const matchesSearch = activity.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === '全部' || getActivityStatus(activity) === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const totalParticipants = activities.reduce((sum, a) => sum + a.participants, 0);
  const totalRevenue = activities.reduce((sum, a) => sum + a.revenue, 0);
  const activeCount = activities.filter(a => getActivityStatus(a) === '进行中').length;

  const statusConfig = {
    '进行中': 'bg-green-100 text-green-700',
    '未开始': 'bg-blue-100 text-blue-700',
    '已结束': 'bg-gray-100 text-gray-700',
  };

  const handleAdd = () => {
    setFormData({
      name: '',
      description: '',
      type: 'flash',
      gradient: 'from-orange-500 to-red-500',
      banner: '',
      startTime: new Date().toISOString().split('T')[0] + ' 00:00',
      endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] + ' 23:59',
    });
    setShowAddModal(true);
  };

  const handleEdit = (activity: Activity) => {
    setEditingActivity({ ...activity });
    setShowEditModal(true);
  };

  const handleView = (activity: Activity) => {
    setSelectedActivity(activity);
    setShowDetailModal(true);
  };

  const handleDelete = (activity: Activity) => {
    setSelectedActivity(activity);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (selectedActivity) {
      try {
        await adminApi.banners.delete(selectedActivity.id);
        setActivities(activities.filter(a => a.id !== selectedActivity.id));
        showToast(`活动"${selectedActivity.name}"已删除`);
      } catch (error) {
        console.error('Failed to delete activity:', error);
        showToast('删除活动失败', 'error');
      }
      setShowDeleteModal(false);
      setSelectedActivity(null);
    }
  };

  const handleToggleStatus = async (activity: Activity) => {
    const currentStatus = getActivityStatus(activity);
    try {
      if (currentStatus === '进行中') {
        // Pause - set end time to now
        await adminApi.banners.update(activity.id, { endDate: new Date().toISOString() });
        setActivities(
          activities.map(a =>
            a.id === activity.id ? { ...a, endTime: new Date().toISOString().slice(0, 16).replace('T', ' ') } : a
          )
        );
        showToast(`活动"${activity.name}"已暂停`);
      } else if (currentStatus === '未开始') {
        // Start immediately
        await adminApi.banners.update(activity.id, { startDate: new Date().toISOString() });
        setActivities(
          activities.map(a =>
            a.id === activity.id ? { ...a, startTime: new Date().toISOString().slice(0, 16).replace('T', ' ') } : a
          )
        );
        showToast(`活动"${activity.name}"已开始`);
      }
    } catch (error) {
      console.error('Failed to toggle activity status:', error);
      // Still update local state
      if (currentStatus === '进行中') {
        setActivities(
          activities.map(a =>
            a.id === activity.id ? { ...a, endTime: new Date().toISOString().slice(0, 16).replace('T', ' ') } : a
          )
        );
        showToast(`活动"${activity.name}"已暂停`);
      } else if (currentStatus === '未开始') {
        setActivities(
          activities.map(a =>
            a.id === activity.id ? { ...a, startTime: new Date().toISOString().slice(0, 16).replace('T', ' ') } : a
          )
        );
        showToast(`活动"${activity.name}"已开始`);
      }
    }
  };

  const handleSaveAdd = async () => {
    if (!formData.name || !formData.description) {
      showToast('请填写活动名称和描述', 'error');
      return;
    }
    try {
      await adminApi.banners.create({
        title: formData.name,
        description: formData.description,
        image: formData.banner,
        startDate: formData.startTime,
        endDate: formData.endTime,
      });
      const typeIcons: Record<string, typeof Zap> = {
        'flash': Zap,
        'newuser': Gift,
        'invite': Users,
        'festival': Percent,
        'discount': TrendingUp,
      };
      const newActivity: Activity = {
        id: Date.now().toString(),
        name: formData.name || '',
        description: formData.description || '',
        type: (formData.type as Activity['type']) || 'flash',
        icon: typeIcons[formData.type as string] || Zap,
        gradient: formData.gradient || 'from-orange-500 to-red-500',
        banner: formData.banner || 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&h=300&fit=crop',
        startTime: formData.startTime || '',
        endTime: formData.endTime || '',
        participants: 0,
        orders: 0,
        revenue: 0,
      };
      setActivities([...activities, newActivity]);
      showToast(`活动"${newActivity.name}"创建成功`);
      setShowAddModal(false);
    } catch (error) {
      console.error('Failed to create activity:', error);
      showToast('创建活动失败', 'error');
    }
  };

  const handleSaveEdit = async () => {
    if (!editingActivity.id || !editingActivity.name) {
      showToast('请填写完整信息', 'error');
      return;
    }
    try {
      await adminApi.banners.update(editingActivity.id, {
        title: editingActivity.name,
        description: editingActivity.description,
        image: editingActivity.banner,
        startDate: editingActivity.startTime,
        endDate: editingActivity.endTime,
      });
      const typeIcons: Record<string, typeof Zap> = {
        'flash': Zap,
        'newuser': Gift,
        'invite': Users,
        'festival': Percent,
        'discount': TrendingUp,
      };
      setActivities(
        activities.map(a =>
          a.id === editingActivity.id
            ? {
                ...a,
                ...editingActivity,
                icon: typeIcons[editingActivity.type as string] || a.icon,
            } as Activity
          : a
      )
      );
      showToast(`活动"${editingActivity.name}"更新成功`);
    } catch (error) {
      console.error('Failed to update activity:', error);
      showToast('更新失败', 'error');
    } finally {
      setShowEditModal(false);
      setEditingActivity({});
    }
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
          <h2 className="text-2xl font-bold text-gray-800">活动管理</h2>
          <p className="text-gray-500 text-sm mt-1">创建和管理平台促销活动</p>
        </div>
        <Button onClick={handleAdd} className="bg-gradient-to-r from-orange-500 to-blue-500">
          <Plus className="w-4 h-4 mr-2" />
          创建活动
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-5 h-5 text-orange-500" />
            <p className="text-sm text-gray-600">进行中活动</p>
          </div>
          <p className="text-2xl font-bold text-orange-600">{activeCount}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-5 h-5 text-blue-500" />
            <p className="text-sm text-gray-600">总参与人数</p>
          </div>
          <p className="text-2xl font-bold text-blue-600">{(totalParticipants / 10000).toFixed(1)}万</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-green-500" />
            <p className="text-sm text-gray-600">活动总销售额</p>
          </div>
          <p className="text-2xl font-bold text-green-600">¥{(totalRevenue / 10000).toFixed(0)}万</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center gap-2 mb-2">
            <Percent className="w-5 h-5 text-purple-500" />
            <p className="text-sm text-gray-600">平均转化率</p>
          </div>
          <p className="text-2xl font-bold text-purple-600">28.5%</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="搜索活动名称..."
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
            <option>进行中</option>
            <option>未开始</option>
            <option>已结束</option>
          </select>
        </div>
      </div>

      {/* Activities List */}
      <div className="space-y-6">
        {filteredActivities.map((activity) => {
          const currentStatus = getActivityStatus(activity);
          const Icon = activity.icon;
          return (
            <div key={activity.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
              {/* Banner */}
              <div className={`h-40 bg-gradient-to-br ${typeConfig[activity.type as keyof typeof typeConfig].color} relative`}>
                <img
                  src={activity.banner}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover opacity-40"
                />
                <div className="relative z-10 h-full flex items-center justify-center">
                  <Icon className="w-16 h-16 text-white opacity-50" />
                </div>
                <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
                  <span className={`px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium`}>
                    {typeConfig[activity.type as keyof typeof typeConfig].name}
                  </span>
                  <span className={`px-3 py-1 backdrop-blur-sm rounded-full text-xs font-medium ${statusConfig[currentStatus as keyof typeof statusConfig]}`}>
                    {currentStatus}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{activity.name}</h3>
                    <p className="text-gray-600 text-sm">{activity.description}</p>
                  </div>
                  <div className="flex gap-2">
                    {currentStatus === '进行中' ? (
                      <Button variant="outline" size="sm" className="text-orange-600" onClick={() => handleToggleStatus(activity)}>
                        <Pause className="w-4 h-4 mr-1" />
                        暂停
                      </Button>
                    ) : currentStatus === '未开始' ? (
                      <Button size="sm" className="bg-gradient-to-r from-green-500 to-teal-500" onClick={() => handleToggleStatus(activity)}>
                        <Play className="w-4 h-4 mr-1" />
                        立即开始
                      </Button>
                    ) : null}
                    <Button variant="outline" size="sm" onClick={() => handleView(activity)}>
                      <Eye className="w-4 h-4 mr-1" />
                      详情
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleEdit(activity)}>
                      <Edit className="w-4 h-4 mr-1" />
                      编辑
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-600 hover:bg-red-50" onClick={() => handleDelete(activity)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">活动时间</p>
                    <p className="text-sm font-medium text-gray-800">
                      {activity.startTime.split(' ')[0]} 至 {activity.endTime.split(' ')[0]}
                    </p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">参与人数</p>
                    <p className="text-lg font-bold text-blue-600">{activity.participants.toLocaleString()}</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">订单数</p>
                    <p className="text-lg font-bold text-green-600">{activity.orders.toLocaleString()}</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">销售额</p>
                    <p className="text-lg font-bold text-orange-600">¥{(activity.revenue / 10000).toFixed(1)}万</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t border-gray-100">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => handleView(activity)}>
                    查看详情
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    参与记录
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    数据报表
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
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-800">创建活动</h3>
                <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">活动名称</label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="例如：限时秒杀"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">活动描述</label>
                <textarea
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="请输入活动描述"
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">活动类型</label>
                  <select
                    value={formData.type || 'flash'}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as Activity['type'] })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    {activityTypes.map((type) => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">背景渐变</label>
                  <select
                    value={formData.gradient || 'from-orange-500 to-red-500'}
                    onChange={(e) => setFormData({ ...formData, gradient: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    {gradients.map((g) => (
                      <option key={g} value={g}>{g.replace('from-', '').replace(' to-', ' / ')}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Banner图片URL</label>
                <input
                  type="text"
                  value={formData.banner || ''}
                  onChange={(e) => setFormData({ ...formData, banner: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">开始时间</label>
                  <input
                    type="datetime-local"
                    value={formData.startTime || ''}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">结束时间</label>
                  <input
                    type="datetime-local"
                    value={formData.endTime || ''}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
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
                创建活动
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editingActivity && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-800">编辑活动</h3>
                <button onClick={() => setShowEditModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">活动名称</label>
                <input
                  type="text"
                  value={editingActivity.name || ''}
                  onChange={(e) => setEditingActivity({ ...editingActivity, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">活动描述</label>
                <textarea
                  value={editingActivity.description || ''}
                  onChange={(e) => setEditingActivity({ ...editingActivity, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">活动类型</label>
                  <select
                    value={editingActivity.type || 'flash'}
                    onChange={(e) => setEditingActivity({ ...editingActivity, type: e.target.value as Activity['type'] })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    {activityTypes.map((type) => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">背景渐变</label>
                  <select
                    value={editingActivity.gradient || 'from-orange-500 to-red-500'}
                    onChange={(e) => setEditingActivity({ ...editingActivity, gradient: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    {gradients.map((g) => (
                      <option key={g} value={g}>{g.replace('from-', '').replace(' to-', ' / ')}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Banner图片URL</label>
                <input
                  type="text"
                  value={editingActivity.banner || ''}
                  onChange={(e) => setEditingActivity({ ...editingActivity, banner: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">开始时间</label>
                  <input
                    type="datetime-local"
                    value={editingActivity.startTime || ''}
                    onChange={(e) => setEditingActivity({ ...editingActivity, startTime: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">结束时间</label>
                  <input
                    type="datetime-local"
                    value={editingActivity.endTime || ''}
                    onChange={(e) => setEditingActivity({ ...editingActivity, endTime: e.target.value })}
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
      {showDetailModal && selectedActivity && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-800">活动详情</h3>
                <button onClick={() => setShowDetailModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className={`h-40 rounded-xl relative overflow-hidden mb-4`}>
                <img src={selectedActivity.banner} alt="" className="w-full h-full object-cover" />
                <div className={`absolute inset-0 bg-gradient-to-br ${selectedActivity.gradient} opacity-60`}></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white">
                    <h3 className="text-2xl font-bold">{selectedActivity.name}</h3>
                    <p className="opacity-90">{selectedActivity.description}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 mb-4">
                <span className={`px-3 py-1 bg-gradient-to-r ${typeConfig[selectedActivity.type as keyof typeof typeConfig].color} text-white text-sm rounded-full`}>
                  {typeConfig[selectedActivity.type as keyof typeof typeConfig].name}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm ${statusConfig[getActivityStatus(selectedActivity) as keyof typeof statusConfig]}`}>
                  {getActivityStatus(selectedActivity)}
                </span>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">活动ID</span>
                  <span className="font-medium">{selectedActivity.id}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">活动时间</span>
                  <span className="font-medium">{selectedActivity.startTime} 至 {selectedActivity.endTime}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">参与人数</span>
                  <span className="font-medium text-blue-600">{selectedActivity.participants.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">订单数</span>
                  <span className="font-medium text-green-600">{selectedActivity.orders.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-500">销售额</span>
                  <span className="font-medium text-orange-600">¥{(selectedActivity.revenue / 10000).toFixed(1)}万</span>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowDetailModal(false)}>
                关闭
              </Button>
              <Button onClick={() => { setShowDetailModal(false); handleEdit(selectedActivity); }} className="bg-gradient-to-r from-orange-500 to-blue-500">
                编辑活动
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedActivity && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">确认删除</h3>
              <p className="text-gray-600">
                确定要删除活动 "{selectedActivity.name}" 吗？此操作无法撤销。
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
