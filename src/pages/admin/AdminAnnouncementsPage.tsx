import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, Volume2, Clock, Eye, Pin, X, Check, AlertTriangle, Send } from 'lucide-react';
import { Button } from '../../components/ui/button';

interface Announcement {
  id: string;
  title: string;
  content: string;
  type: 'important' | 'promotion' | 'system' | 'policy';
  typeName: string;
  author: string;
  createdAt: string;
  views: number;
  status: '已发布' | '草稿';
  isPinned: boolean;
}

const initialAnnouncements: Announcement[] = [
  {
    id: '1',
    title: '春节期间配送时间调整通知',
    content: '亲爱的用户，春节期间（2月9日-2月17日）配送时间将有所调整，部分地区可能出现延迟，感谢您的理解与支持。',
    type: 'important',
    typeName: '重要',
    author: '管理员',
    createdAt: '2024-03-20 10:00',
    views: 12580,
    status: '已发布',
    isPinned: true,
  },
  {
    id: '2',
    title: '新用户注册即送100元优惠券',
    content: '为庆祝平台上线三周年，新用户注册即可获得100元新人礼包，包含多张优惠券，欢迎体验！',
    type: 'promotion',
    typeName: '促销',
    author: '运营部',
    createdAt: '2024-03-19 15:30',
    views: 8932,
    status: '已发布',
    isPinned: true,
  },
  {
    id: '3',
    title: '平台系统维护通知',
    content: '平台将于3月25日凌晨2:00-6:00进行系统升级维护，期间部分功能可能无法使用，给您带来不便敬请谅解。',
    type: 'system',
    typeName: '系统',
    author: '技术部',
    createdAt: '2024-03-18 09:00',
    views: 5621,
    status: '已发布',
    isPinned: false,
  },
  {
    id: '4',
    title: '商品退换货政策更新',
    content: '为提升用户体验，我们优化了退换货流程，现在支持7天无理由退换货，具体政策请查看帮助中心。',
    type: 'policy',
    typeName: '政策',
    author: '客服部',
    createdAt: '2024-03-15 14:20',
    views: 3245,
    status: '已发布',
    isPinned: false,
  },
  {
    id: '5',
    title: '清明节优惠活动公告',
    content: '清明节期间（4月4日-4月6日）全场商品8折起，欢迎选购！',
    type: 'promotion',
    typeName: '促销',
    author: '运营部',
    createdAt: '2024-03-10 11:00',
    views: 4567,
    status: '草稿',
    isPinned: false,
  },
];

const typeColors = {
  'important': 'bg-red-500',
  'promotion': 'bg-orange-500',
  'system': 'bg-blue-500',
  'policy': 'bg-green-500',
};

export default function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>(initialAnnouncements);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('全部');

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Partial<Announcement>>({});

  // Toast state
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({
    show: false,
    message: '',
    type: 'success',
  });

  // Form state
  const [formData, setFormData] = useState<Partial<Announcement>>({
    title: '',
    content: '',
    type: 'important',
    typeName: '重要',
    author: '管理员',
    status: '草稿',
    isPinned: false,
  });

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ ...toast, show: false }), 3000);
  };

  const filteredAnnouncements = announcements.filter(ann => {
    const matchesSearch = ann.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === '全部' || ann.type === selectedType;
    return matchesSearch && matchesType;
  });

  const totalViews = announcements.reduce((sum, a) => sum + a.views, 0);
  const publishedCount = announcements.filter(a => a.status === '已发布').length;

  const handleAdd = () => {
    setFormData({
      title: '',
      content: '',
      type: 'important',
      typeName: '重要',
      author: '管理员',
      status: '草稿',
      isPinned: false,
    });
    setShowAddModal(true);
  };

  const handleEdit = (announcement: Announcement) => {
    setEditingAnnouncement({ ...announcement });
    setShowEditModal(true);
  };

  const handleView = (announcement: Announcement) => {
    setSelectedAnnouncement(announcement);
    setShowDetailModal(true);
  };

  const handleDelete = (announcement: Announcement) => {
    setSelectedAnnouncement(announcement);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (selectedAnnouncement) {
      setAnnouncements(announcements.filter(a => a.id !== selectedAnnouncement.id));
      showToast(`公告"${selectedAnnouncement.title}"已删除`);
      setShowDeleteModal(false);
      setSelectedAnnouncement(null);
    }
  };

  const handleTogglePin = (announcement: Announcement) => {
    setAnnouncements(
      announcements.map(a =>
        a.id === announcement.id ? { ...a, isPinned: !a.isPinned } : a
      )
    );
    showToast(announcement.isPinned ? `公告"${announcement.title}"已取消置顶` : `公告"${announcement.title}"已置顶`);
  };

  const handlePublish = (announcement: Announcement) => {
    setAnnouncements(
      announcements.map(a =>
        a.id === announcement.id ? { ...a, status: '已发布' as const, createdAt: new Date().toLocaleString('zh-CN') } : a
      )
    );
    showToast(`公告"${announcement.title}"已发布`);
  };

  const handleUnpublish = (announcement: Announcement) => {
    setAnnouncements(
      announcements.map(a =>
        a.id === announcement.id ? { ...a, status: '草稿' as const } : a
      )
    );
    showToast(`公告"${announcement.title}"已撤回`);
  };

  const handleSaveAdd = () => {
    if (!formData.title || !formData.content) {
      showToast('请填写公告标题和内容', 'error');
      return;
    }
    const typeNames: Record<string, string> = {
      'important': '重要',
      'promotion': '促销',
      'system': '系统',
      'policy': '政策',
    };
    const newAnnouncement: Announcement = {
      id: Date.now().toString(),
      title: formData.title || '',
      content: formData.content || '',
      type: (formData.type as Announcement['type']) || 'important',
      typeName: typeNames[formData.type as string] || '重要',
      author: formData.author || '管理员',
      createdAt: new Date().toLocaleString('zh-CN'),
      views: 0,
      status: (formData.status as Announcement['status']) || '草稿',
      isPinned: formData.isPinned || false,
    };
    setAnnouncements([newAnnouncement, ...announcements]);
    showToast(`公告"${newAnnouncement.title}"创建成功`);
    setShowAddModal(false);
  };

  const handleSaveEdit = () => {
    if (!editingAnnouncement.id || !editingAnnouncement.title) {
      showToast('请填写完整信息', 'error');
      return;
    }
    const typeNames: Record<string, string> = {
      'important': '重要',
      'promotion': '促销',
      'system': '系统',
      'policy': '政策',
    };
    setAnnouncements(
      announcements.map(a =>
        a.id === editingAnnouncement.id
          ? {
              ...a,
              ...editingAnnouncement,
              typeName: typeNames[editingAnnouncement.type as string] || a.typeName,
            }
          : a
      )
    );
    showToast(`公告"${editingAnnouncement.title}"更新成功`);
    setShowEditModal(false);
    setEditingAnnouncement({});
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
          <h2 className="text-2xl font-bold text-gray-800">公告管理</h2>
          <p className="text-gray-500 text-sm mt-1">发布和管理平台公告</p>
        </div>
        <Button onClick={handleAdd} className="bg-gradient-to-r from-orange-500 to-blue-500">
          <Plus className="w-4 h-4 mr-2" />
          发布公告
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center gap-2 mb-2">
            <Volume2 className="w-5 h-5 text-blue-500" />
            <p className="text-sm text-gray-600">总公告数</p>
          </div>
          <p className="text-2xl font-bold text-gray-800">{announcements.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center gap-2 mb-2">
            <Eye className="w-5 h-5 text-green-500" />
            <p className="text-sm text-gray-600">总浏览量</p>
          </div>
          <p className="text-2xl font-bold text-green-600">{(totalViews / 10000).toFixed(1)}万</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-5 h-5 text-orange-500" />
            <p className="text-sm text-gray-600">已发布</p>
          </div>
          <p className="text-2xl font-bold text-orange-600">{publishedCount}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center gap-2 mb-2">
            <Pin className="w-5 h-5 text-red-500" />
            <p className="text-sm text-gray-600">置顶公告</p>
          </div>
          <p className="text-2xl font-bold text-red-600">
            {announcements.filter(a => a.isPinned).length}
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
              placeholder="搜索公告标题..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option>全部</option>
            <option value="important">重要</option>
            <option value="promotion">促销</option>
            <option value="system">系统</option>
            <option value="policy">政策</option>
          </select>
        </div>
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {filteredAnnouncements.map((announcement) => (
          <div key={announcement.id} className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 ${typeColors[announcement.type as keyof typeof typeColors]} rounded-xl flex items-center justify-center text-white text-xl`}>
                  <Volume2 className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <h3 className="font-semibold text-gray-800">{announcement.title}</h3>
                    {announcement.isPinned && (
                      <span className="px-2 py-0.5 bg-red-100 text-red-600 text-xs rounded-full flex items-center gap-1">
                        <Pin className="w-3 h-3" />
                        置顶
                      </span>
                    )}
                    <span className={`px-2 py-0.5 ${typeColors[announcement.type as keyof typeof typeColors]} text-white text-xs rounded-full`}>
                      {announcement.typeName}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                      announcement.status === '已发布' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {announcement.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{announcement.content}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500 flex-wrap">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {announcement.createdAt}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {announcement.views.toLocaleString()} 次浏览
                    </span>
                    <span>发布者: {announcement.author}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <Button variant="outline" size="sm" onClick={() => handleView(announcement)}>
                  <Eye className="w-4 h-4 mr-1" />
                  预览
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleEdit(announcement)}>
                  <Edit className="w-4 h-4 mr-1" />
                  编辑
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleTogglePin(announcement)}
                  className={announcement.isPinned ? 'text-red-600' : 'text-blue-600'}
                >
                  <Pin className="w-4 h-4 mr-1" />
                  {announcement.isPinned ? '取消置顶' : '置顶'}
                </Button>
                {announcement.status === '草稿' ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePublish(announcement)}
                    className="text-green-600"
                  >
                    <Send className="w-4 h-4 mr-1" />
                    发布
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleUnpublish(announcement)}
                    className="text-orange-600"
                  >
                    撤回
                  </Button>
                )}
                <Button variant="outline" size="sm" className="text-red-600 hover:bg-red-50" onClick={() => handleDelete(announcement)}>
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
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-800">发布公告</h3>
                <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">公告标题</label>
                <input
                  type="text"
                  value={formData.title || ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="请输入公告标题"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">公告内容</label>
                <textarea
                  value={formData.content || ''}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="请输入公告内容"
                  rows={5}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">公告类型</label>
                  <select
                    value={formData.type || 'important'}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as Announcement['type'] })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="important">重要</option>
                    <option value="promotion">促销</option>
                    <option value="system">系统</option>
                    <option value="policy">政策</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">发布者</label>
                  <input
                    type="text"
                    value={formData.author || '管理员'}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.isPinned || false}
                    onChange={(e) => setFormData({ ...formData, isPinned: e.target.checked })}
                    className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                  />
                  <span className="text-sm text-gray-700">置顶公告</span>
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">发布状态</label>
                <select
                  value={formData.status || '草稿'}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as Announcement['status'] })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="草稿">草稿</option>
                  <option value="已发布">立即发布</option>
                </select>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowAddModal(false)}>
                取消
              </Button>
              <Button onClick={handleSaveAdd} className="bg-gradient-to-r from-orange-500 to-blue-500">
                发布公告
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editingAnnouncement && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-800">编辑公告</h3>
                <button onClick={() => setShowEditModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">公告标题</label>
                <input
                  type="text"
                  value={editingAnnouncement.title || ''}
                  onChange={(e) => setEditingAnnouncement({ ...editingAnnouncement, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">公告内容</label>
                <textarea
                  value={editingAnnouncement.content || ''}
                  onChange={(e) => setEditingAnnouncement({ ...editingAnnouncement, content: e.target.value })}
                  rows={5}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">公告类型</label>
                  <select
                    value={editingAnnouncement.type || 'important'}
                    onChange={(e) => setEditingAnnouncement({ ...editingAnnouncement, type: e.target.value as Announcement['type'] })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="important">重要</option>
                    <option value="promotion">促销</option>
                    <option value="system">系统</option>
                    <option value="policy">政策</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">发布者</label>
                  <input
                    type="text"
                    value={editingAnnouncement.author || ''}
                    onChange={(e) => setEditingAnnouncement({ ...editingAnnouncement, author: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={editingAnnouncement.isPinned || false}
                    onChange={(e) => setEditingAnnouncement({ ...editingAnnouncement, isPinned: e.target.checked })}
                    className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                  />
                  <span className="text-sm text-gray-700">置顶公告</span>
                </label>
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
      {showDetailModal && selectedAnnouncement && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-800">公告详情</h3>
                <button onClick={() => setShowDetailModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 ${typeColors[selectedAnnouncement.type as keyof typeof typeColors]} rounded-lg flex items-center justify-center text-white`}>
                  <Volume2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">{selectedAnnouncement.title}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`px-2 py-0.5 ${typeColors[selectedAnnouncement.type as keyof typeof typeColors]} text-white text-xs rounded-full`}>
                      {selectedAnnouncement.typeName}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                      selectedAnnouncement.status === '已发布' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {selectedAnnouncement.status}
                    </span>
                    {selectedAnnouncement.isPinned && (
                      <span className="px-2 py-0.5 bg-red-100 text-red-600 text-xs rounded-full flex items-center gap-1">
                        <Pin className="w-3 h-3" />
                        置顶
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 mb-4">
                <p className="text-gray-700 whitespace-pre-wrap">{selectedAnnouncement.content}</p>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">公告ID</span>
                  <span className="font-medium">{selectedAnnouncement.id}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">发布者</span>
                  <span className="font-medium">{selectedAnnouncement.author}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">发布时间</span>
                  <span className="font-medium">{selectedAnnouncement.createdAt}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-500">浏览量</span>
                  <span className="font-medium text-blue-600">{selectedAnnouncement.views.toLocaleString()} 次</span>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowDetailModal(false)}>
                关闭
              </Button>
              <Button onClick={() => { setShowDetailModal(false); handleEdit(selectedAnnouncement); }} className="bg-gradient-to-r from-orange-500 to-blue-500">
                编辑公告
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedAnnouncement && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">确认删除</h3>
              <p className="text-gray-600">
                确定要删除公告 "{selectedAnnouncement.title}" 吗？此操作无法撤销。
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
