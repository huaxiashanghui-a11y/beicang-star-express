import { Link, useLocation } from 'react-router-dom'
import { Home, Search, ShoppingCart, User, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useApp } from '@/context/AppContext'

const tabs = [
  { path: '/', icon: Home, label: '首页' },
  { path: '/search', icon: Search, label: '搜索' },
  { path: '/activity', icon: Zap, label: '活动', isSpecial: true },
  { path: '/cart', icon: ShoppingCart, label: '购物车' },
  { path: '/profile', icon: User, label: '我的' },
]

export default function TabBar() {
  const location = useLocation()
  const { state } = useApp()
  const cartCount = state.cart.reduce((sum, item) => sum + (item.selected ? item.quantity : 0), 0)

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-border safe-bottom">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path
          const Icon = tab.icon
          const showBadge = tab.path === '/cart' && cartCount > 0
          const isSpecial = tab.isSpecial

          return (
            <Link
              key={tab.path}
              to={tab.path}
              className={cn(
                'flex flex-col items-center justify-center flex-1 h-full transition-all duration-200 relative touch-punch',
                isActive ? 'text-primary' : isSpecial ? 'text-white' : 'text-muted-foreground',
                'active:scale-90'
              )}
            >
              {isSpecial ? (
                <div className="relative -mt-5">
                  <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-lg animate-bounce-in border-[3px] border-white">
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-[10px] font-bold text-orange-600 bg-white px-1.5 py-0.5 rounded-full shadow-md whitespace-nowrap">
                    活动
                  </span>
                </div>
              ) : (
                <>
                  <div className="relative">
                    <Icon className={cn('w-6 h-6 transition-transform', isActive && 'scale-110')} />
                    {showBadge && (
                      <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center animate-bounce-in">
                        {cartCount > 9 ? '9+' : cartCount}
                      </span>
                    )}
                  </div>
                  <span className={cn('text-xs mt-1 font-medium', isActive && 'text-primary')}>
                    {tab.label}
                  </span>
                  {isActive && (
                    <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-primary rounded-full" />
                  )}
                </>
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
