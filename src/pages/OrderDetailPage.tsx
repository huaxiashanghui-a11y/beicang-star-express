import { useParams, Link } from 'react-router-dom'
import { MapPin, CreditCard, Package, Clock, Truck, CheckCircle, XCircle, ChevronRight, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { useApp } from '@/context/AppContext'
import { OrderStatus } from '@/types'

const statusConfig: Record<OrderStatus, { label: string; icon: any; color: string; description: string }> = {
  pending: { 
    label: '待付款', 
    icon: Clock, 
    color: 'warning',
    description: '请尽快完成付款，订单将自动取消'
  },
  paid: { 
    label: '已付款', 
    icon: CheckCircle, 
    color: 'secondary',
    description: '付款成功，我们正在准备您的商品'
  },
  processing: { 
    label: '处理中', 
    icon: Package, 
    color: 'secondary',
    description: '商品正在打包准备中'
  },
  shipped: { 
    label: '已发货', 
    icon: Truck, 
    color: 'secondary',
    description: '商品已发出，请注意查收'
  },
  delivered: { 
    label: '已送达', 
    icon: CheckCircle, 
    color: 'success',
    description: '商品已送达，请确认收货'
  },
  completed: { 
    label: '已完成', 
    icon: CheckCircle, 
    color: 'success',
    description: '感谢您的购买，欢迎评价'
  },
  cancelled: { 
    label: '已取消', 
    icon: XCircle, 
    color: 'destructive',
    description: '订单已取消'
  },
  refunding: { 
    label: '退款中', 
    icon: Clock, 
    color: 'warning',
    description: '退款申请正在处理中'
  },
  refunded: { 
    label: '已退款', 
    icon: CheckCircle, 
    color: 'destructive',
    description: '退款已原路返回'
  },
}

export default function OrderDetailPage() {
  const { orderId } = useParams()
  const { state } = useApp()
  const order = state.orders.find(o => o.id === orderId)

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <div className="text-6xl mb-4">😢</div>
        <h2 className="text-xl font-bold mb-2">订单不存在</h2>
        <Link to="/orders" className="text-primary hover:underline">
          返回订单列表
        </Link>
      </div>
    )
  }

  const config = statusConfig[order.status]
  const StatusIcon = config.icon
  const formatPrice = (price: number) => (price / 100).toFixed(2)

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Status Header */}
      <div className="gradient-hero p-6 text-white">
        <div className="flex items-center gap-3 mb-2">
          <StatusIcon className="w-8 h-8" />
          <h1 className="text-2xl font-bold">{config.label}</h1>
        </div>
        <p className="opacity-90">{config.description}</p>
        {order.estimatedDelivery && (
          <p className="mt-2 text-sm opacity-80">
            预计送达: {order.estimatedDelivery}
          </p>
        )}
      </div>

      {/* Address */}
      <div className="mx-4 -mt-4 p-4 bg-card rounded-xl shadow-lg">
        <div className="flex items-start gap-3">
          <MapPin className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold">{order.shippingAddress.name} {order.shippingAddress.phone}</p>
            <p className="text-sm text-muted-foreground">
              {order.shippingAddress.country} {order.shippingAddress.province} {order.shippingAddress.city}
              <br />
              {order.shippingAddress.street} {order.shippingAddress.postalCode}
            </p>
          </div>
        </div>
      </div>

      {/* Payment Info */}
      <div className="mx-4 mt-4 p-4 bg-card rounded-xl">
        <div className="flex items-center gap-3">
          <CreditCard className="w-6 h-6 text-primary" />
          <div>
            <p className="font-medium">{order.paymentMethod.name}</p>
            <p className="text-sm text-muted-foreground">{order.paymentMethod.description}</p>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="mx-4 mt-4 p-4 bg-card rounded-xl">
        <h3 className="font-semibold mb-3">商品清单</h3>
        <div className="space-y-3">
          {order.items.map((item) => (
            <div key={item.id} className="flex gap-3">
              <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                <img
                  src={item.product.images[0]}
                  alt={item.product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium line-clamp-2">{item.product.name}</h4>
                {Object.keys(item.specifications).length > 0 && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {Object.entries(item.specifications).map(([k, v]) => `${k}: ${v}`).join(' | ')}
                  </p>
                )}
                <div className="flex items-center justify-between mt-1">
                  <span className="text-primary font-bold">${formatPrice(item.price)}</span>
                  <span className="text-sm text-muted-foreground">x{item.quantity}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Order Summary */}
      <div className="mx-4 mt-4 p-4 bg-card rounded-xl">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">订单编号</span>
            <span className="font-mono">{order.orderNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">下单时间</span>
            <span>{new Date(order.createdAt).toLocaleString()}</span>
          </div>
          {order.trackingNumber && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">物流单号</span>
              <span className="font-mono">{order.trackingNumber}</span>
            </div>
          )}
          <div className="flex justify-between pt-2 border-t">
            <span className="font-semibold">实付金额</span>
            <span className="text-xl font-bold text-primary">${formatPrice(order.totalAmount)}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50 safe-bottom">
        <div className="max-w-lg mx-auto px-4 py-3 flex gap-3">
          <Button variant="outline" size="lg" className="flex-1 h-12 rounded-xl">
            <MessageCircle className="w-5 h-5 mr-2" />
            联系客服
          </Button>
          {order.status === 'pending' && (
            <Button variant="premium" size="lg" className="flex-1 h-12 rounded-xl">
              立即付款
            </Button>
          )}
          {['shipped', 'delivered'].includes(order.status) && (
            <Button variant="premium" size="lg" className="flex-1 h-12 rounded-xl">
              确认收货
            </Button>
          )}
          {order.status === 'completed' && (
            <Button variant="premium" size="lg" className="flex-1 h-12 rounded-xl">
              去评价
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
