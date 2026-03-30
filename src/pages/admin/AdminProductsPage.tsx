import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Search, Edit, Trash2, Eye, X, Image, Save, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '../../components/ui/button';
import Modal, { ConfirmDialog, ModalSkeleton } from '../../components/ui/Modal';
import adminApi from '../../config/adminApi';
import { useToast } from '../../components/Toast';

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

const categories = ['数码电子', '服装鞋包', '美妆护肤', '家居生活', '食品饮料', '运动户外'];

// 状态值转换函数：前端 <-> 后端
const toBackendStatus = (status: '上架' | '下架' | string): string => {
  return status === '上架' ? 'active' : 'inactive';
};

const fromBackendStatus = (status: string): '上架' | '下架' => {
  return status === 'active' ? '上架' : '下架';
};

export default function AdminProductsPage() {
  const { showToast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Data states
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [editingProduct, setEditingProduct] = useState<Partial<Product>>({});
  const [isEditMode, setIsEditMode] = useState(false);

  // Loading states
  const [loading, setLoading] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [savingProduct, setSavingProduct] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState(false);
  const [togglingStatus, setTogglingStatus] = useState<string | null>(null);

  // Form validation
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Load products from API
  const loadProducts = useCallback(async () => {
    try {
      setLoadingProducts(true);
      const data = await adminApi.products.list();
      let productsArray: any[] = [];

      if (data.products) {
        productsArray = data.products;
      } else if (Array.isArray(data)) {
        productsArray = data;
      }

      // 转换后端数据格式到前端格式
      const mappedProducts: Product[] = productsArray.map((p: any) => ({
        id: p.id,
        name: p.name,
        category: p.category || p.subcategory || '未分类',
        price: Math.round((p.price || 0) / 100),
        originalPrice: Math.round((p.originalPrice || 0) / 100),
        stock: p.stock || 0,
        sales: p.sales || 0,
        status: fromBackendStatus(p.status || 'active'),
        image: Array.isArray(p.images) ? p.images[0] : (p.image || 'https://via.placeholder.com/100'),
        description: p.description,
      }));

      setProducts(mappedProducts);
    } catch (error: any) {
      console.error('Failed to load products:', error);
      showToast(error.message || '加载商品失败', 'error');
    } finally {
      setLoadingProducts(false);
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // Form validation
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!editingProduct.name?.trim()) {
      errors.name = '请输入商品名称';
    }
    if (!editingProduct.price || editingProduct.price <= 0) {
      errors.price = '请输入有效的价格';
    }
    if (!editingProduct.stock || editingProduct.stock < 0) {
      errors.stock = '请输入有效的库存';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !filterCategory || product.category === filterCategory;
    const matchesStatus = !filterStatus || product.status === filterStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Handlers
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
    setFormErrors({});
    setIsEditMode(false);
    setShowModal(true);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct({ ...product });
    setFormErrors({});
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

  const confirmDelete = async () => {
    if (!selectedProduct) return;

    try {
      setDeletingProduct(true);
      await adminApi.products.delete(selectedProduct.id);
      setProducts(products.filter(p => p.id !== selectedProduct.id));
      showToast(`商品"${selectedProduct.name}"已删除`, 'success');
    } catch (error: any) {
      console.error('Failed to delete product:', error);
      showToast(error.message || '删除商品失败，请重试', 'error');
    } finally {
      setDeletingProduct(false);
      setShowDeleteConfirm(false);
      setSelectedProduct(null);
    }
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setSavingProduct(true);

      const backendData = {
        name: editingProduct.name,
        category: editingProduct.category,
        price: (editingProduct.price || 0) * 100,
        originalPrice: ((editingProduct.originalPrice || editingProduct.price) || 0) * 100,
        stock: editingProduct.stock,
        sales: editingProduct.sales || 0,
        status: toBackendStatus(editingProduct.status || '上架'),
        images: editingProduct.image ? [editingProduct.image] : [],
        description: editingProduct.description,
      };

      if (isEditMode && editingProduct.id) {
        await adminApi.products.update(editingProduct.id, backendData);
        setProducts(products.map(p =>
          p.id === editingProduct.id ? { ...p, ...editingProduct } as Product : p
        ));
        showToast('商品更新成功', 'success');
      } else {
        const response = await adminApi.products.create(backendData);
        const newProduct: Product = {
          id: response.id || Date.now().toString(),
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
      setEditingProduct({});
    } catch (error: any) {
      console.error('Failed to save product:', error);
      showToast(error.message || '保存商品失败，请重试', 'error');
    } finally {
      setSavingProduct(false);
    }
  };

  const handleToggleStatus = async (product: Product) => {
    const newStatus = product.status === '上架' ? '下架' : '上架';

    try {
      setTogglingStatus(product.id);
      await adminApi.products.updateStatus(product.id, toBackendStatus(newStatus));
      setProducts(products.map(p =>
        p.id === product.id ? { ...p, status: newStatus } : p
      ));
      showToast(`商品已${newStatus}`, 'success');
    } catch (error: any) {
      console.error('Failed to update product status:', error);
      showToast(error.message || '更新状态失败，请重试', 'error');
    } finally {
      setTogglingStatus(null);
    }
  };

  return (
    <div className="space-y-6">
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
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
            >
              <option value="">全部分类</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
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
              {loading && loadingProducts ? (
                // Loading skeleton
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gray-200 rounded-lg animate-pulse" />
                        <div className="space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-32 animate-pulse" />
                          <div className="h-3 bg-gray-100 rounded w-16 animate-pulse" />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-20 animate-pulse" /></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-16 animate-pulse" /></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-12 animate-pulse" /></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-12 animate-pulse" /></td>
                    <td className="px-6 py-4"><div className="h-6 bg-gray-200 rounded-full w-14 animate-pulse" /></td>
                    <td className="px-6 py-4"><div className="flex gap-2">
                      <div className="h-8 w-8 bg-gray-200 rounded-lg animate-pulse" />
                      <div className="h-8 w-8 bg-gray-200 rounded-lg animate-pulse" />
                      <div className="h-8 w-8 bg-gray-200 rounded-lg animate-pulse" />
                    </div></td>
                  </tr>
                ))
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    暂无商品，请点击"添加商品"创建
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <img src={product.image} alt={product.name} className="w-12 h-12 rounded-lg object-cover" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{product.name}</p>
                          <p className="text-xs text-gray-500">ID: {product.id.slice(0, 8)}...</p>
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
                        disabled={togglingStatus === product.id}
                        className={`px-3 py-1 text-xs font-medium rounded-full transition-all disabled:opacity-50 ${
                          product.status === '上架'
                            ? 'bg-green-100 text-green-700 hover:bg-green-200 hover:-translate-y-0.5'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:-translate-y-0.5'
                        }`}
                      >
                        {togglingStatus === product.id ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          product.status
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleView(product)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all hover:-translate-y-0.5"
                          title="查看"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(product)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-all hover:-translate-y-0.5"
                          title="编辑"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(product)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all hover:-translate-y-0.5"
                          title="删除"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
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
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={isEditMode ? '编辑商品' : '添加商品'}
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">商品名称 *</label>
            <input
              type="text"
              value={editingProduct.name || ''}
              onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all ${
                formErrors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="请输入商品名称"
            />
            {formErrors.name && (
              <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">分类</label>
              <select
                value={editingProduct.category || categories[0]}
                onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
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
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all ${
                  formErrors.price ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="0"
              />
              {formErrors.price && (
                <p className="text-red-500 text-xs mt-1">{formErrors.price}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">原价</label>
              <input
                type="number"
                value={editingProduct.originalPrice || ''}
                onChange={(e) => setEditingProduct({ ...editingProduct, originalPrice: Number(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
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
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all ${
                  formErrors.stock ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="0"
              />
              {formErrors.stock && (
                <p className="text-red-500 text-xs mt-1">{formErrors.stock}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">销量</label>
              <input
                type="number"
                value={editingProduct.sales || 0}
                onChange={(e) => setEditingProduct({ ...editingProduct, sales: Number(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
              placeholder="https://..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">商品描述</label>
            <textarea
              value={editingProduct.description || ''}
              onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all resize-none"
              rows={3}
              placeholder="请输入商品描述"
            />
          </div>

          <div className="flex gap-3 pt-4 border-t">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setShowModal(false)}
            >
              取消
            </Button>
            <Button
              className="flex-1 bg-orange-500 hover:bg-orange-600"
              onClick={handleSave}
              loading={savingProduct}
              loadingText={isEditMode ? '更新中...' : '添加中...'}
            >
              <Save className="w-4 h-4 mr-2" />
              {isEditMode ? '更新' : '添加'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* View Modal */}
      <Modal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        title="商品详情"
        size="md"
      >
        {selectedProduct && (
          <div>
            <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-48 object-cover rounded-xl mb-4" />
            <h4 className="text-xl font-bold mb-2">{selectedProduct.name}</h4>
            <p className="text-sm text-gray-500 mb-4">{selectedProduct.description || '暂无描述'}</p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-gray-500">分类：</span>{selectedProduct.category}</div>
              <div><span className="text-gray-500">状态：</span>
                <span className={`px-2 py-0.5 rounded-full text-xs ${
                  selectedProduct.status === '上架' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                }`}>
                  {selectedProduct.status}
                </span>
              </div>
              <div><span className="text-gray-500">售价：</span>¥{selectedProduct.price}</div>
              <div><span className="text-gray-500">原价：</span>¥{selectedProduct.originalPrice}</div>
              <div><span className="text-gray-500">库存：</span>{selectedProduct.stock}</div>
              <div><span className="text-gray-500">销量：</span>{selectedProduct.sales}</div>
            </div>
            <div className="flex gap-3 pt-4 mt-4 border-t">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowViewModal(false)}
              >
                关闭
              </Button>
              <Button
                className="flex-1 bg-green-500 hover:bg-green-600"
                onClick={() => {
                  setShowViewModal(false);
                  handleEdit(selectedProduct);
                }}
              >
                <Edit className="w-4 h-4 mr-2" />
                编辑
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={confirmDelete}
        title="确认删除"
        message={`确定要删除商品"${selectedProduct?.name}"吗？此操作不可撤销。`}
        confirmText="确认删除"
        cancelText="取消"
        variant="danger"
        loading={deletingProduct}
      />
    </div>
  );
}
