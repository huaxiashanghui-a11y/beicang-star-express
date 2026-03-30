import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, MessageCircle, Phone, Mail, User, Clock, CheckCircle, X, Check, AlertTriangle, Eye } from 'lucide-react';
import { Button } from '../../components/ui/button';
import adminApi from '../../config/adminApi';

interface Staff {
  id: string;
  name: string;
  avatar: string;
  role: string;
  status: '在线' | '离线' | '忙碌';
  department: string;
  todayConversations: number;
  avgResponseTime: string;
  satisfaction: number;
  unresolved: number;
  phone: string;
  email: string;
}

interface Chat {
  id: string;
  user: string;
  message: string;
  time: string;
  status: '待回复' | '处理中' | '已回复';
}

const initialStaff: Staff[] = [
  {
    id: '1',
    name: '张小明',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    role: '客服主管',
    status: '在线',
    department: '售前客服',
    todayConversations: 45,
    avgResponseTime: '< 1分钟',
    satisfaction: 98.5,
    unresolved: 3,
    phone: '+95 9 123 4567',
    email: 'zhangxm@beicang.com',
  },
  {
    id: '2',
    name: '李婷婷',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    role: '客服专员',
    status: '在线',
    department: '售前客服',
    todayConversations: 38,
    avgResponseTime: '< 2分钟',
    satisfaction: 96.8,
    unresolved: 5,
    phone: '+95 9 234 5678',
    email: 'liting@beicang.com',
  },
  {
    id: '3',
    name: '王建国',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    role: '客服专员',
    status: '离线',
    department: '售后客服',
    todayConversations: 28,
    avgResponseTime: '< 3分钟',
    satisfaction: 94.2,
    unresolved: 2,
    phone: '+95 9 345 6789',
    email: 'wangjg@beicang.com',
  },
  {
    id: '4',
    name: '陈美玲',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    role: '客服专员',
    status: '在线',
    department: '售后客服',
    todayConversations: 32,
    avgResponseTime: '< 1分钟',
    satisfaction: 97.5,
    unresolved: 4,
    phone: '+95 9 456 7890',
    email: 'chenml@beicang.com',
  },
  {
    id: '5',
    name: '刘伟',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
    role: '客服专员',
    status: '忙碌',
    department: '售前客服',
    todayConversations: 52,
    avgResponseTime: '< 2分钟',
    satisfaction: 95.8,
    unresolved: 6,
    phone: '+95 9 567 8901',
    email: 'liuw@beicang.com',
  },
];

const initialChats: Chat[] = [
  { id: '1', user: '张伟', message: '我的订单什么时候发货？', time: '2分钟前', status: '待回复' },
  { id: '2', user: '李娜', message: '商品有质量问题想退货', time: '5分钟前', status: '处理中' },
  { id: '3', user: '王强', message: '请问支持哪些支付方式？', time: '8分钟前', status: '已回复' },
  { id: '4', user: '赵敏', message: '忘记密码了怎么办', time: '12分钟前', status: '已回复' },
  { id: '5', user: '陈刚', message: '商品与描述不符', time: '15分钟前', status: '待回复' },
];

export default function AdminCustomerServicePage() {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [chats, setChats] = useState<Chat[]>(initialChats);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('全部');
  const [loading, setLoading] = useState(true);

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedStaffMember, setSelectedStaffMember] = useState<Staff | null>(null);
  const [editingStaff, setEditingStaff] = useState<Partial<Staff>>({});

  // Toast state
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({
    show: false,
    message: '',
    type: 'success',
  });

  // Load tickets from API
  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    try {
      setLoading(true);
      const data = await adminApi.tickets.list();
      if (data.tickets) {
        setChats(data.tickets.map((t: any) => ({
          id: t.id,
          user: t.userName || t.user || '用户',
          message: t.content || t.message || '',
          time: t.createdAt || new Date().toLocaleString('zh-CN'),
          status: t.status === 'pending' ? '待回复' : t.status === 'processing' ? '处理中' : '已回复',
        })));
      }
    } catch (error) {
      console.error('Failed to load tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  // Form state
  const [formData, setFormData] = useState<Partial<Staff>>({
    name: '',
    avatar: '',
    role: '客服专员',
    status: '离线',
    department: '售前客服',
    phone: '',
    email: '',
    todayConversations: 0,
    avgResponseTime: '< 1分钟',
    satisfaction: 100,
    unresolved: 0,
  });

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ ...toast, show: false }), 3000);
  };

  const filteredStaff = staff.filter(staffMember => {
    const matchesSearch = staffMember.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === '全部' || staffMember.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const totalConversations = staff.reduce((sum, s) => sum + s.todayConversations, 0);
  const onlineCount = staff.filter(s => s.status === '在线').length;
  const totalUnresolved = staff.reduce((sum, s) => sum + s.unresolved, 0);

  const statusColors = {
    '在线': 'bg-green-500',
    '离线': 'bg-gray-400',
    '忙碌': 'bg-orange-500',
  };

  const handleAdd = () => {
    setFormData({
      name: '',
      avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop`,
      role: '客服专员',
      status: '离线',
      department: '售前客服',
      phone: '',
      email: '',
    });
    setShowAddModal(true);
  };

  const handleEdit = (staffMember: Staff) => {
    setEditingStaff({ ...staffMember });
    setShowEditModal(true);
  };

  const handleView = (staffMember: Staff) => {
    setSelectedStaffMember(staffMember);
    setShowDetailModal(true);
  };

  const handleDelete = (staffMember: Staff) => {
    setSelectedStaffMember(staffMember);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (selectedStaffMember) {
      // For now, just update local state since there's no delete staff API
      setStaff(staff.filter(s => s.id !== selectedStaffMember.id));
      showToast(`客服"${selectedStaffMember.name}"已删除`);
      setShowDeleteModal(false);
      setSelectedStaffMember(null);
    }
  };

  const handleToggleStatus = async (staffMember: Staff) => {
    const statusOrder: Staff['status'][] = ['离线', '在线', '忙碌'];
    const currentIndex = statusOrder.indexOf(staffMember.status);
    const nextStatus = statusOrder[(currentIndex + 1) % statusOrder.length];
    try {
      // Update via API if available
      await adminApi.tickets.reply(staffMember.id, `状态更新为: ${nextStatus}`);
      setStaff(
        staff.map(s =>
          s.id === staffMember.id ? { ...s, status: nextStatus } : s
        )
      );
      showToast(`客服"${staffMember.name}"已设为${nextStatus}`);
    } catch (error) {
      // Update local state anyway
      setStaff(
        staff.map(s =>
          s.id === staffMember.id ? { ...s, status: nextStatus } : s
        )
      );
      showToast(`客服"${staffMember.name}"已设为${nextStatus}`);
    }
  };

  const handleSaveAdd = () => {
    if (!formData.name || !formData.email) {
      showToast('请填写姓名和邮箱', 'error');
      return;
    }
    const newStaffMember: Staff = {
      id: Date.now().toString(),
      name: formData.name || '',
      avatar: formData.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
      role: formData.role || '客服专员',
      status: (formData.status as Staff['status']) || '离线',
      department: formData.department || '售前客服',
      phone: formData.phone || '',
      email: formData.email || '',
      todayConversations: 0,
      avgResponseTime: '< 1分钟',
      satisfaction: 100,
      unresolved: 0,
    };
    setStaff([...staff, newStaffMember]);
    showToast(`客服"${newStaffMember.name}"添加成功`);
    setShowAddModal(false);
  };

  const handleSaveEdit = () => {
    if (!editingStaff.id || !editingStaff.name) {
      showToast('请填写完整信息', 'error');
      return;
    }
    setStaff(
      staff.map(s =>
        s.id === editingStaff.id ? { ...s, ...editingStaff } as Staff : s
      )
    );
    showToast(`客服"${editingStaff.name}"更新成功`);
    setShowEditModal(false);
    setEditingStaff({});
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
          <h2 className="text-2xl font-bold text-gray-800">客服管理</h2>
          <p className="text-gray-500 text-sm mt-1">管理客服团队和会话记录</p>
        </div>
        <Button onClick={handleAdd} className="bg-gradient-to-r from-orange-500 to-blue-500">
          <Plus className="w-4 h-4 mr-2" />
          添加客服
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center gap-2 mb-2">
            <MessageCircle className="w-5 h-5 text-blue-500" />
            <p className="text-sm text-gray-600">今日会话</p>
          </div>
          <p className="text-2xl font-bold text-gray-800">{totalConversations}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <p className="text-sm text-gray-600">在线客服</p>
          </div>
          <p className="text-2xl font-bold text-green-600">{onlineCount}人</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-5 h-5 text-orange-500" />
            <p className="text-sm text-gray-600">待回复</p>
          </div>
          <p className="text-2xl font-bold text-orange-600">{totalUnresolved}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center gap-2 mb-2">
            <User className="w-5 h-5 text-purple-500" />
            <p className="text-sm text-gray-600">客服总数</p>
          </div>
          <p className="text-2xl font-bold text-purple-600">{staff.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <p className="text-sm text-gray-600">平均满意度</p>
          </div>
          <p className="text-2xl font-bold text-green-600">
            {(staff.reduce((sum, s) => sum + s.satisfaction, 0) / Math.max(staff.length, 1)).toFixed(1)}%
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Staff List */}
        <div className="lg:col-span-2 space-y-6">
          {/* Filters */}
          <div className="bg-white rounded-xl shadow-sm p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="搜索客服姓名..."
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
                <option>在线</option>
                <option>离线</option>
                <option>忙碌</option>
              </select>
            </div>
          </div>

          {/* Staff Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredStaff.map((staffMember) => (
              <div key={staffMember.id} className="bg-white rounded-xl shadow-sm p-4">
                <div className="flex items-start gap-4">
                  <div className="relative">
                    <img
                      src={staffMember.avatar}
                      alt={staffMember.name}
                      className="w-14 h-14 rounded-full object-cover"
                    />
                    <span className={`absolute -bottom-1 -right-1 w-4 h-4 ${statusColors[staffMember.status as keyof typeof statusColors]} rounded-full border-2 border-white`}></span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-gray-800">{staffMember.name}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        staffMember.status === '在线' ? 'bg-green-100 text-green-700' :
                        staffMember.status === '忙碌' ? 'bg-orange-100 text-orange-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {staffMember.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mb-2">{staffMember.department} · {staffMember.role}</p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="text-gray-600">今日会话: <span className="font-semibold">{staffMember.todayConversations}</span></div>
                      <div className="text-gray-600">满意度: <span className="font-semibold text-green-600">{staffMember.satisfaction}%</span></div>
                      <div className="text-gray-600">响应时间: <span className="font-semibold">{staffMember.avgResponseTime}</span></div>
                      <div className="text-gray-600">待回复: <span className="font-semibold text-orange-600">{staffMember.unresolved}</span></div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => handleView(staffMember)}>
                    <Eye className="w-4 h-4 mr-1" />
                    详情
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleEdit(staffMember)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleToggleStatus(staffMember)}>
                    <CheckCircle className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="text-red-600 hover:bg-red-50" onClick={() => handleDelete(staffMember)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Chats */}
        <div className="bg-white rounded-xl shadow-sm p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">待处理会话</h3>
          <div className="space-y-3">
            {chats.map((chat) => (
              <div key={chat.id} className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-800">{chat.user}</span>
                  <span className="text-xs text-gray-500">{chat.time}</span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{chat.message}</p>
                <div className="flex items-center justify-between">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    chat.status === '待回复' ? 'bg-red-100 text-red-700' :
                    chat.status === '处理中' ? 'bg-orange-100 text-orange-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {chat.status}
                  </span>
                  <Button variant="ghost" size="sm" className="text-orange-600">
                    回复
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-800">添加客服</h3>
                <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">姓名</label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="请输入客服姓名"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">部门</label>
                <select
                  value={formData.department || '售前客服'}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="售前客服">售前客服</option>
                  <option value="售后客服">售后客服</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">职位</label>
                <select
                  value={formData.role || '客服专员'}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="客服专员">客服专员</option>
                  <option value="客服主管">客服主管</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Phone className="w-4 h-4 inline mr-1" />
                    电话
                  </label>
                  <input
                    type="text"
                    value={formData.phone || ''}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+95 9 xxx xxxx"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Mail className="w-4 h-4 inline mr-1" />
                    邮箱
                  </label>
                  <input
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="email@example.com"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">状态</label>
                <select
                  value={formData.status || '离线'}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as Staff['status'] })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="离线">离线</option>
                  <option value="在线">在线</option>
                  <option value="忙碌">忙碌</option>
                </select>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowAddModal(false)}>
                取消
              </Button>
              <Button onClick={handleSaveAdd} className="bg-gradient-to-r from-orange-500 to-blue-500">
                添加客服
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editingStaff && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-800">编辑客服</h3>
                <button onClick={() => setShowEditModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">姓名</label>
                <input
                  type="text"
                  value={editingStaff.name || ''}
                  onChange={(e) => setEditingStaff({ ...editingStaff, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">部门</label>
                <select
                  value={editingStaff.department || '售前客服'}
                  onChange={(e) => setEditingStaff({ ...editingStaff, department: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="售前客服">售前客服</option>
                  <option value="售后客服">售后客服</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">职位</label>
                <select
                  value={editingStaff.role || '客服专员'}
                  onChange={(e) => setEditingStaff({ ...editingStaff, role: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="客服专员">客服专员</option>
                  <option value="客服主管">客服主管</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">电话</label>
                  <input
                    type="text"
                    value={editingStaff.phone || ''}
                    onChange={(e) => setEditingStaff({ ...editingStaff, phone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">邮箱</label>
                  <input
                    type="email"
                    value={editingStaff.email || ''}
                    onChange={(e) => setEditingStaff({ ...editingStaff, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">状态</label>
                <select
                  value={editingStaff.status || '离线'}
                  onChange={(e) => setEditingStaff({ ...editingStaff, status: e.target.value as Staff['status'] })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="离线">离线</option>
                  <option value="在线">在线</option>
                  <option value="忙碌">忙碌</option>
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
      {showDetailModal && selectedStaffMember && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-800">客服详情</h3>
                <button onClick={() => setShowDetailModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={selectedStaffMember.avatar}
                  alt={selectedStaffMember.name}
                  className="w-20 h-20 rounded-full object-cover"
                />
                <div>
                  <h4 className="text-xl font-bold text-gray-800">{selectedStaffMember.name}</h4>
                  <p className="text-gray-500">{selectedStaffMember.department} · {selectedStaffMember.role}</p>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs mt-2 ${
                    selectedStaffMember.status === '在线' ? 'bg-green-100 text-green-700' :
                    selectedStaffMember.status === '忙碌' ? 'bg-orange-100 text-orange-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    <span className={`w-2 h-2 rounded-full ${statusColors[selectedStaffMember.status as keyof typeof statusColors]}`}></span>
                    {selectedStaffMember.status}
                  </span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500 flex items-center gap-2">
                    <Phone className="w-4 h-4" /> 电话
                  </span>
                  <span className="font-medium">{selectedStaffMember.phone}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500 flex items-center gap-2">
                    <Mail className="w-4 h-4" /> 邮箱
                  </span>
                  <span className="font-medium">{selectedStaffMember.email}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">今日会话</span>
                  <span className="font-medium text-blue-600">{selectedStaffMember.todayConversations}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">平均响应时间</span>
                  <span className="font-medium">{selectedStaffMember.avgResponseTime}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">满意度</span>
                  <span className="font-medium text-green-600">{selectedStaffMember.satisfaction}%</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-500">待回复</span>
                  <span className="font-medium text-orange-600">{selectedStaffMember.unresolved}</span>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowDetailModal(false)}>
                关闭
              </Button>
              <Button onClick={() => { setShowDetailModal(false); handleEdit(selectedStaffMember); }} className="bg-gradient-to-r from-orange-500 to-blue-500">
                编辑客服
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedStaffMember && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">确认删除</h3>
              <p className="text-gray-600">
                确定要删除客服 "{selectedStaffMember.name}" 吗？此操作无法撤销。
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
