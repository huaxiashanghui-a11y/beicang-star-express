import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, MessageCircle, Phone, Mail, User, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '../../components/ui/button';

const mockCustomerService = [
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

const recentChats = [
  { id: '1', user: '张伟', message: '我的订单什么时候发货？', time: '2分钟前', status: '待回复' },
  { id: '2', user: '李娜', message: '商品有质量问题想退货', time: '5分钟前', status: '处理中' },
  { id: '3', user: '王强', message: '请问支持哪些支付方式？', time: '8分钟前', status: '已回复' },
  { id: '4', user: '赵敏', message: '忘记密码了怎么办', time: '12分钟前', status: '已回复' },
  { id: '5', user: '陈刚', message: '商品与描述不符', time: '15分钟前', status: '待回复' },
];

export default function AdminCustomerServicePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('全部');

  const filteredStaff = mockCustomerService.filter(staff => {
    const matchesSearch = staff.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === '全部' || staff.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const totalConversations = mockCustomerService.reduce((sum, s) => sum + s.todayConversations, 0);
  const onlineCount = mockCustomerService.filter(s => s.status === '在线').length;
  const totalUnresolved = mockCustomerService.reduce((sum, s) => sum + s.unresolved, 0);

  const statusColors = {
    '在线': 'bg-green-500',
    '离线': 'bg-gray-400',
    '忙碌': 'bg-orange-500',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">客服管理</h2>
          <p className="text-gray-500 text-sm mt-1">管理客服团队和会话记录</p>
        </div>
        <Button className="bg-gradient-to-r from-orange-500 to-blue-500">
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
          <p className="text-2xl font-bold text-purple-600">{mockCustomerService.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <p className="text-sm text-gray-600">平均满意度</p>
          </div>
          <p className="text-2xl font-bold text-green-600">96.5%</p>
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
            {filteredStaff.map((staff) => (
              <div key={staff.id} className="bg-white rounded-xl shadow-sm p-4">
                <div className="flex items-start gap-4">
                  <div className="relative">
                    <img
                      src={staff.avatar}
                      alt={staff.name}
                      className="w-14 h-14 rounded-full object-cover"
                    />
                    <span className={`absolute -bottom-1 -right-1 w-4 h-4 ${statusColors[staff.status as keyof typeof statusColors]} rounded-full border-2 border-white`}></span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-gray-800">{staff.name}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        staff.status === '在线' ? 'bg-green-100 text-green-700' :
                        staff.status === '忙碌' ? 'bg-orange-100 text-orange-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {staff.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mb-2">{staff.department} · {staff.role}</p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="text-gray-600">今日会话: <span className="font-semibold">{staff.todayConversations}</span></div>
                      <div className="text-gray-600">满意度: <span className="font-semibold text-green-600">{staff.satisfaction}%</span></div>
                      <div className="text-gray-600">响应时间: <span className="font-semibold">{staff.avgResponseTime}</span></div>
                      <div className="text-gray-600">待回复: <span className="font-semibold text-orange-600">{staff.unresolved}</span></div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
                  <Button variant="outline" size="sm" className="flex-1">
                    <MessageCircle className="w-4 h-4 mr-1" />
                    会话
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Edit className="w-4 h-4 mr-1" />
                    编辑
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
            {recentChats.map((chat) => (
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
    </div>
  );
}
