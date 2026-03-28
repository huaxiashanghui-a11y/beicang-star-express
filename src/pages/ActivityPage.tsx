import React from 'react';
import { Link } from 'react-router-dom';
import { Gift, Zap, Percent, Clock, TrendingUp, Star, ChevronRight, Timer } from 'lucide-react';

const activities = [
  {
    id: '1',
    type: 'flash',
    title: '限时秒杀',
    subtitle: '爆款直降80%',
    icon: Zap,
    gradient: 'from-orange-500 to-red-500',
    bgImage: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&h=400&fit=crop',
    endTime: '02:35:20',
    tag: '限时',
  },
  {
    id: '2',
    type: 'discount',
    title: '新人专享',
    subtitle: '首单立减100元',
    icon: Percent,
    gradient: 'from-blue-500 to-purple-500',
    bgImage: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=400&fit=crop',
    endTime: null,
    tag: '新用户',
  },
  {
    id: '3',
    type: 'gift',
    title: '邀请有礼',
    subtitle: '邀请好友各得50元',
    icon: Gift,
    gradient: 'from-green-500 to-teal-500',
    bgImage: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&h=400&fit=crop',
    endTime: null,
    tag: '邀请',
  },
  {
    id: '4',
    type: 'points',
    title: '积分兑换',
    subtitle: '100积分抵1元',
    icon: Star,
    gradient: 'from-yellow-500 to-orange-500',
    bgImage: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&h=400&fit=crop',
    endTime: null,
    tag: '积分',
  },
];

const hotProducts = [
  {
    id: '1',
    name: 'iPhone 15 Pro Max',
    price: 8999,
    originalPrice: 9999,
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=200&h=200&fit=crop',
    sold: 1256,
  },
  {
    id: '2',
    name: 'MacBook Pro 14',
    price: 12999,
    originalPrice: 14999,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=200&h=200&fit=crop',
    sold: 892,
  },
  {
    id: '3',
    name: 'AirPods Pro 2',
    price: 1699,
    originalPrice: 1999,
    image: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=200&h=200&fit=crop',
    sold: 2341,
  },
  {
    id: '4',
    name: 'iPad Pro 12.9',
    price: 7999,
    originalPrice: 8999,
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=200&h=200&fit=crop',
    sold: 756,
  },
];

export default function ActivityPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-6">
        <h1 className="text-2xl font-bold mb-1">活动中心</h1>
        <p className="text-orange-100 text-sm">惊喜优惠 不容错过</p>
      </div>

      {/* Featured Activity */}
      <div className="px-4 -mt-4">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="relative h-40 bg-gradient-to-r from-orange-500 to-red-500 p-4">
            <img
              src={activities[0].bgImage}
              alt=""
              className="absolute inset-0 w-full h-full object-cover opacity-30"
            />
            <div className="relative z-10 h-full flex flex-col justify-between">
              <div className="flex items-center gap-2">
                <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium">
                  <Zap className="w-3 h-3 inline mr-1" />
                  {activities[0].tag}
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">{activities[0].title}</h2>
                <p className="text-orange-100 text-sm mb-2">{activities[0].subtitle}</p>
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-lg inline-flex">
                  <Clock className="w-4 h-4 text-white" />
                  <span className="text-white font-mono font-bold">{activities[0].endTime}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Grid */}
      <div className="px-4 mt-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">热门活动</h3>
        <div className="grid grid-cols-2 gap-4">
          {activities.slice(1).map((activity) => {
            const Icon = activity.icon;
            return (
              <div
                key={activity.id}
                className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className={`h-24 bg-gradient-to-br ${activity.gradient} p-3 relative`}>
                  <div className="absolute top-2 right-2 bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded text-xs text-white">
                    {activity.tag}
                  </div>
                  <Icon className="w-8 h-8 text-white mb-2" />
                  <h4 className="text-white font-bold text-sm">{activity.title}</h4>
                </div>
                <div className="p-3">
                  <p className="text-gray-600 text-xs mb-2">{activity.subtitle}</p>
                  <button className="w-full py-1.5 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-medium rounded-lg hover:opacity-90 transition-opacity">
                    立即参与
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Flash Sale Products */}
      <div className="px-4 mt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <Zap className="w-5 h-5 text-orange-500" />
            限时秒杀
          </h3>
          <Link className="text-orange-500 text-sm flex items-center gap-1">
            查看更多 <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {hotProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-32 object-cover"
                />
                <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded">
                  秒杀
                </div>
              </div>
              <div className="p-3">
                <h4 className="text-sm font-medium text-gray-800 mb-1 line-clamp-2">
                  {product.name}
                </h4>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg font-bold text-red-500">¥{product.price}</span>
                  <span className="text-xs text-gray-400 line-through">¥{product.originalPrice}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">已售 {product.sold}</span>
                  <Link
                    to={`/product/${product.id}`}
                    className="text-xs bg-orange-500 text-white px-3 py-1 rounded-full hover:bg-orange-600 transition-colors"
                  >
                    抢购
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Statistics Banner */}
      <div className="px-4 mt-6 mb-4">
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-100 mb-1">今日活动参与人数</p>
              <p className="text-2xl font-bold">12,856</p>
            </div>
            <div className="flex items-center gap-1 text-green-300">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm">+15.3%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
