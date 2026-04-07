import React, { useState } from 'react';
import { Search, Eye, CheckCircle, Truck, Clock, XCircle } from 'lucide-react';
import { Button } from '../../components/ui/button';

export default function AdminOrdersPage() {
  const [orders] = useState([
    { id: 'ORD20240315001', user: '张三', phone: '138****1234', total: 3280, status: '已完成', payment: '微信支付', date: '2024-03-15 14:30' },
    { id: 'ORD20240315002', user: '李四', phone: '139****5678', total: 1560, status: '处理中', payment: '支付宝', date: '2024-03-15 15:20' },
    { id: 'ORD20240315003', user: '王五', phone: '137****9012', total: 890, status: '待支付', payment: '微信支付', date: '2024-03-15 16:45' },
    { id: 'ORD20240315004', user: '赵六', phone: '136****3456', total: 4580, status: '已发货', payment: 'Visa', date: '2024-03-15 18:10' },
    { id: 'ORD20240315005', user: '钱七', phone: '135****7890', total: 1299, status: '处理中', payment: '微信支付', date: '2024-03-16 09:30' },
  ]);

  const getStatusStyle = (status) => {
    const styles = {
      '待支付': 'bg-orange-100 text-orange-700',
      '处理中': 'bg-blue-100 text-blue-700',
      '已发货': 'bg-purple-100 text-purple-700',
      '已完成': 'bg-green-100 text-green-700',
      '已取消': 'bg-gray-100 text-gray-700',
    };
    return styles[status] || 'bg-gray-100 text-gray-700';
  };

  const getStatusIcon = (status) => {
    const icons = {
      '待支付': Clock,
      '处理中': Clock,
      '已发货': Truck,
      '已完成': CheckCircle,
      '已取消': XCircle,
    };
    const Icon = icons[status] || Clock;
    return <Icon className="w-4 h-4" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">订单管理</h2>
          <p className="text-gray-500 text-sm mt-1">查看和处理所有订单</p>
        </div>
        <Button variant="outline">导出订单</Button>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-orange-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">12</p>
              <p className="text-gray-500 text-sm">待支付</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Truck className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">8</p>
              <p className="text-gray-500 text-sm">处理中</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Truck className="w-6 h-6 text-purple-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">5</p>
              <p className="text-gray-500 text-sm">已发货</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">156</p>
              <p className="text-gray-500 text-sm">已完成</p>
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
              placeholder="搜索订单号或用户名..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <select className="px-4 py-2 border border-gray-200 rounded-lg">
            <option>全部状态</option>
            <option>待支付</option>
            <option>处理中</option>
            <option>已发货</option>
            <option>已完成</option>
          </select>
        </div>
      </div>

      {/* 订单表格 */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">订单号</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">用户</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">金额</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">支付方式</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">状态</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">时间</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-mono text-sm">{order.id}</td>
                <td className="px-6 py-4">
                  <div>
                    <p className="font-medium">{order.user}</p>
                    <p className="text-gray-500 text-sm">{order.phone}</p>
                  </div>
                </td>
                <td className="px-6 py-4 font-semibold text-orange-600">¥{order.total.toLocaleString()}</td>
                <td className="px-6 py-4 text-gray-600">{order.payment}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(order.status)}`}>
                    {getStatusIcon(order.status)}
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-600 text-sm">{order.date}</td>
                <td className="px-6 py-4">
                  <Button variant="ghost" size="sm"><Eye className="w-4 h-4" /></Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
