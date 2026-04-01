import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  MapPin, Ticket, Clock, Heart, Bell, ChevronRight,
  Shield, HelpCircle, Settings, Info, MessageCircle,
  User, Edit3, Save, ShieldCheck, Truck, CreditCard,
  Globe, Languages, Moon, Sun, Lock, Mail, Phone as PhoneIcon, MessageSquare, UserCheck,
  ShoppingBag, DollarSign
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useApp } from '@/context/AppContext'
import { cn } from '@/lib/utils'

export default function ProfilePage() {
  const { state, dispatch } = useApp()
  const { user, orders, notifications, coupons } = state
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    avatar: user?.avatar || '',
  })
  const fileInputRef = useRef<HTMLInputElement>(null)

  const orderCounts = {
    pending: orders.filter(o => o.status === 'pending').length,
    processing: orders.filter(o => o.status === 'processing').length,
    shipped: orders.filter(o => ['shipped', 'delivered'].includes(o.status)).length,
    completed: orders.filter(o => ['completed'].includes(o.status)).length,
  }

  const serviceItems = [
    { icon: ShoppingBag, label: '代购', color: 'text-green-600 bg-green-50', href: '/shopping' },
    { icon: Truck, label: '物流', color: 'text-blue-600 bg-blue-50', href: '/shipping' },
    { icon: CreditCard, label: '支付方式', color: 'text-purple-600 bg-purple-50', href: '/payment' },
    { icon: DollarSign, label: '换汇', color: 'text-orange-600 bg-orange-50', href: '/exchange' },
  ]

  const menuItemsRow1 = [
    { icon: MapPin, label: '收货地址', href: '/addresses', badge: null },
    { icon: Ticket, label: '我的优惠券', href: '/coupons', badge: coupons.filter(c => !c.isUsed).length || null },
    { icon: Clock, label: '浏览历史', href: '/history', badge: null },
    { icon: Heart, label: '我的收藏', href: '/favorites', badge: null },
  ]

  const menuItemsRow2 = [
    { icon: Bell, label: '消息通知', href: '/notifications', badge: notifications.filter(n => !n.isRead).length || null },
    { icon: Shield, label: '账号与安全', href: '/security', badge: null },
    { icon: HelpCircle, label: '帮助中心', href: '/help', badge: null },
    { icon: MessageCircle, label: '联系客服', href: '/contact', badge: null },
  ]

  const menuItemsRow3 = [
    { icon: Settings, label: '设置', href: '/settings', badge: null },
    { icon: Info, label: '关于我们', href: '/about', badge: null },
    { icon: Globe, label: '国家/地区', href: '/region', badge: null },
    { icon: Languages, label: '语言', href: '/language', badge: null },
  ]

  const handleSave = () => {
    dispatch({
      type: 'UPDATE_USER',
      payload: { ...editForm }
    })
    setIsEditing(false)
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setEditForm(prev => ({ ...prev, avatar: reader.result as string }))
      }
      reader.readAsDataURL(file)
    }
  }

  const userId = user?.id || `vir-${Math.random().toString(36).substring(2, 10).toUpperCase()}`
  const balance = user?.balance || 0
  const points = user?.points || 0

  const renderMenuGrid = (items: typeof menuItemsRow1) => (
    <div className="grid grid-cols-4 gap-2">
      {items.map((item) => (
        <Link
          key={item.href}
          to={item.href}
          className="flex flex-col items-center p-3 rounded-xl bg-card hover:bg-muted transition-colors active:scale-95 relative"
        >
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-1.5">
            <item.icon className="w-5 h-5 text-primary" />
          </div>
          <span className="text-xs text-center leading-tight">{item.label}</span>
          {item.badge && (
            <Badge variant="destructive" className="absolute -top-1 -right-1 w-4 h-4 p-0 text-[10px]">
              {item.badge > 9 ? '9+' : item.badge}
            </Badge>
          )}
        </Link>
      ))}
    </div>
  )

  return (
    <div className="min-h-screen bg-background pb-20">
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
          <div className="flex-1 flex flex-col items-center justify-center p-3 bg-white/10 rounded-2xl">
            {isEditing ? (
              <div className="relative">
                <div
                  className="w-16 h-16 rounded-xl bg-white flex items-center justify-center mb-2 shadow-lg cursor-pointer overflow-hidden"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {editForm.avatar ? (
                    <img src={editForm.avatar} alt="avatar" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-8 h-8 text-[#FF3B59]" />
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
                <span className="text-xs opacity-60 mb-1">点击修改</span>
              </div>
            ) : (
              <div className="relative">
                <div className="w-16 h-16 rounded-xl bg-white flex items-center justify-center mb-2 shadow-lg">
                  {user?.avatar || editForm.avatar ? (
                    <img
                      src={editForm.avatar || user?.avatar}
                      alt={user?.name}
                      className="w-full h-full object-cover rounded-xl"
                    />
                  ) : (
                    <User className="w-8 h-8 text-[#FF3B59]" />
                  )}
                </div>
                <span className="text-xs opacity-60 mb-1 block text-center">点击修改</span>
              </div>
            )}
            <span className="text-xs font-medium opacity-90">{userId}</span>
          </div>

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

      {/* Edit Profile Form */}
      {isEditing && (
        <div className="mx-4 -mt-4">
          <Card className="shadow-lg">
            <CardContent className="p-4 space-y-4">
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">昵称</label>
                <Input
                  value={editForm.name}
                  onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="请输入昵称"
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">邮箱</label>
                <Input
                  value={editForm.email}
                  onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="请输入邮箱"
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">手机号</label>
                <Input
                  value={editForm.phone}
                  onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="请输入手机号"
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => setIsEditing(false)}>
                  取消
                </Button>
                <Button className="flex-1" onClick={handleSave}>
                  <Save className="w-4 h-4 mr-1" />
                  保存
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Edit Profile Button */}
      {!isEditing && (
        <div className="mx-4 -mt-4 mb-4">
          <Button
            variant="outline"
            className="w-full h-12 rounded-xl border-white/50 text-white bg-white/10 hover:bg-white/20"
            onClick={() => {
              setEditForm({
                name: user?.name || '',
                email: user?.email || '',
                phone: user?.phone || '',
                avatar: user?.avatar || '',
              })
              setIsEditing(true)
            }}
          >
            <Edit3 className="w-4 h-4 mr-2" />
            编辑个人信息
          </Button>
        </div>
      )}

      {/* Service Icons Row */}
      <div className="mx-4 mb-4">
        <div className="grid grid-cols-4 gap-2">
          {serviceItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                'flex flex-col items-center gap-1 p-3 rounded-xl transition-colors active:scale-95',
                item.color
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Orders Section */}
      <div className="mx-4 mb-4">
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
                { icon: '📦', label: '待发货', count: orderCounts.processing, status: 'processing' },
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

      {/* Menu Section 1 - 4x4 Grid */}
      <div className="mx-4 mb-2">
        <Card>
          <CardContent className="p-3">
            {renderMenuGrid(menuItemsRow1)}
          </CardContent>
        </Card>
      </div>

      {/* Menu Section 2 - 4x4 Grid */}
      <div className="mx-4 mb-2">
        <Card>
          <CardContent className="p-3">
            {renderMenuGrid(menuItemsRow2)}
          </CardContent>
        </Card>
      </div>

      {/* Menu Section 3 - 4x4 Grid */}
      <div className="mx-4 mb-4">
        <Card>
          <CardContent className="p-3">
            {renderMenuGrid(menuItemsRow3)}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
