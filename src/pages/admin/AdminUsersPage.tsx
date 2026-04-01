import React, { useState } from 'react';
import { Search, UserX, UserCheck, Eye, Download, Edit } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { ConfirmDialog } from '../../components/ui/Modal';
import { useToast } from '@/components/Toast';

interface User {
  id: string;
  name: string;
  phone: string;
  email: string;
  orders: number;
  spent: number;
  status: '正常' | '禁用';
  registered: string;
  lastLogin: string;
  balance: number;
  points: number;
}

export default function AdminUsersPage() {
  const { showToast } = useToast();
  const [users, setUsers] = useState<User[]>([
    { id: 'U001', name: '张三', phone: '138****1234', email: 'zhangsan@email.com', orders: 23, spent: 4560, status: '正常', registered: '2024-01-15', lastLogin: '2024-03-15', balance: 1000, points: 5000 },
    { id: 'U002', name: '李四', phone: '139****5678', email: 'lisi@email.com', orders: 15, spent: 2890, status: '正常', registered: '2024-02-20', lastLogin: '2024-03-14', balance: 500, points: 2500 },
    { id: 'U003', name: '王五', phone: '137****9012', email: 'wangwu@email.com', orders: 8, spent: 1560, status: '禁用', registered: '2024-03-01', lastLogin: '2024-03-10', balance: 200, points: 800 },
    { id: 'U004', name: '赵六', phone: '136****3456', email: 'zhaoliu@email.com', orders: 45, spent: 8900, status: '正常', registered: '2023-12-10', lastLogin: '2024-03-15', balance: 2000, points: 8900 },
    { id: 'U005', name: '钱七', phone: '135****7890', email: 'qianqi@email.com', orders: 12, spent: 2100, status: '正常', registered: '2024-01-25', lastLogin: '2024-03-13', balance: 800, points: 2100 },
  ]);

  const [searchKeyword, setSearchKeyword] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [statusLoading, setStatusLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);

  const stats = {
    total: 8542,
    active: 8520,
    monthlyNew: 156,
  };

  const handleExportUsers = async () => {
    setExportLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Filter data based on current filters
      let exportData = [...users];
      if (searchKeyword) {
        exportData = exportData.filter(u =>
          u.name.includes(searchKeyword) ||
          u.phone.includes(searchKeyword) ||
          u.email.includes(searchKeyword)
        );
      }
      if (filterStatus) {
        exportData = exportData.filter(u => u.status === filterStatus);
      }

      // Create CSV content
      const headers = ['用户ID', '用户名', '手机号', '邮箱', '订单数', '消费金额', '状态', '注册时间'];
      const csvContent = [
        headers.join(','),
        ...exportData.map(u => [
          u.id,
          u.name,
          u.phone,
          u.email,
          u.orders,
          u.spent,
          u.status,
          u.registered
        ].join(','))
      ].join('\n');

      // Download file
      const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `用户数据_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      showToast('success', `成功导出 ${exportData.length} 条用户数据`);
    } catch (error) {
      showToast('error', '导出失败，请重试');
    } finally {
      setExportLoading(false);
    }
  };

  const handleToggleStatus = async () => {
    if (!selectedUser) return;

    setStatusLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setUsers(prev => prev.map(u =>
        u.id === selectedUser.id
          ? { ...u, status: u.status === '正常' ? '禁用' : '正常' }
          : u
      ));
      showToast('success', `用户「${selectedUser.name}」已${selectedUser.status === '正常' ? '禁用' : '启用'}`);
      setIsStatusDialogOpen(false);
    } catch (error) {
      showToast('error', '操作失败，请重试');
    } finally {
      setStatusLoading(false);
    }
  };

  const openViewDialog = (user: User) => {
    setSelectedUser(user);
    setIsViewDialogOpen(true);
  };

  const openStatusDialog = (user: User) => {
    setSelectedUser(user);
    setIsStatusDialogOpen(true);
  };

  const getStatusStyle = (status: string) => {
    return status === '正常'
      ? 'bg-green-100 text-green-700'
      : 'bg-red-100 text-red-700';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">用户管理</h2>
          <p className="text-gray-500 text-sm mt-1">查看和管理所有注册用户</p>
        </div>
        <Button
          variant="outline"
          onClick={handleExportUsers}
          loading={exportLoading}
          loadingText="导出中..."
          disabled={exportLoading}
        >
          <Download className="w-4 h-4 mr-2" />
          {exportLoading ? '导出中...' : '导出用户'}
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <span className="text-2xl">👥</span>
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.total.toLocaleString()}</p>
              <p className="text-gray-500 text-sm">总用户数</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <UserCheck className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.active.toLocaleString()}</p>
              <p className="text-gray-500 text-sm">活跃用户</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <span className="text-2xl">🆕</span>
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.monthlyNew}</p>
              <p className="text-gray-500 text-sm">本月新增</p>
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
              placeholder="搜索用户名、手机号或邮箱..."
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
            <option value="正常">正常</option>
            <option value="禁用">禁用</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">用户</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">联系方式</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">订单数</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">消费金额</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">状态</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">注册时间</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <span className="font-medium">{user.name}</span>
                      <p className="text-xs text-gray-400">{user.id}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div>
                    <p className="text-gray-600">{user.phone}</p>
                    <p className="text-gray-500 text-sm">{user.email}</p>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-600">{user.orders}</td>
                <td className="px-6 py-4 font-semibold text-orange-600">¥{user.spent.toLocaleString()}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(user.status)}`}>
                    {user.status === '正常' ? <UserCheck className="w-3 h-3" /> : <UserX className="w-3 h-3" />}
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-600 text-sm">{user.registered}</td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openViewDialog(user)}
                      className="hover:bg-blue-50 hover:text-blue-500"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openStatusDialog(user)}
                      className={`hover:bg-${user.status === '正常' ? 'red' : 'green'}-50 hover:text-${user.status === '正常' ? 'red' : 'green'}-500`}
                    >
                      {user.status === '正常' ? (
                        <UserX className="w-4 h-4 text-red-500" />
                      ) : (
                        <UserCheck className="w-4 h-4 text-green-500" />
                      )}
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* View User Dialog */}
      {selectedUser && isViewDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsViewDialogOpen(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg animate-scale-in">
            <div className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {selectedUser.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-xl font-bold">{selectedUser.name}</h3>
                  <p className="text-gray-500 text-sm">{selectedUser.id}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-orange-50 rounded-xl p-3 text-center">
                  <p className="text-2xl font-bold text-orange-600">¥{selectedUser.balance.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">账户余额</p>
                </div>
                <div className="bg-purple-50 rounded-xl p-3 text-center">
                  <p className="text-2xl font-bold text-purple-600">{selectedUser.points.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">积分</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-500">手机号</span>
                  <span>{selectedUser.phone}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-500">邮箱</span>
                  <span>{selectedUser.email}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-500">订单数</span>
                  <span>{selectedUser.orders} 笔</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-500">消费金额</span>
                  <span className="font-semibold text-orange-600">¥{selectedUser.spent.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-500">状态</span>
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusStyle(selectedUser.status)}`}>
                    {selectedUser.status}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-500">注册时间</span>
                  <span>{selectedUser.registered}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-500">最后登录</span>
                  <span>{selectedUser.lastLogin}</span>
                </div>
              </div>
              <Button variant="outline" className="w-full mt-6" onClick={() => setIsViewDialogOpen(false)}>
                关闭
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Status Toggle Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isStatusDialogOpen}
        onClose={() => {
          setIsStatusDialogOpen(false);
          setSelectedUser(null);
        }}
        onConfirm={handleToggleStatus}
        title={selectedUser?.status === '正常' ? '确认禁用' : '确认启用'}
        message={`确认${selectedUser?.status === '正常' ? '禁用' : '启用'}用户「${selectedUser?.name}」？${
          selectedUser?.status === '正常' ? '禁用后该用户将无法登录。' : '启用后该用户可正常登录。'
        }`}
        confirmText={selectedUser?.status === '正常' ? '确认禁用' : '确认启用'}
        cancelText="取消"
        variant={selectedUser?.status === '正常' ? 'danger' : 'default'}
        loading={statusLoading}
      />
    </div>
  );
}
