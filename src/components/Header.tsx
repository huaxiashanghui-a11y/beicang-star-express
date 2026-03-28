import { Link, useLocation } from 'react-router-dom'
import { Bell, ChevronLeft, MessageCircle } from 'lucide-react'
import { useApp } from '@/context/AppContext'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import MarqueeNotice from '@/components/MarqueeNotice'

export default function Header() {
  const location = useLocation()
  const { state } = useApp()
  const unreadCount = state.notifications.filter(n => !n.isRead).length
  const isHomePage = location.pathname === '/'

  return (
    <>
      <header className={cn(
        'fixed top-0 left-0 right-0 z-40 transition-all duration-300',
        isHomePage ? 'bg-white' : 'glass border-b border-border'
      )}>
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
          {isHomePage ? (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl gradient-hero flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-sm">BC</span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-gradient">北苍星际速充</h1>
                <p className="text-[10px] text-muted-foreground">全球好物 一键速达</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to={location.pathname.includes('/product/') ? '/search' : -1 as any}>
                <Button variant="ghost" size="icon-sm" className="touch-target">
                  <ChevronLeft className="w-5 h-5" />
                </Button>
              </Link>
              <h1 className="text-base font-semibold">
                {getPageTitle(location.pathname)}
              </h1>
            </div>
          )}

          <div className="flex items-center gap-2">
            {!isHomePage && (
              <Link to="/notifications">
                <Button variant="ghost" size="icon-sm" className="touch-target relative">
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Marquee Notice - Below Header on Home Page */}
      {isHomePage && <MarqueeNotice />}
    </>
  )
}

function getPageTitle(pathname: string): string {
  if (pathname === '/cart') return '购物车'
  if (pathname === '/search') return '搜索'
  if (pathname === '/profile') return '个人中心'
  if (pathname === '/orders') return '我的订单'
  if (pathname === '/settings') return '设置'
  if (pathname === '/notifications') return '消息通知'
  if (pathname === '/addresses') return '地址管理'
  if (pathname === '/coupons') return '我的优惠券'
  if (pathname.startsWith('/order/')) return '订单详情'
  if (pathname.startsWith('/category/')) return '商品分类'
  return ''
}
