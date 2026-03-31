import React, { useState } from 'react'
import { Bell, HelpCircle, Star, Settings, Gift, FileText, ChevronRight, Circle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface NotificationItem {
  id: string
  title: string
  content: string
  time: string
  isRead: boolean
  type: 'announcement' | 'activity' | 'order' | 'system'
}

interface SecretaryPanelProps {
  onClose?: () => void
}

/**
 * 小秘书悬浮窗内容面板 - 商城专属设计
 * 文档规范：左侧蓝点+标题+灰字、点击标记已读、角标实时更新
 */
export default function SecretaryPanel({ onClose }: SecretaryPanelProps) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    { id: '1', title: '新活动上线通知', content: '春季大促活动火热进行中...', time: '10分钟前', isRead: false, type: 'activity' },
    { id: '2', title: '订单状态变更', content: '您的订单已发货，请注意查收', time: '1小时前', isRead: false, type: 'order' },
    { id: '3', title: '系统升级公告', content: '平台将于今晚进行系统升级...', time: '昨天', isRead: true, type: 'announcement' },
    { id: '4', title: '积分即将过期', content: '您有500积分将于下周过期', time: '3天前', isRead: true, type: 'system' },
  ])

  const unreadCount = notifications.filter(n => !n.isRead).length

  // 标记单条已读
  const handleMarkAsRead = (id: string) => {
    setNotifications(notifications.map(n =>
      n.id === id ? { ...n, isRead: true } : n
    ))
  }

  // 全部标记已读
  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })))
  }

  const typeColors = {
    announcement: 'bg-blue-100 text-blue-600',
    activity: 'bg-purple-100 text-purple-600',
    order: 'bg-orange-100 text-orange-600',
    system: 'bg-gray-100 text-gray-600',
  }

  const typeLabels = {
    announcement: '公告',
    activity: '活动',
    order: '订单',
    system: '系统',
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* 头部 - 带未读数角标 */}
      <div className="px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            <span className="font-semibold">小秘书</span>
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="text-xs text-white/80 hover:text-white"
            >
              全部已读
            </button>
          )}
        </div>
      </div>

      {/* 快捷功能入口 */}
      <div className="px-4 py-3 border-b border-gray-100">
        <div className="grid grid-cols-4 gap-2">
          {[
            { icon: <HelpCircle className="w-5 h-5" />, label: '使用帮助', color: 'text-blue-500', bg: 'bg-blue-50' },
            { icon: <Star className="w-5 h-5" />, label: '我的收藏', color: 'text-yellow-500', bg: 'bg-yellow-50' },
            { icon: <Gift className="w-5 h-5" />, label: '优惠券', color: 'text-red-500', bg: 'bg-red-50' },
            { icon: <FileText className="w-5 h-5" />, label: '交易记录', color: 'text-green-500', bg: 'bg-green-50' },
          ].map((item, index) => (
            <button
              key={index}
              onClick={onClose}
              className={cn(
                'flex flex-col items-center p-2 rounded-lg transition-colors',
                item.bg,
                'hover:opacity-80 active:scale-95'
              )}
            >
              <span className={item.color}>{item.icon}</span>
              <span className="text-xs text-gray-600 mt-1">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 消息列表 - 按文档规范：左侧蓝点+标题+灰字 */}
      <div className="flex-1 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 py-12">
            <Bell className="w-12 h-12 mb-2 opacity-30" />
            <p className="text-sm">暂无新消息</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {notifications.map((item) => (
              <div
                key={item.id}
                onClick={() => handleMarkAsRead(item.id)}
                className={cn(
                  'px-4 py-3 cursor-pointer transition-colors',
                  !item.isRead ? 'bg-blue-50/50 hover:bg-blue-50' : 'hover:bg-gray-50'
                )}
              >
                <div className="flex items-start gap-3">
                  {/* 未读指示器 */}
                  <div className="pt-1.5 flex-shrink-0">
                    {!item.isRead ? (
                      <span className="w-2 h-2 bg-blue-500 rounded-full block" />
                    ) : (
                      <Circle className="w-2 h-2 text-gray-300 fill-gray-300" />
                    )}
                  </div>

                  {/* 内容 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={cn('text-xs px-2 py-0.5 rounded-full', typeColors[item.type])}>
                        {typeLabels[item.type]}
                      </span>
                      <span className={cn(
                        'text-sm font-medium truncate',
                        item.isRead ? 'text-gray-500' : 'text-gray-800'
                      )}>
                        {item.title}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 line-clamp-1">{item.content}</p>
                    <p className="text-xs text-gray-400 mt-1">{item.time}</p>
                  </div>

                  <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0 mt-1" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 底部操作栏 */}
      <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
          >
            查看全部
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-2 bg-purple-500 text-white text-sm rounded-lg hover:bg-purple-600 transition-colors"
          >
            联系客服
          </button>
        </div>
      </div>
    </div>
  )
}
