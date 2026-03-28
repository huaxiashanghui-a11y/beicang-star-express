import React, { useState } from 'react';
import { Search, Eye, CheckCircle, XCircle, Truck, Clock, Filter } from 'lucide-react';
import { Button } from '../../components/ui/button';

const mockOrders = [
  {
    id: 'ORD-2024-001',
    user: '张伟',
    phone: '+95 9 123 4567',
    items: [
      { name: 'iPhone 15 Pro Max', quantity: 1, price: 9999 },
      { name: 'AirPods Pro 2', quantity: 1, price: 1899 },
    ],
    total: 11898,
    status: '已完成',
    payment: 'KBZ Pay',
    address: '仰光市 敏格拉区 123号',
    date: '2024-03-20 14:30',
  },
  {
    id: 'ORD-2024-002',
    user: '李娜',
    phone: '+95 9 987 6543',
    items: [
      { name: 'MacBook Pro 14', quantity: 1, price: 14999 },
    ],
    total: 14999,
    status: '处理中',
    payment: 'Visa',
    address: '曼德勒市 中央区域 456号',
    date: '2024-03-20 13:20',
  },
  {
    id: 'ORD-2024-003',
    user: '王强',
    phone: '+95 9 555 1234',
    items: [
      { name: 'Nike Air Jordan 1', quantity: 2, price: 3198 },
    ],
    total: 3198,
    status: '已发货',
    payment: 'Wave Pay',
    address: '内比都市 政府区 789号',
    date: '2024-03-20 11:45',
  },
  {
    id: 'ORD-2024-004',
    user: '赵敏',
    phone: '+95 9 888 9999',
    items: [
      { name: 'SK-II 护肤套装', quantity: 1, price: 2280 },
    ],
    total: 2280,
    status: '待支付',
    payment: 'PayPal',
    address: '仰光市 莱达雅区 321号',
    date: '2024-03-20 10:15',
  },
  {
    id: 'ORD-2024-005',
    user: '陈刚',
    phone: '+95 9 222 3333',
    items: [
      { name: 'iPad Pro 12.9', quantity: 1, price: 8999 },
      { name: 'Apple Pencil', quantity: 1, price: 999 },
    ],
    total: 9998,
    status: '已完成',
    payment: 'Mastercard',
    address: '勃固市 商业区 654号',
    date: '2024-03-20 09:30',
  },
];

const statusConfig = {
  '待支付': { color: 'bg-orange-100 text-orange-700', icon: Clock },
  '处理中': { color: 'bg-blue-100 text-blue-700', icon: Clock },
  '已发货': { color: 'bg-purple-100 text-purple-700', icon: Truck },
  '已完成': { color: 'bg-green-100 text-green-700', icon: CheckCircle },
  '已取消': { color: 'bg-red-100 text-red-700', icon: XCircle },
};

export default function AdminOrdersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('全部');

  const filteredOrders = mockOrders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          order.user.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === '全部' || order.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">订单管理</h2>
          <p className="text-gray-500 text-sm mt-1">查看和处理所有订单</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-red-300 text-red-600 hover:bg-red-50">
            导出数据
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: '待支付', count: 12, color: 'bg-orange-500' },
          { label: '处理中', count: 8, color: 'bg-blue-500' },
          { label: '已发货', count: 15, color: 'bg-purple-500' },
          { label: '已完成', count: 156, color: 'bg-green-500' },
          { label: '已取消', count: 3, color: 'bg-red-500' },
        ].map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-sm p-4 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setSelectedStatus(stat.label)}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">{stat.label}</span>
              <div className={`w-3 h-3 rounded-full ${stat.color}`}></div>
            </div>
            <p className="text-2xl font-bold text-gray-800">{stat.count}</p>
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
              placeholder="搜索订单号或用户名..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option>全部</option>
              <option>待支付</option>
              <option>处理中</option>
              <option>已发货</option>
              <option>已完成</option>
              <option>已取消</option>
            </select>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              筛选
            </Button>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map((order) => {
          const StatusIcon = statusConfig[order.status as keyof typeof statusConfig].icon;
          return (
            <div key={order.id} className="bg-white rounded-xl shadow-sm p-6">
              {/* Order Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 pb-4 border-b border-gray-200">
                <div className="flex items-center gap-4">
                  <div>
                    <p className="font-semibold text-gray-800">{order.user}</p>
                    <p className="text-sm text-gray-500">{order.phone}</p>
                  </div>
                  <div className="h-8 w-px bg-gray-300 hidden sm:block"></div>
                  <div>
                    <p className="text-sm text-gray-600">订单号</p>
                    <p className="text-sm font-mono text-gray-800">{order.id}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 text-xs font-medium rounded-full flex items-center gap-1 ${
                    statusConfig[order.status as keyof typeof statusConfig].color
                  }`}>
                    <StatusIcon className="w-3 h-3" />
                    {order.status}
                  </span>
                  <span className="text-sm text-gray-500">{order.date}</span>
                </div>
              </div>

              {/* Order Items */}
              <div className="space-y-3 mb-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center text-sm">
                    <div>
                      <span className="text-gray-800">{item.name}</span>
                      <span className="text-gray-400 ml-2">x{item.quantity}</span>
                    </div>
                    <span className="text-gray-600">¥{item.price}</span>
                  </div>
                ))}
              </div>

              {/* Order Footer */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-4 border-t border-gray-200">
                <div className="text-sm text-gray-600">
                  <span className="mr-4">支付方式: {order.payment}</span>
                  <span>地址: {order.address}</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm text-gray-600">订单总额</p>
                    <p className="text-xl font-bold text-orange-600">¥{order.total}</p>
                  </div>
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-2" />
                    查看详情
                  </Button>
                  {order.status === '处理中' && (
                    <Button size="sm" className="bg-gradient-to-r from-orange-500 to-blue-500">
                      <Truck className="w-4 h-4 mr-2" />
                      发货
                    </Button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
