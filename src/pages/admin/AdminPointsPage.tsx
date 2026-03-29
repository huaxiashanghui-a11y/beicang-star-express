import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, Star, Gift, TrendingUp, Users, Coins, ArrowUpDown, X, Check, AlertTriangle, Eye } from 'lucide-react';
import { Button } from '../../components/ui/button';

interface PointsRule {
  id: string;
  name: string;
  description: string;
  type: 'earn' | 'redeem';
  points: number;
  ratio: string;
  status: '启用' | '禁用';
  dailyLimit: number | null;
  totalUsed: number;
}

interface PointsRecord {
  id: string;
  user: string;
  type: '获得' | '使用';
  points: number;
  source: string;
  time: string;
}

const initialRules: PointsRule[] = [
  {
    id: '1',
    name: '购物返积分',
    description: '每消费1元返1积分',
    type: 'earn',
    points: 1,
    ratio: '¥1 = 1积分',
    status: '启用',
    dailyLimit: null,
    totalUsed: 1567800,
  },
  {
    id: '2',
    name: '订单完成奖励',
    description: '订单完成后额外奖励积分',
    type: 'earn',
    points: 100,
    ratio: '每单+100积分',
    status: '启用',
    dailyLimit: 1,
    totalUsed: 890100,
  },
  {
    id: '3',
    name: '商品评价奖励',
    description: '发表有效评价奖励积分',
    type: 'earn',
    points: 50,
    ratio: '每评价+50积分',
    status: '启用',
    dailyLimit: 5,
    totalUsed: 456700,
  },
  {
    id: '4',
    name: '邀请好友奖励',
    description: '成功邀请1位好友奖励积分',
    type: 'earn',
    points: 500,
    ratio: '每人+500积分',
    status: '启用',
    dailyLimit: 10,
    totalUsed: 234500,
  },
  {
    id: '5',
    name: '积分抵扣现金',
    description: '100积分抵扣1元',
    type: 'redeem',
    points: 100,
    ratio: '100积分 = ¥1',
    status: '启用',
    dailyLimit: 50000,
    totalUsed: 3456000,
  },
  {
    id: '6',
    name: '积分兑换优惠券',
    description: '积分商城兑换各种优惠券',
    type: 'redeem',
    points: 1000,
    ratio: '1000积分起兑',
    status: '启用',
    dailyLimit: null,
    totalUsed: 1234000,
  },
];

const initialRecords: PointsRecord[] = [
  { id: '1', user: '张伟', type: '获得', points: 1250, source: '购物返积分', time: '2024-03-20 14:30' },
  { id: '2', user: '李娜', type: '使用', points: -500, source: '兑换优惠券', time: '2024-03-20 13:20' },
  { id: '3', user: '王强', type: '获得', points: 600, source: '邀请好友', time: '2024-03-20 11:45' },
  { id: '4', user: '赵敏', type: '使用', points: -1000, source: '抵扣现金', time: '2024-03-20 10:15' },
  { id: '5', user: '陈刚', type: '获得', points: 150, source: '订单完成', time: '2024-03-20 09:30' },
];

export default function AdminPointsPage() {
  const [rules, setRules] = useState<PointsRule[]>(initialRules);
  const [records] = useState<PointsRecord[]>(initialRecords);
  const [activeTab, setActiveTab] = useState<'rules' | 'records' | 'products'>('rules');

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedRule, setSelectedRule] = useState<PointsRule | null>(null);
  const [editingRule, setEditingRule] = useState<Partial<PointsRule>>({});

  // Toast state
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({
    show: false,
    message: '',
    type: 'success',
  });

  // Form state
  const [formData, setFormData] = useState<Partial<PointsRule>>({
    name: '',
    description: '',
    type: 'earn',
    points: 0,
    ratio: '',
    status: '启用',
    dailyLimit: null,
  });

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ ...toast, show: false }), 3000);
  };

  const totalPointsIssued = rules.filter(r => r.type === 'earn').reduce((sum, r) => sum + r.totalUsed, 0);
  const totalPointsRedeemed = rules.filter(r => r.type === 'redeem').reduce((sum, r) => sum + r.totalUsed, 0);

  const handleAdd = () => {
    setFormData({
      name: '',
      description: '',
      type: 'earn',
      points: 0,
      ratio: '',
      status: '启用',
      dailyLimit: null,
    });
    setShowAddModal(true);
  };

  const handleEdit = (rule: PointsRule) => {
    setEditingRule({ ...rule });
    setShowEditModal(true);
  };

  const handleView = (rule: PointsRule) => {
    setSelectedRule(rule);
    setShowDetailModal(true);
  };

  const handleDelete = (rule: PointsRule) => {
    setSelectedRule(rule);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (selectedRule) {
      setRules(rules.filter(r => r.id !== selectedRule.id));
      showToast(`积分规则"${selectedRule.name}"已删除`);
      setShowDeleteModal(false);
      setSelectedRule(null);
    }
  };

  const handleToggleStatus = (rule: PointsRule) => {
    setRules(
      rules.map(r =>
        r.id === rule.id ? { ...r, status: r.status === '启用' ? '禁用' : '启用' } : r
      )
    );
    showToast(`积分规则"${rule.name}"已${rule.status === '启用' ? '禁用' : '启用'}`);
  };

  const handleSaveAdd = () => {
    if (!formData.name || !formData.points) {
      showToast('请填写规则名称和积分值', 'error');
      return;
    }
    const newRule: PointsRule = {
      id: Date.now().toString(),
      name: formData.name || '',
      description: formData.description || '',
      type: (formData.type as PointsRule['type']) || 'earn',
      points: formData.points || 0,
      ratio: formData.ratio || `${formData.points}积分`,
      status: (formData.status as PointsRule['status']) || '启用',
      dailyLimit: formData.dailyLimit || null,
      totalUsed: 0,
    };
    setRules([...rules, newRule]);
    showToast(`积分规则"${newRule.name}"创建成功`);
    setShowAddModal(false);
  };

  const handleSaveEdit = () => {
    if (!editingRule.id || !editingRule.name) {
      showToast('请填写完整信息', 'error');
      return;
    }
    setRules(
      rules.map(r =>
        r.id === editingRule.id
          ? {
              ...r,
              ...editingRule,
              ratio: editingRule.ratio || `${editingRule.points}积分`,
            } as PointsRule
          : r
      )
    );
    showToast(`积分规则"${editingRule.name}"更新成功`);
    setShowEditModal(false);
    setEditingRule({});
  };

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
          <h2 className="text-2xl font-bold text-gray-800">积分管理</h2>
          <p className="text-gray-500 text-sm mt-1">配置积分规则和兑换商品</p>
        </div>
        <Button onClick={handleAdd} className="bg-gradient-to-r from-orange-500 to-blue-500">
          <Plus className="w-4 h-4 mr-2" />
          添加规则
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-xl p-4 text-white">
          <div className="flex items-center gap-2 mb-2">
            <Star className="w-5 h-5" />
            <p className="text-sm opacity-90">总发放积分</p>
          </div>
          <p className="text-2xl font-bold">{(totalPointsIssued / 10000).toFixed(0)}万</p>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl p-4 text-white">
          <div className="flex items-center gap-2 mb-2">
            <Coins className="w-5 h-5" />
            <p className="text-sm opacity-90">总消耗积分</p>
          </div>
          <p className="text-2xl font-bold">{(totalPointsRedeemed / 10000).toFixed(0)}万</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-green-500" />
            <p className="text-sm text-gray-600">积分结余</p>
          </div>
          <p className="text-2xl font-bold text-green-600">
            {((totalPointsIssued - totalPointsRedeemed) / 10000).toFixed(0)}万
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-5 h-5 text-blue-500" />
            <p className="text-sm text-gray-600">参与用户</p>
          </div>
          <p className="text-2xl font-bold text-blue-600">5,678</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('rules')}
            className={`px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === 'rules'
                ? 'text-orange-600 border-b-2 border-orange-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            积分规则
          </button>
          <button
            onClick={() => setActiveTab('records')}
            className={`px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === 'records'
                ? 'text-orange-600 border-b-2 border-orange-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            积分记录
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === 'products'
                ? 'text-orange-600 border-b-2 border-orange-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            积分商品
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'rules' && (
            <div className="space-y-4">
              {rules.map((rule) => (
                <div key={rule.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      rule.type === 'earn' ? 'bg-green-100' : 'bg-orange-100'
                    }`}>
                      {rule.type === 'earn' ? (
                        <TrendingUp className="w-6 h-6 text-green-600" />
                      ) : (
                        <Gift className="w-6 h-6 text-orange-600" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-gray-800">{rule.name}</h4>
                        <span className={`px-2 py-0.5 rounded-full text-xs ${
                          rule.type === 'earn' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                        }`}>
                          {rule.type === 'earn' ? '获得' : '消耗'}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-xs ${
                          rule.status === '启用' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {rule.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{rule.description}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>{rule.ratio}</span>
                        {rule.dailyLimit && <span>每日限{rule.dailyLimit}次</span>}
                        <span>已使用: {(rule.totalUsed / 10000).toFixed(1)}万</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleView(rule)}>
                      <Eye className="w-4 h-4 mr-1" />
                      详情
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleEdit(rule)}>
                      <Edit className="w-4 h-4 mr-1" />
                      编辑
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleStatus(rule)}
                      className={rule.status === '启用' ? 'text-red-600' : 'text-green-600'}
                    >
                      {rule.status === '启用' ? '禁用' : '启用'}
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-600 hover:bg-red-50" onClick={() => handleDelete(rule)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'records' && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">用户</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">类型</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">积分</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">来源</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">时间</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((record) => (
                    <tr key={record.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <span className="font-medium text-gray-800">{record.user}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-xs ${
                          record.type === '获得' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {record.type}
                        </span>
                      </td>
                      <td className={`py-3 px-4 font-semibold ${
                        record.points > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {record.points > 0 ? '+' : ''}{record.points}
                      </td>
                      <td className="py-3 px-4 text-gray-600">{record.source}</td>
                      <td className="py-3 px-4 text-gray-500 text-sm">{record.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'products' && (
            <div className="text-center py-8 text-gray-500">
              <Gift className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p>积分商城商品管理</p>
              <p className="text-sm text-gray-400 mt-2">即将推出...</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-800">添加积分规则</h3>
                <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">规则名称</label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="例如：购物返积分"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">规则描述</label>
                <textarea
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="请输入规则描述"
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">规则类型</label>
                  <select
                    value={formData.type || 'earn'}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as PointsRule['type'] })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="earn">获得积分</option>
                    <option value="redeem">消耗积分</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">积分值</label>
                  <input
                    type="number"
                    value={formData.points || ''}
                    onChange={(e) => setFormData({ ...formData, points: Number(e.target.value) })}
                    placeholder="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">规则说明</label>
                <input
                  type="text"
                  value={formData.ratio || ''}
                  onChange={(e) => setFormData({ ...formData, ratio: e.target.value })}
                  placeholder="例如：¥1 = 1积分"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">每日限制次数</label>
                  <input
                    type="number"
                    value={formData.dailyLimit || ''}
                    onChange={(e) => setFormData({ ...formData, dailyLimit: e.target.value ? Number(e.target.value) : null })}
                    placeholder="不限制"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">状态</label>
                  <select
                    value={formData.status || '启用'}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as PointsRule['status'] })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="启用">启用</option>
                    <option value="禁用">禁用</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowAddModal(false)}>
                取消
              </Button>
              <Button onClick={handleSaveAdd} className="bg-gradient-to-r from-orange-500 to-blue-500">
                添加规则
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editingRule && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-800">编辑积分规则</h3>
                <button onClick={() => setShowEditModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">规则名称</label>
                <input
                  type="text"
                  value={editingRule.name || ''}
                  onChange={(e) => setEditingRule({ ...editingRule, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">规则描述</label>
                <textarea
                  value={editingRule.description || ''}
                  onChange={(e) => setEditingRule({ ...editingRule, description: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">规则类型</label>
                  <select
                    value={editingRule.type || 'earn'}
                    onChange={(e) => setEditingRule({ ...editingRule, type: e.target.value as PointsRule['type'] })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="earn">获得积分</option>
                    <option value="redeem">消耗积分</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">积分值</label>
                  <input
                    type="number"
                    value={editingRule.points || 0}
                    onChange={(e) => setEditingRule({ ...editingRule, points: Number(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">规则说明</label>
                <input
                  type="text"
                  value={editingRule.ratio || ''}
                  onChange={(e) => setEditingRule({ ...editingRule, ratio: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">每日限制次数</label>
                  <input
                    type="number"
                    value={editingRule.dailyLimit || ''}
                    onChange={(e) => setEditingRule({ ...editingRule, dailyLimit: e.target.value ? Number(e.target.value) : null })}
                    placeholder="不限制"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">状态</label>
                  <select
                    value={editingRule.status || '启用'}
                    onChange={(e) => setEditingRule({ ...editingRule, status: e.target.value as PointsRule['status'] })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="启用">启用</option>
                    <option value="禁用">禁用</option>
                  </select>
                </div>
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
      {showDetailModal && selectedRule && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-800">积分规则详情</h3>
                <button onClick={() => setShowDetailModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${
                  selectedRule.type === 'earn' ? 'bg-green-100' : 'bg-orange-100'
                }`}>
                  {selectedRule.type === 'earn' ? (
                    <TrendingUp className="w-8 h-8 text-green-600" />
                  ) : (
                    <Gift className="w-8 h-8 text-orange-600" />
                  )}
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-800">{selectedRule.name}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                      selectedRule.type === 'earn' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                    }`}>
                      {selectedRule.type === 'earn' ? '获得积分' : '消耗积分'}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                      selectedRule.status === '启用' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {selectedRule.status}
                    </span>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 mb-4">
                <p className="text-gray-700">{selectedRule.description}</p>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">规则ID</span>
                  <span className="font-medium">{selectedRule.id}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">积分值</span>
                  <span className="font-medium text-orange-600">{selectedRule.points}积分</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">规则说明</span>
                  <span className="font-medium">{selectedRule.ratio}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">每日限制</span>
                  <span className="font-medium">{selectedRule.dailyLimit ? `${selectedRule.dailyLimit}次` : '无限制'}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-500">已使用</span>
                  <span className="font-medium text-blue-600">{(selectedRule.totalUsed / 10000).toFixed(1)}万</span>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowDetailModal(false)}>
                关闭
              </Button>
              <Button onClick={() => { setShowDetailModal(false); handleEdit(selectedRule); }} className="bg-gradient-to-r from-orange-500 to-blue-500">
                编辑规则
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedRule && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">确认删除</h3>
              <p className="text-gray-600">
                确定要删除积分规则 "{selectedRule.name}" 吗？此操作无法撤销。
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
