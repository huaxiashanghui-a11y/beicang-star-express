import React, { useState } from 'react';
import { Plus, Edit, Trash2, Grid3X3 } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { FormModal } from '../../components/ui/FormModal';
import { ConfirmDialog } from '../../components/ui/Modal';
import { useToast } from '@/components/Toast';

interface Category {
  id: string;
  name: string;
  icon: string;
  parentId: string | null;
  sort: number;
  status: '正常' | '禁用';
  subCount: number;
  productCount: number;
  createdAt: string;
}

export default function AdminCategoriesPage() {
  const { showToast } = useToast();
  const [categories, setCategories] = useState<Category[]>([
    { id: 'C001', name: '数码电子', icon: '📱', parentId: null, sort: 1, status: '正常', subCount: 12, productCount: 128, createdAt: '2024-01-01' },
    { id: 'C002', name: '服装鞋包', icon: '👕', parentId: null, sort: 2, status: '正常', subCount: 8, productCount: 256, createdAt: '2024-01-02' },
    { id: 'C003', name: '美妆护肤', icon: '💄', parentId: null, sort: 3, status: '正常', subCount: 6, productCount: 89, createdAt: '2024-01-03' },
    { id: 'C004', name: '家居生活', icon: '🏠', parentId: null, sort: 4, status: '正常', subCount: 15, productCount: 167, createdAt: '2024-01-04' },
    { id: 'C005', name: '食品饮料', icon: '🍎', parentId: null, sort: 5, status: '正常', subCount: 10, productCount: 234, createdAt: '2024-01-05' },
    { id: 'C006', name: '运动户外', icon: '⚽', parentId: null, sort: 6, status: '正常', subCount: 7, productCount: 98, createdAt: '2024-01-06' },
  ]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const stats = {
    level1: categories.filter(c => c.parentId === null).length,
    level2: categories.filter(c => c.parentId !== null).length,
    totalProducts: categories.reduce((sum, c) => sum + c.productCount, 0),
    monthlyNew: 45,
  };

  const categoryFields = [
    {
      name: 'name',
      label: '分类名称',
      type: 'text' as const,
      placeholder: '请输入分类名称',
      required: true,
      validation: (value: string) => {
        if (categories.some(c => c.name === value && c.id !== selectedCategory?.id)) {
          return '该分类名称已存在';
        }
        return null;
      }
    },
    {
      name: 'icon',
      label: '分类图标',
      type: 'text' as const,
      placeholder: '请输入图标emoji',
      defaultValue: '📦'
    },
    {
      name: 'parentId',
      label: '上级分类',
      type: 'select' as const,
      placeholder: '请选择上级分类',
      options: [
        { value: '', label: '一级分类' },
        ...categories.filter(c => c.parentId === null).map(c => ({
          value: c.id,
          label: c.name
        }))
      ],
      defaultValue: ''
    },
    {
      name: 'sort',
      label: '排序值',
      type: 'number' as const,
      placeholder: '数字越小越靠前',
      defaultValue: '0'
    },
    {
      name: 'status',
      label: '状态',
      type: 'select' as const,
      placeholder: '请选择状态',
      options: [
        { value: '正常', label: '启用' },
        { value: '禁用', label: '禁用' }
      ],
      defaultValue: '正常'
    }
  ];

  const handleAddCategory = async (data: Record<string, string>) => {
    await new Promise(resolve => setTimeout(resolve, 800));

    const newCategory: Category = {
      id: `C${Date.now()}`,
      name: data.name,
      icon: data.icon || '📦',
      parentId: data.parentId || null,
      sort: parseInt(data.sort) || 0,
      status: data.status as '正常' | '禁用',
      subCount: 0,
      productCount: 0,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setCategories(prev => [newCategory, ...prev]);
    showToast('success', '分类添加成功');
  };

  const handleEditCategory = async (data: Record<string, string>) => {
    await new Promise(resolve => setTimeout(resolve, 800));

    setCategories(prev => prev.map(c =>
      c.id === selectedCategory?.id
        ? {
            ...c,
            name: data.name,
            icon: data.icon || '📦',
            parentId: data.parentId || null,
            sort: parseInt(data.sort) || 0,
            status: data.status as '正常' | '禁用'
          }
        : c
    ));
    showToast('success', '分类修改成功');
  };

  const handleDeleteCategory = async () => {
    setDeleteLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setCategories(prev => prev.filter(c => c.id !== selectedCategory?.id));
      showToast('success', '分类删除成功');
      setIsDeleteDialogOpen(false);
    } catch (error) {
      showToast('error', '删除失败，请重试');
    } finally {
      setDeleteLoading(false);
    }
  };

  const openEditModal = (category: Category) => {
    setSelectedCategory(category);
    setIsEditModalOpen(true);
  };

  const openDeleteDialog = (category: Category) => {
    setSelectedCategory(category);
    setIsDeleteDialogOpen(true);
  };

  const getStatusStyle = (status: string) => {
    return status === '正常'
      ? 'bg-green-100 text-green-700'
      : 'bg-red-100 text-red-700';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">分类管理</h2>
          <p className="text-gray-500 text-sm mt-1">管理商品分类和子类</p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          添加分类
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <Grid3X3 className="w-6 h-6 text-orange-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.level1}</p>
              <p className="text-gray-500 text-sm">一级分类</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <span className="text-2xl">📂</span>
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.level2}</p>
              <p className="text-gray-500 text-sm">二级分类</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <span className="text-2xl">🛍️</span>
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.totalProducts}</p>
              <p className="text-gray-500 text-sm">商品总数</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <span className="text-2xl">🆕</span>
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.monthlyNew}</p>
              <p className="text-gray-500 text-sm">本月新增</p>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">分类</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">子类数量</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">商品数</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">排序</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">状态</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {categories.map((category) => (
              <tr key={category.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{category.icon}</span>
                    <span className="font-semibold text-lg">{category.name}</span>
                    {category.parentId && (
                      <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded">二级</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-600">{category.subCount}</td>
                <td className="px-6 py-4 text-gray-600">{category.productCount}</td>
                <td className="px-6 py-4 text-gray-600">{category.sort}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusStyle(category.status)}`}>
                    {category.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditModal(category)}
                      className="hover:bg-blue-50 hover:text-blue-500"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openDeleteDialog(category)}
                      className="hover:bg-red-50 hover:text-red-500"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Category Modal */}
      <FormModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddCategory}
        title="新增分类"
        fields={categoryFields}
        submitText="确认添加"
        size="md"
      />

      {/* Edit Category Modal */}
      <FormModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedCategory(null);
        }}
        onSubmit={handleEditCategory}
        title="编辑分类"
        fields={categoryFields.map(field => ({
          ...field,
          defaultValue: selectedCategory?.[field.name as keyof Category]?.toString() || field.defaultValue
        }))}
        submitText="保存修改"
        size="md"
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setSelectedCategory(null);
        }}
        onConfirm={handleDeleteCategory}
        title="确认删除"
        message={`确认删除分类「${selectedCategory?.name}」？删除后不可恢复。`}
        confirmText="确认删除"
        cancelText="取消"
        variant="danger"
        loading={deleteLoading}
      />
    </div>
  );
}
