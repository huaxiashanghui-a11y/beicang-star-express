import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, Eye, X, Image, Save, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice: number;
  stock: number;
  sales: number;
  status: '上架' | '下架';
  image: string;
  description?: string;
}

const initialProducts: Product[] = [
  {
    id: '1',
    name: 'iPhone 15 Pro Max 256GB',
    category: '数码电子',
    price: 9999,
    originalPrice: 10999,
    stock: 156,
    sales: 234,
    status: '上架',
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=100&h=100&fit=crop',
    description: '全新iPhone 15 Pro Max，搭载A17 Pro芯片',
  },
  {
    id: '2',
    name: 'MacBook Pro 14英寸 M3 Pro',
    category: '数码电子',
    price: 14999,
    originalPrice: 16999,
    stock: 89,
    sales: 123,
    status: '上架',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=100&h=100&fit=crop',
    description: 'M3 Pro芯片，专业级性能',
  },
  {
    id: '3',
    name: 'AirPods Pro 2代',
    category: '数码电子',
    price: 1899,
    originalPrice: 1999,
    stock: 345,
    sales: 567,
    status: '上架',
    image: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=100&h=100&fit=crop',
    description: '主动降噪，空间音频',
  },
  {
    id: '4',
    name: 'Nike Air Jordan 1 Retro',
    category: '服装鞋包',
    price: 1599,
    originalPrice: 1899,
    stock: 78,
    sales: 234,
    status: '上架',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&h=100&fit=crop',
    description: '经典AJ1，复古时尚',
  },
  {
    id: '5',
    name: 'SK-II 护肤套装',
    category: '美妆护肤',
    price: 2280,
    originalPrice: 2680,
    stock: 56,
    sales: 89,
    status: '下架',
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=100&h=100&fit=crop',
    description: '神仙水套装，护肤必备',
  },
];

const categories = ['数码电子', '服装鞋包', '美妆护肤', '家居生活', '食品饮料', '运动户外'];

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [editingProduct, setEditingProduct] = useState<Partial<Product>>({});
  const [isEditMode, setIsEditMode] = useState(false);
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({ show: false, message: '', type: 'success' });

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !filterCategory || product.category === filterCategory;
    const matchesStatus = !filterStatus || product.status === filterStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleAdd = () => {
    setEditingProduct({
      name: '',
      category: categories[0],
      price: 0,
      originalPrice: 0,
      stock: 0,
      sales: 0,
      status: '上架',
      image: '',
      description: '',
    });
    setIsEditMode(false);
    setShowModal(true);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct({ ...product });
    setIsEditMode(true);
    setShowModal(true);
  };

  const handleView = (product: Product) => {
    setSelectedProduct(product);
    setShowViewModal(true);
  };

  const handleDelete = (product: Product) => {
    setSelectedProduct(product);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (selectedProduct) {
      setProducts(products.filter(p => p.id !== selectedProduct.id));
      showToast(`商品"${selectedProduct.name}"已删除`, 'success');
      setShowDeleteConfirm(false);
      setSelectedProduct(null);
    }
  };

  const handleSave = () => {
    if (!editingProduct.name || !editingProduct.price || !editingProduct.stock) {
      showToast('请填写必填项', 'error');
      return;
    }

    if (isEditMode && editingProduct.id) {
      // Update existing product
      setProducts(products.map(p =>
        p.id === editingProduct.id ? { ...p, ...editingProduct } as Product : p
      ));
      showToast('商品已更新', 'success');
    } else {
      // Add new product
      const newProduct: Product = {
        id: Date.now().toString(),
        name: editingProduct.name || '',
        category: editingProduct.category || categories[0],
        price: editingProduct.price || 0,
        originalPrice: editingProduct.originalPrice || editingProduct.price || 0,
        stock: editingProduct.stock || 0,
        sales: 0,
        status: editingProduct.status || '上架',
        image: editingProduct.image || 'https://via.placeholder.com/100',
        description: editingProduct.description,
      };
      setProducts([newProduct, ...products]);
      showToast('商品添加成功', 'success');
    }

    setShowModal(false);
  };

  const handleToggleStatus = (product: Product) => {
    const newStatus = product.status === '上架' ? '下架' : '上架';
    setProducts(products.map(p =>
      p.id === product.id ? { ...p, status: newStatus } : p
    ));
    showToast(`商品已${newStatus}`, 'success');
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast.show && (
        <div className={`fixed top-20 right-4 z-50 px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 animate-slide-in-down ${
          toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`}>
          {toast.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">商品管理</h2>
          <p className="text-gray-500 text-sm mt-1">管理您的商品库存和上架状态</p>
        </div>
        <Button
          onClick={handleAdd}
          className="bg-gradient-to-r from-orange-500 to-blue-500 hover:from-orange-600 hover:to-blue-600"
        >
          <Plus className="w-4 h-4 mr-2" />
          添加商品
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="搜索商品名称..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">全部分类</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">全部状态</option>
              <option value="上架">上架</option>
              <option value="下架">下架</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
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
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    暂无商品，请点击"添加商品"创建
                  </td>
                </tr>
              ) : filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <img src={product.image} alt={product.name} className="w-12 h-12 rounded-lg object-cover" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{product.name}</p>
                        <p className="text-xs text-gray-500">ID: {product.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-600">{product.category}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <p className="text-sm font-semibold text-orange-600">¥{product.price}</p>
                      {product.originalPrice > product.price && (
                        <p className="text-xs text-gray-400 line-through">¥{product.originalPrice}</p>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm font-medium ${
                      product.stock > 100 ? 'text-green-600' :
                      product.stock > 50 ? 'text-orange-600' :
                      'text-red-600'
                    }`}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-600">{product.sales}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleToggleStatus(product)}
                      className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                        product.status === '上架'
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {product.status}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleView(product)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="查看"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEdit(product)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="编辑"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(product)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="删除"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Info */}
        <div className="bg-gray-50 px-6 py-4 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            显示 {filteredProducts.length} 条，共 {products.length} 条
          </p>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowModal(false)} />
          <div className="relative bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-bold">{isEditMode ? '编辑商品' : '添加商品'}</h3>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto max-h-[calc(90vh-140px)] space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">商品名称 *</label>
                <input
                  type="text"
                  value={editingProduct.name || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="请输入商品名称"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">分类</label>
                  <select
                    value={editingProduct.category || categories[0]}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">状态</label>
                  <select
                    value={editingProduct.status || '上架'}
                    onChange={(e) => setEditingProduct({ ...editingProduct, status: e.target.value as '上架' | '下架' })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="上架">上架</option>
                    <option value="下架">下架</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">售价 *</label>
                  <input
                    type="number"
                    value={editingProduct.price || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">原价</label>
                  <input
                    type="number"
                    value={editingProduct.originalPrice || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, originalPrice: Number(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="0"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">库存 *</label>
                  <input
                    type="number"
                    value={editingProduct.stock || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">销量</label>
                  <input
                    type="number"
                    value={editingProduct.sales || 0}
                    onChange={(e) => setEditingProduct({ ...editingProduct, sales: Number(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="0"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">商品图片URL</label>
                <input
                  type="text"
                  value={editingProduct.image || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">商品描述</label>
                <textarea
                  value={editingProduct.description || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                  rows={3}
                  placeholder="请输入商品描述"
                />
              </div>
            </div>
            <div className="flex gap-3 p-4 border-t">
              <Button variant="outline" className="flex-1" onClick={() => setShowModal(false)}>
                取消
              </Button>
              <Button className="flex-1 bg-orange-500 hover:bg-orange-600" onClick={handleSave}>
                <Save className="w-4 h-4 mr-2" />
                保存
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {showViewModal && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowViewModal(false)} />
          <div className="relative bg-white rounded-2xl w-full max-w-lg">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-bold">商品详情</h3>
              <button onClick={() => setShowViewModal(false)} className="p-2 hover:bg-gray-100 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4">
              <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-48 object-cover rounded-xl mb-4" />
              <h4 className="text-xl font-bold mb-2">{selectedProduct.name}</h4>
              <p className="text-sm text-gray-500 mb-4">{selectedProduct.description || '暂无描述'}</p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-gray-500">分类：</span>{selectedProduct.category}</div>
                <div><span className="text-gray-500">状态：</span>{selectedProduct.status}</div>
                <div><span className="text-gray-500">售价：</span>¥{selectedProduct.price}</div>
                <div><span className="text-gray-500">原价：</span>¥{selectedProduct.originalPrice}</div>
                <div><span className="text-gray-500">库存：</span>{selectedProduct.stock}</div>
                <div><span className="text-gray-500">销量：</span>{selectedProduct.sales}</div>
              </div>
            </div>
            <div className="flex gap-3 p-4 border-t">
              <Button variant="outline" className="flex-1" onClick={() => setShowViewModal(false)}>
                关闭
              </Button>
              <Button className="flex-1 bg-green-500 hover:bg-green-600" onClick={() => {
                setShowViewModal(false);
                handleEdit(selectedProduct);
              }}>
                <Edit className="w-4 h-4 mr-2" />
                编辑
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {showDeleteConfirm && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowDeleteConfirm(false)} />
          <div className="relative bg-white rounded-2xl w-full max-w-sm">
            <div className="p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-lg font-bold mb-2">确认删除</h3>
              <p className="text-gray-500 mb-4">
                确定要删除商品" <span className="font-medium text-gray-800">{selectedProduct.name}</span> "吗？
              </p>
              <p className="text-sm text-red-500 mb-4">此操作不可撤销</p>
            </div>
            <div className="flex gap-3 p-4 border-t">
              <Button variant="outline" className="flex-1" onClick={() => setShowDeleteConfirm(false)}>
                取消
              </Button>
              <Button className="flex-1 bg-red-500 hover:bg-red-600" onClick={confirmDelete}>
                确认删除
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
