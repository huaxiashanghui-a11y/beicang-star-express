import React, { useState, useEffect, useCallback, ReactNode } from 'react'
import { cn } from '@/lib/utils'
import CountBadge from './CountBadge'

interface FloatingItemProps {
  icon: ReactNode
  label: string
  count?: number
  color?: 'green' | 'orange' | 'purple' | 'white' | 'red' | 'secretary'
  isOpen?: boolean
  onClick?: () => void
  disabled?: boolean
}

const colorStyles = {
  green: 'bg-green-500 hover:bg-green-600',
  orange: 'bg-orange-500 hover:bg-orange-600',
  purple: 'bg-purple-500 hover:bg-purple-600',
  white: 'bg-white hover:bg-gray-50 border border-gray-200',
  red: 'bg-[#ff0000] hover:bg-red-600',
  secretary: 'bg-white hover:bg-gray-50 border-[1px] border-gray-200', // 商城小秘书专属样式
}

const iconColors = {
  green: 'text-white',
  orange: 'text-white',
  purple: 'text-white',
  white: 'text-gray-600',
  red: 'text-white',
  secretary: 'text-[#666666]', // 商城小秘书专属图标颜色
}

/**
 * 单个悬浮按钮组件
 * - hover: 上浮2px + 显示文字
 * - click: 缩放95%
 * - disabled: 灰色，不可点击
 */
export function FloatingItem({
  icon,
  label,
  count = 0,
  color = 'green',
  isOpen = false,
  onClick,
  disabled = false,
}: FloatingItemProps) {
  const [isPressed, setIsPressed] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={disabled ? undefined : onClick}
        onMouseEnter={() => !disabled && setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onMouseDown={() => !disabled && setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        disabled={disabled}
        className={cn(
          'relative w-12 h-12 rounded-full flex items-center justify-center',
          'transition-all duration-200 ease-out',
          'shadow-lg hover:shadow-xl',
          colorStyles[color],
          isOpen && 'ring-4 ring-white ring-offset-2',
          disabled && 'opacity-50 cursor-not-allowed',
          !disabled && !isPressed && 'hover:opacity-90',
          !disabled && isPressed && 'scale-95',
        )}
      >
        <span className={cn(iconColors[color], "scale-90")}>{icon}</span>
        <CountBadge count={count} />
      </button>

      {/* Tooltip */}
      <div
        className={cn(
          'absolute right-full mr-3 top-1/2 -translate-y-1/2',
          'px-3 py-2 bg-gray-800 text-white text-sm rounded-lg',
          'whitespace-nowrap shadow-lg',
          'transition-all duration-200',
          showTooltip && !isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2 pointer-events-none'
        )}
      >
        {label}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 border-8 border-transparent border-l-gray-800" />
      </div>
    </div>
  )
}

interface FloatingPanelProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: ReactNode
  width?: 'sm' | 'md' | 'lg'
}

const panelWidths = {
  sm: 'w-72',
  md: 'w-80',
  lg: 'w-96',
}

/**
 * 悬浮面板组件
 * - 从右侧滑入
 * - 点击遮罩或ESC关闭
 * - 阻止背景滚动
 */
export function FloatingPanel({
  isOpen,
  onClose,
  title,
  children,
  width = 'md',
}: FloatingPanelProps) {
  // ESC 关闭
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose()
    }
  }, [onClose])

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, handleKeyDown])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50">
      {/* 遮罩 */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* 面板 */}
      <div
        className={cn(
          'absolute right-0 top-0 bottom-0 bg-white shadow-2xl',
          'animate-slide-in-from-right',
          panelWidths[width],
          'flex flex-col'
        )}
      >
        {/* 头部 */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50">
          <h3 className="font-semibold text-gray-800">{title}</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors"
          >
            <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 内容 */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  )
}

interface FloatingWindowProps {
  children: ReactNode
  className?: string
}

/**
 * 悬浮窗容器组件
 * 固定在页面右下角
 */
export default function FloatingWindow({ children, className }: FloatingWindowProps) {
  return (
    <div
      className={cn(
        'fixed right-4 bottom-4 z-40',
        'flex flex-col gap-3',
        className
      )}
    >
      {children}
    </div>
  )
}
