import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, Star, Gift, TrendingUp, Users, Coins, ArrowUpDown } from 'lucide-react';
import { Button } from '../../components/ui/button';

const mockPointsRules = [
  {
    id: '1',
    name: '购物返积分',
    description: '每消费1元返1积分',
    type: 'earn',
    points: 1,
    ratio: '¥1 = 1积分',
    status: '启用',
    dailyLimit: null,
    totalUsed: 1567800,
  },
  {
    id: '2',
    name: '订单完成奖励',
    description: '订单完成后额外奖励积分',
    type: 'earn',
    points: 100,
    ratio: '每单+100积分',
    status: '启用',
    dailyLimit: 1,
    totalUsed: 890100,
  },
  {
    id: '3',
    name: '商品评价奖励',
    description: '发表有效评价奖励积分',
    type: 'earn',
    points: 50,
    ratio: '每评价+50积分',
    status: '启用',
    dailyLimit: 5,
    totalUsed: 456700,
  },
  {
    id: '4',
    name: '邀请好友奖励',
    description: '成功邀请1位好友奖励积分',
    type: 'earn',
    points: 500,
    ratio: '每人+500积分',
    status: '启用',
    dailyLimit: 10,
    totalUsed: 234500,
  },
  {
    id: '5',
    name: '积分抵扣现金',
    description: '100积分抵扣1元',
    type: 'redeem',
    points: 100,
    ratio: '100积分 = ¥1',
    status: '启用',
    dailyLimit: 50000,
    totalUsed: 3456000,
  },
  {
    id: '6',
    name: '积分兑换优惠券',
    description: '积分商城兑换各种优惠券',
    type: 'redeem',
    points: 1000,
    ratio: '1000积分起兑',
    status: '启用',
    dailyLimit: null,
    totalUsed: 1234000,
  },
];

const mockPointsRecords = [
  { id: '1', user: '张伟', type: '获得', points: 1250, source: '购物返积分', time: '2024-03-20 14:30' },
  { id: '2', user: '李娜', type: '使用', points: -500, source: '兑换优惠券', time: '2024-03-20 13:20' },
  { id: '3', user: '王强', type: '获得', points: 600, source: '邀请好友', time: '2024-03-20 11:45' },
  { id: '4', user: '赵敏', type: '使用', points: -1000, source: '抵扣现金', time: '2024-03-20 10:15' },
  { id: '5', user: '陈刚', type: '获得', points: 150, source: '订单完成', time: '2024-03-20 09:30' },
];

export default function AdminPointsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'rules' | 'records' | 'products'>('rules');

  const totalPointsIssued = mockPointsRules.filter(r => r.type === 'earn').reduce((sum, r) => sum + r.totalUsed, 0);
  const totalPointsRedeemed = mockPointsRules.filter(r => r.type === 'redeem').reduce((sum, r) => sum + r.totalUsed, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">积分管理</h2>
          <p className="text-gray-500 text-sm mt-1">配置积分规则和兑换商品</p>
        </div>
        <Button className="bg-gradient-to-r from-orange-500 to-blue-500">
          <Plus className="w-4 h-4 mr-2" />
          添加规则
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-xl p-4 text-white">
          <div className="flex items-center gap-2 mb-2">
            <Star className="w-5 h-5" />
            <p className="text-sm opacity-90">总发放积分</p>
          </div>
          <p className="text-2xl font-bold">{(totalPointsIssued / 10000).toFixed(0)}万</p>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl p-4 text-white">
          <div className="flex items-center gap-2 mb-2">
            <Coins className="w-5 h-5" />
            <p className="text-sm opacity-90">总消耗积分</p>
          </div>
          <p className="text-2xl font-bold">{(totalPointsRedeemed / 10000).toFixed(0)}万</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-green-500" />
            <p className="text-sm text-gray-600">积分结余</p>
          </div>
          <p className="text-2xl font-bold text-green-600">
            {((totalPointsIssued - totalPointsRedeemed) / 10000).toFixed(0)}万
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-5 h-5 text-blue-500" />
            <p className="text-sm text-gray-600">参与用户</p>
          </div>
          <p className="text-2xl font-bold text-blue-600">5,678</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('rules')}
            className={`px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === 'rules'
                ? 'text-orange-600 border-b-2 border-orange-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            积分规则
          </button>
          <button
            onClick={() => setActiveTab('records')}
            className={`px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === 'records'
                ? 'text-orange-600 border-b-2 border-orange-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            积分记录
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === 'products'
                ? 'text-orange-600 border-b-2 border-orange-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            积分商品
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'rules' && (
            <div className="space-y-4">
              {mockPointsRules.map((rule) => (
                <div key={rule.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      rule.type === 'earn' ? 'bg-green-100' : 'bg-orange-100'
                    }`}>
                      {rule.type === 'earn' ? (
                        <TrendingUp className="w-6 h-6 text-green-600" />
                      ) : (
                        <Gift className="w-6 h-6 text-orange-600" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-gray-800">{rule.name}</h4>
                        <span className={`px-2 py-0.5 rounded-full text-xs ${
                          rule.type === 'earn' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                        }`}>
                          {rule.type === 'earn' ? '获得' : '消耗'}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-xs ${
                          rule.status === '启用' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {rule.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{rule.description}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>{rule.ratio}</span>
                        {rule.dailyLimit && <span>每日限{rule.dailyLimit}次</span>}
                        <span>已使用: {(rule.totalUsed / 10000).toFixed(1)}万</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4 mr-1" />
                      编辑
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-600 hover:bg-red-50">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'records' && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">用户</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">类型</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">积分</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">来源</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">时间</th>
                  </tr>
                </thead>
                <tbody>
                  {mockPointsRecords.map((record) => (
                    <tr key={record.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <span className="font-medium text-gray-800">{record.user}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-xs ${
                          record.type === '获得' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {record.type}
                        </span>
                      </td>
                      <td className={`py-3 px-4 font-semibold ${
                        record.points > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {record.points > 0 ? '+' : ''}{record.points}
                      </td>
                      <td className="py-3 px-4 text-gray-600">{record.source}</td>
                      <td className="py-3 px-4 text-gray-500 text-sm">{record.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'products' && (
            <div className="text-center py-8 text-gray-500">
              <Gift className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p>积分商城商品管理</p>
              <p className="text-sm text-gray-400 mt-2">即将推出...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
