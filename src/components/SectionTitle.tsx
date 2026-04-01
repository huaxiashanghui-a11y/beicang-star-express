import { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SectionTitleProps {
  title: string
  icon?: ReactNode
  accentColor?: 'primary' | 'secondary' | 'orange' | 'blue' | 'green' | 'purple'
  showMore?: boolean
  moreText?: string
  moreHref?: string
  onMoreClick?: () => void
  className?: string
}

/**
 * 商城统一标题组件
 * - 左侧：强调线 + 图标 + 标题
 * - 右侧：查看更多（可选）
 */
export default function SectionTitle({
  title,
  icon,
  accentColor = 'primary',
  showMore = false,
  moreText = '查看更多',
  moreHref,
  onMoreClick,
  className,
}: SectionTitleProps) {
  const accentStyles = {
    primary: 'bg-primary',
    secondary: 'bg-secondary',
    orange: 'bg-orange-500',
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
  }

  const iconColors = {
    primary: 'text-primary',
    secondary: 'text-secondary',
    orange: 'text-orange-500',
    blue: 'text-blue-500',
    green: 'text-green-500',
    purple: 'text-purple-500',
  }

  const moreButtonColors = {
    primary: 'hover:text-primary',
    secondary: 'hover:text-secondary',
    orange: 'hover:text-orange-500',
    blue: 'hover:text-blue-500',
    green: 'hover:text-green-500',
    purple: 'hover:text-purple-500',
  }

  return (
    <div className={cn('flex items-center justify-between', className)}>
      {/* 标题区域 */}
      <h2 className="flex items-center gap-2 text-base sm:text-lg font-bold">
        {/* 强调线 */}
        <span className={cn('w-1 h-4 sm:h-5 rounded-full', accentStyles[accentColor])} />
        {/* 图标 */}
        {icon && <span className={iconColors[accentColor]}>{icon}</span>}
        {/* 标题文字 */}
        <span className="text-gray-900">{title}</span>
      </h2>

      {/* 查看更多 */}
      {showMore && (
        moreHref ? (
          <Link
            to={moreHref}
            className={cn(
              'flex items-center gap-1 text-xs sm:text-sm text-gray-400 transition-colors',
              moreButtonColors[accentColor]
            )}
          >
            <span>{moreText}</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        ) : onMoreClick ? (
          <button
            onClick={onMoreClick}
            className={cn(
              'flex items-center gap-1 text-xs sm:text-sm text-gray-400 transition-colors',
              moreButtonColors[accentColor]
            )}
          >
            <span>{moreText}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : null
      )}
    </div>
  )
}

/**
 * 简洁标题组件（无图标无更多）
 */
export function SimpleTitle({
  title,
  className,
}: {
  title: string
  className?: string
}) {
  return (
    <h2 className={cn('text-base sm:text-lg font-bold text-gray-900', className)}>
      {title}
    </h2>
  )
}
