import React from 'react';
import {
  TrendingUp,
  TrendingDown,
  ShoppingBag,
  ShoppingCart,
  Users,
  Ticket,
  DollarSign,
  Package,
} from 'lucide-react';

const stats = [
  {
    title: '总销售额',
    value: '¥128,450',
    change: '+12.5%',
    trend: 'up',
    icon: DollarSign,
    color: 'from-orange-500 to-orange-600',
  },
  {
    title: '今日订单',
    value: '156',
    change: '+8.2%',
    trend: 'up',
    icon: ShoppingCart,
    color: 'from-blue-500 to-blue-600',
  },
  {
    title: '商品数量',
    value: '1,234',
    change: '-2.1%',
    trend: 'down',
    icon: Package,
    color: 'from-green-500 to-green-600',
  },
  {
    title: '用户总数',
    value: '5,678',
    change: '+15.3%',
    trend: 'up',
    icon: Users,
    color: 'from-purple-500 to-purple-600',
  },
];

const recentOrders = [
  {
    id: 'ORD-2024-001',
    user: '张伟',
    amount: '¥2,580.00',
    status: '已完成',
    date: '2024-03-20 14:30',
  },
  {
    id: 'ORD-2024-002',
    user: '李娜',
    amount: '¥1,890.00',
    status: '处理中',
    date: '2024-03-20 13:20',
  },
  {
    id: 'ORD-2024-003',
    user: '王强',
    amount: '¥3,200.00',
    status: '已发货',
    date: '2024-03-20 11:45',
  },
  {
    id: 'ORD-2024-004',
    user: '赵敏',
    amount: '¥890.00',
    status: '待支付',
    date: '2024-03-20 10:15',
  },
  {
    id: 'ORD-2024-005',
    user: '陈刚',
    amount: '¥4,500.00',
    status: '已完成',
    date: '2024-03-20 09:30',
  },
];

const topProducts = [
  { name: 'iPhone 15 Pro Max', sales: 156, revenue: '¥156,000' },
  { name: 'MacBook Pro 14', sales: 89, revenue: '¥133,500' },
  { name: 'AirPods Pro 2', sales: 234, revenue: '¥46,800' },
  { name: 'iPad Pro 12.9', sales: 67, revenue: '¥53,600' },
  { name: 'Apple Watch S9', sales: 123, revenue: '¥61,500' },
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className={`flex items-center gap-1 text-sm ${
                  stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.trend === 'up' ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  <span>{stat.change}</span>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-1">{stat.value}</h3>
              <p className="text-gray-500 text-sm">{stat.title}</p>
            </div>
          );
        })}
      </div>

      {/* Charts and Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Chart Placeholder */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">销售趋势</h3>
          <div className="h-64 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">销售趋势图表区域</p>
              <p className="text-sm text-gray-400">集成 Recharts 或 Chart.js</p>
            </div>
          </div>
        </div>

        {/* Category Distribution */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">商品分类</h3>
          <div className="space-y-3">
            {[
              { name: '数码电子', percent: 45, color: 'bg-orange-500' },
              { name: '服装鞋包', percent: 25, color: 'bg-blue-500' },
              { name: '美妆护肤', percent: 15, color: 'bg-green-500' },
              { name: '家居生活', percent: 10, color: 'bg-purple-500' },
              { name: '其他', percent: 5, color: 'bg-gray-500' },
            ].map((cat, index) => (
              <div key={index}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700">{cat.name}</span>
                  <span className="text-gray-500">{cat.percent}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`${cat.color} h-2 rounded-full transition-all`}
                    style={{ width: `${cat.percent}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders and Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">最近订单</h3>
            <button className="text-orange-500 hover:text-orange-600 text-sm font-medium">
              查看全部
            </button>
          </div>
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-blue-500 rounded-lg flex items-center justify-center">
                    <ShoppingBag className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">{order.user}</p>
                    <p className="text-xs text-gray-500">{order.id}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-800">{order.amount}</p>
                  <p className={`text-xs ${
                    order.status === '已完成' ? 'text-green-600' :
                    order.status === '处理中' ? 'text-blue-600' :
                    order.status === '已发货' ? 'text-purple-600' :
                    'text-orange-600'
                  }`}>
                    {order.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">热销商品</h3>
            <button className="text-orange-500 hover:text-orange-600 text-sm font-medium">
              查看全部
            </button>
          </div>
          <div className="space-y-3">
            {topProducts.map((product, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-3">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    index === 0 ? 'bg-orange-500 text-white' :
                    index === 1 ? 'bg-blue-500 text-white' :
                    index === 2 ? 'bg-green-500 text-white' :
                    'bg-gray-500 text-white'
                  }`}>
                    {index + 1}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-gray-800">{product.name}</p>
                    <p className="text-xs text-gray-500">销量: {product.sales}</p>
                  </div>
                </div>
                <p className="text-sm font-semibold text-orange-600">{product.revenue}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
