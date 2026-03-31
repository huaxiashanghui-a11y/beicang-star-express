import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Search, MapPin, Clock, Package, ShoppingBag, Truck, Car, Wrench, Home,
  Trash2, ChevronRight, Bell, CheckCircle, CreditCard, FileText, Users
} from 'lucide-react'
import { cn } from '@/lib/utils'

// 顶部快捷入口
const topQuickEntries = [
  {
    id: 'express',
    title: '代取快递',
    subtitle: '送货上门，帮取包裹',
    icon: Package,
    color: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-50'
  },
  {
    id: 'buy',
    title: '帮我买',
    subtitle: '随叫随到',
    icon: ShoppingBag,
    color: 'from-purple-500 to-pink-500',
    bgColor: 'bg-purple-50'
  },
]

// 服务分类
const serviceCategories = [
  { id: 'go', label: '帮我去', icon: Users, color: 'bg-blue-500' },
  { id: 'send', label: '帮我送', icon: Truck, color: 'bg-green-500' },
  { id: 'express', label: '代取快递', icon: Package, color: 'bg-orange-500' },
  { id: 'drive', label: '代驾服务', icon: Car, color: 'bg-red-500' },
]

// 更多服务
const moreServices = [
  { id: 'store', label: '代取店铺', icon: ShoppingBag, color: 'bg-purple-100', textColor: 'text-purple-600' },
  { id: 'home', label: '家政生活', icon: Home, color: 'bg-blue-100', textColor: 'text-blue-600' },
  { id: 'repair', label: '上门维修', icon: Wrench, color: 'bg-orange-100', textColor: 'text-orange-600' },
  { id: 'recycle', label: '上门回收', icon: Trash2, color: 'bg-green-100', textColor: 'text-green-600' },
]

// 服务流程
const serviceSteps = [
  { icon: Search, label: '选择类型' },
  { icon: FileText, label: '填写信息' },
  { icon: CreditCard, label: '支付/下单' },
  { icon: Users, label: '携手办事' },
  { icon: CheckCircle, label: '订单完成' },
]

// 公告数据
const announcements = [
  { title: '帮我去', tag: '支持预约', tagColor: 'bg-green-500' },
  { title: '帮我送', tag: '支持预约', tagColor: 'bg-green-500' },
  { title: '代取快递', tag: '支持预约', tagColor: 'bg-green-500' },
  { title: '代驾服务', tag: '支持预约', tagColor: 'bg-green-500' },
]

export default function ErrandsPage() {
  const navigate = useNavigate()
  const [searchText, setSearchText] = useState('')

  const handleServiceClick = (serviceId: string) => {
    navigate(`/errands/${serviceId}`)
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* 顶部搜索区域 - 紫色渐变 */}
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
          <button className="p-3 bg-white/20 rounded-full">
            <MapPin className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* 顶部快捷入口 */}
      <div className="px-4 -mt-4">
        <div className="bg-white rounded-2xl shadow-lg p-4">
          <div className="flex gap-4">
            {/* 代取快递 */}
            <div className="flex-1 bg-blue-50 rounded-xl p-3">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-1">
                    <Package className="w-4 h-4 text-blue-500" />
                    <span className="font-semibold text-blue-600">代取快递</span>
                    <ChevronRight className="w-4 h-4 text-blue-400" />
                  </div>
                  <p className="text-xs text-blue-500 mt-1">送货上门，帮取包裹</p>
                </div>
                <button
                  onClick={() => handleServiceClick('express')}
                  className="px-3 py-1 bg-blue-500 text-white text-xs rounded-full"
                >
                  去下单
                </button>
              </div>
            </div>

            {/* 帮我买 + 二手市集 */}
            <div className="flex-1 flex flex-col gap-2">
              <div className="bg-purple-50 rounded-xl p-3">
                <div className="flex items-center gap-1">
                  <ShoppingBag className="w-4 h-4 text-purple-500" />
                  <span className="font-semibold text-purple-600">帮我买</span>
                  <ChevronRight className="w-4 h-4 text-purple-400" />
                </div>
                <p className="text-xs text-purple-500 mt-0.5">随叫随到</p>
              </div>
              <div className="bg-blue-50 rounded-xl p-3">
                <div className="flex items-center gap-1">
                  <span className="font-semibold text-blue-600 text-sm">二手市集</span>
                  <ChevronRight className="w-4 h-4 text-blue-400" />
                </div>
                <p className="text-xs text-blue-500">回收！捡漏！</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 服务分类图标行 */}
      <div className="px-4 mt-4">
        <div className="bg-white rounded-2xl shadow-sm p-4">
          <div className="flex justify-around">
            {serviceCategories.map((service) => {
              const Icon = service.icon
              return (
                <button
                  key={service.id}
                  onClick={() => handleServiceClick(service.id)}
                  className="flex flex-col items-center"
                >
                  <div className={cn('w-14 h-14 rounded-full flex items-center justify-center', service.color)}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <span className="text-xs text-gray-700 mt-2 font-medium">{service.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* 更多服务入口 */}
      <div className="px-4 mt-4">
        <div className="grid grid-cols-4 gap-3">
          {moreServices.map((service) => {
            const Icon = service.icon
            return (
              <button
                key={service.id}
                onClick={() => handleServiceClick(service.id)}
                className="flex flex-col items-center p-2"
              >
                <div className={cn('w-12 h-12 rounded-full flex items-center justify-center', service.color)}>
                  <Icon className={cn('w-6 h-6', service.textColor)} />
                </div>
                <span className="text-xs text-gray-600 mt-1.5">{service.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* 通知公告 */}
      <div className="px-4 mt-4">
        <div className="bg-white rounded-2xl shadow-sm p-4">
          <div className="flex items-center gap-2 mb-3">
            <Bell className="w-5 h-5 text-purple-500" />
            <span className="font-semibold text-gray-800">通知公告</span>
          </div>
          <div className="space-y-3">
            {announcements.map((item, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <span className="text-sm text-gray-700">{item.title}</span>
                <span className={cn('px-2 py-0.5 text-xs text-white rounded', item.tagColor)}>
                  {item.tag}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 服务流程说明 */}
      <div className="px-4 mt-4">
        <div className="bg-white rounded-2xl shadow-sm p-4">
          <h3 className="font-semibold text-gray-800 mb-4">服务流程说明</h3>
          <div className="flex justify-between items-center relative">
            {serviceSteps.map((step, index) => {
              const Icon = step.icon
              return (
                <div key={index} className="flex flex-col items-center relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center">
                    <Icon className="w-6 h-6 text-purple-600" />
                  </div>
                  <span className="text-xs text-gray-600 mt-2 text-center">{step.label}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* 底部促销Banner */}
      <div className="px-4 mt-4 pb-6">
        <div className="flex gap-3">
          {/* 妇女节Banner */}
          <div className="flex-1 h-24 bg-gradient-to-r from-pink-400 to-pink-500 rounded-2xl p-3 flex items-center relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-white text-xs opacity-80">THE BEAUTIFUL REASON</p>
              <p className="text-white font-bold text-lg">妇女节</p>
              <p className="text-white text-xs">专属福利 限时抢购</p>
            </div>
            <div className="absolute right-2 bottom-2 text-4xl opacity-20">
              🎁
            </div>
          </div>

          {/* 精选套餐Banner */}
          <div className="flex-1 h-24 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-2xl p-3 flex items-center relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-white text-xs opacity-80">超优惠</p>
              <p className="text-white font-bold text-lg">精选套餐</p>
              <p className="text-white text-xs">每日更新 惊喜不断</p>
            </div>
            <div className="absolute right-2 bottom-2 text-4xl opacity-20">
              🍔
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
