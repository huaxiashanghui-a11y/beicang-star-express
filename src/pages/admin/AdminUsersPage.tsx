import React, { useState } from 'react';
import { Search, UserX, UserCheck, Eye, Download } from 'lucide-react';
import { Button } from '../../components/ui/button';

export default function AdminUsersPage() {
  const [users] = useState([
    { id: 'U001', name: '张三', phone: '138****1234', email: 'zhangsan@email.com', orders: 23, spent: 4560, status: '正常', registered: '2024-01-15' },
    { id: 'U002', name: '李四', phone: '139****5678', email: 'lisi@email.com', orders: 15, spent: 2890, status: '正常', registered: '2024-02-20' },
    { id: 'U003', name: '王五', phone: '137****9012', email: 'wangwu@email.com', orders: 8, spent: 1560, status: '禁用', registered: '2024-03-01' },
    { id: 'U004', name: '赵六', phone: '136****3456', email: 'zhaoliu@email.com', orders: 45, spent: 8900, status: '正常', registered: '2023-12-10' },
    { id: 'U005', name: '钱七', phone: '135****7890', email: 'qianqi@email.com', orders: 12, spent: 2100, status: '正常', registered: '2024-01-25' },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">用户管理</h2>
          <p className="text-gray-500 text-sm mt-1">查看和管理所有注册用户</p>
        </div>
        <Button variant="outline"><Download className="w-4 h-4 mr-2" />导出用户</Button>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <span className="text-2xl">👥</span>
            </div>
            <div>
              <p className="text-2xl font-bold">8,542</p>
              <p className="text-gray-500 text-sm">总用户数</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <UserCheck className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">8,520</p>
              <p className="text-gray-500 text-sm">活跃用户</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <span className="text-2xl">🆕</span>
            </div>
            <div>
              <p className="text-2xl font-bold">156</p>
              <p className="text-gray-500 text-sm">本月新增</p>
            </div>
          </div>
        </div>
      </div>

      {/* 搜索栏 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="搜索用户名、手机号或邮箱..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <select className="px-4 py-2 border border-gray-200 rounded-lg">
            <option>全部状态</option>
            <option>正常</option>
            <option>禁用</option>
          </select>
        </div>
      </div>

      {/* 用户表格 */}
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
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                      {user.name.charAt(0)}
                    </div>
                    <span className="font-medium">{user.name}</span>
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
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                    user.status === '正常' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {user.status === '正常' ? <UserCheck className="w-3 h-3" /> : <UserX className="w-3 h-3" />}
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-600 text-sm">{user.registered}</td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm"><Eye className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="sm">
                      {user.status === '正常' ? <UserX className="w-4 h-4 text-red-500" /> : <UserCheck className="w-4 h-4 text-green-500" />}
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
