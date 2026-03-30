import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingBag,
  ShoppingCart,
  Users,
  Ticket,
  Grid3X3,
  CreditCard,
  MessageCircle,
  Volume2,
  Zap,
  Image,
  Star,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
} from 'lucide-react';
import { Button } from '../components/ui/button';
import adminApi from '../config/adminApi';

const menuItems = [
  { path: '/admin', icon: LayoutDashboard, label: '仪表盘', badge: null },
  { path: '/admin/products', icon: ShoppingBag, label: '商品管理', badge: null },
  { path: '/admin/orders', icon: ShoppingCart, label: '订单管理', badge: 5 },
  { path: '/admin/users', icon: Users, label: '用户管理', badge: null },
  { path: '/admin/coupons', icon: Ticket, label: '优惠券', badge: null },
  { path: '/admin/categories', icon: Grid3X3, label: '分类管理', badge: null },
  { path: '/admin/payments', icon: CreditCard, label: '支付管理', badge: null },
  { path: '/admin/customer-service', icon: MessageCircle, label: '客服管理', badge: 3 },
  { path: '/admin/announcements', icon: Volume2, label: '公告管理', badge: null },
  { path: '/admin/activities', icon: Zap, label: '活动管理', badge: null },
  { path: '/admin/banners', icon: Image, label: '轮播管理', badge: null },
  { path: '/admin/points', icon: Star, label: '积分管理', badge: null },
];

interface AdminUser {
  id?: string;
  name?: string;
  username?: string;
  role?: string;
}

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [adminUser, setAdminUser] = useState<AdminUser>({});
  const [loading, setLoading] = useState(true);

  // 从API获取管理员信息
  useEffect(() => {
    loadAdminProfile();
  }, []);

  const loadAdminProfile = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        navigate('/admin/login');
        return;
      }

      // 尝试从API获取用户信息
      const userData = await adminApi.auth.getCurrentUser();
      if (userData) {
        setAdminUser(userData);
        localStorage.setItem('adminUser', JSON.stringify(userData));
      }
    } catch (error) {
      console.error('Failed to load admin profile:', error);
      // 如果获取失败，尝试使用本地存储的数据
      const storedUser = localStorage.getItem('adminUser');
      if (storedUser) {
        setAdminUser(JSON.parse(storedUser));
      } else {
        // 如果没有存储的用户数据，跳转到登录页
        navigate('/admin/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/admin/login');
  };

  const isActive = (path: string) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-gradient-to-b from-slate-900 to-slate-800 text-white transition-all duration-300 flex flex-col`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-700">
          {sidebarOpen ? (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-blue-500 rounded-lg flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg">管理后台</span>
            </div>
          ) : (
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-blue-500 rounded-lg flex items-center justify-center mx-auto">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-400 hover:text-white"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Menu */}
        <nav className="flex-1 py-4 overflow-y-auto">
          <ul className="space-y-1 px-3">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);

              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                      active
                        ? 'bg-gradient-to-r from-orange-500 to-blue-500 text-white shadow-lg'
                        : 'text-gray-400 hover:bg-slate-700 hover:text-white'
                    }`}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    {sidebarOpen && (
                      <>
                        <span className="flex-1">{item.label}</span>
                        {item.badge && (
                          <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Quick Actions */}
        <div className="px-3 py-4 border-t border-slate-700">
          <Link
            to="/"
            className="flex items-center gap-3 px-3 py-2.5 text-gray-400 hover:bg-slate-700 hover:text-white rounded-lg transition-all"
          >
            <Grid3X3 className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && <span>返回前台</span>}
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 bg-white shadow-sm border-b border-gray-200 flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-semibold text-gray-800">
              {menuItems.find((item) => isActive(item.path))?.label || '管理后台'}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {/* Notifications */}
            <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-lg">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  {adminUser.name?.[0] || 'A'}
                </div>
                <span className="text-gray-700 font-medium">{adminUser.name || '管理员'}</span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-800">{adminUser.name}</p>
                    <p className="text-xs text-gray-500">{adminUser.username}</p>
                  </div>
                  <button className="w-full flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50">
                    <Settings className="w-4 h-4" />
                    <span>设置</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>退出登录</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
