import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, Image, Eye, GripVertical, X, Check, AlertTriangle, Upload } from 'lucide-react';
import { Button } from '../../components/ui/button';

interface Banner {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  link: string;
  linkType: '活动页' | '分类页' | '商品页' | '个人中心';
  position: number;
  status: '显示' | '隐藏' | '草稿';
  startTime: string;
  endTime: string;
  clicks: number;
  gradient: string;
}

const initialBanners: Banner[] = [
  {
    id: '1',
    title: '春季新品大促',
    subtitle: '全场低至5折起',
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&h=400&fit=crop',
    link: '/activity',
    linkType: '活动页',
    position: 1,
    status: '显示',
    startTime: '2024-03-01',
    endTime: '2024-03-31',
    clicks: 12580,
    gradient: 'from-orange-500 to-red-500',
  },
  {
    id: '2',
    title: '数码产品专场',
    subtitle: '苹果华为限时优惠',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=400&fit=crop',
    link: '/category/1',
    linkType: '分类页',
    position: 2,
    status: '显示',
    startTime: '2024-03-01',
    endTime: '2024-04-30',
    clicks: 8932,
    gradient: 'from-blue-500 to-purple-500',
  },
  {
    id: '3',
    title: '美妆护肤节',
    subtitle: '大牌护肤超值套装',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&h=400&fit=crop',
    link: '/category/3',
    linkType: '分类页',
    position: 3,
    status: '显示',
    startTime: '2024-03-01',
    endTime: '2024-03-31',
    clicks: 5621,
    gradient: 'from-pink-500 to-rose-500',
  },
  {
    id: '4',
    title: '邀请好友得优惠',
    subtitle: '邀请即得50元优惠券',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&h=400&fit=crop',
    link: '/activity/invite',
    linkType: '活动页',
    position: 4,
    status: '隐藏',
    startTime: '2024-02-01',
    endTime: '2024-02-29',
    clicks: 2341,
    gradient: 'from-green-500 to-teal-500',
  },
  {
    id: '5',
    title: '会员专享日',
    subtitle: 'VIP会员专属优惠',
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&h=400&fit=crop',
    link: '/profile',
    linkType: '个人中心',
    position: 5,
    status: '草稿',
    startTime: '2024-04-01',
    endTime: '2024-04-07',
    clicks: 0,
    gradient: 'from-yellow-500 to-orange-500',
  },
];

const gradients = [
  'from-orange-500 to-red-500',
  'from-blue-500 to-purple-500',
  'from-pink-500 to-rose-500',
  'from-green-500 to-teal-500',
  'from-yellow-500 to-orange-500',
  'from-indigo-500 to-blue-500',
  'from-red-500 to-pink-500',
];

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<Banner[]>(initialBanners);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('全部');

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState<Banner | null>(null);
  const [editingBanner, setEditingBanner] = useState<Partial<Banner>>({});

  // Toast state
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({
    show: false,
    message: '',
    type: 'success',
  });

  // Form state
  const [formData, setFormData] = useState<Partial<Banner>>({
    title: '',
    subtitle: '',
    image: '',
    link: '',
    linkType: '活动页',
    position: 1,
    status: '草稿',
    startTime: new Date().toISOString().split('T')[0],
    endTime: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    gradient: 'from-orange-500 to-red-500',
  });

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ ...toast, show: false }), 3000);
  };

  const filteredBanners = banners.filter(banner => {
    const matchesSearch = banner.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === '全部' || banner.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const totalClicks = banners.reduce((sum, b) => sum + b.clicks, 0);
  const activeCount = banners.filter(b => b.status === '显示').length;

  const statusConfig = {
    '显示': 'bg-green-100 text-green-700',
    '隐藏': 'bg-gray-100 text-gray-700',
    '草稿': 'bg-yellow-100 text-yellow-700',
  };

  const handleAdd = () => {
    setFormData({
      title: '',
      subtitle: '',
      image: '',
      link: '',
      linkType: '活动页',
      position: banners.length + 1,
      status: '草稿',
      startTime: new Date().toISOString().split('T')[0],
      endTime: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      gradient: 'from-orange-500 to-red-500',
    });
    setShowAddModal(true);
  };

  const handleEdit = (banner: Banner) => {
    setEditingBanner({ ...banner });
    setShowEditModal(true);
  };

  const handleView = (banner: Banner) => {
    setSelectedBanner(banner);
    setShowDetailModal(true);
  };

  const handleDelete = (banner: Banner) => {
    setSelectedBanner(banner);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (selectedBanner) {
      setBanners(banners.filter(b => b.id !== selectedBanner.id));
      showToast(`轮播图"${selectedBanner.title}"已删除`);
      setShowDeleteModal(false);
      setSelectedBanner(null);
    }
  };

  const handleToggleStatus = (banner: Banner) => {
    const newStatus = banner.status === '显示' ? '隐藏' : banner.status === '隐藏' ? '显示' : '草稿';
    setBanners(
      banners.map(b =>
        b.id === banner.id ? { ...b, status: newStatus as Banner['status'] } : b
      )
    );
    showToast(`轮播图"${banner.title}"已${newStatus === '显示' ? '显示' : newStatus === '隐藏' ? '隐藏' : '设为草稿'}`);
  };

  const handleSaveAdd = () => {
    if (!formData.title || !formData.image) {
      showToast('请填写轮播图标题和图片', 'error');
      return;
    }
    const newBanner: Banner = {
      id: Date.now().toString(),
      title: formData.title || '',
      subtitle: formData.subtitle || '',
      image: formData.image || '',
      link: formData.link || '/',
      linkType: (formData.linkType as Banner['linkType']) || '活动页',
      position: formData.position || banners.length + 1,
      status: (formData.status as Banner['status']) || '草稿',
      startTime: formData.startTime || '',
      endTime: formData.endTime || '',
      clicks: 0,
      gradient: formData.gradient || 'from-orange-500 to-red-500',
    };
    setBanners([...banners, newBanner]);
    showToast(`轮播图"${newBanner.title}"创建成功`);
    setShowAddModal(false);
  };

  const handleSaveEdit = () => {
    if (!editingBanner.id || !editingBanner.title) {
      showToast('请填写完整信息', 'error');
      return;
    }
    setBanners(
      banners.map(b =>
        b.id === editingBanner.id ? { ...b, ...editingBanner } as Banner : b
      )
    );
    showToast(`轮播图"${editingBanner.title}"更新成功`);
    setShowEditModal(false);
    setEditingBanner({});
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
          <h2 className="text-2xl font-bold text-gray-800">轮播管理</h2>
          <p className="text-gray-500 text-sm mt-1">管理首页轮播图和广告位</p>
        </div>
        <Button onClick={handleAdd} className="bg-gradient-to-r from-orange-500 to-blue-500">
          <Plus className="w-4 h-4 mr-2" />
          添加轮播图
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center gap-2 mb-2">
            <Image className="w-5 h-5 text-blue-500" />
            <p className="text-sm text-gray-600">轮播图总数</p>
          </div>
          <p className="text-2xl font-bold text-gray-800">{banners.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center gap-2 mb-2">
            <Eye className="w-5 h-5 text-green-500" />
            <p className="text-sm text-gray-600">正在显示</p>
          </div>
          <p className="text-2xl font-bold text-green-600">{activeCount}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center gap-2 mb-2">
            <Image className="w-5 h-5 text-orange-500" />
            <p className="text-sm text-gray-600">总点击量</p>
          </div>
          <p className="text-2xl font-bold text-orange-600">{totalClicks.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center gap-2 mb-2">
            <Image className="w-5 h-5 text-purple-500" />
            <p className="text-sm text-gray-600">平均点击率</p>
          </div>
          <p className="text-2xl font-bold text-purple-600">8.5%</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="搜索轮播图标题..."
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
            <option>显示</option>
            <option>隐藏</option>
            <option>草稿</option>
          </select>
        </div>
      </div>

      {/* Banners Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredBanners.map((banner) => (
          <div key={banner.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
            {/* Preview */}
            <div className={`h-40 relative`}>
              <img
                src={banner.image}
                alt={banner.title}
                className="w-full h-full object-cover"
              />
              <div className={`absolute inset-0 bg-gradient-to-br ${banner.gradient} opacity-60`}></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white">
                  <h3 className="text-xl font-bold mb-1">{banner.title}</h3>
                  <p className="text-sm opacity-90">{banner.subtitle}</p>
                </div>
              </div>
              <div className="absolute top-3 right-3 flex gap-2">
                <span className={`px-2 py-1 backdrop-blur-sm rounded text-xs font-medium ${statusConfig[banner.status as keyof typeof statusConfig]}`}>
                  {banner.status}
                </span>
              </div>
              <div className="absolute top-3 left-3 flex items-center gap-1 bg-black/30 backdrop-blur-sm px-2 py-1 rounded text-white text-xs">
                <GripVertical className="w-3 h-3" />
                排序: {banner.position}
              </div>
            </div>

            {/* Info */}
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-gray-800">{banner.title}</h4>
                  <p className="text-sm text-gray-500">链接: {banner.linkType}</p>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => handleView(banner)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleEdit(banner)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(banner)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                <div className="p-2 bg-gray-50 rounded">
                  <p className="text-gray-500 text-xs mb-1">链接类型</p>
                  <p className="font-medium text-gray-800">{banner.linkType}</p>
                </div>
                <div className="p-2 bg-gray-50 rounded">
                  <p className="text-gray-500 text-xs mb-1">点击量</p>
                  <p className="font-medium text-orange-600">{banner.clicks.toLocaleString()}</p>
                </div>
                <div className="p-2 bg-gray-50 rounded col-span-2">
                  <p className="text-gray-500 text-xs mb-1">投放时间</p>
                  <p className="font-medium text-gray-800">{banner.startTime} 至 {banner.endTime}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1" onClick={() => handleView(banner)}>
                  <Eye className="w-4 h-4 mr-1" />
                  预览
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className={`flex-1 ${banner.status === '显示' ? 'text-red-600' : 'text-green-600'}`}
                  onClick={() => handleToggleStatus(banner)}
                >
                  {banner.status === '显示' ? '隐藏' : banner.status === '隐藏' ? '显示' : '发布'}
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
                <h3 className="text-xl font-bold text-gray-800">添加轮播图</h3>
                <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">轮播图标题</label>
                <input
                  type="text"
                  value={formData.title || ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="例如：春季新品大促"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">副标题</label>
                <input
                  type="text"
                  value={formData.subtitle || ''}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  placeholder="例如：全场低至5折起"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">图片URL</label>
                <input
                  type="text"
                  value={formData.image || ''}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                {formData.image && (
                  <div className="mt-2 rounded-lg overflow-hidden">
                    <img src={formData.image} alt="预览" className="w-full h-32 object-cover" />
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">链接类型</label>
                  <select
                    value={formData.linkType || '活动页'}
                    onChange={(e) => setFormData({ ...formData, linkType: e.target.value as Banner['linkType'] })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="活动页">活动页</option>
                    <option value="分类页">分类页</option>
                    <option value="商品页">商品页</option>
                    <option value="个人中心">个人中心</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">排序位置</label>
                  <input
                    type="number"
                    value={formData.position || 1}
                    onChange={(e) => setFormData({ ...formData, position: Number(e.target.value) })}
                    min={1}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">背景渐变</label>
                <div className="grid grid-cols-4 gap-2">
                  {gradients.map((g) => (
                    <button
                      key={g}
                      onClick={() => setFormData({ ...formData, gradient: g })}
                      className={`h-8 rounded-lg bg-gradient-to-r ${g} ${
                        formData.gradient === g ? 'ring-2 ring-orange-500' : ''
                      }`}
                    />
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">开始时间</label>
                  <input
                    type="date"
                    value={formData.startTime || ''}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">结束时间</label>
                  <input
                    type="date"
                    value={formData.endTime || ''}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">状态</label>
                <select
                  value={formData.status || '草稿'}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as Banner['status'] })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="草稿">草稿</option>
                  <option value="显示">显示</option>
                  <option value="隐藏">隐藏</option>
                </select>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowAddModal(false)}>
                取消
              </Button>
              <Button onClick={handleSaveAdd} className="bg-gradient-to-r from-orange-500 to-blue-500">
                添加轮播图
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editingBanner && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-800">编辑轮播图</h3>
                <button onClick={() => setShowEditModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">轮播图标题</label>
                <input
                  type="text"
                  value={editingBanner.title || ''}
                  onChange={(e) => setEditingBanner({ ...editingBanner, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">副标题</label>
                <input
                  type="text"
                  value={editingBanner.subtitle || ''}
                  onChange={(e) => setEditingBanner({ ...editingBanner, subtitle: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">图片URL</label>
                <input
                  type="text"
                  value={editingBanner.image || ''}
                  onChange={(e) => setEditingBanner({ ...editingBanner, image: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                {editingBanner.image && (
                  <div className="mt-2 rounded-lg overflow-hidden">
                    <img src={editingBanner.image} alt="预览" className="w-full h-32 object-cover" />
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">链接类型</label>
                  <select
                    value={editingBanner.linkType || '活动页'}
                    onChange={(e) => setEditingBanner({ ...editingBanner, linkType: e.target.value as Banner['linkType'] })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="活动页">活动页</option>
                    <option value="分类页">分类页</option>
                    <option value="商品页">商品页</option>
                    <option value="个人中心">个人中心</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">排序位置</label>
                  <input
                    type="number"
                    value={editingBanner.position || 1}
                    onChange={(e) => setEditingBanner({ ...editingBanner, position: Number(e.target.value) })}
                    min={1}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">背景渐变</label>
                <div className="grid grid-cols-4 gap-2">
                  {gradients.map((g) => (
                    <button
                      key={g}
                      onClick={() => setEditingBanner({ ...editingBanner, gradient: g })}
                      className={`h-8 rounded-lg bg-gradient-to-r ${g} ${
                        editingBanner.gradient === g ? 'ring-2 ring-orange-500' : ''
                      }`}
                    />
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">开始时间</label>
                  <input
                    type="date"
                    value={editingBanner.startTime || ''}
                    onChange={(e) => setEditingBanner({ ...editingBanner, startTime: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">结束时间</label>
                  <input
                    type="date"
                    value={editingBanner.endTime || ''}
                    onChange={(e) => setEditingBanner({ ...editingBanner, endTime: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">状态</label>
                <select
                  value={editingBanner.status || '草稿'}
                  onChange={(e) => setEditingBanner({ ...editingBanner, status: e.target.value as Banner['status'] })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="草稿">草稿</option>
                  <option value="显示">显示</option>
                  <option value="隐藏">隐藏</option>
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
      {showDetailModal && selectedBanner && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-800">轮播图详情</h3>
                <button onClick={() => setShowDetailModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className={`h-48 rounded-xl relative overflow-hidden mb-4`}>
                <img
                  src={selectedBanner.image}
                  alt={selectedBanner.title}
                  className="w-full h-full object-cover"
                />
                <div className={`absolute inset-0 bg-gradient-to-br ${selectedBanner.gradient} opacity-60`}></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white">
                    <h3 className="text-2xl font-bold mb-1">{selectedBanner.title}</h3>
                    <p className="opacity-90">{selectedBanner.subtitle}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">轮播图ID</span>
                  <span className="font-medium">{selectedBanner.id}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">链接类型</span>
                  <span className="font-medium">{selectedBanner.linkType}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">排序位置</span>
                  <span className="font-medium">第{selectedBanner.position}位</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">状态</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs ${statusConfig[selectedBanner.status as keyof typeof statusConfig]}`}>
                    {selectedBanner.status}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">投放时间</span>
                  <span className="font-medium">{selectedBanner.startTime} 至 {selectedBanner.endTime}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-500">点击量</span>
                  <span className="font-medium text-orange-600">{selectedBanner.clicks.toLocaleString()}</span>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowDetailModal(false)}>
                关闭
              </Button>
              <Button onClick={() => { setShowDetailModal(false); handleEdit(selectedBanner); }} className="bg-gradient-to-r from-orange-500 to-blue-500">
                编辑轮播图
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedBanner && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">确认删除</h3>
              <p className="text-gray-600">
                确定要删除轮播图 "{selectedBanner.title}" 吗？此操作无法撤销。
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
