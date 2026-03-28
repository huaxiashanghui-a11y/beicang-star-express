import React, { useState } from 'react';
import { Plus, Edit, Trash2, Grid3X3, ChevronRight } from 'lucide-react';
import { Button } from '../../components/ui/button';

const mockCategories = [
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

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState(mockCategories);
  const [showAddModal, setShowAddModal] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  const toggleExpand = (id: string) => {
    setExpandedCategories(prev =>
      prev.includes(id)
        ? prev.filter(catId => catId !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">分类管理</h2>
          <p className="text-gray-500 text-sm mt-1">管理商品分类和子分类</p>
        </div>
        <Button
          onClick={() => setShowAddModal(true)}
          className="bg-gradient-to-r from-orange-500 to-blue-500 hover:from-orange-600 hover:to-blue-600"
        >
          <Plus className="w-4 h-4 mr-2" />
          添加分类
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: '一级分类', count: 6, icon: '📂' },
          { label: '二级分类', count: 10, icon: '📁' },
          { label: '商品总数', count: 1454, icon: '📦' },
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
                <Button variant="outline" size="sm" className="flex-1">
                  <Edit className="w-4 h-4 mr-2" />
                  编辑
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className={category.status === '启用' ? 'text-red-600' : 'text-green-600'}
                >
                  {category.status === '启用' ? '禁用' : '启用'}
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
                      <div className="flex gap-2">
                        <button className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-red-600 hover:bg-red-50 rounded">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
