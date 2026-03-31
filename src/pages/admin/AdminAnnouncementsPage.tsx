import React, { useState } from 'react';
import { Plus, Edit, Trash2, Volume2, Eye } from 'lucide-react';
import { Button } from '../../components/ui/button';

export default function AdminAnnouncementsPage() {
  const [announcements] = useState([
    { id: 'A001', title: '春节期间配送延迟通知', type: '系统', status: '已发布', views: 1234, date: '2024-02-01' },
    { id: 'A002', title: '新用户首单立减活动', type: '活动', status: '已发布', views: 2345, date: '2024-02-05' },
    { id: 'A003', title: '商品上新通知', type: '商品', status: '已发布', views: 876, date: '2024-02-10' },
    { id: 'A004', title: '系统维护公告', type: '系统', status: '草稿', views: 0, date: '2024-02-15' },
    { id: 'A005', title: '会员权益升级', type: '会员', status: '已发布', views: 1567, date: '2024-02-20' },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">公告管理</h2>
          <p className="text-gray-500 text-sm mt-1">发布和管理平台公告</p>
        </div>
        <Button><Plus className="w-4 h-4 mr-2" />发布公告</Button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Volume2 className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{announcements.length}</p>
              <p className="text-gray-500 text-sm">全部公告</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-500 text-xl">✓</div>
            <div>
              <p className="text-2xl font-bold">{announcements.filter(a => a.status === '已发布').length}</p>
              <p className="text-gray-500 text-sm">已发布</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-orange-500 text-xl">📝</div>
            <div>
              <p className="text-2xl font-bold">{announcements.filter(a => a.status === '草稿').length}</p>
              <p className="text-gray-500 text-sm">草稿</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Eye className="w-6 h-6 text-purple-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{announcements.reduce((sum, a) => sum + a.views, 0).toLocaleString()}</p>
              <p className="text-gray-500 text-sm">总浏览</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-4 shadow-sm">
        <input type="text" placeholder="搜索公告标题..." className="w-full px-4 py-2 border border-gray-200 rounded-lg" />
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">标题</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">类型</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">状态</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">浏览量</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">发布时间</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {announcements.map((ann) => (
              <tr key={ann.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium">{ann.title}</td>
                <td className="px-6 py-4"><span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">{ann.type}</span></td>
                <td className="px-6 py-4"><span className={`px-3 py-1 text-xs font-medium rounded-full ${ann.status === '已发布' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>{ann.status}</span></td>
                <td className="px-6 py-4 text-gray-600">{ann.views.toLocaleString()}</td>
                <td className="px-6 py-4 text-gray-600">{ann.date}</td>
                <td className="px-6 py-4"><div className="flex gap-2"><Button variant="ghost" size="sm"><Eye className="w-4 h-4" /></Button><Button variant="ghost" size="sm"><Edit className="w-4 h-4" /></Button><Button variant="ghost" size="sm"><Trash2 className="w-4 h-4 text-red-500" /></Button></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
