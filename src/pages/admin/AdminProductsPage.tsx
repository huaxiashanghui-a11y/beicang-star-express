import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2, Eye } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { FormModal } from '../../components/ui/FormModal';
import { ConfirmDialog } from '../../components/ui/Modal';
import { useToast } from '@/components/Toast';

interface Product {
  id: string;
  name: string;
  category: string;
  categoryId: string;
  price: number;
  stock: number;
  sales: number;
  status: '上架' | '下架';
  image: string;
  createdAt: string;
}

export default function AdminProductsPage() {
  const { showToast } = useToast();
  const [products, setProducts] = useState<Product[]>([
    { id: 'P001', name: 'iPhone 15 Pro', category: '数码电子', categoryId: 'C001', price: 7999, stock: 128, sales: 234, status: '上架', image: '', createdAt: '2024-03-01' },
    { id: 'P002', name: '华为 Mate 60', category: '数码电子', categoryId: 'C001', price: 5999, stock: 86, sales: 156, status: '上架', image: '', createdAt: '2024-03-02' },
    { id: 'P003', name: '耐克运动鞋', category: '服装鞋包', categoryId: 'C002', price: 899, stock: 234, sales: 456, status: '上架', image: '', createdAt: '2024-03-03' },
    { id: 'P004', name: '雅诗兰黛护肤套装', category: '美妆护肤', categoryId: 'C003', price: 1299, stock: 67, sales: 89, status: '上架', image: '', createdAt: '2024-03-04' },
    { id: 'P005', name: '戴森吸尘器', category: '家居生活', categoryId: 'C004', price: 3999, stock: 34, sales: 45, status: '上架', image: '', createdAt: '2024-03-05' },
  ]);

  const [searchKeyword, setSearchKeyword] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const categories = [
    { id: 'C001', name: '数码电子' },
    { id: 'C002', name: '服装鞋包' },
    { id: 'C003', name: '美妆护肤' },
    { id: 'C004', name: '家居生活' },
    { id: 'C005', name: '食品饮料' },
    { id: 'C006', name: '运动户外' },
  ];

  const stats = {
    total: products.length,
    totalStock: products.reduce((sum, p) => sum + p.stock, 0),
    totalSales: products.reduce((sum, p) => sum + p.sales, 0),
    lowStock: products.filter(p => p.stock < 50).length,
  };

  const productFields = [
    {
      name: 'name',
      label: '商品名称',
      type: 'text' as const,
      placeholder: '请输入商品名称',
      required: true,
    },
    {
      name: 'categoryId',
      label: '商品分类',
      type: 'select' as const,
      placeholder: '请选择商品分类',
      required: true,
      options: categories.map(c => ({ value: c.id, label: c.name })),
    },
    {
      name: 'price',
      label: '商品价格',
      type: 'text' as const,
      placeholder: '请输入价格，保留2位小数',
      required: true,
      validation: (value: string) => {
        const num = parseFloat(value);
        if (isNaN(num) || num < 0) return '请输入正确的价格格式';
        return null;
      }
    },
    {
      name: 'stock',
      label: '商品库存',
      type: 'text' as const,
      placeholder: '请输入库存数量',
      required: true,
      validation: (value: string) => {
        const num = parseInt(value);
        if (isNaN(num) || num < 0 || !Number.isInteger(num)) return '请输入正确的库存数量';
        return null;
      }
    },
    {
      name: 'image',
      label: '商品图标',
      type: 'file' as const,
      placeholder: '上传商品图片',
    },
    {
      name: 'detail',
      label: '商品详情',
      type: 'textarea' as const,
      placeholder: '请输入商品详情描述',
    },
    {
      name: 'status',
      label: '状态',
      type: 'select' as const,
      placeholder: '请选择状态',
      options: [
        { value: '上架', label: '上架' },
        { value: '下架', label: '下架' }
      ],
      defaultValue: '上架'
    }
  ];

  const handleAddProduct = async (data: Record<string, string>) => {
    await new Promise(resolve => setTimeout(resolve, 800));

    const category = categories.find(c => c.id === data.categoryId);
    const newProduct: Product = {
      id: `P${Date.now()}`,
      name: data.name,
      category: category?.name || '',
      categoryId: data.categoryId,
      price: parseFloat(data.price),
      stock: parseInt(data.stock),
      sales: 0,
      status: data.status as '上架' | '下架',
      image: data.image || '',
      createdAt: new Date().toISOString().split('T')[0]
    };

    setProducts(prev => [newProduct, ...prev]);
    showToast('success', '商品添加成功');
  };

  const handleEditProduct = async (data: Record<string, string>) => {
    await new Promise(resolve => setTimeout(resolve, 800));

    const category = categories.find(c => c.id === data.categoryId);
    setProducts(prev => prev.map(p =>
      p.id === selectedProduct?.id
        ? {
            ...p,
            name: data.name,
            category: category?.name || p.category,
            categoryId: data.categoryId,
            price: parseFloat(data.price),
            stock: parseInt(data.stock),
            status: data.status as '上架' | '下架',
          }
        : p
    ));
    showToast('success', '商品修改成功');
  };

  const handleDeleteProduct = async () => {
    setDeleteLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setProducts(prev => prev.filter(p => p.id !== selectedProduct?.id));
      showToast('success', '商品删除成功');
      setIsDeleteDialogOpen(false);
    } catch (error) {
      showToast('error', '删除失败，请重试');
    } finally {
      setDeleteLoading(false);
    }
  };

  const openEditModal = (product: Product) => {
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  };

  const openViewDialog = (product: Product) => {
    setSelectedProduct(product);
    setIsViewDialogOpen(true);
  };

  const openDeleteDialog = (product: Product) => {
    setSelectedProduct(product);
    setIsDeleteDialogOpen(true);
  };

  const getStatusStyle = (status: string) => {
    return status === '上架'
      ? 'bg-green-100 text-green-700'
      : 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">商品管理</h2>
          <p className="text-gray-500 text-sm mt-1">管理您的商品列表和库存</p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          添加商品
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <span className="text-2xl">📦</span>
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.total}</p>
              <p className="text-gray-500 text-sm">商品总数</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <span className="text-2xl">📊</span>
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.totalStock}</p>
              <p className="text-gray-500 text-sm">总库存</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <span className="text-2xl">💰</span>
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.totalSales}</p>
              <p className="text-gray-500 text-sm">总销量</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <span className="text-2xl">⚠️</span>
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.lowStock}</p>
              <p className="text-gray-500 text-sm">库存不足</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="搜索商品名称..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary transition-all"
          >
            <option value="">全部分类</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
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
              <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                      {product.name.charAt(0)}
                    </div>
                    <span className="font-medium">{product.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-600">{product.category}</td>
                <td className="px-6 py-4 font-semibold text-orange-600">¥{product.price.toLocaleString()}</td>
                <td className="px-6 py-4">
                  <span className={product.stock < 50 ? 'text-red-500 font-medium' : 'text-gray-600'}>
                    {product.stock}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-600">{product.sales}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusStyle(product.status)}`}>
                    {product.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openViewDialog(product)}
                      className="hover:bg-blue-50 hover:text-blue-500"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditModal(product)}
                      className="hover:bg-orange-50 hover:text-orange-500"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openDeleteDialog(product)}
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

      {/* Add Product Modal */}
      <FormModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddProduct}
        title="新增商品"
        fields={productFields}
        submitText="确认添加"
        size="lg"
      />

      {/* Edit Product Modal */}
      <FormModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedProduct(null);
        }}
        onSubmit={handleEditProduct}
        title="编辑商品"
        fields={productFields.map(field => ({
          ...field,
          defaultValue: selectedProduct?.[field.name as keyof Product]?.toString() || field.defaultValue
        }))}
        submitText="保存修改"
        size="lg"
      />

      {/* View Product Dialog */}
      {selectedProduct && isViewDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsViewDialogOpen(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg animate-scale-in">
            <div className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-blue-500 rounded-xl flex items-center justify-center text-white text-3xl font-bold">
                  {selectedProduct.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-xl font-bold">{selectedProduct.name}</h3>
                  <p className="text-gray-500">{selectedProduct.category}</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-500">商品ID</span>
                  <span className="font-mono">{selectedProduct.id}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-500">价格</span>
                  <span className="font-bold text-orange-600">¥{selectedProduct.price.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-500">库存</span>
                  <span className={selectedProduct.stock < 50 ? 'text-red-500 font-medium' : ''}>{selectedProduct.stock}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-500">销量</span>
                  <span>{selectedProduct.sales}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-500">状态</span>
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusStyle(selectedProduct.status)}`}>
                    {selectedProduct.status}
                  </span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-500">创建时间</span>
                  <span>{selectedProduct.createdAt}</span>
                </div>
              </div>
              <Button variant="outline" className="w-full mt-6" onClick={() => setIsViewDialogOpen(false)}>
                关闭
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setSelectedProduct(null);
        }}
        onConfirm={handleDeleteProduct}
        title="确认删除"
        message={`确认删除商品「${selectedProduct?.name}」？删除后不可恢复。`}
        confirmText="确认删除"
        cancelText="取消"
        variant="danger"
        loading={deleteLoading}
      />
    </div>
  );
}
