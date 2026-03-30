import React, { useState } from 'react'
import { Mail, Check, Circle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Message {
  id: string
  title: string
  content: string
  time: string
  isRead: boolean
  type: 'system' | 'order' | 'activity'
}

interface MessagePanelProps {
  onClose: () => void
}

const typeConfig = {
  system: { label: '系统', color: 'bg-blue-100 text-blue-600' },
  order: { label: '订单', color: 'bg-orange-100 text-orange-600' },
  activity: { label: '活动', color: 'bg-purple-100 text-purple-600' },
}

/**
 * 私信悬浮窗内容面板
 */
export default function MessagePanel({ onClose }: MessagePanelProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      title: '订单已发货',
      content: '您的订单 #ORD-2024-001 已发货，快递单号：SF1234567890',
      time: '10分钟前',
      isRead: false,
      type: 'order',
    },
    {
      id: '2',
      title: '新活动上线',
      content: '春季大促活动火热进行中，全场低至5折！',
      time: '1小时前',
      isRead: false,
      type: 'activity',
    },
    {
      id: '3',
      title: '系统通知',
      content: '您的账户已成功绑定手机号',
      time: '昨天',
      isRead: true,
      type: 'system',
    },
  ])

  const unreadCount = messages.filter(m => !m.isRead).length

  const handleMarkAsRead = (id: string) => {
    setMessages(messages.map(m =>
      m.id === id ? { ...m, isRead: true } : m
    ))
  }

  const handleMarkAllAsRead = () => {
    setMessages(messages.map(m => ({ ...m, isRead: true })))
  }

  return (
    <div className="flex flex-col h-full">
      {/* 头部 */}
      <div className="px-4 py-3 bg-purple-50 border-b border-purple-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-purple-500" />
            <span className="font-medium text-gray-800">我的消息</span>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="text-xs text-purple-600 hover:text-purple-700"
            >
              全部已读
            </button>
          )}
        </div>
      </div>

      {/* 消息列表 */}
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <Mail className="w-16 h-16 mb-3 opacity-30" />
            <p>暂无消息</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {messages.map((msg) => (
              <div
                key={msg.id}
                onClick={() => handleMarkAsRead(msg.id)}
                className={cn(
                  'p-4 cursor-pointer hover:bg-gray-50 transition-colors',
                  !msg.isRead && 'bg-blue-50/50'
                )}
              >
                <div className="flex items-start gap-3">
                  {/* 未读指示器 */}
                  <div className="pt-1">
                    {msg.isRead ? (
                      <Check className="w-4 h-4 text-gray-300" />
                    ) : (
                      <Circle className="w-4 h-4 text-blue-500 fill-blue-500" />
                    )}
                  </div>

                  {/* 内容 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={cn(
                        'text-xs px-2 py-0.5 rounded-full',
                        typeConfig[msg.type].color
                      )}>
                        {typeConfig[msg.type].label}
                      </span>
                      <span className={cn(
                        'text-sm font-medium truncate',
                        msg.isRead ? 'text-gray-600' : 'text-gray-800'
                      )}>
                        {msg.title}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 line-clamp-2">{msg.content}</p>
                    <p className="text-xs text-gray-400 mt-1">{msg.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 底部 */}
      <div className="p-3 border-t border-gray-200 bg-gray-50">
        <button
          onClick={onClose}
          className="w-full py-2 text-sm text-center text-purple-600 hover:text-purple-700"
        >
          查看全部消息
        </button>
      </div>
    </div>
  )
}

// 导出图标组件
export const MessageIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
)
