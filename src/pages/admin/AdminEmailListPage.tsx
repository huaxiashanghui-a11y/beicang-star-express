import React, { useState } from 'react';
import { Search, Eye, Trash2, Download } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { ConfirmDialog } from '../../components/ui/Modal';
import { useToast } from '@/components/Toast';

interface Email {
  id: string;
  recipientId: string;
  type: string;
  time: string;
  title: string;
  content: string;
}

export default function AdminEmailListPage() {
  const { showToast } = useToast();
  const [emails, setEmails] = useState<Email[]>([
    // 暂无数据状态演示 - 空列表
  ]);

  const [searchKeyword, setSearchKeyword] = useState('');
  const [filterType, setFilterType] = useState('');
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const filteredEmails = emails.filter(e => {
    if (searchKeyword && !e.recipientId.includes(searchKeyword) && !e.title.includes(searchKeyword)) return false;
    if (filterType && e.type !== filterType) return false;
    return true;
  });

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedEmails(filteredEmails.map(e => e.id));
    } else {
      setSelectedEmails([]);
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedEmails(prev => [...prev, id]);
    } else {
      setSelectedEmails(prev => prev.filter(i => i !== id));
    }
  };

  const handleBatchDelete = async () => {
    if (selectedEmails.length === 0) {
      showToast('warning', '请先选择要删除的邮件');
      return;
    }
    setDeleteLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setEmails(prev => prev.filter(e => !selectedEmails.includes(e.id)));
      setSelectedEmails([]);
      showToast('success', `成功删除 ${selectedEmails.length} 条邮件`);
      setIsDeleteDialogOpen(false);
    } catch (error) {
      showToast('error', '删除失败，请重试');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleDeleteOne = async () => {
    if (!selectedEmail) return;
    setDeleteLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setEmails(prev => prev.filter(e => e.id !== selectedEmail.id));
      showToast('success', '邮件删除成功');
      setIsDeleteDialogOpen(false);
      setSelectedEmail(null);
    } catch (error) {
      showToast('error', '删除失败，请重试');
    } finally {
      setDeleteLoading(false);
    }
  };

  const openViewDialog = (email: Email) => {
    setSelectedEmail(email);
    setIsViewDialogOpen(true);
  };

  const openDeleteDialog = (email: Email) => {
    setSelectedEmail(email);
    setIsDeleteDialogOpen(true);
  };

  const isAllSelected = filteredEmails.length > 0 && selectedEmails.length === filteredEmails.length;
  const isIndeterminate = selectedEmails.length > 0 && selectedEmails.length < filteredEmails.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">邮件列表</h2>
          <p className="text-gray-500 text-sm mt-1">管理系统邮件发送记录</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            导出
          </Button>
          <Button
            variant="outline"
            onClick={() => setIsDeleteDialogOpen(true)}
            disabled={selectedEmails.length === 0}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            批量删除 {selectedEmails.length > 0 && `(${selectedEmails.length})`}
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="搜索收件人ID或标题..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary transition-all"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary transition-all"
          >
            <option value="">全部类型</option>
            <option value="系统通知">系统通知</option>
            <option value="活动邮件">活动邮件</option>
            <option value="订单通知">订单通知</option>
            <option value="营销邮件">营销邮件</option>
          </select>
        </div>
      </div>

      {/* Emails Table */}
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">收件人ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">类型</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">时间</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">标题</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">内容</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredEmails.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-gray-500 bg-gray-50">
                  暂无数据
                </td>
              </tr>
            ) : (
              filteredEmails.map((email) => (
                <tr key={email.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedEmails.includes(email.id)}
                      onChange={(e) => handleSelectOne(email.id, e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300"
                    />
                  </td>
                  <td className="px-6 py-4 font-mono text-sm">{email.recipientId}</td>
                  <td className="px-6 py-4 text-gray-600">{email.type}</td>
                  <td className="px-6 py-4 text-gray-600 text-sm">{email.time}</td>
                  <td className="px-6 py-4">
                    <p className="line-clamp-1 max-w-xs">{email.title}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="line-clamp-1 max-w-xs text-gray-600">{email.content}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => openViewDialog(email)} className="hover:bg-blue-50 hover:text-blue-500">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => openDeleteDialog(email)} className="hover:bg-red-50 hover:text-red-500">
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-gray-500 text-sm">每页显示:</span>
          <select
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
            className="px-2 py-1 border rounded text-sm"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled={currentPage === 1}>上一页</Button>
          <span className="px-4 py-2 text-sm text-gray-600">第{currentPage}页</span>
          <Button variant="outline" size="sm" disabled>下一页</Button>
        </div>
      </div>

      {/* View Dialog */}
      {selectedEmail && isViewDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsViewDialogOpen(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg animate-scale-in">
            <div className="p-6">
              <h3 className="text-lg font-bold mb-4">邮件详情</h3>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-500">收件人ID</span>
                  <span className="font-mono">{selectedEmail.recipientId}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-500">类型</span>
                  <span>{selectedEmail.type}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-500">时间</span>
                  <span>{selectedEmail.time}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-500">标题</span>
                  <span>{selectedEmail.title}</span>
                </div>
                <div className="py-2">
                  <span className="text-gray-500 block mb-2">内容</span>
                  <p className="text-gray-800 whitespace-pre-wrap">{selectedEmail.content}</p>
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
        onClose={() => { setIsDeleteDialogOpen(false); setSelectedEmail(null); }}
        onConfirm={selectedEmail ? handleDeleteOne : handleBatchDelete}
        title="确认删除"
        message={selectedEmail ? `确认删除该邮件？` : `确认删除选中的 ${selectedEmails.length} 封邮件？`}
        confirmText="确认删除"
        cancelText="取消"
        variant="danger"
        loading={deleteLoading}
      />
    </div>
  );
}
