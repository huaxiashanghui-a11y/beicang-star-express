import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Package, Clock, Truck, CheckCircle, XCircle, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { useApp } from '@/context/AppContext'
import { Order, OrderStatus } from '@/types'

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

const tabs = [
  { id: 'all', label: '全部' },
  { id: 'pending', label: '待付款' },
  { id: 'shipped', label: '待收货' },
  { id: 'completed', label: '已完成' },
]

export default function OrdersPage() {
  const { state } = useApp()
  const [activeTab, setActiveTab] = useState('all')
  const { orders } = state

  const filteredOrders = activeTab === 'all'
    ? orders
    : orders.filter(order => {
        if (activeTab === 'pending') return order.status === 'pending'
        if (activeTab === 'shipped') return ['paid', 'processing', 'shipped'].includes(order.status)
        if (activeTab === 'completed') return ['completed', 'delivered'].includes(order.status)
        return true
      })

  const formatPrice = (price: number) => (price / 100).toFixed(2)

  return (
    <div className="min-h-screen bg-background">
      {/* Tabs */}
      <div className="sticky top-14 z-30 bg-background/95 backdrop-blur border-b border-border">
        <div className="flex overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 min-w-max px-4 py-4 text-sm font-medium transition-colors border-b-2 ${
                activeTab === tab.id
                  ? 'text-primary border-primary'
                  : 'text-muted-foreground border-transparent'
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
            <OrderCard key={order.id} order={order} formatPrice={formatPrice} />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-lg font-bold mb-2">暂无订单</h3>
            <p className="text-muted-foreground mb-6">快去选购心仪商品吧</p>
            <Link to="/">
              <Button variant="premium" size="lg" className="rounded-xl">
                去购物
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* Empty State for filtered tabs */}
      {filteredOrders.length === 0 && orders.length > 0 && (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-lg font-bold mb-2">没有相关订单</h3>
          <p className="text-muted-foreground">看看其他订单吧</p>
        </div>
      )}
    </div>
  )
}

function OrderCard({ order, formatPrice }: { order: Order; formatPrice: (price: number) => string }) {
  const config = statusConfig[order.status]
  const StatusIcon = config.icon

  return (
    <Link to={`/order/${order.id}`}>
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-muted-foreground">订单号: {order.orderNumber}</span>
            <Badge variant={config.color as any} className="flex items-center gap-1">
              <StatusIcon className="w-3 h-3" />
              {config.label}
            </Badge>
          </div>

          {/* Items */}
          <div className="space-y-2 mb-3">
            {order.items.slice(0, 3).map((item) => (
              <div key={item.id} className="flex gap-3">
                <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium line-clamp-1">{item.product.name}</h4>
                  <p className="text-xs text-muted-foreground">x{item.quantity}</p>
                </div>
                <span className="text-sm font-medium">${formatPrice(item.price)}</span>
              </div>
            ))}
            {order.items.length > 3 && (
              <p className="text-sm text-muted-foreground text-center">
                还有 {order.items.length - 3} 件商品...
              </p>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t">
            <div>
              <span className="text-sm text-muted-foreground">共 {order.items.length} 件</span>
              <span className="ml-2 text-base font-bold text-primary">$
                {formatPrice(order.totalAmount + order.items.reduce((sum, item) => {
                  return sum + (item.product.originalPrice - item.product.price) * item.quantity
                }, 0))}
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
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
