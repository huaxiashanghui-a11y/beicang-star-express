import React, { useState } from 'react';
import { Plus, Edit, Trash2, Star, Gift, Eye } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { FormModal } from '../../components/ui/FormModal';
import { ConfirmDialog } from '../../components/ui/Modal';
import { useToast } from '@/components/Toast';

interface PointRule {
  id: string;
  name: string;
  points: number;
  description: string;
  status: '启用' | '禁用';
  createdAt: string;
}

interface PointRecord {
  id: string;
  user: string;
  userId: string;
  type: '获得' | '使用';
  points: number;
  source: string;
  createdAt: string;
}

export default function AdminPointsPage() {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('rules');
  const [rules, setRules] = useState<PointRule[]>([
    { id: 'R001', name: '购物返积分', points: 100, description: '每消费1元返1积分', status: '启用', createdAt: '2024-01-01' },
    { id: 'R002', name: '新用户注册', points: 500, description: '注册即送500积分', status: '启用', createdAt: '2024-01-02' },
    { id: 'R003', name: '商品评价', points: 50, description: '完成商品评价返50积分', status: '启用', createdAt: '2024-01-03' },
    { id: 'R004', name: '邀请好友', points: 200, description: '邀请好友注册送200积分', status: '启用', createdAt: '2024-01-04' },
  ]);

  const [records] = useState<PointRecord[]>([
    { id: 'PR001', user: '张三', userId: 'U001', type: '获得', points: 500, source: '新用户注册', createdAt: '2024-03-15 10:30' },
    { id: 'PR002', user: '李四', userId: 'U002', type: '使用', points: -200, source: '积分兑换', createdAt: '2024-03-15 11:20' },
    { id: 'PR003', user: '王五', userId: 'U003', type: '获得', points: 100, source: '购物返积分', createdAt: '2024-03-15 14:00' },
    { id: 'PR004', user: '赵六', userId: 'U004', type: '获得', points: 50, source: '商品评价', createdAt: '2024-03-15 15:30' },
    { id: 'PR005', user: '钱七', userId: 'U005', type: '使用', points: -500, source: '积分兑换', createdAt: '2024-03-16 09:00' },
  ]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedRule, setSelectedRule] = useState<PointRule | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<PointRecord | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const stats = {
    totalIssued: 1234567,
    totalUsed: 876543,
    products: 567,
    users: 8542,
  };

  const ruleFields = [
    {
      name: 'name',
      label: '规则名称',
      type: 'text' as const,
      placeholder: '请输入规则名称',
      required: true,
    },
    {
      name: 'points',
      label: '积分值',
      type: 'text' as const,
      placeholder: '请输入积分值（正整数）',
      required: true,
      validation: (value: string) => {
        const num = parseInt(value);
        if (isNaN(num) || num <= 0) return '请输入正确的积分值';
        return null;
      }
    },
    {
      name: 'description',
      label: '规则说明',
      type: 'textarea' as const,
      placeholder: '请输入规则说明',
      required: true,
    },
    {
      name: 'status',
      label: '状态',
      type: 'select' as const,
      placeholder: '请选择状态',
      options: [
        { value: '启用', label: '启用' },
        { value: '禁用', label: '禁用' }
      ],
      defaultValue: '启用'
    }
  ];

  const handleAddRule = async (data: Record<string, string>) => {
    await new Promise(resolve => setTimeout(resolve, 800));

    const newRule: PointRule = {
      id: `R${Date.now()}`,
      name: data.name,
      points: parseInt(data.points),
      description: data.description,
      status: data.status as '启用' | '禁用',
      createdAt: new Date().toISOString().split('T')[0]
    };

    setRules(prev => [newRule, ...prev]);
    showToast('success', '积分规则添加成功');
  };

  const handleEditRule = async (data: Record<string, string>) => {
    await new Promise(resolve => setTimeout(resolve, 800));

    setRules(prev => prev.map(r =>
      r.id === selectedRule?.id
        ? {
            ...r,
            name: data.name,
            points: parseInt(data.points),
            description: data.description,
            status: data.status as '启用' | '禁用',
          }
        : r
    ));
    showToast('success', '积分规则修改成功');
  };

  const handleDeleteRule = async () => {
    setDeleteLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setRules(prev => prev.filter(r => r.id !== selectedRule?.id));
      showToast('success', '积分规则删除成功');
      setIsDeleteDialogOpen(false);
    } catch (error) {
      showToast('error', '删除失败，请重试');
    } finally {
      setDeleteLoading(false);
    }
  };

  const openEditModal = (rule: PointRule) => {
    setSelectedRule(rule);
    setIsEditModalOpen(true);
  };

  const openViewRecord = (record: PointRecord) => {
    setSelectedRecord(record);
    setIsViewDialogOpen(true);
  };

  const openDeleteDialog = (rule: PointRule) => {
    setSelectedRule(rule);
    setIsDeleteDialogOpen(true);
  };

  const getStatusStyle = (status: string) => {
    return status === '启用'
      ? 'bg-green-100 text-green-700'
      : 'bg-gray-100 text-gray-700';
  };

  const getRecordTypeStyle = (type: string) => {
    return type === '获得'
      ? 'text-green-600'
      : 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">积分管理</h2>
          <p className="text-gray-500 text-sm mt-1">管理积分规则和用户积分</p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          添加规则
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Star className="w-6 h-6 text-purple-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.totalIssued.toLocaleString()}</p>
              <p className="text-gray-500 text-sm">总积分发放</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <span className="text-green-500 text-xl font-bold">✓</span>
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.totalUsed.toLocaleString()}</p>
              <p className="text-gray-500 text-sm">已使用积分</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Gift className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.products}</p>
              <p className="text-gray-500 text-sm">积分商品</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <span className="text-orange-500 text-xl font-bold">人</span>
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.users.toLocaleString()}</p>
              <p className="text-gray-500 text-sm">参与用户</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('rules')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'rules'
                ? 'text-orange-500 border-b-2 border-orange-500'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            积分规则
          </button>
          <button
            onClick={() => setActiveTab('records')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'records'
                ? 'text-orange-500 border-b-2 border-orange-500'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            积分记录
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'products'
                ? 'text-orange-500 border-b-2 border-orange-500'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            积分商品
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'rules' && (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">规则名称</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">积分</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">说明</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">状态</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {rules.map((rule) => (
                  <tr key={rule.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium">{rule.name}</td>
                    <td className="px-6 py-4 text-orange-500 font-semibold">+{rule.points}</td>
                    <td className="px-6 py-4 text-gray-600">{rule.description}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusStyle(rule.status)}`}>
                        {rule.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditModal(rule)}
                          className="hover:bg-blue-50 hover:text-blue-500"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openDeleteDialog(rule)}
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
          )}

          {activeTab === 'records' && (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">用户</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">类型</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">积分</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">来源</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">时间</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {records.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                          {record.user.charAt(0)}
                        </div>
                        <span className="font-medium">{record.user}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`font-medium ${getRecordTypeStyle(record.type)}`}>
                        {record.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-semibold">{record.points > 0 ? '+' : ''}{record.points}</td>
                    <td className="px-6 py-4 text-gray-600">{record.source}</td>
                    <td className="px-6 py-4 text-gray-600">{record.createdAt}</td>
                    <td className="px-6 py-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openViewRecord(record)}
                        className="hover:bg-blue-50 hover:text-blue-500"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeTab === 'products' && (
            <div className="text-center py-12 text-gray-500">
              <Gift className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>积分商品管理功能开发中</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Rule Modal */}
      <FormModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddRule}
        title="新增积分规则"
        fields={ruleFields}
        submitText="确认添加"
        size="md"
      />

      {/* Edit Rule Modal */}
      <FormModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedRule(null);
        }}
        onSubmit={handleEditRule}
        title="编辑积分规则"
        fields={ruleFields.map(field => ({
          ...field,
          defaultValue: selectedRule?.[field.name as keyof PointRule]?.toString() || field.defaultValue
        }))}
        submitText="保存修改"
        size="md"
      />

      {/* View Record Dialog */}
      {selectedRecord && isViewDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsViewDialogOpen(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md animate-scale-in">
            <div className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                  {selectedRecord.user.charAt(0)}
                </div>
                <div>
                  <h3 className="text-lg font-bold">{selectedRecord.user}</h3>
                  <p className="text-gray-500 text-sm">{selectedRecord.userId}</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-500">变动类型</span>
                  <span className={`font-medium ${getRecordTypeStyle(selectedRecord.type)}`}>
                    {selectedRecord.type}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-500">积分变动</span>
                  <span className="font-bold text-orange-600">
                    {selectedRecord.points > 0 ? '+' : ''}{selectedRecord.points}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-500">变动来源</span>
                  <span>{selectedRecord.source}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-500">变动时间</span>
                  <span>{selectedRecord.createdAt}</span>
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
          setSelectedRule(null);
        }}
        onConfirm={handleDeleteRule}
        title="确认删除"
        message={`确认删除积分规则「${selectedRule?.name}」？删除后不可恢复。`}
        confirmText="确认删除"
        cancelText="取消"
        variant="danger"
        loading={deleteLoading}
      />
    </div>
  );
}
