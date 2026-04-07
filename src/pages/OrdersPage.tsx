import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Package, Clock, Truck, CheckCircle, XCircle, Filter, ShoppingBag, Repeat, Users, AlertCircle, ChevronRight, Store } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { useApp } from '@/context/AppContext'
import { Order, OrderStatus, OrderType } from '@/types'

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

const orderTypeConfig: Record<string, { label: string; icon: any; color: string }> = {
  mall: { label: '商城', icon: Store, color: 'bg-blue-100 text-blue-700' },
  errands: { label: '跑腿', icon: Users, color: 'bg-purple-100 text-purple-700' },
  exchange: { label: '换汇', icon: Repeat, color: 'bg-green-100 text-green-700' },
  shopping: { label: '代购', icon: ShoppingBag, color: 'bg-orange-100 text-orange-700' },
  secondhand: { label: '二手', icon: AlertCircle, color: 'bg-gray-100 text-gray-700' },
}

const typeTabs = [
  { id: 'all', label: '全部订单', icon: Package },
  { id: 'mall', label: '商城', icon: Store },
  { id: 'errands', label: '跑腿', icon: Users },
  { id: 'exchange', label: '换汇', icon: Repeat },
  { id: 'shopping', label: '代购', icon: ShoppingBag },
  { id: 'secondhand', label: '二手', icon: AlertCircle },
]

const statusTabs = [
  { id: 'all', label: '全部' },
  { id: 'pending', label: '待付款' },
  { id: 'processing', label: '处理中' },
  { id: 'shipped', label: '待收货' },
  { id: 'completed', label: '已完成' },
  { id: 'cancelled', label: '已取消' },
]

export default function OrdersPage() {
  const { state } = useApp()
  const [activeType, setActiveType] = useState('all')
  const [activeStatus, setActiveStatus] = useState('all')

  // Get all orders from state (including exchange orders from API)
  const allOrders = state.orders

  const getStatusMatch = (orderStatus: OrderStatus, tabId: string) => {
    if (tabId === 'pending') return orderStatus === 'pending'
    if (tabId === 'processing') return ['paid', 'processing'].includes(orderStatus)
    if (tabId === 'shipped') return ['shipped', 'delivered'].includes(orderStatus)
    if (tabId === 'completed') return ['completed', 'delivered'].includes(orderStatus)
    if (tabId === 'cancelled') return ['cancelled', 'refunded'].includes(orderStatus)
    return true
  }

  const filteredOrders = allOrders.filter(order => {
    // Filter by type
    const typeMatch = activeType === 'all' || order.orderType === activeType
    // Filter by status
    const statusMatch = activeStatus === 'all' || getStatusMatch(order.status, activeStatus)
    return typeMatch && statusMatch
  })

  const formatPrice = (price: number) => `¥${(price / 100).toFixed(2)}`

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Type Tabs */}
      <div className="bg-white border-b sticky top-0 z-20">
        <div className="flex overflow-x-auto scrollbar-hide">
          {typeTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveType(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                activeType === tab.id
                  ? 'text-blue-600 border-blue-600'
                  : 'text-gray-500 border-transparent hover:text-gray-700'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Status Tabs */}
      <div className="bg-gray-50 border-b">
        <div className="flex overflow-x-auto scrollbar-hide px-4">
          {statusTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveStatus(tab.id)}
              className={`px-3 py-2 text-xs font-medium whitespace-nowrap border-b transition-colors ${
                activeStatus === tab.id
                  ? 'text-blue-600 border-blue-600'
                  : 'text-gray-500 border-transparent'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      <div className="p-4 space-y-4">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              formatPrice={formatPrice}
              showType={activeType === 'all'}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-lg font-bold mb-2">暂无订单</h3>
            <p className="text-gray-500 mb-6">
              {activeType !== 'all' || activeStatus !== 'all'
                ? '没有符合条件的订单'
                : '快去选购心仪商品吧'}
            </p>
            <Link to="/">
              <Button variant="premium" size="lg" className="rounded-xl">
                去购物
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* Quick Links */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-3 flex justify-around">
        <Link to="/errands" className="flex flex-col items-center text-gray-500">
          <Users className="w-5 h-5 mb-1" />
          <span className="text-xs">跑腿</span>
        </Link>
        <Link to="/exchange" className="flex flex-col items-center text-gray-500">
          <Repeat className="w-5 h-5 mb-1" />
          <span className="text-xs">换汇</span>
        </Link>
        <Link to="/" className="flex flex-col items-center text-gray-500">
          <Store className="w-5 h-5 mb-1" />
          <span className="text-xs">商城</span>
        </Link>
      </div>
    </div>
  )
}

function OrderCard({
  order,
  formatPrice,
  showType = true
}: {
  order: Order
  formatPrice: (price: number) => string
  showType?: boolean
}) {
  const config = statusConfig[order.status]
  const StatusIcon = config.icon
  const typeConfig = order.orderType ? orderTypeConfig[order.orderType] : orderTypeConfig.mall
  const TypeIcon = typeConfig.icon

  return (
    <Link to={`/order/${order.id}`}>
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              {showType && (
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs ${typeConfig.color}`}>
                  <TypeIcon className="w-3 h-3" />
                  {typeConfig.label}
                </span>
              )}
              <span className="text-sm text-gray-500">订单号: {order.orderNumber}</span>
            </div>
            <Badge variant={config.color as any} className="flex items-center gap-1">
              <StatusIcon className="w-3 h-3" />
              {config.label}
            </Badge>
          </div>

          {/* Items */}
          <div className="space-y-2 mb-3">
            {order.items.slice(0, 3).map((item) => (
              <div key={item.id} className="flex gap-3">
                <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                  {item.product?.images?.[0] ? (
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <Package className="w-6 h-6" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium line-clamp-1">{item.product?.name || '商品'}</h4>
                  <p className="text-xs text-gray-500">x{item.quantity}</p>
                </div>
                <span className="text-sm font-medium">{formatPrice(item.price)}</span>
              </div>
            ))}
            {order.items.length > 3 && (
              <p className="text-sm text-gray-500 text-center">
                还有 {order.items.length - 3} 件商品...
              </p>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t">
            <div>
              <span className="text-sm text-gray-500">共 {order.items.length} 件</span>
              <span className="ml-2 text-base font-bold text-blue-600">
                {formatPrice(order.totalAmount)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {order.status === 'pending' && (
                <Button variant="premium" size="sm" className="rounded-lg">
                  立即付款
                </Button>
              )}
              {['shipped', 'delivered'].includes(order.status) && (
                <Button variant="outline" size="sm" className="rounded-lg">
                  查看物流
                </Button>
              )}
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
