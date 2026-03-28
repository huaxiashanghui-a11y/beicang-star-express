import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, Copy, Gift } from 'lucide-react';
import { Button } from '../../components/ui/button';

const mockCoupons = [
  {
    id: '1',
    name: '新人专享券',
    type: '折扣',
    discount: '20%',
    minAmount: 100,
    maxDiscount: 50,
    total: 1000,
    claimed: 756,
    startDate: '2024-03-01',
    endDate: '2024-03-31',
    status: '进行中',
  },
  {
    id: '2',
    name: '满减优惠券',
    type: '满减',
    discount: '¥50',
    minAmount: 500,
    maxDiscount: 50,
    total: 500,
    claimed: 234,
    startDate: '2024-03-15',
    endDate: '2024-04-15',
    status: '进行中',
  },
  {
    id: '3',
    name: '限时折扣券',
    type: '折扣',
    discount: '15%',
    minAmount: 200,
    maxDiscount: 100,
    total: 200,
    claimed: 200,
    startDate: '2024-03-10',
    endDate: '2024-03-20',
    status: '已结束',
  },
  {
    id: '4',
    name: '节日特惠券',
    type: '满减',
    discount: '¥100',
    minAmount: 1000,
    maxDiscount: 100,
    total: 100,
    claimed: 45,
    startDate: '2024-04-01',
    endDate: '2024-04-07',
    status: '未开始',
  },
  {
    id: '5',
    name: 'VIP专属券',
    type: '折扣',
    discount: '30%',
    minAmount: 0,
    maxDiscount: 200,
    total: 50,
    claimed: 12,
    startDate: '2024-03-01',
    endDate: '2024-12-31',
    status: '进行中',
  },
];

export default function AdminCouponsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const filteredCoupons = mockCoupons.filter(coupon =>
    coupon.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const statusColors = {
    '进行中': 'bg-green-100 text-green-700',
    '已结束': 'bg-gray-100 text-gray-700',
    '未开始': 'bg-blue-100 text-blue-700',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">优惠券管理</h2>
          <p className="text-gray-500 text-sm mt-1">创建和管理促销活动优惠券</p>
        </div>
        <Button
          onClick={() => setShowAddModal(true)}
          className="bg-gradient-to-r from-orange-500 to-blue-500 hover:from-orange-600 hover:to-blue-600"
        >
          <Plus className="w-4 h-4 mr-2" />
          创建优惠券
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: '进行中', count: 3, color: 'text-green-600' },
          { label: '已结束', count: 1, color: 'text-gray-600' },
          { label: '未开始', count: 1, color: 'text-blue-600' },
          { label: '发放总量', count: 1850, color: 'text-orange-600' },
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
              placeholder="搜索优惠券名称..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div className="flex gap-2">
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500">
              <option>全部状态</option>
              <option>进行中</option>
              <option>已结束</option>
              <option>未开始</option>
            </select>
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500">
              <option>全部类型</option>
              <option>折扣</option>
              <option>满减</option>
            </select>
          </div>
        </div>
      </div>

      {/* Coupons List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCoupons.map((coupon) => (
          <div key={coupon.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            {/* Coupon Header */}
            <div className={`p-6 ${
              coupon.status === '进行中'
                ? 'bg-gradient-to-r from-orange-500 to-blue-500'
                : coupon.status === '未开始'
                ? 'bg-gradient-to-r from-blue-500 to-purple-500'
                : 'bg-gradient-to-r from-gray-400 to-gray-500'
            } text-white`}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold mb-1">{coupon.name}</h3>
                  <p className="text-sm opacity-90">
                    {coupon.type === '折扣' ? '折扣券' : '满减券'}
                  </p>
                </div>
                <span className="px-3 py-1 bg-white/20 rounded-full text-xs">
                  {coupon.status}
                </span>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold">{coupon.discount}</p>
                {coupon.minAmount > 0 && (
                  <p className="text-sm mt-2 opacity-90">
                    满¥{coupon.minAmount}可用
                  </p>
                )}
              </div>
            </div>

            {/* Coupon Body */}
            <div className="p-6">
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">发行数量</span>
                  <span className="font-medium text-gray-800">{coupon.total}张</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">已领取</span>
                  <span className="font-medium text-green-600">{coupon.claimed}张</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">使用期限</span>
                  <span className="font-medium text-gray-800 text-right text-xs">
                    {coupon.startDate}<br />至 {coupon.endDate}
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-orange-500 to-blue-500 h-2 rounded-full transition-all"
                    style={{ width: `${(coupon.claimed / coupon.total) * 100}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1 text-center">
                  领取率: {((coupon.claimed / coupon.total) * 100).toFixed(1)}%
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  size="sm"
                  onClick={() => navigator.clipboard.writeText(coupon.id)}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  复制
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Edit className="w-4 h-4 mr-2" />
                  编辑
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
