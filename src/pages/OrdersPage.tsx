import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Package, Clock, Truck, CheckCircle, XCircle, Search,
  ChevronRight, MoreVertical
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useApp } from '@/context/AppContext'
import { Order, OrderStatus } from '@/types'

// 状态配置
const statusConfig: Record<OrderStatus, { label: string; icon: any; color: string }> = {
  pending: { label: '待付款', icon: Clock, color: 'warning' },
  paid: { label: '已付款', icon: CheckCircle, color: 'secondary' },
  processing: { label: '处理中', icon: Package, color: 'secondary' },
  shipped: { label: '已发货', icon: Truck, color: 'secondary' },
  delivered: { label: '已送达', icon: CheckCircle, color: 'success' },
  completed: { label: '已完成', icon: CheckCircle, color: 'success' },
  cancelled: { label: '已取消', icon: XCircle, color: 'destructive' },
  refunding: { label: '退款中', icon: Clock, color: 'warning' },
  refunded: { label: '已退款', icon: CheckCircle, color: 'destructive' },
}

// 订单类型配置
const orderTypeConfig: Record<string, { label: string }> = {
  errands: { label: '跑腿订单' },
  takeout: { label: '外卖订单' },
  dinein: { label: '堂食订单' },
  brand: { label: '品牌订单' },
  all: { label: '全部订单' },
}

// 订单类型下拉选项
const orderTypeOptions = [
  { id: 'all', label: '全部订单' },
  { id: 'errands', label: '跑腿订单' },
  { id: 'takeout', label: '外卖订单' },
  { id: 'dinein', label: '堂食订单' },
  { id: 'brand', label: '品牌订单' },
]

// 状态筛选选项
const statusFilters = [
  { id: 'all', label: '全部' },
  { id: 'uncompleted', label: '未完成' },
  { id: 'completed', label: '已完成' },
]

export default function OrdersPage() {
  const { state } = useApp()
  const [searchQuery, setSearchQuery] = useState('')
  const [showTypeDropdown, setShowTypeDropdown] = useState(false)
  const [selectedType, setSelectedType] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [showMenu, setShowMenu] = useState(false)

  // 获取所有订单
  const allOrders = state.orders

  // 判断订单是否完成
  const isOrderCompleted = (status: OrderStatus) => {
    return ['completed', 'delivered', 'cancelled', 'refunded'].includes(status)
  }

  // 筛选订单
  const filteredOrders = allOrders.filter(order => {
    // 状态筛选
    if (selectedStatus === 'completed') {
      if (!isOrderCompleted(order.status)) return false
    } else if (selectedStatus === 'uncompleted') {
      if (isOrderCompleted(order.status)) return false
    }

    // 搜索筛选
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      const searchableText = [
        order.orderNumber,
        order.shippingAddress?.name || '',
        order.shippingAddress?.phone || '',
        order.items.map(item => item.product?.name || '').join(' '),
      ].join(' ').toLowerCase()

      if (!searchableText.includes(query)) return false
    }

    return true
  })

  const formatPrice = (price: number) => `¥${(price / 100).toFixed(2)}`

  const handleTypeSelect = (typeId: string) => {
    setSelectedType(typeId)
    setShowTypeDropdown(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* 顶部导航 */}
      <div className="bg-white sticky top-0 z-30 border-b">
        <div className="flex items-center justify-between px-4 h-12">
          <span className="text-sm font-medium text-gray-900">
            {orderTypeConfig[selectedType]?.label || '全部订单'}
          </span>
          <div className="relative">
            <button
              onClick={() => setShowTypeDropdown(!showTypeDropdown)}
              className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 bg-gray-100 rounded-full hover:bg-gray-200"
            >
              <span>{orderTypeConfig[selectedType]?.label || '全部订单'}</span>
              <ChevronRight className="w-4 h-4" style={{ transform: 'rotate(90deg)' }} />
            </button>

            {/* 下拉菜单 */}
            {showTypeDropdown && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowTypeDropdown(false)}
                />
                <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border z-20 overflow-hidden">
                  {orderTypeOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => handleTypeSelect(option.id)}
                      className={`w-full px-4 py-3 text-sm text-left hover:bg-gray-50 border-b last:border-b-0 ${
                        selectedType === option.id ? 'text-orange-500 bg-orange-50' : 'text-gray-700'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* 状态标签 */}
        <div className="flex px-4 py-2 bg-white">
          {statusFilters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setSelectedStatus(filter.id)}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                selectedStatus === filter.id
                  ? 'text-yellow-500 border-yellow-500'
                  : 'text-gray-500 border-transparent hover:text-gray-700'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* 搜索框 */}
      <div className="px-4 py-3 bg-white border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            type="search"
            placeholder="请输入姓名/手机号/商品/店铺名称/地址/备注"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-10 bg-gray-100 rounded-full border-0"
          />
        </div>
      </div>

      {/* 订单列表 */}
      <div className="p-4 space-y-4">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              formatPrice={formatPrice}
            />
          ))
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  )
}

// 空状态组件
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      {/* 插画 */}
      <div className="relative w-48 h-48 mb-6">
        <svg viewBox="0 0 200 200" className="w-full h-full">
          {/* 店铺 */}
          <rect x="50" y="80" width="100" height="80" fill="#E8E8E8" rx="4" />
          <rect x="50" y="70" width="100" height="15" fill="#FFB800" rx="2" />
          {/* 屋顶 */}
          <polygon points="40,70 100,30 160,70" fill="#FF6B35" />
          <polygon points="45,70 100,35 155,70" fill="#FFB800" />
          {/* 门 */}
          <rect x="85" y="115" width="30" height="45" fill="#A0D8EF" rx="2" />
          {/* 窗 */}
          <rect x="60" y="95" width="18" height="15" fill="#A0D8EF" />
          <rect x="122" y="95" width="18" height="15" fill="#A0D8EF" />
          {/* 自行车 */}
          <circle cx="70" cy="170" r="12" fill="none" stroke="#666" strokeWidth="2" />
          <circle cx="130" cy="170" r="12" fill="none" stroke="#666" strokeWidth="2" />
          <line x1="70" y1="170" x2="100" y2="155" stroke="#666" strokeWidth="2" />
          <line x1="100" y1="155" x2="130" y2="170" stroke="#666" strokeWidth="2" />
          <line x1="100" y1="155" x2="100" y2="140" stroke="#666" strokeWidth="2" />
          {/* 人 */}
          <circle cx="100" cy="135" r="8" fill="#FFB800" />
          <line x1="100" y1="143" x2="100" y2="155" stroke="#666" strokeWidth="2" />
          <line x1="100" y1="148" x2="85" y2="155" stroke="#666" strokeWidth="2" />
          <line x1="100" y1="148" x2="115" y2="155" stroke="#666" strokeWidth="2" />
        </svg>
      </div>
      <p className="text-gray-400 text-base">这里还没有订单哦</p>
    </div>
  )
}

// 订单卡片组件
function OrderCard({
  order,
  formatPrice,
}: {
  order: Order
  formatPrice: (price: number) => string
}) {
  const config = statusConfig[order.status]

  return (
    <Link to={`/order/${order.id}`}>
      <Card className="hover:shadow-md transition-shadow rounded-xl overflow-hidden">
        <CardContent className="p-0">
          {/* 卡片头部 */}
          <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b">
            <span className="text-sm text-gray-500">订单号: {order.orderNumber}</span>
            <span className={`text-sm font-medium ${
              order.status === 'completed' ? 'text-green-500' :
              order.status === 'cancelled' ? 'text-gray-400' :
              'text-orange-500'
            }`}>
              {config.label}
            </span>
          </div>

          {/* 商品信息 */}
          <div className="p-4">
            <div className="space-y-3">
              {order.items.slice(0, 2).map((item) => (
                <div key={item.id} className="flex gap-3">
                  <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                    {item.product?.images?.[0] ? (
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-6 h-6 text-gray-300" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-900 line-clamp-1">
                      {item.product?.name || '商品'}
                    </h4>
                    <p className="text-xs text-gray-400 mt-1">x{item.quantity}</p>
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {formatPrice(item.price)}
                  </span>
                </div>
              ))}
              {order.items.length > 2 && (
                <p className="text-sm text-gray-400 text-center">
                  还有 {order.items.length - 2} 件商品...
                </p>
              )}
            </div>

            {/* 底部 */}
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
              <div className="text-sm text-gray-500">
                共 {order.items.length} 件
              </div>
              <div className="flex items-center gap-3">
                {order.status === 'pending' && (
                  <Button variant="premium" size="sm" className="rounded-full h-8 px-4 text-xs">
                    立即付款
                  </Button>
                )}
                {['shipped', 'delivered'].includes(order.status) && (
                  <Button variant="outline" size="sm" className="rounded-full h-8 px-4 text-xs">
                    查看物流
                  </Button>
                )}
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
