import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface StickyBottomProps {
  children: React.ReactNode
  className?: string
  threshold?: number
  showShadow?: boolean
}

export default function StickyBottom({
  children,
  className = '',
  threshold = 0,
  showShadow = true
}: StickyBottomProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      // Show sticky when scrolling up or at top, hide when scrolling down quickly
      if (currentScrollY < lastScrollY || currentScrollY <= threshold) {
        setIsVisible(true)
      } else if (currentScrollY > lastScrollY && currentScrollY > 200) {
        setIsVisible(false)
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY, threshold])

  return (
    <div
      className={cn(
        'fixed bottom-16 left-0 right-0 z-40 transition-transform duration-300',
        isVisible ? 'translate-y-0' : 'translate-y-full',
        showShadow && 'safe-bottom',
        className
      )}
    >
      <div
        className={cn(
          'bg-background/95 backdrop-blur-lg border-t border-border transition-shadow duration-300',
          isVisible && showShadow && 'shadow-[0_-4px_20px_rgba(0,0,0,0.1)]'
        )}
      >
        {children}
      </div>
    </div>
  )
}

export function FloatingActionButton({
  onClick,
  icon: Icon,
  label,
  className = ''
}: {
  onClick?: () => void
  icon: React.ElementType
  label?: string
  className?: string
}) {
  const [isPressed, setIsPressed] = useState(false)

  return (
    <button
      onClick={onClick}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      onTouchStart={() => setIsPressed(true)}
      onTouchEnd={() => setIsPressed(false)}
      className={cn(
        'w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg',
        'flex items-center justify-center',
        'transition-all duration-200 active:scale-90',
        isPressed && 'scale-90 shadow-md',
        'hover:shadow-xl hover:scale-105',
        className
      )}
    >
      <Icon className="w-6 h-6" />
      {label && (
        <span className="absolute -bottom-6 text-xs text-muted-foreground whitespace-nowrap">
          {label}
        </span>
      )}
    </button>
  )
}
