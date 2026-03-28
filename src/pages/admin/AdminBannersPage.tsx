import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, Image, Eye, GripVertical, Upload, X } from 'lucide-react';
import { Button } from '../../components/ui/button';

const mockBanners = [
  {
    id: '1',
    title: '春季新品大促',
    subtitle: '全场低至5折起',
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&h=400&fit=crop',
    link: '/activity',
    linkType: '活动页',
    position: 1,
    status: '显示',
    startTime: '2024-03-01',
    endTime: '2024-03-31',
    clicks: 12580,
    gradient: 'from-orange-500 to-red-500',
  },
  {
    id: '2',
    title: '数码产品专场',
    subtitle: '苹果华为限时优惠',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=400&fit=crop',
    link: '/category/1',
    linkType: '分类页',
    position: 2,
    status: '显示',
    startTime: '2024-03-01',
    endTime: '2024-04-30',
    clicks: 8932,
    gradient: 'from-blue-500 to-purple-500',
  },
  {
    id: '3',
    title: '美妆护肤节',
    subtitle: '大牌护肤超值套装',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&h=400&fit=crop',
    link: '/category/3',
    linkType: '分类页',
    position: 3,
    status: '显示',
    startTime: '2024-03-01',
    endTime: '2024-03-31',
    clicks: 5621,
    gradient: 'from-pink-500 to-rose-500',
  },
  {
    id: '4',
    title: '邀请好友得优惠',
    subtitle: '邀请即得50元优惠券',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&h=400&fit=crop',
    link: '/activity/invite',
    linkType: '活动页',
    position: 4,
    status: '隐藏',
    startTime: '2024-02-01',
    endTime: '2024-02-29',
    clicks: 2341,
    gradient: 'from-green-500 to-teal-500',
  },
  {
    id: '5',
    title: '会员专享日',
    subtitle: 'VIP会员专属优惠',
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&h=400&fit=crop',
    link: '/profile',
    linkType: '个人中心',
    position: 5,
    status: '草稿',
    startTime: '2024-04-01',
    endTime: '2024-04-07',
    clicks: 0,
    gradient: 'from-yellow-500 to-orange-500',
  },
];

export default function AdminBannersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('全部');
  const [banners, setBanners] = useState(mockBanners);

  const filteredBanners = banners.filter(banner => {
    const matchesSearch = banner.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === '全部' || banner.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const totalClicks = banners.reduce((sum, b) => sum + b.clicks, 0);
  const activeCount = banners.filter(b => b.status === '显示').length;

  const statusConfig = {
    '显示': 'bg-green-100 text-green-700',
    '隐藏': 'bg-gray-100 text-gray-700',
    '草稿': 'bg-yellow-100 text-yellow-700',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">轮播管理</h2>
          <p className="text-gray-500 text-sm mt-1">管理首页轮播图和广告位</p>
        </div>
        <Button className="bg-gradient-to-r from-orange-500 to-blue-500">
          <Plus className="w-4 h-4 mr-2" />
          添加轮播图
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center gap-2 mb-2">
            <Image className="w-5 h-5 text-blue-500" />
            <p className="text-sm text-gray-600">轮播图总数</p>
          </div>
          <p className="text-2xl font-bold text-gray-800">{banners.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center gap-2 mb-2">
            <Eye className="w-5 h-5 text-green-500" />
            <p className="text-sm text-gray-600">正在显示</p>
          </div>
          <p className="text-2xl font-bold text-green-600">{activeCount}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center gap-2 mb-2">
            <Image className="w-5 h-5 text-orange-500" />
            <p className="text-sm text-gray-600">总点击量</p>
          </div>
          <p className="text-2xl font-bold text-orange-600">{totalClicks.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center gap-2 mb-2">
            <Image className="w-5 h-5 text-purple-500" />
            <p className="text-sm text-gray-600">平均点击率</p>
          </div>
          <p className="text-2xl font-bold text-purple-600">8.5%</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="搜索轮播图标题..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option>全部</option>
            <option>显示</option>
            <option>隐藏</option>
            <option>草稿</option>
          </select>
        </div>
      </div>

      {/* Banners Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredBanners.map((banner) => (
          <div key={banner.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
            {/* Preview */}
            <div className={`h-40 relative`}>
              <img
                src={banner.image}
                alt={banner.title}
                className="w-full h-full object-cover"
              />
              <div className={`absolute inset-0 bg-gradient-to-br ${banner.gradient} opacity-60`}></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white">
                  <h3 className="text-xl font-bold mb-1">{banner.title}</h3>
                  <p className="text-sm opacity-90">{banner.subtitle}</p>
                </div>
              </div>
              <div className="absolute top-3 right-3 flex gap-2">
                <span className={`px-2 py-1 backdrop-blur-sm rounded text-xs font-medium ${statusConfig[banner.status as keyof typeof statusConfig]}`}>
                  {banner.status}
                </span>
              </div>
              <div className="absolute top-3 left-3 flex items-center gap-1 bg-black/30 backdrop-blur-sm px-2 py-1 rounded text-white text-xs">
                <GripVertical className="w-3 h-3" />
                拖拽排序
              </div>
            </div>

            {/* Info */}
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-gray-800">{banner.title}</h4>
                  <p className="text-sm text-gray-500">排序: 第{banner.position}位</p>
                </div>
                <div className="flex gap-1">
                  <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                <div className="p-2 bg-gray-50 rounded">
                  <p className="text-gray-500 text-xs mb-1">链接类型</p>
                  <p className="font-medium text-gray-800">{banner.linkType}</p>
                </div>
                <div className="p-2 bg-gray-50 rounded">
                  <p className="text-gray-500 text-xs mb-1">点击量</p>
                  <p className="font-medium text-orange-600">{banner.clicks.toLocaleString()}</p>
                </div>
                <div className="p-2 bg-gray-50 rounded col-span-2">
                  <p className="text-gray-500 text-xs mb-1">投放时间</p>
                  <p className="font-medium text-gray-800">{banner.startTime} 至 {banner.endTime}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Eye className="w-4 h-4 mr-1" />
                  预览
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className={`flex-1 ${banner.status === '显示' ? 'text-red-600' : 'text-green-600'}`}
                >
                  {banner.status === '显示' ? '隐藏' : '显示'}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Banner Card */}
      <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-orange-500 hover:bg-orange-50 transition-colors cursor-pointer">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Plus className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="font-semibold text-gray-800 mb-2">添加新轮播图</h3>
        <p className="text-sm text-gray-500">点击上传图片，建议尺寸 1200x400</p>
      </div>
    </div>
  );
}
