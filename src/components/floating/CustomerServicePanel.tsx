import React, { useState } from 'react'
import { MessageCircle, Send, User, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ChatMessage {
  id: string
  type: 'user' | 'service'
  content: string
  time: string
}

interface CustomerServicePanelProps {
  onClose: () => void
}

/**
 * 客服悬浮窗内容面板
 */
export default function CustomerServicePanel({ onClose }: CustomerServicePanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'service',
      content: '您好！我是在线客服，请问有什么可以帮助您的？',
      time: '10:30',
    },
  ])
  const [inputValue, setInputValue] = useState('')

  const handleSend = () => {
    if (!inputValue.trim()) return

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
    }

    setMessages([...messages, newMessage])
    setInputValue('')

    // 模拟客服回复
    setTimeout(() => {
      const replyMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'service',
        content: '感谢您的留言，客服正在处理中，请稍候...',
        time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
      }
      setMessages(prev => [...prev, replyMessage])
    }, 1500)
  }

  return (
    <div className="flex flex-col h-full">
      {/* 客服状态 */}
      <div className="px-4 py-3 bg-green-50 border-b border-green-100">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-sm text-green-700 font-medium">在线客服</span>
        </div>
      </div>

      {/* 消息列表 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              'flex gap-2',
              msg.type === 'user' && 'justify-end'
            )}
          >
            {msg.type === 'service' && (
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-white" />
              </div>
            )}
            <div
              className={cn(
                'max-w-[80%] px-3 py-2 rounded-lg text-sm',
                msg.type === 'service'
                  ? 'bg-gray-100 text-gray-800'
                  : 'bg-green-500 text-white'
              )}
            >
              <p>{msg.content}</p>
              <p className={cn('text-xs mt-1', msg.type === 'user' ? 'text-green-100' : 'text-gray-400')}>
                {msg.time}
              </p>
            </div>
            {msg.type === 'user' && (
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-white" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 输入框 */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="输入消息..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
          />
          <button
            onClick={handleSend}
            disabled={!inputValue.trim()}
            className={cn(
              'px-4 py-2 bg-green-500 text-white rounded-lg',
              'hover:bg-green-600 transition-colors',
              'disabled:opacity-50 disabled:cursor-not-allowed'
            )}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 常见问题 */}
      <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
        <p className="text-xs text-gray-500 mb-2">常见问题</p>
        <div className="flex flex-wrap gap-2">
          {['订单查询', '退款退货', '配送问题', '支付问题'].map((q) => (
            <button
              key={q}
              onClick={() => setInputValue(q)}
              className="px-2 py-1 text-xs bg-white border border-gray-200 rounded-full hover:bg-gray-50"
            >
              {q}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// 导出图标组件供 FloatingWindow 使用
export const CustomerServiceIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
)
