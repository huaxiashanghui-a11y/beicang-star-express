import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TrendingUp,
  TrendingDown,
  ShoppingBag,
  ShoppingCart,
  Users,
  DollarSign,
  Package,
  RefreshCw,
} from 'lucide-react';
import { Button } from '../../components/ui/button';

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState<any[]>([]);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [topProducts, setTopProducts] = useState<any[]>([]);

  const loadDashboardData = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      // 尝试获取API数据
      const response = await fetch('/api/admin/stats/dashboard', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });

      if (response.ok) {
        const data = await response.json();

        if (data.stats) {
          setStats([
            {
              title: '总销售额',
              value: `¥${((data.stats.totalSales || 0) / 100).toLocaleString()}`,
              change: data.stats.salesChange || '0%',
              trend: data.stats.salesChange?.startsWith('+') ? 'up' : 'down',
              icon: DollarSign,
              color: 'from-orange-500 to-orange-600',
              onClick: () => navigate('/admin/orders'),
            },
            {
              title: '今日订单',
              value: (data.stats.todayOrders || 0).toString(),
              change: data.stats.ordersChange || '0%',
              trend: data.stats.ordersChange?.startsWith('+') ? 'up' : 'down',
              icon: ShoppingCart,
              color: 'from-blue-500 to-blue-600',
              onClick: () => navigate('/admin/orders'),
            },
            {
              title: '商品数量',
              value: (data.stats.totalProducts || 0).toString(),
              change: data.stats.productsChange || '0%',
              trend: data.stats.productsChange?.startsWith('+') ? 'up' : 'down',
              icon: Package,
              color: 'from-green-500 to-green-600',
              onClick: () => navigate('/admin/products'),
            },
            {
              title: '用户总数',
              value: (data.stats.totalUsers || 0).toLocaleString(),
              change: data.stats.usersChange || '0%',
              trend: data.stats.usersChange?.startsWith('+') ? 'up' : 'down',
              icon: Users,
              color: 'from-purple-500 to-purple-600',
              onClick: () => navigate('/admin/users'),
            },
          ]);
        }

        if (data.recentOrders) {
          setRecentOrders(data.recentOrders.slice(0, 5).map((order: any) => ({
            id: order.id,
            user: order.userName || order.user_name || '用户',
            amount: `¥${((order.total || order.totalAmount || 0) / 100).toLocaleString()}`,
            status: order.status === 'completed' ? '已完成' :
                    order.status === 'pending' ? '待支付' :
                    order.status === 'processing' ? '处理中' :
                    order.status === 'shipped' ? '已发货' : '处理中',
            date: order.createdAt || order.created_at || new Date().toISOString(),
          })));
        }

        if (data.topProducts) {
          setTopProducts(data.topProducts.slice(0, 5).map((p: any) => ({
            name: p.name,
            sales: p.sales || 0,
            revenue: `¥${(((p.price || 0) * (p.sales || 0)) / 100).toLocaleString()}`,
          })));
        }
      } else {
        throw new Error('API request failed');
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      // 使用演示数据
      setStats([
        { title: '总销售额', value: '¥12,580', change: '+12.5%', trend: 'up', icon: DollarSign, color: 'from-orange-500 to-orange-600', onClick: () => navigate('/admin/orders') },
        { title: '今日订单', value: '156', change: '+8.3%', trend: 'up', icon: ShoppingCart, color: 'from-blue-500 to-blue-600', onClick: () => navigate('/admin/orders') },
        { title: '商品数量', value: '1,284', change: '+5.2%', trend: 'up', icon: Package, color: 'from-green-500 to-green-600', onClick: () => navigate('/admin/products') },
        { title: '用户总数', value: '8,542', change: '-2.1%', trend: 'down', icon: Users, color: 'from-purple-500 to-purple-600', onClick: () => navigate('/admin/users') },
      ]);
      setRecentOrders([
        { id: '20240315001', user: '张三', amount: '¥328.00', status: '已完成', date: '2024-03-15' },
        { id: '20240315002', user: '李四', amount: '¥156.50', status: '处理中', date: '2024-03-15' },
        { id: '20240315003', user: '王五', amount: '¥89.00', status: '待支付', date: '2024-03-15' },
      ]);
      setTopProducts([
        { name: 'iPhone 15 Pro', sales: 128, revenue: '¥127,872' },
        { name: '华为 Mate 60', sales: 86, revenue: '¥68,800' },
        { name: '耐克运动鞋', sales: 234, revenue: '¥46,800' },
      ]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [navigate]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const handleRefresh = () => {
    loadDashboardData(true);
  };

  const displayStats = stats.length > 0 ? stats : [
    { title: '总销售额', value: '¥0', change: '0%', trend: 'up', icon: DollarSign, color: 'from-orange-500 to-orange-600' },
    { title: '今日订单', value: '0', change: '0%', trend: 'up', icon: ShoppingCart, color: 'from-blue-500 to-blue-600' },
    { title: '商品数量', value: '0', change: '0%', trend: 'up', icon: Package, color: 'from-green-500 to-green-600' },
    { title: '用户总数', value: '0', change: '0%', trend: 'up', icon: Users, color: 'from-purple-500 to-purple-600' },
  ];

  const displayOrders = recentOrders.length > 0 ? recentOrders : [{ id: '暂无订单', user: '-', amount: '¥0', status: '-', date: '-' }];
  const displayProducts = topProducts.length > 0 ? topProducts : [{ name: '暂无商品', sales: 0, revenue: '¥0' }];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">仪表盘</h2>
          <p className="text-gray-500 text-sm mt-1">欢迎回来！以下是今日数据概览</p>
        </div>
        <Button
          variant="outline"
          onClick={handleRefresh}
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? '刷新中...' : '刷新数据'}
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-xl" />
                <div className="w-12 h-4 bg-gray-200 rounded" />
              </div>
              <div className="h-8 bg-gray-200 rounded w-24 mb-2" />
              <div className="h-4 bg-gray-100 rounded w-16" />
            </div>
          ))
        ) : (
          displayStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                onClick={stat.onClick}
                className="bg-white rounded-xl shadow-sm p-6 cursor-pointer hover:shadow-md hover:-translate-y-1 transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center shadow-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className={`flex items-center gap-1 text-sm font-medium ${
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
          })
        )}
      </div>

      {/* Charts and Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Chart Placeholder */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">销售趋势</h3>
          <div className="h-64 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-200">
            <div className="text-center">
              <TrendingUp className="w-12 h-12 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-400">图表区域</p>
              <p className="text-xs text-gray-300 mt-1">集成 Recharts 或 Chart.js</p>
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
              { name: '其他', percent: 5, color: 'bg-gray-400' },
            ].map((cat, index) => (
              <div key={index}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700">{cat.name}</span>
                  <span className="text-gray-500">{cat.percent}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className={`${cat.color} h-2 rounded-full transition-all duration-500`}
                    style={{ width: `${cat.percent}%` }}
                  />
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
            <button
              onClick={() => navigate('/admin/orders')}
              className="text-orange-500 hover:text-orange-600 hover:-translate-y-0.5 text-sm font-medium transition-all"
            >
              查看全部
            </button>
          </div>
          <div className="space-y-3">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg animate-pulse">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-lg" />
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-20" />
                      <div className="h-3 bg-gray-100 rounded w-24" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-16" />
                    <div className="h-3 bg-gray-100 rounded w-12" />
                  </div>
                </div>
              ))
            ) : (
              displayOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer" onClick={() => navigate('/admin/orders')}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-blue-500 rounded-lg flex items-center justify-center">
                      <ShoppingBag className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">{order.user}</p>
                      <p className="text-xs text-gray-500">{order.id.slice(0, 12)}...</p>
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
              ))
            )}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">热销商品</h3>
            <button
              onClick={() => navigate('/admin/products')}
              className="text-orange-500 hover:text-orange-600 hover:-translate-y-0.5 text-sm font-medium transition-all"
            >
              查看全部
            </button>
          </div>
          <div className="space-y-3">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg animate-pulse">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-gray-200 rounded-full" />
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-32" />
                      <div className="h-3 bg-gray-100 rounded w-16" />
                    </div>
                  </div>
                  <div className="h-4 bg-gray-200 rounded w-16" />
                </div>
              ))
            ) : (
              displayProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer" onClick={() => navigate('/admin/products')}>
                  <div className="flex items-center gap-3">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      index === 0 ? 'bg-orange-500 text-white' :
                      index === 1 ? 'bg-blue-500 text-white' :
                      index === 2 ? 'bg-green-500 text-white' :
                      'bg-gray-400 text-white'
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
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
