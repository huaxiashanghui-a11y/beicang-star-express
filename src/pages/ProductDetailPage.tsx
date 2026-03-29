import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Heart, Share2, Star, Minus, Plus, ShoppingCart, ChevronLeft, ChevronRight, Shield, Truck, RotateCcw, Store, Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { products } from '@/data/mockData'
import { useApp } from '@/context/AppContext'
import ReviewSection from '@/components/ReviewSection'
import { cn } from '@/lib/utils'

export default function ProductDetailPage() {
  const { productId } = useParams()
  const product = products.find(p => p.id === productId)
  const { dispatch, state } = useApp()
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [selectedSpecs, setSelectedSpecs] = useState<Record<string, string>>({})
  const [showFullDesc, setShowFullDesc] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null)
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'scanning' | 'paid'>('pending')
  const [paymentProof, setPaymentProof] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="text-6xl mb-4">😢</div>
        <h2 className="text-xl font-bold mb-2">商品不存在</h2>
        <Link to="/" className="text-primary hover:underline">
          返回首页
        </Link>
      </div>
    )
  }

  const paymentMethods = [
    { id: 'wechat', name: '微信支付', icon: '💬', color: 'bg-green-500' },
    { id: 'alipay', name: '支付宝', icon: '💙', color: 'bg-blue-500' },
    { id: 'bank', name: '银行卡', icon: '💳', color: 'bg-purple-500' },
  ]

  const handleAddToCart = () => {
    dispatch({
      type: 'ADD_TO_CART',
      payload: { product, quantity, specifications: selectedSpecs },
    })
    alert('已添加到购物车')
  }

  const handleBuyNow = () => {
    setShowPaymentModal(true)
    setPaymentStatus('pending')
    setSelectedPayment(null)
    setPaymentProof('')
  }

  const handlePaymentSubmit = () => {
    if (!selectedPayment) {
      alert('请选择支付方式')
      return
    }
    setPaymentStatus('scanning')
    setIsProcessing(true)

    // Simulate payment verification
    setTimeout(() => {
      if (paymentProof.trim()) {
        setPaymentStatus('paid')
        setIsProcessing(false)
        // Add to orders
        dispatch({
          type: 'ADD_ORDER',
          payload: {
            order: {
              id: `ORD${Date.now()}`,
              orderNumber: `BC${Date.now()}`,
              items: [{ id: `ITEM${Date.now()}`, product, quantity, price: product.price, specifications: selectedSpecs }],
              totalAmount: product.price * quantity,
              originalAmount: product.originalPrice * quantity,
              discount: (product.originalPrice - product.price) * quantity,
              status: 'paid',
              shippingAddress: state.addresses.find(a => a.isDefault) || state.addresses[0],
              paymentMethod: { id: selectedPayment, name: paymentMethods.find(p => p.id === selectedPayment)?.name || '', icon: '', description: '' },
              paymentStatus: 'paid',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            }
          }
        })
        setTimeout(() => {
          setShowPaymentModal(false)
          window.location.href = '/orders'
        }, 2000)
      } else {
        alert('请填写支付凭证信息')
        setIsProcessing(false)
      }
    }, 2000)
  }

  const formatPrice = (price: number) => (price / 100).toFixed(2)
  const totalPrice = product.price * quantity

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Image Gallery */}
      <div className="relative">
        <div className="aspect-square bg-muted">
          <img
            src={product.images[selectedImage]}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Image Navigation */}
        {product.images.length > 1 && (
          <>
            <button
              onClick={() => setSelectedImage((prev) => (prev - 1 + product.images.length) % product.images.length)}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 flex items-center justify-center shadow-lg active:scale-95"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={() => setSelectedImage((prev) => (prev + 1) % product.images.length)}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 flex items-center justify-center shadow-lg active:scale-95"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        {/* Image Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {product.images.map((_, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === selectedImage ? 'w-6 bg-primary' : 'bg-white/60'
              }`}
            />
          ))}
        </div>

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {product.isHot && <Badge className="bg-primary">热门</Badge>}
          {product.isNew && <Badge className="bg-secondary">新品</Badge>}
          {product.discount && (
            <Badge variant="destructive">-{product.discount}%</Badge>
          )}
        </div>

        {/* Actions */}
        <div className="absolute top-4 right-4 flex gap-2">
          <button className="w-10 h-10 rounded-full bg-white/80 flex items-center justify-center active:scale-95">
            <Share2 className="w-5 h-5" />
          </button>
          <button className="w-10 h-10 rounded-full bg-white/80 flex items-center justify-center active:scale-95">
            <Heart className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="px-4 py-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h1 className="text-xl font-bold leading-tight">{product.name}</h1>
            <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
              <span className="flex items-center gap-1 text-warning">
                <Star className="w-4 h-4 fill-warning" />
                {product.rating}
              </span>
              <span>|</span>
              <span>{product.reviewCount} 条评价</span>
              <span>|</span>
              <span>{product.sales} 已售</span>
            </div>
          </div>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-3 mb-4">
          <span className="text-3xl font-bold text-primary">${formatPrice(product.price)}</span>
          {product.discount && (
            <span className="text-lg text-muted-foreground line-through">
              ${formatPrice(product.originalPrice)}
            </span>
          )}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {product.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      {/* Specifications */}
      <div className="px-4 py-4 border-t border-border">
        <h2 className="font-semibold mb-3">商品规格</h2>
        <div className="space-y-3">
          {product.specifications.map((spec) => (
            <div key={spec.name} className="flex items-center justify-between">
              <span className="text-muted-foreground">{spec.name}</span>
              <span className="font-medium">{spec.value}</span>
            </div>
          ))}
        </div>

        {/* Product Source */}
        <div className="mt-4 p-3 bg-muted/50 rounded-xl">
          <div className="flex items-center gap-2 text-sm">
            <Store className="w-4 h-4 text-primary" />
            <span className="text-muted-foreground">商品来源：</span>
            <span className="font-medium">{product.seller.name}</span>
          </div>
        </div>
      </div>

      {/* Seller Info */}
      <Link to={`/seller/${product.seller.id}`} className="flex items-center gap-3 p-4 bg-card mx-4 rounded-xl mb-4">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-2xl">
          {product.seller.avatar}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold">{product.seller.name}</h3>
          <p className="text-sm text-muted-foreground">
            评分 {product.seller.rating} | {product.seller.products} 件商品
          </p>
        </div>
        <ChevronRight className="w-5 h-5 text-muted-foreground" />
      </Link>

      {/* Description */}
      <div className="px-4 py-4 border-t border-border">
        <h2 className="font-semibold mb-3">商品详情</h2>
        <p className={`text-muted-foreground leading-relaxed ${!showFullDesc && 'line-clamp-3'}`}>
          {product.description}
        </p>
        {product.description.length > 100 && (
          <button
            onClick={() => setShowFullDesc(!showFullDesc)}
            className="text-primary text-sm mt-2"
          >
            {showFullDesc ? '收起' : '展开全部'}
          </button>
        )}
      </div>

      {/* Reviews */}
      <div className="px-4 py-4 border-t border-border">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold">商品评价</h2>
          <Link to={`/product/${productId}/reviews`} className="text-sm text-primary">
            查看全部
          </Link>
        </div>
        <ReviewSection productId={productId!} />
      </div>

      {/* Services */}
      <div className="px-4 py-4 border-t border-border">
        <h2 className="font-semibold mb-3">服务保障</h2>
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: Shield, label: '正品保障' },
            { icon: Truck, label: '全球包邮' },
            { icon: RotateCcw, label: '7天退换' },
          ].map((service, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <service.icon className="w-6 h-6 text-primary mb-1" />
              <span className="text-xs text-muted-foreground">{service.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Fixed Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border safe-bottom z-50">
        <div className="max-w-lg mx-auto px-4 py-4 space-y-3">
          {/* Quantity Selector */}
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">数量</span>
            <div className="flex items-center gap-1 border border-input rounded-xl overflow-hidden">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 flex items-center justify-center hover:bg-muted transition-colors active:scale-95"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-16 text-center font-semibold">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                className="w-10 h-10 flex items-center justify-center hover:bg-muted transition-colors active:scale-95"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <span className="text-sm text-muted-foreground">库存：{product.stock}</span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="lg"
              className="flex-1 h-12 rounded-xl"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              加入购物车
            </Button>

            <Button
              variant="premium"
              size="lg"
              className="flex-1 h-12 rounded-xl"
              onClick={handleBuyNow}
            >
              立即购买
            </Button>
          </div>

          {/* Total Price */}
          <div className="text-right">
            <span className="text-muted-foreground">合计：</span>
            <span className="text-xl font-bold text-primary ml-2">${formatPrice(totalPrice)}</span>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => paymentStatus !== 'scanning' && setShowPaymentModal(false)} />
          <div className="relative w-full max-w-lg bg-white rounded-t-3xl animate-slide-in-up max-h-[85vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h3 className="text-lg font-bold">选择支付方式</h3>
              {paymentStatus === 'pending' && (
                <button onClick={() => setShowPaymentModal(false)} className="p-2 hover:bg-muted rounded-full">
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Order Summary */}
            <div className="px-4 py-3 bg-muted/50 border-b border-border">
              <div className="flex items-center gap-3">
                <img src={product.images[0]} alt={product.name} className="w-16 h-16 rounded-xl object-cover" />
                <div className="flex-1">
                  <h4 className="font-medium line-clamp-1">{product.name}</h4>
                  <p className="text-sm text-muted-foreground">x{quantity}</p>
                </div>
                <span className="text-xl font-bold text-primary">${formatPrice(totalPrice)}</span>
              </div>
            </div>

            {/* Payment Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {paymentStatus === 'pending' && (
                <>
                  <h4 className="font-medium mb-3">支付方式</h4>
                  <div className="space-y-2">
                    {paymentMethods.map((method) => (
                      <button
                        key={method.id}
                        onClick={() => setSelectedPayment(method.id)}
                        className={cn(
                          'w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all active:scale-[0.98]',
                          selectedPayment === method.id
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        )}
                      >
                        <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center text-2xl', method.color)}>
                          {method.icon}
                        </div>
                        <span className="flex-1 font-medium text-left">{method.name}</span>
                        {selectedPayment === method.id && (
                          <Check className="w-5 h-5 text-primary" />
                        )}
                      </button>
                    ))}
                  </div>

                  <h4 className="font-medium mb-3 mt-6">支付凭证</h4>
                  <textarea
                    value={paymentProof}
                    onChange={(e) => setPaymentProof(e.target.value)}
                    placeholder="请填写支付凭证信息（如：转账截图描述、交易流水号等）"
                    className="w-full h-24 p-3 border border-input rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    请在完成支付后，填写您的支付凭证信息以便系统核实
                  </p>
                </>
              )}

              {paymentStatus === 'scanning' && (
                <div className="flex flex-col items-center justify-center py-8">
                  <div className="w-16 h-16 rounded-full border-4 border-primary border-t-transparent animate-spin mb-4" />
                  <h4 className="font-medium mb-2">正在验证支付...</h4>
                  <p className="text-sm text-muted-foreground text-center">
                    系统正在核实您的支付凭证，请稍候
                  </p>
                </div>
              )}

              {paymentStatus === 'paid' && (
                <div className="flex flex-col items-center justify-center py-8">
                  <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center mb-4 animate-bounce-in">
                    <Check className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="font-medium mb-2 text-green-600">支付成功！</h4>
                  <p className="text-sm text-muted-foreground text-center">
                    正在跳转到订单页面...
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            {paymentStatus === 'pending' && (
              <div className="p-4 border-t border-border">
                <Button
                  className="w-full"
                  size="lg"
                  disabled={!selectedPayment || !paymentProof.trim()}
                  onClick={handlePaymentSubmit}
                >
                  确认支付 ${formatPrice(totalPrice)}
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
