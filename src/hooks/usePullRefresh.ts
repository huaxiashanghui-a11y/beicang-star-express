import { useState, useEffect, useRef } from 'react'

interface UsePullRefreshOptions {
  onRefresh?: () => Promise<void>
  onLoadMore?: () => Promise<void>
  threshold?: number
  enabled?: boolean
}

export function usePullRefresh({
  onRefresh,
  onLoadMore,
  threshold = 80,
  enabled = true
}: UsePullRefreshOptions = {}) {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [pullDistance, setPullDistance] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const isPullingRef = useRef(false)
  const startYRef = useRef(0)

  useEffect(() => {
    if (!enabled) return

    const container = containerRef.current
    if (!container) return

    const handleTouchStart = (e: TouchEvent) => {
      if (window.scrollY === 0 && onRefresh) {
        isPullingRef.current = true
        startYRef.current = e.touches[0].clientY
      }
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (!isPullingRef.current || !onRefresh) return

      const currentY = e.touches[0].clientY
      const diff = currentY - startYRef.current

      if (diff > 0) {
        e.preventDefault()
        setPullDistance(Math.min(diff * 0.5, threshold * 1.5))
      }
    }

    const handleTouchEnd = async () => {
      if (!isPullingRef.current) return

      if (pullDistance >= threshold && onRefresh) {
        setIsRefreshing(true)
        try {
          await onRefresh()
        } finally {
          setIsRefreshing(false)
        }
      }

      setPullDistance(0)
      isPullingRef.current = false
    }

    container.addEventListener('touchstart', handleTouchStart, { passive: true })
    container.addEventListener('touchmove', handleTouchMove, { passive: false })
    container.addEventListener('touchend', handleTouchEnd)

    return () => {
      container.removeEventListener('touchstart', handleTouchStart)
      container.removeEventListener('touchmove', handleTouchMove)
      container.removeEventListener('touchend', handleTouchEnd)
    }
  }, [enabled, onRefresh, pullDistance, threshold])

  useEffect(() => {
    if (!enabled || !onLoadMore) return

    const handleScroll = async () => {
      const scrollTop = window.scrollY
      const documentHeight = document.documentElement.scrollHeight
      const windowHeight = window.innerHeight

      if (scrollTop + windowHeight >= documentHeight - 200) {
        if (!isLoadingMore) {
          setIsLoadingMore(true)
          try {
            await onLoadMore()
          } finally {
            setIsLoadingMore(false)
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [enabled, onLoadMore, isLoadingMore])

  return {
    containerRef,
    isRefreshing,
    isLoadingMore,
    pullDistance,
    refreshThreshold: threshold
  }
}

export function PullToRefresh({ children, ...props }: UsePullRefreshOptions & { children: React.ReactNode }) {
  const { containerRef, isRefreshing, pullDistance, refreshThreshold } = usePullRefresh(props)

  return (
    <div ref={containerRef} className="relative">
      {isRefreshing && (
        <div className="absolute top-0 left-0 right-0 h-16 flex items-center justify-center z-10">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent" />
        </div>
      )}
      {pullDistance > 0 && !isRefreshing && (
        <div
          className="absolute top-0 left-0 right-0 h-16 flex items-center justify-center z-10 transition-transform"
          style={{ transform: `translateY(${pullDistance - refreshThreshold}px)` }}
        >
          <div className="text-primary font-medium">下拉刷新</div>
        </div>
      )}
      {children}
    </div>
  )
}

export function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  }

  return (
    <div className="flex items-center justify-center py-8">
      <div className={`animate-spin rounded-full border-4 border-primary border-t-transparent ${sizeClasses[size]}`} />
    </div>
  )
}

export function LoadingMore() {
  return (
    <div className="flex items-center justify-center py-4">
      <div className="flex items-center gap-2">
        <div className="animate-spin rounded-full h-5 w-5 border-2 border-primary border-t-transparent" />
        <span className="text-sm text-muted-foreground">加载更多...</span>
      </div>
    </div>
  )
}
