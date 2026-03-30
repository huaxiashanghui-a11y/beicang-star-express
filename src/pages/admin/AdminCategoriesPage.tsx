import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Grid3X3, ChevronRight, X, Check, AlertTriangle, Eye } from 'lucide-react';
import { Button } from '../../components/ui/button';
import adminApi from '../../config/adminApi';

interface Category {
  id: string;
  name: string;
  icon: string;
  productCount: number;
  revenue: string;
  status: '启用' | '禁用';
  children: { id: string; name: string; productCount: number }[];
}

const initialCategories: Category[] = [
  {
    id: '1',
    name: '数码电子',
    icon: '📱',
    productCount: 456,
    revenue: '¥456,780',
    status: '启用',
    children: [
      { id: '1-1', name: '手机', productCount: 123 },
      { id: '1-2', name: '电脑', productCount: 89 },
      { id: '1-3', name: '平板', productCount: 45 },
      { id: '1-4', name: '配件', productCount: 199 },
    ],
  },
  {
    id: '2',
    name: '服装鞋包',
    icon: '👗',
    productCount: 321,
    revenue: '¥321,450',
    status: '启用',
    children: [],
  },
  {
    id: '3',
    name: '美妆护肤',
    icon: '💄',
    productCount: 234,
    revenue: '¥234,560',
    status: '启用',
    children: [
      { id: '3-1', name: '护肤品', productCount: 112 },
      { id: '3-2', name: '化妆品', productCount: 78 },
      { id: '3-3', name: '香水', productCount: 44 },
    ],
  },
  {
    id: '4',
    name: '家居生活',
    icon: '🏠',
    productCount: 189,
    revenue: '¥189,230',
    status: '启用',
    children: [],
  },
  {
    id: '5',
    name: '食品饮料',
    icon: '🍔',
    productCount: 156,
    revenue: '¥156,890',
    status: '禁用',
    children: [],
  },
  {
    id: '6',
    name: '运动户外',
    icon: '⚽',
    productCount: 98,
    revenue: '¥98,450',
    status: '启用',
    children: [],
  },
];

const availableIcons = ['📱', '👗', '💄', '🏠', '🍔', '⚽', '🎮', '📚', '🛋️', '🎁', '💊', '🔧'];

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [editingCategory, setEditingCategory] = useState<Partial<Category>>({});

  // Toast state
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({
    show: false,
    message: '',
    type: 'success',
  });

  // Load categories from API
  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await adminApi.categories.list();
      if (data.categories) {
        setCategories(data.categories);
      } else if (Array.isArray(data)) {
        setCategories(data);
      }
    } catch (error) {
      console.error('Failed to load categories:', error);
      showToast('加载分类失败', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Form state
  const [formData, setFormData] = useState<Partial<Category>>({
    name: '',
    icon: '📱',
    status: '启用',
  });

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ ...toast, show: false }), 3000);
  };

  const toggleExpand = (id: string) => {
    setExpandedCategories(prev =>
      prev.includes(id)
        ? prev.filter(catId => catId !== id)
        : [...prev, id]
    );
  };

  const handleAdd = () => {
    setFormData({ name: '', icon: '📱', status: '启用' });
    setShowAddModal(true);
  };

  const handleEdit = (category: Category) => {
    setEditingCategory({ ...category });
    setShowEditModal(true);
  };

  const handleView = (category: Category) => {
    setSelectedCategory(category);
    setShowDetailModal(true);
  };

  const handleDelete = (category: Category) => {
    setSelectedCategory(category);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (selectedCategory) {
      try {
        await adminApi.categories.delete(selectedCategory.id);
        setCategories(categories.filter(c => c.id !== selectedCategory.id));
        showToast(`分类"${selectedCategory.name}"已删除`);
      } catch (error) {
        console.error('Failed to delete category:', error);
        showToast('删除分类失败', 'error');
      }
      setShowDeleteModal(false);
      setSelectedCategory(null);
    }
  };

  const handleToggleStatus = async (category: Category) => {
    const newStatus = category.status === '启用' ? '禁用' : '启用';
    try {
      await adminApi.categories.update(category.id, { status: newStatus });
      setCategories(
        categories.map(c =>
          c.id === category.id
            ? { ...c, status: newStatus as Category['status'] }
            : c
        )
      );
      showToast(`分类"${category.name}"已${newStatus}`);
    } catch (error) {
      console.error('Failed to toggle category status:', error);
      showToast('操作失败', 'error');
    }
  };

  const handleSaveAdd = async () => {
    if (!formData.name) {
      showToast('请填写分类名称', 'error');
      return;
    }
    try {
      await adminApi.categories.create(formData);
      const newCategory: Category = {
        id: Date.now().toString(),
        name: formData.name || '',
        icon: formData.icon || '📱',
        productCount: 0,
        revenue: '¥0',
        status: (formData.status as Category['status']) || '启用',
        children: [],
      };
      setCategories([...categories, newCategory]);
      showToast(`分类"${newCategory.name}"创建成功`);
      setShowAddModal(false);
    } catch (error) {
      console.error('Failed to create category:', error);
      showToast('创建分类失败', 'error');
    }
  };

  const handleSaveEdit = async () => {
    if (!editingCategory.id || !editingCategory.name) {
      showToast('请填写完整信息', 'error');
      return;
    }
    try {
      await adminApi.categories.update(editingCategory.id, editingCategory);
      setCategories(
        categories.map(c =>
          c.id === editingCategory.id
            ? { ...c, name: editingCategory.name, icon: editingCategory.icon, status: editingCategory.status as Category['status'] }
            : c
        )
      );
      showToast(`分类"${editingCategory.name}"更新成功`);
      setShowEditModal(false);
      setEditingCategory({});
    } catch (error) {
      console.error('Failed to update category:', error);
      showToast('更新分类失败', 'error');
    }
  };

  // Calculate stats
  const totalLevel1 = categories.length;
  const totalLevel2 = categories.reduce((sum, c) => sum + c.children.length, 0);
  const totalProducts = categories.reduce((sum, c) => sum + c.productCount, 0);

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast.show && (
        <div
          className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 ${
            toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
          }`}
        >
          {toast.type === 'success' ? <Check className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">分类管理</h2>
          <p className="text-gray-500 text-sm mt-1">管理商品分类和子分类</p>
        </div>
        <Button onClick={handleAdd} className="bg-gradient-to-r from-orange-500 to-blue-500 hover:from-orange-600 hover:to-blue-600">
          <Plus className="w-4 h-4 mr-2" />
          添加分类
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: '一级分类', count: totalLevel1, icon: '📂' },
          { label: '二级分类', count: totalLevel2, icon: '📁' },
          { label: '商品总数', count: totalProducts, icon: '📦' },
          { label: '本月新增', count: 45, icon: '🆕' },
        ].map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-2xl">{stat.icon}</p>
            </div>
            <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
            <p className="text-2xl font-bold text-gray-800">{stat.count}</p>
          </div>
        ))}
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div
            key={category.id}
            className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
          >
            {/* Category Header */}
            <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-blue-500 rounded-xl flex items-center justify-center text-2xl">
                    {category.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{category.name}</h3>
                    <p className="text-xs text-gray-500">ID: {category.id}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                  category.status === '启用'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}>
                  {category.status}
                </span>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-1">商品数</p>
                  <p className="text-lg font-bold text-gray-800">{category.productCount}</p>
                </div>
                <div className="bg-white rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-1">销售额</p>
                  <p className="text-lg font-bold text-orange-600">{category.revenue}</p>
                </div>
              </div>
            </div>

            {/* Category Actions */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-gray-600">
                  子分类: {category.children.length}个
                </p>
                {category.children.length > 0 && (
                  <button
                    onClick={() => toggleExpand(category.id)}
                    className="flex items-center gap-1 text-sm text-orange-600 hover:text-orange-700"
                  >
                    查看详情
                    <ChevronRight className={`w-4 h-4 transition-transform ${
                      expandedCategories.includes(category.id) ? 'rotate-90' : ''
                    }`} />
                  </button>
                )}
              </div>

              {/* Children Categories */}
              {expandedCategories.includes(category.id) && category.children.length > 0 && (
                <div className="mb-3 p-3 bg-gray-50 rounded-lg space-y-2">
                  {category.children.map((child) => (
                    <div key={child.id} className="flex justify-between items-center text-sm">
                      <span className="text-gray-700">{child.name}</span>
                      <span className="text-gray-500">{child.productCount}件</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1" onClick={() => handleView(category)}>
                  <Eye className="w-4 h-4 mr-2" />
                  详情
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleEdit(category)}>
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleToggleStatus(category)}
                  className={category.status === '启用' ? 'text-red-600' : 'text-green-600'}
                >
                  {category.status === '启用' ? '禁用' : '启用'}
                </Button>
                <Button variant="outline" size="sm" className="text-red-600 hover:bg-red-50" onClick={() => handleDelete(category)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tree View Table */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Grid3X3 className="w-5 h-5" />
          分类结构图
        </h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <div key={category.id}>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{category.icon}</span>
                  <span className="font-medium text-gray-800">{category.name}</span>
                  <span className="text-sm text-gray-500">({category.productCount}件商品)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 text-xs rounded ${
                    category.status === '启用' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {category.status}
                  </span>
                  <button
                    onClick={() => handleEdit(category)}
                    className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(category)}
                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  {category.children.length > 0 && (
                    <button
                      onClick={() => toggleExpand(category.id)}
                      className="p-1 hover:bg-gray-200 rounded"
                    >
                      <ChevronRight className={`w-4 h-4 transition-transform ${
                        expandedCategories.includes(category.id) ? 'rotate-90' : ''
                      }`} />
                    </button>
                  )}
                </div>
              </div>

              {/* Children */}
              {expandedCategories.includes(category.id) && category.children.length > 0 && (
                <div className="ml-12 mt-2 space-y-2">
                  {category.children.map((child) => (
                    <div
                      key={child.id}
                      className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-4 h-4 border-2 border-gray-300 rounded-sm"></span>
                        <span className="text-gray-700">{child.name}</span>
                        <span className="text-sm text-gray-500">({child.productCount}件)</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-800">添加分类</h3>
                <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">分类名称</label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="例如：数码电子"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">选择图标</label>
                <div className="grid grid-cols-6 gap-2">
                  {availableIcons.map((icon) => (
                    <button
                      key={icon}
                      onClick={() => setFormData({ ...formData, icon })}
                      className={`w-12 h-12 text-2xl rounded-lg border-2 transition-all ${
                        formData.icon === icon
                          ? 'border-orange-500 bg-orange-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">状态</label>
                <select
                  value={formData.status || '启用'}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as '启用' | '禁用' })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="启用">启用</option>
                  <option value="禁用">禁用</option>
                </select>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowAddModal(false)}>
                取消
              </Button>
              <Button onClick={handleSaveAdd} className="bg-gradient-to-r from-orange-500 to-blue-500">
                添加分类
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editingCategory && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-800">编辑分类</h3>
                <button onClick={() => setShowEditModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">分类名称</label>
                <input
                  type="text"
                  value={editingCategory.name || ''}
                  onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">选择图标</label>
                <div className="grid grid-cols-6 gap-2">
                  {availableIcons.map((icon) => (
                    <button
                      key={icon}
                      onClick={() => setEditingCategory({ ...editingCategory, icon })}
                      className={`w-12 h-12 text-2xl rounded-lg border-2 transition-all ${
                        editingCategory.icon === icon
                          ? 'border-orange-500 bg-orange-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">状态</label>
                <select
                  value={editingCategory.status || '启用'}
                  onChange={(e) => setEditingCategory({ ...editingCategory, status: e.target.value as '启用' | '禁用' })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="启用">启用</option>
                  <option value="禁用">禁用</option>
                </select>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowEditModal(false)}>
                取消
              </Button>
              <Button onClick={handleSaveEdit} className="bg-gradient-to-r from-orange-500 to-blue-500">
                保存修改
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedCategory && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-800">分类详情</h3>
                <button onClick={() => setShowDetailModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-blue-500 rounded-xl flex items-center justify-center text-3xl">
                  {selectedCategory.icon}
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-800">{selectedCategory.name}</h4>
                  <p className="text-sm text-gray-500">分类ID: {selectedCategory.id}</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">状态</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs ${
                    selectedCategory.status === '启用' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {selectedCategory.status}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">商品数量</span>
                  <span className="font-medium">{selectedCategory.productCount}件</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">销售额</span>
                  <span className="font-medium text-orange-600">{selectedCategory.revenue}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-500">子分类</span>
                  <span className="font-medium">{selectedCategory.children.length}个</span>
                </div>
              </div>
              {selectedCategory.children.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">子分类列表</p>
                  <div className="space-y-2">
                    {selectedCategory.children.map((child) => (
                      <div key={child.id} className="flex justify-between p-2 bg-gray-50 rounded-lg">
                        <span className="text-gray-700">{child.name}</span>
                        <span className="text-gray-500">{child.productCount}件</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowDetailModal(false)}>
                关闭
              </Button>
              <Button onClick={() => { setShowDetailModal(false); handleEdit(selectedCategory); }} className="bg-gradient-to-r from-orange-500 to-blue-500">
                编辑分类
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedCategory && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">确认删除</h3>
              <p className="text-gray-600">
                确定要删除分类 "{selectedCategory.name}" 吗？此操作无法撤销。
              </p>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
                取消
              </Button>
              <Button onClick={confirmDelete} className="bg-red-500 hover:bg-red-600 text-white">
                确认删除
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
