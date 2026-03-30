import React, { useState, useEffect } from 'react'
import { Gift, X } from 'lucide-react'
import { FloatingItem, FloatingPanel } from '@/components/ui/FloatingWindow'
import { cn } from '@/lib/utils'
import CustomerServicePanel, { CustomerServiceIcon } from './CustomerServicePanel'
import CartPanel, { CartIcon } from './CartPanel'
import MessagePanel, { MessageIcon } from './MessagePanel'
import SecretaryPanel, { SecretaryIcon } from './SecretaryPanel'

type FloatingType = 'customerService' | 'cart' | 'message' | 'secretary' | 'gift' | null

interface FloatingWindowsProps {
  cartCount?: number
  messageCount?: number
}

/**
 * 福利面板组件
 */
function GiftPanel({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 bg-purple-50 border-b border-purple-100">
        <div className="flex items-center gap-2">
          <Gift className="w-5 h-5 text-purple-500" />
          <span className="font-medium text-gray-800">福利中心</span>
        </div>
      </div>
      <div className="flex-1 p-4 overflow-y-auto">
        <p className="text-sm text-gray-600 mb-4">专属福利 限时领取</p>
        <div className="grid grid-cols-2 gap-3">
          {[
            { title: '新人礼包', desc: '价值500元', color: 'from-orange-500 to-red-500' },
            { title: '邀请有礼', desc: '各得50元', color: 'from-blue-500 to-purple-500' },
            { title: '积分兑换', desc: '100抵1元', color: 'from-yellow-500 to-orange-500' },
            { title: '每日抽奖', desc: 'iphone等你', color: 'from-green-500 to-teal-500' },
          ].map((item, index) => (
            <button
              key={index}
              onClick={onClose}
              className={`p-4 bg-gradient-to-br ${item.color} rounded-xl text-white text-center shadow-md hover:shadow-lg transition-shadow`}
            >
              <p className="font-semibold text-sm">{item.title}</p>
              <p className="text-xs opacity-90 mt-1">{item.desc}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

/**
 * 悬浮窗容器组件 - 统一竖立排列
 * 整合客服、购物车、福利、私信、小秘书五个悬浮窗
 */
export default function FloatingWindows({ cartCount = 0, messageCount = 0 }: FloatingWindowsProps) {
  const [activePanel, setActivePanel] = useState<FloatingType>(null)

  // ESC 键关闭
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && activePanel) {
        setActivePanel(null)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activePanel])

  // 打开面板时阻止背景滚动
  useEffect(() => {
    if (activePanel) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [activePanel])

  const handleToggle = (panel: FloatingType) => {
    setActivePanel(prev => prev === panel ? null : panel)
  }

  const handleClose = () => {
    setActivePanel(null)
  }

  const isAnyPanelOpen = activePanel !== null

  return (
    <>
      {/* 悬浮按钮组 - 固定在右下角，竖立排列 */}
      <div className="fixed right-4 bottom-20 z-50 flex flex-col gap-4">
        {/* 客服 */}
        <FloatingItem
          icon={<CustomerServiceIcon />}
          label="客服"
          color="green"
          isOpen={activePanel === 'customerService'}
          onClick={() => handleToggle('customerService')}
          disabled={isAnyPanelOpen && activePanel !== 'customerService'}
        />

        {/* 购物车 */}
        <FloatingItem
          icon={<CartIcon />}
          label="购物车"
          count={cartCount}
          color="orange"
          isOpen={activePanel === 'cart'}
          onClick={() => handleToggle('cart')}
          disabled={isAnyPanelOpen && activePanel !== 'cart'}
        />

        {/* 福利 */}
        <FloatingItem
          icon={<Gift className="w-6 h-6" />}
          label="福利"
          color="purple"
          isOpen={activePanel === 'gift'}
          onClick={() => handleToggle('gift')}
          disabled={isAnyPanelOpen && activePanel !== 'gift'}
        />

        {/* 私信 */}
        <FloatingItem
          icon={<MessageIcon />}
          label="私信"
          count={messageCount}
          color="purple"
          isOpen={activePanel === 'message'}
          onClick={() => handleToggle('message')}
          disabled={isAnyPanelOpen && activePanel !== 'message'}
        />

        {/* 小秘书 */}
        <FloatingItem
          icon={<SecretaryIcon />}
          label="小秘书"
          color="red"
          isOpen={activePanel === 'secretary'}
          onClick={() => handleToggle('secretary')}
          disabled={isAnyPanelOpen && activePanel !== 'secretary'}
        />
      </div>

      {/* 客服面板 */}
      <FloatingPanel
        isOpen={activePanel === 'customerService'}
        onClose={handleClose}
        title="在线客服"
        width="md"
      >
        <CustomerServicePanel onClose={handleClose} />
      </FloatingPanel>

      {/* 购物车面板 */}
      <FloatingPanel
        isOpen={activePanel === 'cart'}
        onClose={handleClose}
        title="购物车"
        width="md"
      >
        <CartPanel onClose={handleClose} />
      </FloatingPanel>

      {/* 福利面板 */}
      <FloatingPanel
        isOpen={activePanel === 'gift'}
        onClose={handleClose}
        title="福利中心"
        width="md"
      >
        <GiftPanel onClose={handleClose} />
      </FloatingPanel>

      {/* 消息面板 */}
      <FloatingPanel
        isOpen={activePanel === 'message'}
        onClose={handleClose}
        title="我的消息"
        width="md"
      >
        <MessagePanel onClose={handleClose} />
      </FloatingPanel>

      {/* 小秘书面板 */}
      <FloatingPanel
        isOpen={activePanel === 'secretary'}
        onClose={handleClose}
        title="小秘书"
        width="md"
      >
        <SecretaryPanel onClose={handleClose} />
      </FloatingPanel>
    </>
  )
}
