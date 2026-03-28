import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, Zap, Gift, Percent, Clock, Users, TrendingUp, Play, Pause, Copy } from 'lucide-react';
import { Button } from '../../components/ui/button';

const mockActivities = [
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

const typeConfig = {
  'flash': { name: '秒杀', color: 'from-orange-500 to-red-500' },
  'newuser': { name: '新人', color: 'from-blue-500 to-purple-500' },
  'invite': { name: '邀请', color: 'from-green-500 to-teal-500' },
  'festival': { name: '节日', color: 'from-yellow-500 to-orange-500' },
  'discount': { name: '满减', color: 'from-purple-500 to-pink-500' },
};

export default function AdminActivitiesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('全部');

  const filteredActivities = mockActivities.filter(activity => {
    const matchesSearch = activity.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === '全部' || activity.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const totalParticipants = mockActivities.reduce((sum, a) => sum + a.participants, 0);
  const totalRevenue = mockActivities.reduce((sum, a) => sum + a.revenue, 0);
  const activeCount = mockActivities.filter(a => a.status === '进行中').length;

  const statusConfig = {
    '进行中': 'bg-green-100 text-green-700',
    '未开始': 'bg-blue-100 text-blue-700',
    '已结束': 'bg-gray-100 text-gray-700',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">活动管理</h2>
          <p className="text-gray-500 text-sm mt-1">创建和管理平台促销活动</p>
        </div>
        <Button className="bg-gradient-to-r from-orange-500 to-blue-500">
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
                  <span className={`px-3 py-1 backdrop-blur-sm rounded-full text-xs font-medium ${statusConfig[activity.status as keyof typeof statusConfig]}`}>
                    {activity.status}
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
                    {activity.status === '进行中' ? (
                      <Button variant="outline" size="sm" className="text-orange-600">
                        <Pause className="w-4 h-4 mr-1" />
                        暂停
                      </Button>
                    ) : activity.status === '未开始' ? (
                      <Button size="sm" className="bg-gradient-to-r from-green-500 to-teal-500">
                        <Play className="w-4 h-4 mr-1" />
                        立即开始
                      </Button>
                    ) : null}
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4 mr-1" />
                      编辑
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-600 hover:bg-red-50">
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
                  <Button variant="outline" size="sm" className="flex-1">
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
    </div>
  );
}
