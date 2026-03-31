import React, { useState } from 'react';
import { Plus, Edit, Trash2, Grid3X3 } from 'lucide-react';
import { Button } from '../../components/ui/button';

export default function AdminCategoriesPage() {
  const [categories] = useState([
    { id: 'C001', name: '数码电子', icon: '📱', subCount: 12, productCount: 128, status: '正常' },
    { id: 'C002', name: '服装鞋包', icon: '👕', subCount: 8, productCount: 256, status: '正常' },
    { id: 'C003', name: '美妆护肤', icon: '💄', subCount: 6, productCount: 89, status: '正常' },
    { id: 'C004', name: '家居生活', icon: '🏠', subCount: 15, productCount: 167, status: '正常' },
    { id: 'C005', name: '食品饮料', icon: '🍎', subCount: 10, productCount: 234, status: '正常' },
    { id: 'C006', name: '运动户外', icon: '⚽', subCount: 7, productCount: 98, status: '正常' },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">分类管理</h2>
          <p className="text-gray-500 text-sm mt-1">管理商品分类和子类</p>
        </div>
        <Button><Plus className="w-4 h-4 mr-2" />添加分类</Button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <Grid3X3 className="w-6 h-6 text-orange-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{categories.length}</p>
              <p className="text-gray-500 text-sm">一级分类</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <span className="text-2xl">📂</span>
            </div>
            <div>
              <p className="text-2xl font-bold">58</p>
              <p className="text-gray-500 text-sm">二级分类</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <span className="text-2xl">🛍️</span>
            </div>
            <div>
              <p className="text-2xl font-bold">972</p>
              <p className="text-gray-500 text-sm">商品总数</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <span className="text-2xl">🆕</span>
            </div>
            <div>
              <p className="text-2xl font-bold">45</p>
              <p className="text-gray-500 text-sm">本月新增</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">分类</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">子类数量</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">商品数</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">状态</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {categories.map((category) => (
              <tr key={category.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{category.icon}</span>
                    <span className="font-semibold text-lg">{category.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-600">{category.subCount}</td>
                <td className="px-6 py-4 text-gray-600">{category.productCount}</td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">{category.status}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm"><Edit className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="sm"><Trash2 className="w-4 h-4 text-red-500" /></Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
