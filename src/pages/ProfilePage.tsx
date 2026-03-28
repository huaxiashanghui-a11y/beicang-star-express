import { Link } from 'react-router-dom'
import { Settings, MapPin, Ticket, Clock, Heart, Bell, ChevronRight, LogOut, Shield, HelpCircle, Info, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useApp } from '@/context/AppContext'

export default function ProfilePage() {
  const { state, dispatch } = useApp()
  const { user, orders, cart, notifications, coupons, viewedProducts } = state

  const orderCounts = {
    pending: orders.filter(o => o.status === 'pending').length,
    shipped: orders.filter(o => ['shipped', 'delivered'].includes(o.status)).length,
    completed: orders.filter(o => ['completed'].includes(o.status)).length,
  }

  const menuItems = [
    { icon: MapPin, label: '收货地址', href: '/addresses', badge: null },
    { icon: Ticket, label: '我的优惠券', href: '/coupons', badge: coupons.filter(c => !c.isUsed).length || null },
    { icon: Clock, label: '浏览历史', href: '/history', badge: null },
    { icon: Heart, label: '我的收藏', href: '/favorites', badge: null },
  ]

  const settingsItems = [
    { icon: Bell, label: '消息通知', href: '/notifications', badge: notifications.filter(n => !n.isRead).length || null },
    { icon: Shield, label: '账号与安全', href: '/security', badge: null },
    { icon: HelpCircle, label: '帮助中心', href: '/help', badge: null },
    { icon: Settings, label: '设置', href: '/settings', badge: null },
    { icon: Info, label: '关于我们', href: '/about', badge: null },
  ]

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' })
    window.location.href = '/login'
  }

  // Generate random user ID if not exists
  const userId = user?.id || `vir-${Math.random().toString(36).substring(2, 10).toUpperCase()}`
  const balance = user?.balance || 0
  const points = user?.points || 0

  return (
    <div className="min-h-screen bg-background">
      {/* Profile Header - Red Theme */}
      <div className="bg-gradient-to-r from-[#FF3B59] to-[#FF6B81] px-4 pt-8 pb-6 text-white">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold">个人中心</h1>
          <Link to="/settings">
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
              <Settings className="w-5 h-5" />
            </Button>
          </Link>
        </div>

        {/* User Info Card - Three Columns */}
        <div className="flex items-stretch gap-2">
          {/* Balance Section */}
          <div className="flex-1 flex flex-col items-center justify-center p-3 bg-white/10 rounded-2xl">
            <span className="text-xs opacity-80 mb-1">余额</span>
            <span className="text-2xl font-bold mb-2">{balance.toFixed(2)}</span>
            <button className="px-4 py-1.5 rounded-full border border-white/50 text-xs hover:bg-white/20 transition-colors">
              充值
            </button>
          </div>

          {/* Avatar & ID Section */}
          <Link
            to="/profile/edit"
            className="flex-1 flex flex-col items-center justify-center p-3 bg-white/10 rounded-2xl hover:bg-white/20 transition-colors"
          >
            <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center mb-2 shadow-lg">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-full h-full object-cover rounded-xl"
                />
              ) : (
                <User className="w-8 h-8 text-[#FF3B59]" />
              )}
            </div>
            <span className="text-xs opacity-60 mb-1">点击修改</span>
            <span className="text-xs font-medium opacity-90">{userId}</span>
          </Link>

          {/* Points Section */}
          <div className="flex-1 flex flex-col items-center justify-center p-3 bg-white/10 rounded-2xl">
            <span className="text-xs opacity-80 mb-1">积分</span>
            <span className="text-2xl font-bold mb-2">{points.toFixed(2)}</span>
            <button className="px-4 py-1.5 rounded-full border border-white/50 text-xs hover:bg-white/20 transition-colors">
              兑换
            </button>
          </div>
        </div>
      </div>

      {/* Orders Section */}
      <div className="mx-4 -mt-4">
        <Card className="shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">我的订单</h3>
              <Link to="/orders" className="text-sm text-muted-foreground flex items-center hover:text-primary">
                全部订单 <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {[
                { icon: '⏳', label: '待付款', count: orderCounts.pending, status: 'pending' },
                { icon: '📦', label: '待发货', count: 0, status: 'processing' },
                { icon: '🚚', label: '待收货', count: orderCounts.shipped, status: 'shipped' },
                { icon: '⭐', label: '已完成', count: orderCounts.completed, status: 'completed' },
              ].map((item) => (
                <Link
                  key={item.status}
                  to={`/orders?status=${item.status}`}
                  className="flex flex-col items-center"
                >
                  <div className="relative">
                    <span className="text-2xl">{item.icon}</span>
                    {item.count > 0 && (
                      <Badge
                        variant="destructive"
                        className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-[10px]"
                      >
                        {item.count > 9 ? '9+' : item.count}
                      </Badge>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground mt-1">{item.label}</span>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Menu Section */}
      <div className="mx-4 mt-4">
        <Card>
          <CardContent className="p-2">
            {menuItems.map((item, index) => (
              <Link
                key={item.href}
                to={item.href}
                className={`flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors ${
                  index !== menuItems.length - 1 ? 'border-b border-border' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="font-medium">{item.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  {item.badge && (
                    <Badge variant="destructive">{item.badge}</Badge>
                  )}
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Settings Section */}
      <div className="mx-4 mt-4 mb-8">
        <Card>
          <CardContent className="p-2">
            {settingsItems.map((item, index) => (
              <Link
                key={item.href}
                to={item.href}
                className={`flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors ${
                  index !== settingsItems.length - 1 ? 'border-b border-border' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-secondary" />
                  </div>
                  <span className="font-medium">{item.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  {item.badge && (
                    <Badge variant="destructive">{item.badge}</Badge>
                  )}
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Customer Service */}
      <div className="mx-4 mb-8">
        <Button
          variant="outline"
          className="w-full h-12 rounded-xl border-primary/50 text-primary hover:bg-primary/10"
        >
          联系客服
        </Button>
      </div>
    </div>
  )
}
