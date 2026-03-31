import React, { useState } from 'react'
import { Search, MapPin, Clock, Package, ShoppingBag, Truck, Umbrella, Wrench, ChevronRight, Phone } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

// 跑腿服务类型
const serviceTypes = [
  { id: 'buy', icon: ShoppingBag, label: '帮买', desc: '超市、药店随叫随到', color: 'from-orange-500 to-red-500' },
  { id: 'send', icon: Truck, label: '帮送', desc: '文件、物品即时配送', color: 'from-blue-500 to-purple-500' },
  { id: 'help', icon: Umbrella, label: '帮忙', desc: '排队、代办生活琐事', color: 'from-green-500 to-teal-500' },
  { id: 'fix', icon: Wrench, label: '代办', desc: '各类行政业务代跑腿', color: 'from-yellow-500 to-orange-500' },
]

// 快速入口
const quickEntries = [
  { label: '帮我买', icon: ShoppingBag, color: 'bg-orange-500' },
  { label: '帮我送', icon: Truck, color: 'bg-blue-500' },
  { label: '帮我办', icon: Wrench, color: 'bg-green-500' },
  { label: '帮我取', icon: Package, color: 'bg-purple-500' },
]

// 附近骑手模拟数据
const nearbyRiders = [
  { id: 1, name: '张师傅', rating: 4.9, orders: 1523, distance: '0.8km', avatar: '张' },
  { id: 2, name: '李师傅', rating: 4.8, orders: 986, distance: '1.2km', avatar: '李' },
  { id: 3, name: '王师傅', rating: 4.9, orders: 2341, distance: '1.5km', avatar: '王' },
]

export default function ErrandsPage() {
  const navigate = useNavigate()
  const [searchText, setSearchText] = useState('')
  const [activeService, setActiveService] = useState<string | null>(null)

  const handleServiceClick = (serviceId: string) => {
    setActiveService(serviceId)
    // 导航到对应服务页面
    navigate(`/errands/${serviceId}`)
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* 顶部搜索区域 */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 px-4 pt-4 pb-6">
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="输入地址或搜索服务..."
              className="w-full pl-10 pr-4 py-3 bg-white rounded-full text-sm shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
            />
          </div>
        </div>

        {/* 快速入口 */}
        <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
          {quickEntries.map((entry) => {
            const Icon = entry.icon
            return (
              <button
                key={entry.label}
                onClick={() => handleServiceClick(entry.label)}
                className="flex flex-col items-center min-w-[60px]"
              >
                <div className={`w-12 h-12 ${entry.color} rounded-full flex items-center justify-center shadow-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs text-white mt-1 font-medium">{entry.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* 服务类型选择 */}
      <div className="px-4 py-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">选择服务类型</h2>
        <div className="grid grid-cols-2 gap-3">
          {serviceTypes.map((service) => {
            const Icon = service.icon
            return (
              <button
                key={service.id}
                onClick={() => handleServiceClick(service.id)}
                className={cn(
                  'p-4 rounded-xl bg-white shadow-sm border-2 transition-all',
                  activeService === service.id ? 'border-purple-500' : 'border-transparent',
                  'hover:shadow-md active:scale-98'
                )}
              >
                <div className={cn('w-12 h-12 rounded-full bg-gradient-to-br mb-3 flex items-center justify-center', service.color)}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-800">{service.label}</h3>
                <p className="text-xs text-gray-500 mt-1">{service.desc}</p>
              </button>
            )
          })}
        </div>
      </div>

      {/* 附近骑手 */}
      <div className="px-4 py-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-800">附近骑手</h2>
          <button className="text-sm text-purple-600">查看全部</button>
        </div>
        <div className="space-y-3">
          {nearbyRiders.map((rider) => (
            <div key={rider.id} className="bg-white rounded-xl p-4 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-semibold">
                {rider.avatar}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-800">{rider.name}</span>
                  <span className="text-sm text-yellow-500">★ {rider.rating}</span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">已完成 {rider.orders} 单</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">{rider.distance}</p>
                <button className="mt-1 p-1.5 bg-green-500 text-white rounded-full">
                  <Phone className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 服务说明 */}
      <div className="px-4 py-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">服务说明</h2>
        <div className="bg-white rounded-xl p-4 shadow-sm space-y-3">
          {[
            { icon: MapPin, title: '实时定位', desc: '全程追踪，安心托付' },
            { icon: Clock, title: '准时送达', desc: '超时赔付承诺' },
            { icon: Package, title: '安全保障', desc: '物品丢失全额赔付' },
          ].map((item, index) => {
            const Icon = item.icon
            return (
              <div key={index} className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-50 rounded-full flex items-center justify-center">
                  <Icon className="w-5 h-5 text-purple-500" />
                </div>
                <div>
                  <p className="font-medium text-gray-800">{item.title}</p>
                  <p className="text-xs text-gray-500">{item.desc}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* 常见问题 */}
      <div className="px-4 py-4 pb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">常见问题</h2>
        <div className="bg-white rounded-xl overflow-hidden shadow-sm">
          {['如何发布跑腿订单？', '费用如何计算？', '超时了怎么办？'].map((q, i) => (
            <div key={i} className="flex items-center justify-between px-4 py-3 border-b border-gray-100 last:border-0">
              <span className="text-sm text-gray-700">{q}</span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// 工具函数
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}
