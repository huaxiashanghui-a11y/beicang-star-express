import React, { useState } from 'react'
import { Bell, HelpCircle, Star, Settings, Gift, FileText, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface QuickAction {
  id: string
  icon: React.ReactNode
  label: string
  description: string
  color: string
  bgColor: string
}

interface Announcement {
  id: string
  title: string
  time: string
  isNew: boolean
}

interface SecretaryPanelProps {
  onClose: () => void
}

/**
 * 小秘书悬浮窗内容面板
 * 提供快捷功能入口、系统公告、使用指南等
 */
export default function SecretaryPanel({ onClose }: SecretaryPanelProps) {
  const [activeTab, setActiveTab] = useState<'home' | 'guide'>('home')

  const quickActions: QuickAction[] = [
    {
      id: 'help',
      icon: <HelpCircle className="w-5 h-5" />,
      label: '使用帮助',
      description: '了解如何操作',
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
    },
    {
      id: 'favorite',
      icon: <Star className="w-5 h-5" />,
      label: '我的收藏',
      description: '查看收藏内容',
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-50',
    },
    {
      id: 'settings',
      icon: <Settings className="w-5 h-5" />,
      label: '账号设置',
      description: '个人资料管理',
      color: 'text-gray-500',
      bgColor: 'bg-gray-50',
    },
    {
      id: 'gift',
      icon: <Gift className="w-5 h-5" />,
      label: '优惠券',
      description: '查看可用优惠',
      color: 'text-red-500',
      bgColor: 'bg-red-50',
    },
    {
      id: 'notice',
      icon: <FileText className="w-5 h-5" />,
      label: '交易记录',
      description: '查看收支明细',
      color: 'text-green-500',
      bgColor: 'bg-green-50',
    },
    {
      id: 'history',
      icon: <Bell className="w-5 h-5" />,
      label: '浏览历史',
      description: '最近浏览内容',
      color: 'text-purple-500',
      bgColor: 'bg-purple-50',
    },
  ]

  const announcements: Announcement[] = [
    { id: '1', title: '平台升级通知', time: '2024-03-15', isNew: true },
    { id: '2', title: '新增批量操作功能', time: '2024-03-10', isNew: true },
    { id: '3', title: '数据导出支持Excel格式', time: '2024-03-05', isNew: false },
    { id: '4', title: '优化搜索性能', time: '2024-03-01', isNew: false },
  ]

  const tips = [
    { title: '快捷键', content: '使用 Ctrl+K 快速搜索' },
    { title: '批量操作', content: '勾选多项后可批量编辑或删除' },
    { title: '自动保存', content: '编辑内容每30秒自动保存' },
  ]

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Tab切换 */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('home')}
          className={cn(
            'flex-1 px-4 py-3 text-sm font-medium transition-colors',
            activeTab === 'home'
              ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50/50'
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
          )}
        >
          快捷服务
        </button>
        <button
          onClick={() => setActiveTab('guide')}
          className={cn(
            'flex-1 px-4 py-3 text-sm font-medium transition-colors',
            activeTab === 'guide'
              ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50/50'
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
          )}
        >
          使用指南
        </button>
      </div>

      {activeTab === 'home' ? (
        <>
          {/* 快捷功能入口 */}
          <div className="p-4">
            <div className="grid grid-cols-3 gap-3">
              {quickActions.map((action) => (
                <button
                  key={action.id}
                  onClick={onClose}
                  className="flex flex-col items-center p-3 rounded-xl hover:bg-gray-50 transition-colors active:scale-95"
                >
                  <div className={cn('w-10 h-10 rounded-full flex items-center justify-center mb-2', action.bgColor)}>
                    <span className={action.color}>{action.icon}</span>
                  </div>
                  <span className="text-xs text-gray-700 font-medium">{action.label}</span>
                  <span className="text-xs text-gray-400 mt-0.5">{action.description}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 系统公告 */}
          <div className="px-4 pb-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-purple-500" />
                <span className="text-sm font-medium text-gray-800">系统公告</span>
              </div>
              <button className="text-xs text-purple-600 hover:text-purple-700">查看全部</button>
            </div>
            <div className="space-y-2">
              {announcements.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    {item.isNew && (
                      <span className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0" />
                    )}
                    <span className="text-sm text-gray-700 truncate">{item.title}</span>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-xs text-gray-400">{item.time}</span>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <>
          {/* 使用指南 */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-4">
              {/* 基础操作 */}
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-4">
                <h4 className="text-sm font-medium text-purple-800 mb-2">基础操作</h4>
                <ul className="space-y-2 text-xs text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-purple-500 mt-0.5">1.</span>
                    <span>点击左侧菜单进入各功能模块</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-500 mt-0.5">2.</span>
                    <span>使用顶部搜索框快速查找内容</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-500 mt-0.5">3.</span>
                    <span>双击列表项可快速编辑</span>
                  </li>
                </ul>
              </div>

              {/* 功能提示 */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="text-sm font-medium text-gray-800 mb-3">实用技巧</h4>
                <div className="space-y-3">
                  {tips.map((tip, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs text-purple-600 font-medium">{index + 1}</span>
                      </div>
                      <div>
                        <span className="text-xs font-medium text-gray-700">{tip.title}: </span>
                        <span className="text-xs text-gray-500">{tip.content}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* FAQ */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="text-sm font-medium text-gray-800 mb-3">常见问题</h4>
                <div className="space-y-2">
                  {[
                    '如何导出数据报表？',
                    '批量上传失败怎么办？',
                    '如何设置消息提醒？',
                  ].map((question, index) => (
                    <button
                      key={index}
                      onClick={onClose}
                      className="w-full text-left px-3 py-2 text-xs text-gray-600 hover:bg-gray-100 rounded-lg transition-colors flex items-center justify-between group"
                    >
                      <span>{question}</span>
                      <ChevronRight className="w-3 h-3 text-gray-400 group-hover:text-gray-600" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 联系客服 */}
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="w-full py-2.5 px-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
            >
              联系在线客服
            </button>
          </div>
        </>
      )}
    </div>
  )
}

// 导出图标组件
export const SecretaryIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
  </svg>
)
