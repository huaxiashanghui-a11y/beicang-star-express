import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, Volume2, Clock, Eye, Pin, MessageCircle } from 'lucide-react';
import { Button } from '../../components/ui/button';

const mockAnnouncements = [
  {
    id: '1',
    title: '春节期间配送时间调整通知',
    content: '亲爱的用户，春节期间（2月9日-2月17日）配送时间将有所调整，部分地区可能出现延迟，感谢您的理解与支持。',
    type: 'important',
    typeName: '重要',
    author: '管理员',
    createdAt: '2024-03-20 10:00',
    views: 12580,
    status: '已发布',
    isPinned: true,
  },
  {
    id: '2',
    title: '新用户注册即送100元优惠券',
    content: '为庆祝平台上线三周年，新用户注册即可获得100元新人礼包，包含多张优惠券，欢迎体验！',
    type: 'promotion',
    typeName: '促销',
    author: '运营部',
    createdAt: '2024-03-19 15:30',
    views: 8932,
    status: '已发布',
    isPinned: true,
  },
  {
    id: '3',
    title: '平台系统维护通知',
    content: '平台将于3月25日凌晨2:00-6:00进行系统升级维护，期间部分功能可能无法使用，给您带来不便敬请谅解。',
    type: 'system',
    typeName: '系统',
    author: '技术部',
    createdAt: '2024-03-18 09:00',
    views: 5621,
    status: '已发布',
    isPinned: false,
  },
  {
    id: '4',
    title: '商品退换货政策更新',
    content: '为提升用户体验，我们优化了退换货流程，现在支持7天无理由退换货，具体政策请查看帮助中心。',
    type: 'policy',
    typeName: '政策',
    author: '客服部',
    createdAt: '2024-03-15 14:20',
    views: 3245,
    status: '已发布',
    isPinned: false,
  },
  {
    id: '5',
    title: '清明节优惠活动公告',
    content: '清明节期间（4月4日-4月6日）全场商品8折起，欢迎选购！',
    type: 'promotion',
    typeName: '促销',
    author: '运营部',
    createdAt: '2024-03-10 11:00',
    views: 4567,
    status: '草稿',
    isPinned: false,
  },
];

const typeColors = {
  'important': 'bg-red-500',
  'promotion': 'bg-orange-500',
  'system': 'bg-blue-500',
  'policy': 'bg-green-500',
};

export default function AdminAnnouncementsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('全部');

  const filteredAnnouncements = mockAnnouncements.filter(ann => {
    const matchesSearch = ann.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === '全部' || ann.type === selectedType;
    return matchesSearch && matchesType;
  });

  const totalViews = mockAnnouncements.reduce((sum, a) => sum + a.views, 0);
  const publishedCount = mockAnnouncements.filter(a => a.status === '已发布').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">公告管理</h2>
          <p className="text-gray-500 text-sm mt-1">发布和管理平台公告</p>
        </div>
        <Button className="bg-gradient-to-r from-orange-500 to-blue-500">
          <Plus className="w-4 h-4 mr-2" />
          发布公告
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center gap-2 mb-2">
            <Volume2 className="w-5 h-5 text-blue-500" />
            <p className="text-sm text-gray-600">总公告数</p>
          </div>
          <p className="text-2xl font-bold text-gray-800">{mockAnnouncements.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center gap-2 mb-2">
            <Eye className="w-5 h-5 text-green-500" />
            <p className="text-sm text-gray-600">总浏览量</p>
          </div>
          <p className="text-2xl font-bold text-green-600">{(totalViews / 10000).toFixed(1)}万</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-5 h-5 text-orange-500" />
            <p className="text-sm text-gray-600">已发布</p>
          </div>
          <p className="text-2xl font-bold text-orange-600">{publishedCount}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center gap-2 mb-2">
            <Pin className="w-5 h-5 text-red-500" />
            <p className="text-sm text-gray-600">置顶公告</p>
          </div>
          <p className="text-2xl font-bold text-red-600">
            {mockAnnouncements.filter(a => a.isPinned).length}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="搜索公告标题..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option>全部</option>
            <option>important</option>
            <option>promotion</option>
            <option>system</option>
            <option>policy</option>
          </select>
        </div>
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {filteredAnnouncements.map((announcement) => (
          <div key={announcement.id} className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 ${typeColors[announcement.type as keyof typeof typeColors]} rounded-xl flex items-center justify-center text-white text-xl`}>
                  <Volume2 className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-gray-800">{announcement.title}</h3>
                    {announcement.isPinned && (
                      <span className="px-2 py-0.5 bg-red-100 text-red-600 text-xs rounded-full flex items-center gap-1">
                        <Pin className="w-3 h-3" />
                        置顶
                      </span>
                    )}
                    <span className={`px-2 py-0.5 ${typeColors[announcement.type as keyof typeof typeColors]} text-white text-xs rounded-full`}>
                      {announcement.typeName}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                      announcement.status === '已发布' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {announcement.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{announcement.content}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {announcement.createdAt}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {announcement.views.toLocaleString()} 次浏览
                    </span>
                    <span>发布者: {announcement.author}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4 mr-1" />
                  预览
                </Button>
                <Button variant="outline" size="sm">
                  <Edit className="w-4 h-4 mr-1" />
                  编辑
                </Button>
                <Button variant="outline" size="sm" className="text-red-600 hover:bg-red-50">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
