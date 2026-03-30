import { cn } from "@/lib/utils"

interface CountBadgeProps {
  count: number
  max?: number
  className?: string
}

/**
 * 数字角标组件
 * 用于显示未读消息数量等
 * - 没有数量时不显示
 * - 数量超过max时显示 max+
 */
export default function CountBadge({ count, max = 99, className }: CountBadgeProps) {
  // 如果没有数量，不显示角标
  if (count <= 0) return null

  // 计算显示的数字
  const displayCount = count > max ? `${max}+` : count.toString()

  return (
    <span
      className={cn(
        'absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1',
        'bg-red-500 text-white text-[10px] font-bold',
        'rounded-full flex items-center justify-center',
        'shadow-md animate-in fade-in zoom-in duration-200',
        className
      )}
    >
      {displayCount}
    </span>
  )
}
