import React, { useState } from 'react'
import { Search, Plus, Edit, Trash2, Phone, MapPin, Star, Clock, MoreVertical } from 'lucide-react'
import Modal from '@/components/ui/Modal'
import { adminApi } from '@/config/adminApi'

// 骑手数据类型
interface Rider {
  id: string
  name: string
  phone: string
  avatar: string
  rating: number
  totalOrders: number
  todayOrders: number
  status: 'active' | 'inactive' | 'busy'
  region: string
  joinDate: string
}

// 模拟数据
const mockRiders: Rider[] = [
  { id: '1', name: '张师傅', phone: '138****1234', avatar: '张', rating: 4.9, totalOrders: 1523, todayOrders: 12, status: 'active', region: '朝阳区', joinDate: '2023-05-01' },
  { id: '2', name: '李师傅', phone: '139****5678', avatar: '李', rating: 4.8, totalOrders: 986, todayOrders: 8, status: 'busy', region: '海淀区', joinDate: '2023-06-15' },
  { id: '3', name: '王师傅', phone: '137****9012', avatar: '王', rating: 4.9, totalOrders: 2341, todayOrders: 15, status: 'active', region: '东城区', joinDate: '2023-03-20' },
  { id: '4', name: '赵师傅', phone: '136****3456', avatar: '赵', rating: 4.7, totalOrders: 567, todayOrders: 5, status: 'inactive', region: '西城区', joinDate: '2023-09-10' },
]

export default function AdminRidersPage() {
  const [riders, setRiders] = useState<Rider[]>(mockRiders)
  const [searchText, setSearchText] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingRider, setEditingRider] = useState<Rider | null>(null)
  const [loading, setLoading] = useState(false)

  // 筛选骑手
  const filteredRiders = riders.filter(rider => {
    const matchesSearch = rider.name.includes(searchText) || rider.phone.includes(searchText)
    const matchesStatus = statusFilter === 'all' || rider.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // 添加骑手
  const handleAddRider = async (data: Partial<Rider>) => {
    setLoading(true)
    try {
      const newRider: Rider = {
        id: Date.now().toString(),
        name: data.name || '',
        phone: data.phone || '',
        avatar: (data.name || '').charAt(0),
        rating: 5.0,
        totalOrders: 0,
        todayOrders: 0,
        status: 'inactive',
        region: data.region || '',
        joinDate: new Date().toISOString().split('T')[0],
      }
      setRiders([...riders, newRider])
      setShowAddModal(false)
    } finally {
      setLoading(false)
    }
  }

  // 编辑骑手
  const handleEditRider = (rider: Rider) => {
    setEditingRider(rider)
    setShowEditModal(true)
  }

  // 保存编辑
  const handleSaveRider = (data: Partial<Rider>) => {
    if (!editingRider) return
    setRiders(riders.map(r => r.id === editingRider.id ? { ...r, ...data } : r))
    setShowEditModal(false)
    setEditingRider(null)
  }

  // 删除骑手
  const handleDeleteRider = (id: string) => {
    if (confirm('确定要删除该骑手吗？')) {
      setRiders(riders.filter(r => r.id !== id))
    }
  }

  const statusLabels = { active: '在线', busy: '忙碌', inactive: '离线' }
  const statusColors = {
    active: 'bg-green-100 text-green-600',
    busy: 'bg-orange-100 text-orange-600',
    inactive: 'bg-gray-100 text-gray-500',
  }

  return (
    <div className="p-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">骑手管理</h1>
          <p className="text-sm text-gray-500 mt-1">管理跑腿骑手信息、订单分配和区域配置</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          添加骑手
        </button>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: '总骑手数', value: riders.length, color: 'text-purple-600' },
          { label: '在线骑手', value: riders.filter(r => r.status === 'active').length, color: 'text-green-600' },
          { label: '今日订单', value: riders.reduce((sum, r) => sum + r.todayOrders, 0), color: 'text-orange-600' },
          { label: '完成订单', value: riders.reduce((sum, r) => sum + r.totalOrders, 0), color: 'text-blue-600' },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-sm text-gray-500">{stat.label}</p>
            <p className={`text-2xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* 搜索和筛选 */}
      <div className="bg-white rounded-xl p-4 shadow-sm mb-6">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="搜索骑手姓名或手机号..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">全部状态</option>
            <option value="active">在线</option>
            <option value="busy">忙碌</option>
            <option value="inactive">离线</option>
          </select>
        </div>
      </div>

      {/* 骑手列表 */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">骑手信息</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">评分</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">订单量</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">状态</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">服务区域</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">加入时间</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredRiders.map((rider) => (
              <tr key={rider.id} className="hover:bg-gray-50">
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-semibold">
                      {rider.avatar}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{rider.name}</p>
                      <p className="text-sm text-gray-500">{rider.phone}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-1 text-yellow-500">
                    <Star className="w-4 h-4 fill-yellow-500" />
                    <span className="font-medium">{rider.rating}</span>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <p className="text-gray-800">{rider.totalOrders}</p>
                  <p className="text-xs text-gray-500">今日 {rider.todayOrders} 单</p>
                </td>
                <td className="px-4 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[rider.status]}`}>
                    {statusLabels[rider.status]}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-1 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    {rider.region}
                  </div>
                </td>
                <td className="px-4 py-4 text-gray-500 text-sm">
                  {rider.joinDate}
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleEditRider(rider)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteRider(rider.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredRiders.length === 0 && (
          <div className="py-12 text-center text-gray-400">
            暂无骑手数据
          </div>
        )}
      </div>

      {/* 添加骑手弹窗 */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="添加骑手"
      >
        <RiderForm onSubmit={handleAddRider} onCancel={() => setShowAddModal(false)} loading={loading} />
      </Modal>

      {/* 编辑骑手弹窗 */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="编辑骑手"
      >
        <RiderForm
          initialData={editingRider}
          onSubmit={handleSaveRider}
          onCancel={() => setShowEditModal(false)}
          loading={loading}
        />
      </Modal>
    </div>
  )
}

// 骑手表单组件
function RiderForm({
  initialData,
  onSubmit,
  onCancel,
  loading
}: {
  initialData?: Rider | null
  onSubmit: (data: Partial<Rider>) => void
  onCancel: () => void
  loading: boolean
}) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    phone: initialData?.phone || '',
    region: initialData?.region || '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">骑手姓名</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">手机号</label>
        <input
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">服务区域</label>
        <input
          type="text"
          value={formData.region}
          onChange={(e) => setFormData({ ...formData, region: e.target.value })}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="如：朝阳区、海淀区"
          required
        />
      </div>
      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
        >
          取消
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
        >
          {loading ? '保存中...' : '保存'}
        </button>
      </div>
    </form>
  )
}
