import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  MapPin, Ticket, Clock, Heart, Bell, ChevronRight,
  Shield, HelpCircle, Settings, Info, MessageCircle,
  User, Save, ShieldCheck, Truck, CreditCard, Edit3,
  ShoppingBag, DollarSign, Camera, Image
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useApp } from '@/context/AppContext'
import { cn } from '@/lib/utils'
import { updateProfile } from '@/api/profile'

export default function ProfilePage() {
  const { state, dispatch } = useApp()
  const { user, orders, notifications, coupons } = state
  const [showAvatarModal, setShowAvatarModal] = useState(false)
  const [showNicknameModal, setShowNicknameModal] = useState(false)
  const [nickname, setNickname] = useState(user?.name || '北苍星际速充')
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar || '')
  const fileInputRef = useRef<HTMLInputElement>(null)

  // 同步用户数据到本地状态
  useEffect(() => {
    if (user?.name) setNickname(user.name)
    if (user?.avatar) setAvatarUrl(user.avatar)
  }, [user?.name, user?.avatar])

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
    { icon: Bell, label: '国家/地区', href: '/region', badge: null },
    { icon: HelpCircle, label: '语言', href: '/language', badge: null },
  ]

  const userId = user?.id || `vir-${Math.random().toString(36).substring(2, 10).toUpperCase()}`
  const balance = user?.balance || 0
  const points = user?.points || 0

  const handleTakePhoto = () => {
    fileInputRef.current?.click()
    setShowAvatarModal(false)
  }

  const handleChooseFromAlbum = () => {
    fileInputRef.current?.click()
    setShowAvatarModal(false)
  }

  // 点击昵称弹窗中的头像触发文件选择
  const handleAvatarInNicknameModal = () => {
    fileInputRef.current?.click()
  }

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = async () => {
        const newAvatar = reader.result as string
        setAvatarUrl(newAvatar)
        // 更新本地状态
        dispatch({
          type: 'UPDATE_USER',
          payload: { avatar: newAvatar }
        })
        // 同步到后端，确保数据持久化
        try {
          const res = await updateProfile({ avatar: newAvatar })
          if (res.success) {
            console.log('头像保存成功:', newAvatar.substring(0, 50) + '...')
          }
        } catch (error) {
          console.error('保存头像失败:', error)
        }
      }
      reader.readAsDataURL(file)
    }
    // 重置input值，允许重复选择同一图片
    e.target.value = ''
  }

  const handleSaveNickname = async () => {
    // 先同步到后端，确保数据持久化
    try {
      const res = await updateProfile({ name: nickname })
      if (res.success) {
        // API确认成功后再更新本地状态
        dispatch({
          type: 'UPDATE_USER',
          payload: { name: nickname }
        })
        console.log('昵称保存成功:', nickname)
      }
    } catch (error) {
      console.error('保存昵称失败:', error)
      // API失败时仍然更新本地状态
      dispatch({
        type: 'UPDATE_USER',
        payload: { name: nickname }
      })
    }
    setShowNicknameModal(false)
  }

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
      <div className="bg-gradient-to-r from-[#FF4A6D] to-[#FF6B81] px-4 pt-8 pb-6 text-white">
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
            <Link to="/recharge">
              <button className="px-4 py-1.5 rounded-full bg-white text-[#FF4A6D] text-xs font-medium hover:bg-white/90 transition-colors">
                充值
              </button>
            </Link>
          </div>

          {/* Avatar & Nickname Section */}
          <div
            className="flex-1 flex flex-col items-center justify-center p-3 bg-white/10 rounded-2xl cursor-pointer"
            onClick={() => setShowAvatarModal(true)}
          >
            <div className="w-16 h-16 rounded-xl bg-white overflow-hidden flex items-center justify-center mb-2 shadow-lg">
              {avatarUrl ? (
                <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                <User className="w-8 h-8 text-[#FF4A6D]" />
              )}
            </div>
            <span
              className="text-sm font-medium opacity-90 mb-1"
              onClick={(e) => {
                e.stopPropagation()
                setShowNicknameModal(true)
              }}
            >
              {nickname}
            </span>
            <span className="text-xs opacity-60">点击修改</span>
          </div>

          {/* Points Section */}
          <div className="flex-1 flex flex-col items-center justify-center p-3 bg-white/10 rounded-2xl">
            <span className="text-xs opacity-80 mb-1">积分</span>
            <span className="text-2xl font-bold mb-2">{points.toFixed(2)}</span>
            <Link to="/exchange">
              <button className="px-4 py-1.5 rounded-full bg-white text-[#FF4A6D] text-xs font-medium hover:bg-white/90 transition-colors">
                兑换
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Hidden file input for avatar - 支持移动端相机拍摄 */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleAvatarChange}
      />

      {/* Avatar Modal */}
      {showAvatarModal && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowAvatarModal(false)}
          />
          <div className="relative w-full max-w-md bg-white rounded-t-3xl p-0 overflow-hidden animate-slide-in-up">
            <button
              onClick={handleTakePhoto}
              className="w-full px-4 py-4 text-center text-base text-gray-800 hover:bg-gray-50 border-b border-gray-100"
            >
              拍摄
            </button>
            <button
              onClick={handleChooseFromAlbum}
              className="w-full px-4 py-4 text-center text-base text-gray-800 hover:bg-gray-50 border-b border-gray-100"
            >
              从相册选择
            </button>
            <button
              onClick={() => setShowAvatarModal(false)}
              className="w-full px-4 py-4 text-center text-base text-gray-500 hover:bg-gray-50"
            >
              取消
            </button>
          </div>
        </div>
      )}

      {/* Nickname Modal */}
      {showNicknameModal && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowNicknameModal(false)}
          />
          <div className="relative w-full max-w-md bg-white rounded-t-3xl p-6 animate-slide-in-up">
            <h3 className="text-lg font-bold text-center mb-4">修改昵称</h3>

            {/* Avatar Preview */}
            <div className="flex flex-col items-center mb-6">
              <div
                className="w-20 h-20 rounded-xl bg-gray-100 overflow-hidden flex items-center justify-center mb-2 cursor-pointer hover:bg-gray-200 active:scale-95 transition-all"
                onClick={handleAvatarInNicknameModal}
              >
                {avatarUrl ? (
                  <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-10 h-10 text-gray-400" />
                )}
              </div>
              <span className="text-sm text-gray-500">点击头像修改</span>
            </div>

            {/* Nickname Input */}
            <div className="mb-6">
              <label className="text-sm text-gray-500 mb-2 block">请输入昵称</label>
              <Input
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="请输入昵称"
                className="text-center border-yellow-400 focus:ring-yellow-400"
              />
            </div>

            {/* Authorization Info */}
            <div className="mb-6 p-4 bg-gray-50 rounded-xl">
              <p className="font-medium text-gray-800 mb-1">授权 北苍星际速充</p>
              <p className="text-xs text-gray-500 mb-2">授权获取以下信息为您提供更多服务</p>
              <p className="text-xs text-gray-500">• 获取您的公开信息(昵称、头像等)</p>
            </div>

            {/* Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleSaveNickname}
                className="w-full py-3 bg-yellow-400 text-gray-900 font-medium rounded-full hover:bg-yellow-500 transition-colors"
              >
                保存
              </button>
              <button
                onClick={() => setShowNicknameModal(false)}
                className="w-full py-3 bg-white border border-gray-200 text-gray-500 font-medium rounded-full hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
            </div>
          </div>
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
