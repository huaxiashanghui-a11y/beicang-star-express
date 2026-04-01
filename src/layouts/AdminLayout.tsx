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
  Bike,
  Shield,
  Wallet,
  DollarSign,
  Megaphone,
  Mail,
  UserCog,
} from 'lucide-react';
import { Button } from '../components/ui/button';
import adminApi from '../config/adminApi';

// 一级菜单配置
interface MenuItem {
  path: string;
  icon: React.ElementType;
  label: string;
  badge?: number | null;
}

// 二级菜单配置
interface SubMenuItem {
  path: string;
  label: string;
  badge?: number | null;
}

// 财务管理组配置
const financeGroup = {
  icon: DollarSign,
  label: '财务管理',
  subMenus: [
    { path: '/admin/recharge', label: '充值管理', badge: null },
    { path: '/admin/payments', label: '支付管理', badge: null },
    { path: '/admin/points', label: '积分管理', badge: null },
  ] as SubMenuItem[],
};

// 运营管理组配置
const operationGroup = {
  icon: Megaphone,
  label: '运营管理',
  subMenus: [
    { path: '/admin/coupons', label: '优惠券', badge: null },
    { path: '/admin/announcements', label: '公告管理', badge: null },
    { path: '/admin/activities', label: '活动管理', badge: null },
    { path: '/admin/banners', label: '轮播管理', badge: null },
    { path: '/admin/system-messages', label: '系统消息', badge: null },
    { path: '/admin/email-list', label: '邮件列表', badge: null },
    { path: '/admin/secretary', label: '小秘书', badge: null },
    { path: '/admin/popup', label: '首页弹窗', badge: null },
  ] as SubMenuItem[],
};

// 一级菜单列表
const menuItems: MenuItem[] = [
  { path: '/admin', icon: LayoutDashboard, label: '仪表盘', badge: null },
  { path: '/admin/products', icon: ShoppingBag, label: '商品管理', badge: null },
  { path: '/admin/orders', icon: ShoppingCart, label: '订单管理', badge: 5 },
  { path: '/admin/users', icon: Users, label: '用户管理', badge: null },
  { path: '/admin/categories', icon: Grid3X3, label: '分类管理', badge: null },
  { path: '/admin/customer-service', icon: MessageCircle, label: '客服管理', badge: 3 },
  { path: '/admin/riders', icon: Bike, label: '骑手管理', badge: null },
  { path: '/admin/permissions', icon: Shield, label: '权限管理', badge: null },
];

interface AdminUser {
  id?: string;
  name?: string;
  username?: string;
  role?: string;
}

// 菜单组组件
function MenuGroup({
  group,
  expanded,
  onToggle,
  isActive,
  sidebarOpen
}: {
  group: { icon: React.ElementType; label: string; subMenus: SubMenuItem[] };
  expanded: boolean;
  onToggle: () => void;
  isActive: () => boolean;
  sidebarOpen: boolean;
}) {
  const location = useLocation();
  const Icon = group.icon;

  return (
    <li className="pt-2">
      <button
        onClick={onToggle}
        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
          isActive()
            ? 'bg-gradient-to-r from-orange-500 to-blue-500 text-white shadow-lg'
            : 'text-gray-400 hover:bg-slate-700 hover:text-white'
        }`}
      >
        <Icon className="w-5 h-5 flex-shrink-0" />
        {sidebarOpen && (
          <>
            <span className="flex-1 text-left">{group.label}</span>
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-200 ${
                expanded ? 'rotate-180' : ''
              }`}
            />
          </>
        )}
      </button>

      {/* 子菜单 */}
      {sidebarOpen && (
        <div
          className={`overflow-hidden transition-all duration-200 ease-in-out ${
            expanded ? 'max-h-96 opacity-100 mt-1' : 'max-h-0 opacity-0'
          }`}
        >
          <ul className="space-y-1 pl-4 border-l-2 border-slate-700 ml-3">
            {group.subMenus.map((subMenu) => {
              const active = location.pathname.startsWith(subMenu.path);
              return (
                <li key={subMenu.path}>
                  <Link
                    to={subMenu.path}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-sm ${
                      active
                        ? 'bg-orange-500/20 text-orange-400 border-l-2 border-orange-500 -ml-[2px]'
                        : 'text-gray-400 hover:bg-slate-700 hover:text-white'
                    }`}
                  >
                    <span className="flex-1">{subMenu.label}</span>
                    {subMenu.badge && (
                      <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                        {subMenu.badge}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </li>
  );
}

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [adminUser, setAdminUser] = useState<AdminUser>({});
  const [loading, setLoading] = useState(true);
  const [financeExpanded, setFinanceExpanded] = useState(false);
  const [operationExpanded, setOperationExpanded] = useState(false);

  // 从本地存储或API获取管理员信息
  useEffect(() => {
    loadAdminProfile();
  }, []);

  // 当进入财务管理子页面时，自动展开菜单
  useEffect(() => {
    const financePaths = financeGroup.subMenus.map(m => m.path);
    const isFinanceActive = financePaths.some(p => location.pathname.startsWith(p));
    if (isFinanceActive) {
      setFinanceExpanded(true);
    } else {
      setFinanceExpanded(false);
    }
  }, [location.pathname]);

  // 当进入运营管理子页面时，自动展开菜单
  useEffect(() => {
    const operationPaths = operationGroup.subMenus.map(m => m.path);
    const isOperationActive = operationPaths.some(p => location.pathname.startsWith(p));
    if (isOperationActive) {
      setOperationExpanded(true);
    } else {
      setOperationExpanded(false);
    }
  }, [location.pathname]);

  const loadAdminProfile = async () => {
    // 首先检查本地存储
    const storedUser = localStorage.getItem('adminUser');
    const token = localStorage.getItem('adminToken');

    if (storedUser) {
      try {
        setAdminUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Failed to parse stored user:', e);
      }
    }

    // 如果有 token 但没有本地用户，尝试获取
    if (token && !storedUser) {
      try {
        // 带超时的 API 调用
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);

        const userData = await adminApi.auth.getCurrentUser();
        clearTimeout(timeoutId);

        if (userData) {
          setAdminUser(userData);
          localStorage.setItem('adminUser', JSON.stringify(userData));
        }
      } catch (error) {
        console.error('Failed to load admin profile:', error);
        // API 失败时使用演示用户
        const demoUser = {
          id: 'admin-1',
          name: '演示管理员',
          username: 'admin',
          role: 'super_admin'
        };
        setAdminUser(demoUser);
        localStorage.setItem('adminUser', JSON.stringify(demoUser));
      }
    }

    setLoading(false);
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

  // 检查财务管理及其子菜单是否激活
  const isFinanceActive = () => {
    return financeGroup.subMenus.some(m => location.pathname.startsWith(m.path));
  };

  // 检查运营管理及其子菜单是否激活
  const isOperationActive = () => {
    return operationGroup.subMenus.some(m => location.pathname.startsWith(m.path));
  };

  // 获取当前页面的标题
  const getCurrentTitle = () => {
    // 先检查财务管理的子菜单
    const financeMenu = financeGroup.subMenus.find(m => location.pathname.startsWith(m.path));
    if (financeMenu) {
      return financeGroup.label;
    }
    // 检查运营管理的子菜单
    const operationMenu = operationGroup.subMenus.find(m => location.pathname.startsWith(m.path));
    if (operationMenu) {
      return operationGroup.label;
    }
    // 检查其他菜单
    const activeMenu = menuItems.find(item => isActive(item.path));
    return activeMenu?.label || '管理后台';
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Loading State */}
      {loading && (
        <div className="fixed inset-0 bg-gray-100 flex items-center justify-center z-50">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">加载中...</p>
          </div>
        </div>
      )}

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
            {/* 常规菜单项 */}
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

            {/* 财务管理菜单组 */}
            <MenuGroup
              group={financeGroup}
              expanded={financeExpanded}
              onToggle={() => setFinanceExpanded(!financeExpanded)}
              isActive={isFinanceActive}
              sidebarOpen={sidebarOpen}
            />

            {/* 运营管理菜单组 */}
            <MenuGroup
              group={operationGroup}
              expanded={operationExpanded}
              onToggle={() => setOperationExpanded(!operationExpanded)}
              isActive={isOperationActive}
              sidebarOpen={sidebarOpen}
            />
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
              {getCurrentTitle()}
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
