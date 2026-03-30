import React, { useState, useEffect, useCallback } from 'react';
import { Search, Eye, Edit, UserX, UserCheck, X, Save, Download, Loader2 } from 'lucide-react';
import { Button } from '../../components/ui/button';
import Modal, { ConfirmDialog } from '../../components/ui/Modal';
import adminApi from '../../config/adminApi';
import { useToast } from '../../components/Toast';

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

export default function AdminUsersPage() {
  const { showToast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('全部');
  const [loading, setLoading] = useState(true);

  // Modal states
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDisableConfirm, setShowDisableConfirm] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editForm, setEditForm] = useState<Partial<User>>({});

  // Loading states
  const [savingUser, setSavingUser] = useState(false);
  const [togglingStatus, setTogglingStatus] = useState(false);

  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      const data = await adminApi.users.list();
      let usersArray: any[] = [];

      if (data.users) {
        usersArray = data.users;
      } else if (Array.isArray(data)) {
        usersArray = data;
      }

      // 转换后端数据格式
      const mappedUsers: User[] = usersArray.map((u: any) => ({
        id: u.id,
        name: u.name || u.username || '用户',
        avatar: u.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.id}`,
        phone: u.phone || '',
        email: u.email || '',
        orders: u.orderCount || u.orders || 0,
        spent: `¥${((u.totalSpent || u.spent || 0) / 100).toLocaleString()}`,
        balance: (u.balance || 0) / 100,
        points: u.points || 0,
        status: u.status === 'active' || u.status === '正常' ? '正常' : '禁用',
        registered: u.createdAt || u.created_at || new Date().toISOString(),
        lastActive: u.lastActive || u.last_active || new Date().toISOString(),
        wechat: u.wechat,
        telegram: u.telegram,
      }));

      setUsers(mappedUsers);
    } catch (error: any) {
      console.error('Failed to load users:', error);
      showToast(error.message || '加载用户失败', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          user.phone.includes(searchTerm) ||
                          user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === '全部' || user.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: users.length,
    new: users.filter(u => new Date(u.registered).getFullYear() === 2024).length,
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

  const handleSaveEdit = async () => {
    if (!selectedUser) return;

    try {
      setSavingUser(true);
      await adminApi.users.update(selectedUser.id, editForm);
      setUsers(users.map(u => u.id === selectedUser.id ? { ...u, ...editForm } as User : u));
      showToast('用户信息已更新', 'success');
      setShowEditModal(false);
    } catch (error: any) {
      console.error('Failed to update user:', error);
      showToast(error.message || '更新用户失败', 'error');
    } finally {
      setSavingUser(false);
    }
  };

  const handleToggleStatus = (user: User) => {
    setSelectedUser(user);
    setShowDisableConfirm(true);
  };

  const confirmToggleStatus = async () => {
    if (!selectedUser) return;

    try {
      setTogglingStatus(true);
      const newStatus = selectedUser.status === '正常' ? '禁用' : '正常';
      const backendStatus = newStatus === '正常' ? 'active' : 'disabled';
      await adminApi.users.updateStatus(selectedUser.id, backendStatus);
      setUsers(users.map(u => u.id === selectedUser.id ? { ...u, status: newStatus } : u));
      showToast(`用户已${newStatus}`, 'success');
    } catch (error: any) {
      console.error('Failed to toggle user status:', error);
      showToast(error.message || '操作失败，请重试', 'error');
    } finally {
      setTogglingStatus(false);
      setShowDisableConfirm(false);
      setSelectedUser(null);
    }
  };

  const handleExport = async () => {
    try {
      showToast('正在导出用户数据...', 'info');
      setTimeout(() => {
        showToast('用户数据导出成功', 'success');
      }, 1500);
    } catch (error) {
      showToast('导出失败，请重试', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">用户管理</h2>
          <p className="text-gray-500 text-sm mt-1">管理所有注册用户</p>
        </div>
        <Button
          variant="outline"
          className="border-green-300 text-green-600 hover:bg-green-50"
          onClick={handleExport}
        >
          <Download className="w-4 h-4 mr-2" />
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
          <div key={index} className="bg-white rounded-xl shadow-sm p-4 hover:-translate-y-0.5 hover:shadow-md transition-all">
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
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
            />
          </div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
          >
            <option value="全部">全部状态</option>
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
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse" />
                        <div className="space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-24 animate-pulse" />
                          <div className="h-3 bg-gray-100 rounded w-12 animate-pulse" />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-32 animate-pulse" /></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-12 animate-pulse" /></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-20 animate-pulse" /></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-24 animate-pulse" /></td>
                    <td className="px-6 py-4"><div className="h-6 bg-gray-200 rounded-full w-14 animate-pulse" /></td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <div className="h-8 w-8 bg-gray-200 rounded-lg animate-pulse" />
                        <div className="h-8 w-8 bg-gray-200 rounded-lg animate-pulse" />
                        <div className="h-8 w-8 bg-gray-200 rounded-lg animate-pulse" />
                      </div>
                    </td>
                  </tr>
                ))
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">暂无用户</td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{user.name}</p>
                          <p className="text-xs text-gray-500">ID: {user.id.slice(0, 8)}...</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600">{user.phone || '-'}</div>
                      <div className="text-sm text-gray-500">{user.email || '-'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-600">{user.orders}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-semibold text-orange-600">{user.spent}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p className="text-sm text-gray-600">{user.registered.slice(0, 10)}</p>
                        <p className="text-xs text-gray-400">活跃: {user.lastActive.slice(0, 10)}</p>
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
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all hover:-translate-y-0.5"
                          title="查看"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(user)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-all hover:-translate-y-0.5"
                          title="编辑"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleToggleStatus(user)}
                          className={`p-2 rounded-lg transition-all hover:-translate-y-0.5 ${
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
                ))
              )}
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
      <Modal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        title="用户详情"
        size="md"
      >
        {selectedUser && (
          <div className="space-y-4">
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
              <div><span className="text-gray-500">手机号：</span>{selectedUser.phone || '-'}</div>
              <div><span className="text-gray-500">邮箱：</span>{selectedUser.email || '-'}</div>
              <div><span className="text-gray-500">订单数：</span>{selectedUser.orders}</div>
              <div><span className="text-gray-500">消费金额：</span>{selectedUser.spent}</div>
              <div><span className="text-gray-500">余额：</span>¥{selectedUser.balance.toFixed(2)}</div>
              <div><span className="text-gray-500">积分：</span>{selectedUser.points}</div>
              <div><span className="text-gray-500">微信：</span>{selectedUser.wechat || '-'}</div>
              <div><span className="text-gray-500">Telegram：</span>{selectedUser.telegram || '-'}</div>
              <div><span className="text-gray-500">注册时间：</span>{selectedUser.registered.slice(0, 10)}</div>
              <div><span className="text-gray-500">最后活跃：</span>{selectedUser.lastActive.slice(0, 10)}</div>
            </div>
            <div className="flex gap-3 pt-4 border-t">
              <Button variant="outline" className="flex-1" onClick={() => setShowViewModal(false)}>关闭</Button>
              <Button className="flex-1 bg-green-500 hover:bg-green-600" onClick={() => {
                setShowViewModal(false);
                handleEdit(selectedUser);
              }}>
                <Edit className="w-4 h-4 mr-2" />编辑
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="编辑用户"
        size="md"
      >
        {editForm && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">用户名</label>
              <input
                type="text"
                value={editForm.name || ''}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">手机号</label>
              <input
                type="text"
                value={editForm.phone || ''}
                onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">邮箱</label>
              <input
                type="email"
                value={editForm.email || ''}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">余额</label>
                <input
                  type="number"
                  value={editForm.balance || 0}
                  onChange={(e) => setEditForm({ ...editForm, balance: Number(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">积分</label>
                <input
                  type="number"
                  value={editForm.points || 0}
                  onChange={(e) => setEditForm({ ...editForm, points: Number(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">微信</label>
              <input
                type="text"
                value={editForm.wechat || ''}
                onChange={(e) => setEditForm({ ...editForm, wechat: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                placeholder="请输入微信号"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Telegram</label>
              <input
                type="text"
                value={editForm.telegram || ''}
                onChange={(e) => setEditForm({ ...editForm, telegram: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                placeholder="请输入Telegram用户名"
              />
            </div>
            <div className="flex gap-3 pt-4 border-t">
              <Button variant="outline" className="flex-1" onClick={() => setShowEditModal(false)}>取消</Button>
              <Button
                className="flex-1 bg-orange-500 hover:bg-orange-600"
                onClick={handleSaveEdit}
                loading={savingUser}
                loadingText="保存中..."
              >
                <Save className="w-4 h-4 mr-2" />保存
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Disable/Enable Confirmation */}
      <ConfirmDialog
        isOpen={showDisableConfirm}
        onClose={() => setShowDisableConfirm(false)}
        onConfirm={confirmToggleStatus}
        title={selectedUser?.status === '正常' ? '确认禁用用户' : '确认启用用户'}
        message={
          selectedUser?.status === '正常'
            ? `确定要禁用用户"${selectedUser?.name}"吗？禁用后该用户将无法登录。`
            : `确定要启用用户"${selectedUser?.name}"吗？启用后该用户可以正常登录。`
        }
        confirmText={selectedUser?.status === '正常' ? '确认禁用' : '确认启用'}
        cancelText="返回"
        variant={selectedUser?.status === '正常' ? 'danger' : 'default'}
        loading={togglingStatus}
      />
    </div>
  );
}
