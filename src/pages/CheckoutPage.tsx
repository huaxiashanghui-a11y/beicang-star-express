import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ChevronRight, MapPin, CreditCard, Check, Truck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { useApp } from '@/context/AppContext'
import { paymentMethods } from '@/data/mockData'

export default function CheckoutPage() {
  const navigate = useNavigate()
  const { state, dispatch } = useApp()
  const { cart, addresses, user } = state

  const [selectedAddress, setSelectedAddress] = useState(
    addresses.find(a => a.isDefault) || addresses[0]
  )
  const [selectedPayment, setSelectedPayment] = useState(paymentMethods[0])
  const [step, setStep] = useState(1)
  const [isProcessing, setIsProcessing] = useState(false)

  const selectedItems = cart.filter(item => item.selected)
  const totalAmount = selectedItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  )
  const originalAmount = selectedItems.reduce(
    (sum, item) => sum + item.product.originalPrice * item.quantity,
    0
  )
  const shippingFee = totalAmount > 10000 ? 0 : 500
  const total = totalAmount + shippingFee

  const handlePlaceOrder = () => {
    setIsProcessing(true)
    
    // Simulate payment
    setTimeout(() => {
      const order = {
        id: `order-${Date.now()}`,
        orderNumber: `BC${Date.now()}`,
        items: selectedItems.map(item => ({
          id: `item-${Date.now()}-${item.id}`,
          product: item.product,
          quantity: item.quantity,
          price: item.product.price,
          specifications: item.specifications,
        })),
        totalAmount: total,
        originalAmount,
        discount: originalAmount - totalAmount,
        status: 'pending' as const,
        shippingAddress: selectedAddress!,
        paymentMethod: selectedPayment,
        paymentStatus: 'pending' as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      
      dispatch({ type: 'ADD_ORDER', payload: order })
      setIsProcessing(false)
      navigate(`/order/${order.id}`)
    }, 2000)
  }

  const formatPrice = (price: number) => (price / 100).toFixed(2)

  if (selectedItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <div className="text-6xl mb-4">🛒</div>
        <h2 className="text-xl font-bold mb-2">请先选择商品</h2>
        <Link to="/cart">
          <Button variant="premium" size="lg" className="rounded-xl">
            返回购物车
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Progress Steps */}
      <div className="px-4 py-4 bg-card border-b border-border">
        <div className="flex items-center justify-between">
          {[
            { step: 1, label: '确认订单' },
            { step: 2, label: '支付' },
            { step: 3, label: '完成' },
          ].map((s, index) => (
            <div key={s.step} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                    step >= s.step
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {step > s.step ? <Check className="w-4 h-4" /> : s.step}
                </div>
                <span className={`text-xs mt-1 ${step >= s.step ? 'text-primary' : 'text-muted-foreground'}`}>
                  {s.label}
                </span>
              </div>
              {index < 2 && (
                <div className={`w-16 h-0.5 mx-2 ${step > s.step ? 'bg-primary' : 'bg-muted'}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Address Section */}
      <div className="mx-4 mt-4">
        <div
          className="flex items-center justify-between p-4 bg-card rounded-xl"
          onClick={() => setStep(1)}
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full gradient-hero flex items-center justify-center">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <p className="font-semibold">{selectedAddress?.name} {selectedAddress?.phone}</p>
              <p className="text-sm text-muted-foreground line-clamp-1">
                {selectedAddress?.country} {selectedAddress?.province} {selectedAddress?.city} {selectedAddress?.street}
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </div>
      </div>

      {/* Shipping Method */}
      <div className="mx-4 mt-4 p-4 bg-card rounded-xl">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <Truck className="w-5 h-5 text-primary" />
          配送方式
        </h3>
        <div className="flex items-center justify-between p-3 rounded-lg bg-primary/5 border border-primary/20">
          <div className="flex items-center gap-3">
            <span className="text-2xl">✈️</span>
            <div>
              <p className="font-medium">国际快递</p>
              <p className="text-xs text-muted-foreground">预计5-10个工作日送达</p>
            </div>
          </div>
          <span className="font-semibold text-primary">
            {shippingFee === 0 ? '免费' : `$${formatPrice(shippingFee)}`}
          </span>
        </div>
      </div>

      {/* Payment Method */}
      <div className="mx-4 mt-4 p-4 bg-card rounded-xl">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-primary" />
          支付方式
        </h3>
        <div className="space-y-2">
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                selectedPayment.id === method.id
                  ? 'bg-primary/10 border-2 border-primary'
                  : 'bg-muted/50 border-2 border-transparent hover:bg-muted'
              }`}
              onClick={() => setSelectedPayment(method)}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{method.icon}</span>
                <div>
                  <p className="font-medium">{method.name}</p>
                  <p className="text-xs text-muted-foreground">{method.description}</p>
                </div>
              </div>
              {selectedPayment.id === method.id && (
                <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                  <Check className="w-4 h-4 text-primary-foreground" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Order Items */}
      <div className="mx-4 mt-4 p-4 bg-card rounded-xl">
        <h3 className="font-semibold mb-3">商品清单</h3>
        <div className="space-y-3">
          {selectedItems.map((item) => (
            <div key={item.id} className="flex gap-3">
              <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                <img
                  src={item.product.images[0]}
                  alt={item.product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium line-clamp-2 text-sm">{item.product.name}</h4>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-primary font-bold">${formatPrice(item.product.price)}</span>
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
            <span className="text-muted-foreground">商品总价</span>
            <span>${formatPrice(totalAmount)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">运费</span>
            <span className={shippingFee === 0 ? 'text-success' : ''}>
              {shippingFee === 0 ? '免费' : `$${formatPrice(shippingFee)}`}
            </span>
          </div>
          {originalAmount > totalAmount && (
            <div className="flex justify-between text-success">
              <span>优惠</span>
              <span>-${formatPrice(originalAmount - totalAmount)}</span>
            </div>
          )}
          <div className="flex justify-between font-semibold text-base pt-2 border-t">
            <span>合计</span>
            <span className="text-primary text-xl">${formatPrice(total)}</span>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50 safe-bottom">
        <div className="max-w-lg mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <span className="text-muted-foreground">实付金额</span>
            <span className="text-2xl font-bold text-primary">${formatPrice(total)}</span>
          </div>
          <Button
            variant="premium"
            size="lg"
            className="w-full h-14 rounded-xl"
            onClick={handlePlaceOrder}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <span className="flex items-center gap-2">
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                支付中...
              </span>
            ) : (
              `立即支付 $${formatPrice(total)}`
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
