import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2, Eye } from 'lucide-react';
import { Button } from '../../components/ui/button';

export default function AdminProductsPage() {
  const [products] = useState([
    { id: 'P001', name: 'iPhone 15 Pro', category: '数码电子', price: 7999, stock: 128, sales: 234, status: '上架', image: '' },
    { id: 'P002', name: '华为 Mate 60', category: '数码电子', price: 5999, stock: 86, sales: 156, status: '上架', image: '' },
    { id: 'P003', name: '耐克运动鞋', category: '服装鞋包', price: 899, stock: 234, sales: 456, status: '上架', image: '' },
    { id: 'P004', name: '雅诗兰黛护肤套装', category: '美妆护肤', price: 1299, stock: 67, sales: 89, status: '上架', image: '' },
    { id: 'P005', name: '戴森吸尘器', category: '家居生活', price: 3999, stock: 34, sales: 45, status: '上架', image: '' },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">商品管理</h2>
          <p className="text-gray-500 text-sm mt-1">管理您的商品列表和库存</p>
        </div>
        <Button><Plus className="w-4 h-4 mr-2" />添加商品</Button>
      </div>

      {/* 搜索栏 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="搜索商品名称..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <select className="px-4 py-2 border border-gray-200 rounded-lg">
            <option>全部分类</option>
            <option>数码电子</option>
            <option>服装鞋包</option>
            <option>美妆护肤</option>
            <option>家居生活</option>
          </select>
        </div>
      </div>

      {/* 商品表格 */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">商品</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">分类</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">价格</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">库存</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">销量</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">状态</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-blue-500 rounded-lg flex items-center justify-center text-white font-bold">
                      {product.name.charAt(0)}
                    </div>
                    <span className="font-medium">{product.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-600">{product.category}</td>
                <td className="px-6 py-4 font-semibold text-orange-600">¥{product.price.toLocaleString()}</td>
                <td className="px-6 py-4">
                  <span className={product.stock < 50 ? 'text-red-500' : 'text-gray-600'}>{product.stock}</span>
                </td>
                <td className="px-6 py-4 text-gray-600">{product.sales}</td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                    {product.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"><Eye className="w-4 h-4" /></button>
                    <button className="p-2 text-orange-500 hover:bg-orange-50 rounded-lg"><Edit className="w-4 h-4" /></button>
                    <button className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
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
