import React, { useState } from 'react';
import { Search, Eye, Edit, UserX, UserCheck, X, Save, Plus, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '../../components/ui/button';

interface User {
  id: string;
  name: string;
  avatar: string;
  phone: string;
  email: string;
  orders: number;
  spent: string;
  balance: number;
  points: number;
  status: '正常' | '禁用';
  registered: string;
  lastActive: string;
  wechat?: string;
  telegram?: string;
}

const initialUsers: User[] = [
  {
    id: '1',
    name: '张伟',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    phone: '+95 9 123 4567',
    email: 'zhangwei@email.com',
    orders: 15,
    spent: '¥25,680',
    balance: 1500.00,
    points: 2568,
    status: '正常',
    registered: '2024-01-15',
    lastActive: '2024-03-20 14:30',
    wechat: 'zhangwei123',
    telegram: '@zhangwei',
  },
  {
    id: '2',
    name: '李娜',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    phone: '+95 9 987 6543',
    email: 'lina@email.com',
    orders: 8,
    spent: '¥12,450',
    balance: 500.00,
    points: 1245,
    status: '正常',
    registered: '2024-02-01',
    lastActive: '2024-03-20 13:20',
  },
  {
    id: '3',
    name: '王强',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    phone: '+95 9 555 1234',
    email: 'wangqiang@email.com',
    orders: 23,
    spent: '¥45,230',
    balance: 3000.00,
    points: 4523,
    status: '正常',
    registered: '2023-11-20',
    lastActive: '2024-03-20 11:45',
    wechat: 'wangqiang456',
  },
  {
    id: '4',
    name: '赵敏',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    phone: '+95 9 888 9999',
    email: 'zhaomin@email.com',
    orders: 5,
    spent: '¥8,990',
    balance: 0,
    points: 899,
    status: '禁用',
    registered: '2024-03-01',
    lastActive: '2024-03-19 18:00',
  },
  {
    id: '5',
    name: '陈刚',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
    phone: '+95 9 222 3333',
    email: 'chengang@email.com',
    orders: 32,
    spent: '¥68,900',
    balance: 5000.00,
    points: 6890,
    status: '正常',
    registered: '2023-08-15',
    lastActive: '2024-03-20 09:30',
    telegram: '@chengang88',
  },
];

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('全部');
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDisableConfirm, setShowDisableConfirm] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editForm, setEditForm] = useState<Partial<User>>({});
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({ show: false, message: '', type: 'success' });

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          user.phone.includes(searchTerm) ||
                          user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === '全部' || user.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: users.length,
    new: users.filter(u => u.registered.startsWith('2024')).length,
    active: users.filter(u => u.status === '正常').length,
    disabled: users.filter(u => u.status === '禁用').length,
  };

  const handleView = (user: User) => {
    setSelectedUser(user);
    setShowViewModal(true);
  };

  const handleEdit = (user: User) => {
    setEditForm({ ...user });
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
    if (selectedUser && editForm) {
      setUsers(users.map(u => u.id === selectedUser.id ? { ...u, ...editForm } as User : u));
      showToast('用户信息已更新', 'success');
      setShowEditModal(false);
    }
  };

  const handleToggleStatus = (user: User) => {
    setSelectedUser(user);
    setShowDisableConfirm(true);
  };

  const confirmToggleStatus = () => {
    if (selectedUser) {
      const newStatus = selectedUser.status === '正常' ? '禁用' : '正常';
      setUsers(users.map(u => u.id === selectedUser.id ? { ...u, status: newStatus } : u));
      showToast(`用户已${newStatus}`, 'success');
      setShowDisableConfirm(false);
      setSelectedUser(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast.show && (
        <div className={`fixed top-20 right-4 z-50 px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 animate-slide-in-down ${
          toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`}>
          {toast.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">用户管理</h2>
          <p className="text-gray-500 text-sm mt-1">管理所有注册用户</p>
        </div>
        <Button variant="outline" className="border-green-300 text-green-600 hover:bg-green-50">
          导出用户
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: '总用户数', count: stats.total, color: 'text-blue-600' },
          { label: '本月新增', count: stats.new, color: 'text-green-600' },
          { label: '活跃用户', count: stats.active, color: 'text-orange-600' },
          { label: '禁用用户', count: stats.disabled, color: 'text-red-600' },
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
              placeholder="搜索用户名、手机号或邮箱..."
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
            <option value="全部">全部</option>
            <option value="正常">正常</option>
            <option value="禁用">禁用</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">用户</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">联系方式</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">订单数</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">消费金额</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">注册时间</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">状态</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">暂无用户</td>
                </tr>
              ) : filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500">ID: {user.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-600">{user.phone}</div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-600">{user.orders}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-semibold text-orange-600">{user.spent}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <p className="text-sm text-gray-600">{user.registered}</p>
                      <p className="text-xs text-gray-400">活跃: {user.lastActive}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                      user.status === '正常' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleView(user)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="查看"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEdit(user)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="编辑"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleToggleStatus(user)}
                        className={`p-2 rounded-lg transition-colors ${
                          user.status === '正常'
                            ? 'text-red-600 hover:bg-red-50'
                            : 'text-green-600 hover:bg-green-50'
                        }`}
                        title={user.status === '正常' ? '禁用' : '启用'}
                      >
                        {user.status === '正常' ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Info */}
        <div className="bg-gray-50 px-6 py-4 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            显示 {filteredUsers.length} 条，共 {users.length} 条
          </p>
        </div>
      </div>

      {/* View Modal */}
      {showViewModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowViewModal(false)} />
          <div className="relative bg-white rounded-2xl w-full max-w-lg">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-bold">用户详情</h3>
              <button onClick={() => setShowViewModal(false)} className="p-2 hover:bg-gray-100 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4">
              <div className="flex items-center gap-4 mb-6">
                <img src={selectedUser.avatar} alt={selectedUser.name} className="w-20 h-20 rounded-full object-cover" />
                <div>
                  <h4 className="text-xl font-bold">{selectedUser.name}</h4>
                  <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full mt-1 ${
                    selectedUser.status === '正常' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {selectedUser.status}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-gray-500">手机号：</span>{selectedUser.phone}</div>
                <div><span className="text-gray-500">邮箱：</span>{selectedUser.email}</div>
                <div><span className="text-gray-500">订单数：</span>{selectedUser.orders}</div>
                <div><span className="text-gray-500">消费金额：</span>{selectedUser.spent}</div>
                <div><span className="text-gray-500">余额：</span>¥{selectedUser.balance.toFixed(2)}</div>
                <div><span className="text-gray-500">积分：</span>{selectedUser.points}</div>
                <div><span className="text-gray-500">微信：</span>{selectedUser.wechat || '-'}</div>
                <div><span className="text-gray-500">Telegram：</span>{selectedUser.telegram || '-'}</div>
                <div><span className="text-gray-500">注册时间：</span>{selectedUser.registered}</div>
                <div><span className="text-gray-500">最后活跃：</span>{selectedUser.lastActive}</div>
              </div>
            </div>
            <div className="flex gap-3 p-4 border-t">
              <Button variant="outline" className="flex-1" onClick={() => setShowViewModal(false)}>关闭</Button>
              <Button className="flex-1 bg-green-500 hover:bg-green-600" onClick={() => {
                setShowViewModal(false);
                handleEdit(selectedUser);
              }}>
                <Edit className="w-4 h-4 mr-2" />编辑
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowEditModal(false)} />
          <div className="relative bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-bold">编辑用户</h3>
              <button onClick={() => setShowEditModal(false)} className="p-2 hover:bg-gray-100 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto max-h-[calc(90vh-140px)] space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">用户名</label>
                <input
                  type="text"
                  value={editForm.name || ''}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">手机号</label>
                <input
                  type="text"
                  value={editForm.phone || ''}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">邮箱</label>
                <input
                  type="email"
                  value={editForm.email || ''}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">余额</label>
                  <input
                    type="number"
                    value={editForm.balance || 0}
                    onChange={(e) => setEditForm({ ...editForm, balance: Number(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">积分</label>
                  <input
                    type="number"
                    value={editForm.points || 0}
                    onChange={(e) => setEditForm({ ...editForm, points: Number(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">微信</label>
                <input
                  type="text"
                  value={editForm.wechat || ''}
                  onChange={(e) => setEditForm({ ...editForm, wechat: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="请输入微信号"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Telegram</label>
                <input
                  type="text"
                  value={editForm.telegram || ''}
                  onChange={(e) => setEditForm({ ...editForm, telegram: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="请输入Telegram用户名"
                />
              </div>
            </div>
            <div className="flex gap-3 p-4 border-t">
              <Button variant="outline" className="flex-1" onClick={() => setShowEditModal(false)}>取消</Button>
              <Button className="flex-1 bg-orange-500 hover:bg-orange-600" onClick={handleSaveEdit}>
                <Save className="w-4 h-4 mr-2" />保存
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Disable/Enable Confirmation */}
      {showDisableConfirm && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowDisableConfirm(false)} />
          <div className="relative bg-white rounded-2xl w-full max-w-sm">
            <div className="p-6 text-center">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                selectedUser.status === '正常' ? 'bg-red-100' : 'bg-green-100'
              }`}>
                {selectedUser.status === '正常' ? <UserX className="w-8 h-8 text-red-600" /> : <UserCheck className="w-8 h-8 text-green-600" />}
              </div>
              <h3 className="text-lg font-bold mb-2">
                {selectedUser.status === '正常' ? '确认禁用用户' : '确认启用用户'}
              </h3>
              <p className="text-gray-500 mb-4">
                {selectedUser.status === '正常'
                  ? `确定要禁用用户"${selectedUser.name}"吗？禁用后该用户将无法登录。`
                  : `确定要启用用户"${selectedUser.name}"吗？启用后该用户可以正常登录。`
                }
              </p>
            </div>
            <div className="flex gap-3 p-4 border-t">
              <Button variant="outline" className="flex-1" onClick={() => setShowDisableConfirm(false)}>取消</Button>
              <Button
                className={`flex-1 ${
                  selectedUser.status === '正常'
                    ? 'bg-red-500 hover:bg-red-600'
                    : 'bg-green-500 hover:bg-green-600'
                }`}
                onClick={confirmToggleStatus}
              >
                确认
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
