import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2, Eye } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { FormModal } from '../../components/ui/FormModal';
import { ConfirmDialog } from '../../components/ui/Modal';
import { useToast } from '@/components/Toast';

interface SystemMessage {
  id: string;
  code: string;
  content: string;
  type: string;
  status: '草稿' | '待发布' | '已发布' | '已下线';
  createTime: string;
  endTime: string;
}

export default function AdminSystemMessagesPage() {
  const { showToast } = useToast();
  const [messages, setMessages] = useState<SystemMessage[]>([
    { id: '1', code: 'SM001', content: '【系统通知】平台将于今晚22:00-23:00进行系统维护，届时部分功能将暂停使用。', type: '系统通知', status: '已发布', createTime: '2024-01-27 15:39:28', endTime: '2024-02-01 00:00:00' },
    { id: '2', code: 'SM002', content: '【活动公告】新年大促活动火热进行中，全场商品8折起！', type: '活动公告', status: '已发布', createTime: '2024-01-26 10:00:00', endTime: '2024-02-15 23:59:59' },
    { id: '3', code: 'SM003', content: '【功能更新】APP v2.0版本已上线，新增多项实用功能。', type: '功能更新', status: '待发布', createTime: '2024-01-25 14:30:00', endTime: '2024-03-01 00:00:00' },
  ]);

  const [searchKeyword, setSearchKeyword] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<SystemMessage | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const addFields = [
    {
      name: 'content',
      label: '发布内容',
      type: 'textarea' as const,
      placeholder: '请输入系统消息内容',
      required: true,
    },
    {
      name: 'type',
      label: '内容类型',
      type: 'select' as const,
      placeholder: '请选择类型',
      required: true,
      options: [
        { value: '系统通知', label: '系统通知' },
        { value: '活动公告', label: '活动公告' },
        { value: '功能更新', label: '功能更新' },
        { value: '温馨提示', label: '温馨提示' },
      ],
    },
    {
      name: 'endTime',
      label: '结束时间',
      type: 'text' as const,
      placeholder: '格式：YYYY-MM-DD HH:MM:SS',
      required: true,
    },
  ];

  const handleAddMessage = async (data: Record<string, string>) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    const newMessage: SystemMessage = {
      id: `${Date.now()}`,
      code: `SM${String(messages.length + 1).padStart(3, '0')}`,
      content: data.content,
      type: data.type,
      status: '待发布',
      createTime: new Date().toLocaleString('zh-CN'),
      endTime: data.endTime,
    };
    setMessages(prev => [newMessage, ...prev]);
    showToast('success', '系统消息创建成功');
  };

  const handleEditMessage = async (data: Record<string, string>) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    setMessages(prev => prev.map(m =>
      m.id === selectedMessage?.id
        ? { ...m, content: data.content, type: data.type, endTime: data.endTime }
        : m
    ));
    showToast('success', '系统消息修改成功');
  };

  const handleDeleteMessage = async () => {
    setDeleteLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setMessages(prev => prev.filter(m => m.id !== selectedMessage?.id));
      showToast('success', '系统消息删除成功');
      setIsDeleteDialogOpen(false);
    } catch (error) {
      showToast('error', '删除失败，请重试');
    } finally {
      setDeleteLoading(false);
    }
  };

  const openEditModal = (message: SystemMessage) => {
    setSelectedMessage(message);
    setIsEditModalOpen(true);
  };

  const openViewDialog = (message: SystemMessage) => {
    setSelectedMessage(message);
    setIsViewDialogOpen(true);
  };

  const openDeleteDialog = (message: SystemMessage) => {
    setSelectedMessage(message);
    setIsDeleteDialogOpen(true);
  };

  const getStatusStyle = (status: string) => {
    const styles: Record<string, string> = {
      '草稿': 'bg-gray-100 text-gray-700',
      '待发布': 'bg-orange-100 text-orange-700',
      '已发布': 'bg-green-100 text-green-700',
      '已下线': 'bg-red-100 text-red-700',
    };
    return styles[status] || 'bg-gray-100 text-gray-700';
  };

  const filteredMessages = messages.filter(m => {
    if (searchKeyword && !m.content.includes(searchKeyword)) return false;
    if (filterStatus && m.status !== filterStatus) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">系统消息</h2>
          <p className="text-gray-500 text-sm mt-1">管理平台系统消息发布</p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          发布系统消息
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <span className="text-2xl">📢</span>
            </div>
            <div>
              <p className="text-2xl font-bold">{messages.length}</p>
              <p className="text-gray-500 text-sm">消息总数</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <span className="text-2xl">✓</span>
            </div>
            <div>
              <p className="text-2xl font-bold">{messages.filter(m => m.status === '已发布').length}</p>
              <p className="text-gray-500 text-sm">已发布</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <span className="text-2xl">⏰</span>
            </div>
            <div>
              <p className="text-2xl font-bold">{messages.filter(m => m.status === '待发布').length}</p>
              <p className="text-gray-500 text-sm">待发布</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <span className="text-2xl">🔴</span>
            </div>
            <div>
              <p className="text-2xl font-bold">{messages.filter(m => m.status === '已下线').length}</p>
              <p className="text-gray-500 text-sm">已下线</p>
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
              placeholder="搜索消息内容..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary transition-all"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary transition-all"
          >
            <option value="">全部状态</option>
            <option value="草稿">草稿</option>
            <option value="待发布">待发布</option>
            <option value="已发布">已发布</option>
            <option value="已下线">已下线</option>
          </select>
        </div>
      </div>

      {/* Messages Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">编号</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">发表内容</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">内容类型</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">状态</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">创建时间</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">结束时间</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredMessages.map((message) => (
              <tr key={message.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-mono text-sm">{message.code}</td>
                <td className="px-6 py-4">
                  <p className="line-clamp-2 text-sm max-w-md">{message.content}</p>
                </td>
                <td className="px-6 py-4 text-gray-600">{message.type}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusStyle(message.status)}`}>
                    {message.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-600 text-sm">{message.createTime}</td>
                <td className="px-6 py-4 text-gray-600 text-sm">{message.endTime}</td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => openViewDialog(message)} className="hover:bg-blue-50 hover:text-blue-500">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => openEditModal(message)} className="hover:bg-orange-50 hover:text-orange-500">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => openDeleteDialog(message)} className="hover:bg-red-50 hover:text-red-500">
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center">
        <p className="text-gray-500 text-sm">共 {filteredMessages.length} 条记录</p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled>上一页</Button>
          <Button variant="outline" size="sm" disabled>下一页</Button>
        </div>
      </div>

      {/* Add Modal */}
      <FormModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddMessage}
        title="发布系统消息"
        fields={addFields}
        submitText="确认发布"
        size="lg"
      />

      {/* Edit Modal */}
      <FormModal
        isOpen={isEditModalOpen}
        onClose={() => { setIsEditModalOpen(false); setSelectedMessage(null); }}
        onSubmit={handleEditMessage}
        title="编辑系统消息"
        fields={addFields.map(field => ({
          ...field,
          defaultValue: selectedMessage?.[field.name as keyof SystemMessage]?.toString() || field.defaultValue
        }))}
        submitText="保存修改"
        size="lg"
      />

      {/* View Dialog */}
      {selectedMessage && isViewDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsViewDialogOpen(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg animate-scale-in">
            <div className="p-6">
              <h3 className="text-lg font-bold mb-4">消息详情</h3>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-500">编号</span>
                  <span className="font-mono">{selectedMessage.code}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-500">类型</span>
                  <span>{selectedMessage.type}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-500">状态</span>
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusStyle(selectedMessage.status)}`}>
                    {selectedMessage.status}
                  </span>
                </div>
                <div className="py-2 border-b">
                  <span className="text-gray-500 block mb-2">内容</span>
                  <p className="text-gray-800">{selectedMessage.content}</p>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-500">创建时间</span>
                  <span>{selectedMessage.createTime}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-500">结束时间</span>
                  <span>{selectedMessage.endTime}</span>
                </div>
              </div>
              <Button variant="outline" className="w-full mt-6" onClick={() => setIsViewDialogOpen(false)}>关闭</Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Dialog */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => { setIsDeleteDialogOpen(false); setSelectedMessage(null); }}
        onConfirm={handleDeleteMessage}
        title="确认删除"
        message={`确认删除系统消息「${selectedMessage?.code}」？删除后不可恢复。`}
        confirmText="确认删除"
        cancelText="取消"
        variant="danger"
        loading={deleteLoading}
      />
    </div>
  );
}
