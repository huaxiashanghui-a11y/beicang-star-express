import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, CreditCard, CheckCircle, XCircle, Eye } from 'lucide-react';
import { Button } from '../../components/ui/button';

const mockPayments = [
  {
    id: '1',
    name: 'KBZ Pay',
    description: '缅甸KBZ银行移动支付',
    icon: '💳',
    status: '启用',
    transactionFee: 0,
    minAmount: 1000,
    maxAmount: 5000000,
    dailyLimit: 10000000,
    todayVolume: 2560000,
    orderCount: 1234,
    color: 'bg-blue-500',
  },
  {
    id: '2',
    name: 'Wave Pay',
    description: '缅甸Wave移动支付',
    icon: '📱',
    status: '启用',
    transactionFee: 0,
    minAmount: 500,
    maxAmount: 3000000,
    dailyLimit: 5000000,
    todayVolume: 1890000,
    orderCount: 892,
    color: 'bg-green-500',
  },
  {
    id: '3',
    name: 'Visa',
    description: '国际信用卡支付',
    icon: '💳',
    status: '启用',
    transactionFee: 2.5,
    minAmount: 5000,
    maxAmount: 10000000,
    dailyLimit: 50000000,
    todayVolume: 5600000,
    orderCount: 456,
    color: 'bg-purple-500',
  },
  {
    id: '4',
    name: 'Mastercard',
    description: '万事达卡支付',
    icon: '💳',
    status: '启用',
    transactionFee: 2.5,
    minAmount: 5000,
    maxAmount: 10000000,
    dailyLimit: 50000000,
    todayVolume: 4200000,
    orderCount: 389,
    color: 'bg-orange-500',
  },
  {
    id: '5',
    name: 'PayPal',
    description: '国际在线支付平台',
    icon: '🌐',
    status: '启用',
    transactionFee: 3.5,
    minAmount: 10000,
    maxAmount: 50000000,
    dailyLimit: 100000000,
    todayVolume: 8900000,
    orderCount: 567,
    color: 'bg-blue-600',
  },
  {
    id: '6',
    name: 'COD',
    description: '货到付款',
    icon: '💵',
    status: '禁用',
    transactionFee: 0,
    minAmount: 0,
    maxAmount: 1000000,
    dailyLimit: 2000000,
    todayVolume: 450000,
    orderCount: 234,
    color: 'bg-gray-500',
  },
];

export default function AdminPaymentsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('全部');

  const filteredPayments = mockPayments.filter(payment => {
    const matchesSearch = payment.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === '全部' || payment.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const totalVolume = mockPayments.reduce((sum, p) => sum + p.todayVolume, 0);
  const totalOrders = mockPayments.reduce((sum, p) => sum + p.orderCount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">支付管理</h2>
          <p className="text-gray-500 text-sm mt-1">配置和管理支付渠道</p>
        </div>
        <Button className="bg-gradient-to-r from-orange-500 to-blue-500">
          <Plus className="w-4 h-4 mr-2" />
          添加支付方式
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-4">
          <p className="text-sm text-gray-600 mb-1">今日交易总额</p>
          <p className="text-2xl font-bold text-orange-600">
            ¥{(totalVolume / 10000).toFixed(0)}万
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <p className="text-sm text-gray-600 mb-1">今日订单数</p>
          <p className="text-2xl font-bold text-blue-600">{totalOrders}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <p className="text-sm text-gray-600 mb-1">启用支付方式</p>
          <p className="text-2xl font-bold text-green-600">
            {mockPayments.filter(p => p.status === '启用').length}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <p className="text-sm text-gray-600 mb-1">平均手续费</p>
          <p className="text-2xl font-bold text-purple-600">2.1%</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="搜索支付方式..."
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
            <option>启用</option>
            <option>禁用</option>
          </select>
        </div>
      </div>

      {/* Payment Methods Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPayments.map((payment) => (
          <div
            key={payment.id}
            className={`bg-white rounded-xl shadow-sm overflow-hidden border-2 ${
              payment.status === '启用' ? 'border-transparent' : 'border-gray-200'
            }`}
          >
            {/* Header */}
            <div className={`${payment.color} p-4 text-white`}>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl">
                    {payment.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{payment.name}</h3>
                    <p className="text-sm opacity-90">{payment.description}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  payment.status === '启用'
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-400 text-white'
                }`}>
                  {payment.status}
                </span>
              </div>
            </div>

            {/* Body */}
            <div className="p-4">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center p-2 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">今日交易额</p>
                  <p className="font-bold text-gray-800">
                    ¥{(payment.todayVolume / 10000).toFixed(1)}万
                  </p>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">订单数</p>
                  <p className="font-bold text-gray-800">{payment.orderCount}</p>
                </div>
              </div>

              <div className="space-y-2 text-sm mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-500">手续费率</span>
                  <span className="font-medium">{payment.transactionFee}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">单笔限额</span>
                  <span className="font-medium">
                    ¥{payment.minAmount.toLocaleString()} - ¥{payment.maxAmount.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">日限额</span>
                  <span className="font-medium">¥{(payment.dailyLimit / 10000).toFixed(0)}万</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Eye className="w-4 h-4 mr-2" />
                  详情
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Edit className="w-4 h-4 mr-2" />
                  编辑
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className={payment.status === '启用' ? 'text-red-600' : 'text-green-600'}
                >
                  {payment.status === '启用' ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
