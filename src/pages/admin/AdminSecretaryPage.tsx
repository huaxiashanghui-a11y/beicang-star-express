import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2, Eye, RotateCcw, Play, Download } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { FormModal } from '../../components/ui/FormModal';
import { ConfirmDialog } from '../../components/ui/Modal';
import { useToast } from '@/components/Toast';

interface SecretaryMessage {
  id: string;
  code: string;
  image: string;
  content: string;
  remark: string;
  target: '全部用户' | '商户' | '指定用户';
  status: '待审核' | '已通过' | '已拒绝' | '已驳回' | '已撤回' | '已发布';
  publishTime: string;
  expireTime: string;
}

export default function AdminSecretaryPage() {
  const { showToast } = useToast();
  const [messages, setMessages] = useState<SecretaryMessage[]>([
    { id: '1', code: '20240127', image: '', content: '【系统通知】平台将于今晚22:00-23:00进行系统维护...', remark: '系统维护通知', target: '全部用户', status: '已通过', publishTime: '2024-01-27 15:39:28', expireTime: '2024-02-01 00:00:00' },
    { id: '2', code: '20240126', image: '', content: '【活动公告】新年大促活动火热进行中...', remark: '新年活动', target: '全部用户', status: '已通过', publishTime: '2024-01-26 10:00:00', expireTime: '2024-02-15 23:59:59' },
    { id: '3', code: '20240125', image: '', content: '【功能更新】APP v2.0版本已上线...', remark: '版本更新', target: '商户', status: '待审核', publishTime: '-', expireTime: '-' },
    { id: '4', code: '20240124', image: '', content: '【订单提醒】您有新的订单等待处理...', remark: '订单提醒', target: '商户', status: '已拒绝', publishTime: '-', expireTime: '-' },
    { id: '5', code: '20240123', image: '', content: '【积分兑换】积分商城新商品上线...', remark: '积分商城', target: '全部用户', status: '已发布', publishTime: '2024-01-23 09:00:00', expireTime: '2024-01-30 23:59:59' },
  ]);

  const [searchKeyword, setSearchKeyword] = useState('');
  const [filterTarget, setFilterTarget] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [selectedMessages, setSelectedMessages] = useState<string[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isActionDialogOpen, setIsActionDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'reject' | 'recall' | 'republish' | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<SecretaryMessage | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const addFields = [
    {
      name: 'content',
      label: '消息内容',
      type: 'textarea' as const,
      placeholder: '请输入小秘书消息内容',
      required: true,
    },
    {
      name: 'remark',
      label: '备注',
      type: 'text' as const,
      placeholder: '请输入备注信息',
    },
    {
      name: 'target',
      label: '发布对象',
      type: 'select' as const,
      placeholder: '请选择发布对象',
      required: true,
      options: [
        { value: '全部用户', label: '全部用户' },
        { value: '商户', label: '商户' },
        { value: '指定用户', label: '指定用户' },
      ],
    },
    {
      name: 'expireTime',
      label: '过期时间',
      type: 'text' as const,
      placeholder: '格式：YYYY-MM-DD HH:MM:SS',
      required: true,
    },
  ];

  const handleAddMessage = async (data: Record<string, string>) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    const newMessage: SecretaryMessage = {
      id: `${Date.now()}`,
      code: new Date().toISOString().split('T')[0].replace(/-/g, ''),
      image: '',
      content: data.content,
      remark: data.remark || '',
      target: data.target as '全部用户' | '商户' | '指定用户',
      status: '待审核',
      publishTime: '-',
      expireTime: data.expireTime,
    };
    setMessages(prev => [newMessage, ...prev]);
    showToast('success', '小秘书消息创建成功');
  };

  const handleEditMessage = async (data: Record<string, string>) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    setMessages(prev => prev.map(m =>
      m.id === selectedMessage?.id
        ? { ...m, content: data.content, remark: data.remark || '', target: data.target as any, expireTime: data.expireTime }
        : m
    ));
    showToast('success', '小秘书消息修改成功');
  };

  const handleAction = async () => {
    if (!actionType) return;
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      const actionMap: Record<string, { status: string; message: string }> = {
        approve: { status: '已通过', message: '审核通过' },
        reject: { status: '已拒绝', message: '已拒绝' },
        recall: { status: '已撤回', message: '已撤回' },
        republish: { status: '已发布', message: '重新发布成功' },
      };

      const action = actionMap[actionType];

      if (selectedMessage) {
        setMessages(prev => prev.map(m =>
          m.id === selectedMessage.id
            ? { ...m, status: action.status as any, publishTime: actionType === 'republish' ? new Date().toLocaleString('zh-CN') : m.publishTime }
            : m
        ));
      } else {
        // Batch operation
        const newStatus = action.status;
        setMessages(prev => prev.map(m =>
          selectedMessages.includes(m.id) ? { ...m, status: newStatus as any } : m
        ));
        setSelectedMessages([]);
      }

      showToast('success', action.message);
      setIsActionDialogOpen(false);
    } catch (error) {
      showToast('error', '操作失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      if (selectedMessage) {
        setMessages(prev => prev.filter(m => m.id !== selectedMessage.id));
        showToast('success', '删除成功');
      } else {
        setMessages(prev => prev.filter(m => !selectedMessages.includes(m.id)));
        showToast('success', `成功删除 ${selectedMessages.length} 条`);
        setSelectedMessages([]);
      }
      setIsDeleteDialogOpen(false);
      setSelectedMessage(null);
    } catch (error) {
      showToast('error', '删除失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedMessages(filteredMessages.map(m => m.id));
    } else {
      setSelectedMessages([]);
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedMessages(prev => [...prev, id]);
    } else {
      setSelectedMessages(prev => prev.filter(i => i !== id));
    }
  };

  const openActionDialog = (type: 'approve' | 'reject' | 'recall' | 'republish', message?: SecretaryMessage) => {
    setActionType(type);
    setSelectedMessage(message || null);
    setIsActionDialogOpen(true);
  };

  const openDeleteDialog = (message?: SecretaryMessage) => {
    setSelectedMessage(message || null);
    setIsDeleteDialogOpen(true);
  };

  const openEditModal = (message: SecretaryMessage) => {
    setSelectedMessage(message);
    setIsEditModalOpen(true);
  };

  const filteredMessages = messages.filter(m => {
    if (searchKeyword && !m.content.includes(searchKeyword) && !m.code.includes(searchKeyword)) return false;
    if (filterTarget && m.target !== filterTarget) return false;
    if (filterStatus && m.status !== filterStatus) return false;
    return true;
  });

  const getStatusStyle = (status: string) => {
    const styles: Record<string, string> = {
      '待审核': 'bg-gray-100 text-gray-700',
      '已通过': 'bg-green-100 text-green-700',
      '已拒绝': 'bg-red-100 text-red-700',
      '已驳回': 'bg-red-100 text-red-700',
      '已撤回': 'bg-orange-100 text-orange-700',
      '已发布': 'bg-blue-100 text-blue-700',
    };
    return styles[status] || 'bg-gray-100 text-gray-700';
  };

  const isAllSelected = filteredMessages.length > 0 && selectedMessages.length === filteredMessages.length;
  const isIndeterminate = selectedMessages.length > 0 && selectedMessages.length < filteredMessages.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">小秘书</h2>
          <p className="text-gray-500 text-sm mt-1">管理平台小秘书推送消息</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => openActionDialog('recall')} disabled={selectedMessages.length === 0}>
            <RotateCcw className="w-4 h-4 mr-2" />
            批量撤回 {selectedMessages.length > 0 && `(${selectedMessages.length})`}
          </Button>
          <Button variant="outline" onClick={() => openDeleteDialog()} disabled={selectedMessages.length === 0}>
            <Trash2 className="w-4 h-4 mr-2" />
            批量删除 {selectedMessages.length > 0 && `(${selectedMessages.length})`}
          </Button>
          <Button onClick={() => setIsAddModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            发布小秘书
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-5 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <span className="text-2xl">📋</span>
            </div>
            <div>
              <p className="text-2xl font-bold">{messages.length}</p>
              <p className="text-gray-500 text-sm">消息总数</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <span className="text-2xl">⏳</span>
            </div>
            <div>
              <p className="text-2xl font-bold">{messages.filter(m => m.status === '待审核').length}</p>
              <p className="text-gray-500 text-sm">待审核</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <span className="text-2xl">✓</span>
            </div>
            <div>
              <p className="text-2xl font-bold">{messages.filter(m => m.status === '已通过').length}</p>
              <p className="text-gray-500 text-sm">已通过</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <span className="text-2xl">🚀</span>
            </div>
            <div>
              <p className="text-2xl font-bold">{messages.filter(m => m.status === '已发布').length}</p>
              <p className="text-gray-500 text-sm">已发布</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <span className="text-2xl">✕</span>
            </div>
            <div>
              <p className="text-2xl font-bold">{messages.filter(m => m.status === '已拒绝' || m.status === '已驳回').length}</p>
              <p className="text-gray-500 text-sm">已拒绝</p>
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
              placeholder="搜索内容..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary transition-all"
            />
          </div>
          <select
            value={filterTarget}
            onChange={(e) => setFilterTarget(e.target.value)}
            className="px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary transition-all"
          >
            <option value="">全部对象</option>
            <option value="全部用户">全部用户</option>
            <option value="商户">商户</option>
            <option value="指定用户">指定用户</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary transition-all"
          >
            <option value="">全部状态</option>
            <option value="待审核">待审核</option>
            <option value="已通过">已通过</option>
            <option value="已拒绝">已拒绝</option>
            <option value="已发布">已发布</option>
            <option value="已撤回">已撤回</option>
          </select>
        </div>
      </div>

      {/* Messages Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  ref={(el) => { if (el) el.indeterminate = isIndeterminate; }}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">编号</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">图片</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">内容</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">备注</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">发布对象</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">状态</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">发布时间</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">过期时间</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredMessages.map((message) => (
              <tr key={message.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedMessages.includes(message.id)}
                    onChange={(e) => handleSelectOne(message.id, e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300"
                  />
                </td>
                <td className="px-6 py-4 font-mono text-sm">{message.code}</td>
                <td className="px-6 py-4">
                  <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center text-gray-400">
                    <span className="text-xs">暂无</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="line-clamp-2 text-sm max-w-xs">{message.content}</p>
                </td>
                <td className="px-6 py-4 text-gray-600 text-sm">{message.remark}</td>
                <td className="px-6 py-4 text-gray-600">{message.target}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusStyle(message.status)}`}>
                    {message.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-600 text-sm">{message.publishTime}</td>
                <td className="px-6 py-4 text-gray-600 text-sm">{message.expireTime}</td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => openEditModal(message)} className="hover:bg-blue-50 hover:text-blue-500">
                      <Edit className="w-4 h-4" />
                    </Button>
                    {message.status === '待审核' && (
                      <>
                        <Button variant="ghost" size="sm" onClick={() => openActionDialog('approve', message)} className="hover:bg-green-50 hover:text-green-500 text-green-600">
                          审核
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => openActionDialog('reject', message)} className="hover:bg-red-50 hover:text-red-500 text-red-600">
                          拒绝
                        </Button>
                      </>
                    )}
                    {message.status === '已通过' && (
                      <Button variant="ghost" size="sm" onClick={() => openActionDialog('republish', message)} className="hover:bg-purple-50 hover:text-purple-500 text-purple-600">
                        <Play className="w-4 h-4" />
                      </Button>
                    )}
                    {message.status === '已发布' && (
                      <Button variant="ghost" size="sm" onClick={() => openActionDialog('recall', message)} className="hover:bg-orange-50 hover:text-orange-500 text-orange-600">
                        <RotateCcw className="w-4 h-4" />
                      </Button>
                    )}
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
          <Button variant="outline" size="sm" disabled={currentPage === 1}>上一页</Button>
          <span className="px-4 py-2 text-sm text-gray-600">第{currentPage}页</span>
          <Button variant="outline" size="sm" disabled>下一页</Button>
        </div>
      </div>

      {/* Add Modal */}
      <FormModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddMessage}
        title="发布小秘书"
        fields={addFields}
        submitText="确认发布"
        size="lg"
      />

      {/* Edit Modal */}
      <FormModal
        isOpen={isEditModalOpen}
        onClose={() => { setIsEditModalOpen(false); setSelectedMessage(null); }}
        onSubmit={handleEditMessage}
        title="编辑小秘书"
        fields={addFields.map(field => ({
          ...field,
          defaultValue: selectedMessage?.[field.name as keyof SecretaryMessage]?.toString() || field.defaultValue
        }))}
        submitText="保存修改"
        size="lg"
      />

      {/* Action Dialog */}
      <ConfirmDialog
        isOpen={isActionDialogOpen}
        onClose={() => { setIsActionDialogOpen(false); setSelectedMessage(null); setActionType(null); }}
        onConfirm={handleAction}
        title={
          actionType === 'approve' ? '确认审核' :
          actionType === 'reject' ? '确认拒绝' :
          actionType === 'recall' ? '确认撤回' :
          '确认发布'
        }
        message={
          actionType === 'approve' ? `确认通过该小秘书消息？` :
          actionType === 'reject' ? `确认拒绝该小秘书消息？` :
          actionType === 'recall' ? `确认撤回该小秘书消息？` :
          `确认重新发布该小秘书消息？`
        }
        confirmText="确认"
        cancelText="取消"
        variant={actionType === 'reject' || actionType === 'recall' ? 'danger' : 'default'}
        loading={loading}
      />

      {/* Delete Dialog */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => { setIsDeleteDialogOpen(false); setSelectedMessage(null); }}
        onConfirm={handleDelete}
        title="确认删除"
        message={selectedMessage ? `确认删除该小秘书消息？删除后不可恢复。` : `确认删除选中的 ${selectedMessages.length} 条小秘书消息？`}
        confirmText="确认删除"
        cancelText="取消"
        variant="danger"
        loading={loading}
      />
    </div>
  );
}
