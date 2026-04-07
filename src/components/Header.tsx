import { Link, useLocation } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { Bell, ChevronLeft, MessageCircle, User, Phone, HelpCircle, FileText, Search } from 'lucide-react'
import { useApp } from '@/context/AppContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { useState } from 'react'

export default function Header() {
  const location = useLocation()
  const navigate = useNavigate()
  const { state } = useApp()
  const unreadCount = state.notifications.filter(n => !n.isRead).length
  const isHomePage = location.pathname === '/'
  const [showContactModal, setShowContactModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  return (
    <>
      <header className={cn(
        'fixed top-0 left-0 right-0 z-40 transition-all duration-300',
        isHomePage ? 'bg-white' : 'glass border-b border-border'
      )}>
        {/* 内容自适应屏幕：小屏铺满，大屏居中限宽 */}
        <div className="w-full px-3 sm:px-4 md:max-w-2xl lg:max-w-3xl xl:max-w-4xl mx-auto">
          {isHomePage ? (
            // 首页顶部：Logo + 搜索框 + 头像
            <div className="h-14 flex items-center gap-3">
              {/* Logo区域 */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <div className="w-8 h-8 rounded-lg gradient-hero flex items-center justify-center shadow-md">
                  <span className="text-white font-bold text-xs">BC</span>
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-base font-bold text-gradient leading-tight">北苍星际速充</h1>
                  <p className="text-[9px] text-muted-foreground -mt-0.5">全球好物 一键速达</p>
                </div>
              </div>

              {/* 搜索框 */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="search"
                  placeholder="搜索商品..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="h-9 pl-9 pr-4 rounded-full bg-gray-100 text-sm"
                />
              </div>

              {/* 右侧图标 */}
              <div className="flex items-center gap-1 flex-shrink-0">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="touch-target relative"
                  onClick={() => setShowContactModal(true)}
                >
                  <MessageCircle className="w-5 h-5" />
                </Button>
                <Link to="/profile">
                  <Button variant="ghost" size="icon-sm" className="touch-target">
                    <User className="w-5 h-5" />
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            // 非首页顶部
            <div className="h-12 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {location.pathname !== '/login' && location.pathname !== '/register' && (
                  <Link to={location.pathname.includes('/product/') ? '/search' : -1 as any}>
                    <Button variant="ghost" size="icon-sm" className="touch-target">
                      <ChevronLeft className="w-5 h-5" />
                    </Button>
                  </Link>
                )}
                <h1 className="text-base font-semibold">
                  {getPageTitle(location.pathname)}
                </h1>
              </div>

              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="touch-target relative"
                  onClick={() => setShowContactModal(true)}
                >
                  <MessageCircle className="w-5 h-5" />
                </Button>
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
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Contact Us Modal */}
      {showContactModal && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowContactModal(false)}
          />
          <div className="relative w-full max-w-lg bg-white rounded-t-3xl p-6 animate-slide-in-up">
            <h3 className="text-lg font-bold mb-4 text-center">联系我们</h3>
            <div className="grid grid-cols-3 gap-4">
              <button
                className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-green-50 hover:bg-green-100 transition-colors"
                onClick={() => {
                  window.open('https://wechat.com', '_blank')
                  setShowContactModal(false)
                }}
              >
                <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
                  <span className="text-xl">💬</span>
                </div>
                <span className="text-sm font-medium">微信</span>
              </button>
              <button
                className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-blue-50 hover:bg-blue-100 transition-colors"
                onClick={() => {
                  window.open('https://t.me', '_blank')
                  setShowContactModal(false)
                }}
              >
                <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center">
                  <span className="text-xl">✈️</span>
                </div>
                <span className="text-sm font-medium">Telegram</span>
              </button>
              <button
                className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-orange-50 hover:bg-orange-100 transition-colors"
                onClick={() => {
                  window.location.href = 'tel:+1234567890'
                  setShowContactModal(false)
                }}
              >
                <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm font-medium">电话</span>
              </button>
            </div>

            {/* Help Links */}
            <div className="mt-6 pt-4 border-t border-border space-y-2">
              <Link
                to="/help"
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-colors"
                onClick={() => setShowContactModal(false)}
              >
                <HelpCircle className="w-5 h-5 text-primary" />
                <span className="font-medium">帮助中心</span>
              </Link>
              <Link
                to="/agreement"
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-colors"
                onClick={() => setShowContactModal(false)}
              >
                <FileText className="w-5 h-5 text-primary" />
                <span className="font-medium">用户协议</span>
              </Link>
            </div>

            <Button
              variant="ghost"
              className="w-full mt-4 text-muted-foreground"
              onClick={() => setShowContactModal(false)}
            >
              取消
            </Button>
          </div>
        </div>
      )}
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
  if (pathname === '/activity') return '活动中心'
  if (pathname.startsWith('/order/')) return '订单详情'
  if (pathname.startsWith('/category/')) return '商品分类'
  return ''
}
