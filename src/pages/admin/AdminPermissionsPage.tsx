import { useState, useEffect } from 'react';
import { Shield, Check, X, Save, RotateCcw } from 'lucide-react';

interface Permission {
  id: string;
  label: string;
  enabled: boolean;
}

interface PermissionCategory {
  id: string;
  label: string;
  items: Permission[];
}

// 用户端功能模块
const userPermissions: Permission[] = [
  { id: 'home', label: '首页（商品展示、分类、搜索）', enabled: true },
  { id: 'product-detail', label: '商品详情页', enabled: true },
  { id: 'cart', label: '购物车', enabled: true },
  { id: 'checkout', label: '下单结算', enabled: true },
  { id: 'orders', label: '订单管理', enabled: true },
  { id: 'profile', label: '个人中心', enabled: true },
  { id: 'coupons', label: '优惠券', enabled: true },
  { id: 'notifications', label: '消息通知', enabled: true },
  { id: 'activities', label: '活动中心', enabled: true },
  { id: 'marquee', label: '跑马灯公告', enabled: true },
];

// 管理后台功能模块
const adminPermissions: Permission[] = [
  { id: 'dashboard', label: '仪表盘（销售统计）', enabled: true },
  { id: 'products', label: '商品管理', enabled: true },
  { id: 'orders', label: '订单管理', enabled: true },
  { id: 'users', label: '用户管理', enabled: true },
  { id: 'coupons', label: '优惠券管理', enabled: true },
  { id: 'categories', label: '分类管理', enabled: true },
  { id: 'payments', label: '支付管理', enabled: true },
  { id: 'customer-service', label: '客服管理', enabled: true },
  { id: 'announcements', label: '公告管理', enabled: true },
  { id: 'activities', label: '活动管理', enabled: true },
  { id: 'banners', label: '轮播管理', enabled: true },
  { id: 'points', label: '积分管理', enabled: true },
  { id: 'riders', label: '骑手管理', enabled: true },
  { id: 'permissions', label: '权限管理', enabled: true },
];

const defaultCategories: PermissionCategory[] = [
  { id: 'user', label: '用户端', items: userPermissions },
  { id: 'admin', label: '管理后台', items: adminPermissions },
];

export default function AdminPermissionsPage() {
  const [categories, setCategories] = useState<PermissionCategory[]>([]);
  const [hasChanges, setHasChanges] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  // 加载权限配置
  useEffect(() => {
    const saved = localStorage.getItem('admin_permissions');
    if (saved) {
      setCategories(JSON.parse(saved));
    } else {
      setCategories(defaultCategories);
      localStorage.setItem('admin_permissions', JSON.stringify(defaultCategories));
    }
  }, []);

  // 切换单个权限
  const togglePermission = (categoryId: string, itemId: string) => {
    setCategories(prev => {
      const updated = prev.map(cat => {
        if (cat.id === categoryId) {
          return {
            ...cat,
            items: cat.items.map(item => {
              if (item.id === itemId) {
                return { ...item, enabled: !item.enabled };
              }
              return item;
            }),
          };
        }
        return cat;
      });
      setHasChanges(true);
      return updated;
    });
  };

  // 开启/关闭分类下所有权限
  const toggleCategory = (categoryId: string, enabled: boolean) => {
    setCategories(prev => {
      const updated = prev.map(cat => {
        if (cat.id === categoryId) {
          return {
            ...cat,
            items: cat.items.map(item => ({ ...item, enabled })),
          };
        }
        return cat;
      });
      setHasChanges(true);
      return updated;
    });
  };

  // 保存配置
  const handleSave = () => {
    setSaveStatus('saving');
    localStorage.setItem('admin_permissions', JSON.stringify(categories));

    // 模拟保存延迟
    setTimeout(() => {
      setSaveStatus('saved');
      setHasChanges(false);
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 500);
  };

  // 重置为默认
  const handleReset = () => {
    if (confirm('确定要重置所有权限为默认设置吗？')) {
      setCategories(defaultCategories);
      localStorage.setItem('admin_permissions', JSON.stringify(defaultCategories));
      setHasChanges(true);
    }
  };

  return (
    <div className="p-6">
      {/* 页面标题 */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Shield className="w-8 h-8 text-indigo-600" />
          功能模块权限配置
        </h1>
        <p className="text-gray-500 mt-1">
          配置用户端和管理后台的功能模块开关状态
        </p>
      </div>

      {/* 操作按钮 */}
      <div className="mb-6 flex items-center gap-4">
        <button
          onClick={handleSave}
          disabled={!hasChanges || saveStatus === 'saving'}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
            hasChanges
              ? 'bg-indigo-600 text-white hover:bg-indigo-700'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          <Save className="w-4 h-4" />
          {saveStatus === 'saving' ? '保存中...' : saveStatus === 'saved' ? '已保存' : '保存配置'}
        </button>

        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-all"
        >
          <RotateCcw className="w-4 h-4" />
          重置为默认
        </button>

        {hasChanges && (
          <span className="text-amber-600 text-sm flex items-center gap-1">
            <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
            有未保存的更改
          </span>
        )}

        {saveStatus === 'saved' && !hasChanges && (
          <span className="text-green-600 text-sm flex items-center gap-1">
            <Check className="w-4 h-4" />
            配置已保存
          </span>
        )}
      </div>

      {/* 功能模块列表 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {categories.map((category) => {
          const enabledCount = category.items.filter(item => item.enabled).length;
          const allEnabled = enabledCount === category.items.length;

          return (
            <div
              key={category.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
            >
              {/* 分类标题 */}
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold text-gray-800">{category.label}</h2>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">
                      {enabledCount}/{category.items.length} 已启用
                    </span>
                    <button
                      onClick={() => toggleCategory(category.id, !allEnabled)}
                      className={`px-2 py-1 text-xs rounded ${
                        allEnabled
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {allEnabled ? '全部禁用' : '全部启用'}
                    </button>
                  </div>
                </div>
              </div>

              {/* 权限列表 */}
              <div className="p-4 space-y-2 max-h-96 overflow-y-auto">
                {category.items.map((item) => (
                  <label
                    key={item.id}
                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                      item.enabled
                        ? 'bg-green-50 hover:bg-green-100'
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={item.enabled}
                      onChange={() => togglePermission(category.id, item.id)}
                      className="w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <div className="flex-1">
                      <span className={`font-medium ${
                        item.enabled ? 'text-gray-900' : 'text-gray-500'
                      }`}>
                        {item.label}
                      </span>
                    </div>
                    {item.enabled ? (
                      <Check className="w-5 h-5 text-green-600" />
                    ) : (
                      <X className="w-5 h-5 text-gray-400" />
                    )}
                  </label>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* 说明 */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
        <h3 className="font-medium text-blue-800 mb-2">使用说明</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• 勾选表示该功能模块对当前角色可见</li>
          <li>• 取消勾选表示该功能模块对当前角色隐藏</li>
          <li>• 保存后配置将存储在浏览器本地</li>
          <li>• 点击"全部启用"或"全部禁用"可快速设置分类下所有权限</li>
        </ul>
      </div>
    </div>
  );
}
