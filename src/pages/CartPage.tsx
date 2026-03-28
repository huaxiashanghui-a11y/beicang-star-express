import { Link } from 'react-router-dom'
import { Trash2, Minus, Plus, ShoppingBag, Tag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useApp } from '@/context/AppContext'

export default function CartPage() {
  const { state, dispatch } = useApp()
  const { cart, addresses, coupons } = state

  const selectedItems = cart.filter(item => item.selected)
  const totalAmount = selectedItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  )
  const originalAmount = selectedItems.reduce(
    (sum, item) => sum + item.product.originalPrice * item.quantity,
    0
  )
  const totalDiscount = originalAmount - totalAmount

  const defaultAddress = addresses.find(a => a.isDefault)
  const availableCoupons = coupons.filter(c => !c.isUsed && totalAmount >= c.minPurchase)

  const allSelected = cart.length > 0 && cart.every(item => item.selected)

  const handleSelectAll = () => {
    dispatch({ type: 'SELECT_ALL_CART', payload: !allSelected })
  }

  const handleToggleItem = (id: string) => {
    dispatch({ type: 'TOGGLE_CART_ITEM', payload: id })
  }

  const handleUpdateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) return
    dispatch({ type: 'UPDATE_CART_ITEM', payload: { id, quantity } })
  }

  const handleRemoveItem = (id: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: id })
  }

  const handleCheckout = () => {
    window.location.href = '/checkout'
  }

  const formatPrice = (price: number) => (price / 100).toFixed(2)

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <div className="w-32 h-32 rounded-full bg-muted flex items-center justify-center mb-6">
          <ShoppingBag className="w-16 h-16 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-bold mb-2">购物车是空的</h2>
        <p className="text-muted-foreground mb-6">去发现更多好物吧</p>
        <Link to="/">
          <Button variant="premium" size="lg" className="rounded-xl">
            去购物
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-36">
      {/* Address Section */}
      {defaultAddress && (
        <div className="px-4 py-3 bg-card border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full gradient-hero flex items-center justify-center">
                <span className="text-white text-sm">📍</span>
              </div>
              <div>
                <p className="font-medium">{defaultAddress.name} {defaultAddress.phone}</p>
                <p className="text-sm text-muted-foreground line-clamp-1">
                  {defaultAddress.country} {defaultAddress.province} {defaultAddress.city} {defaultAddress.street}
                </p>
              </div>
            </div>
            <Link to="/addresses" className="text-primary text-sm">修改</Link>
          </div>
        </div>
      )}

      {/* Cart Items */}
      <div className="px-4 py-4 space-y-3">
        <div className="flex items-center justify-between mb-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={allSelected}
              onChange={handleSelectAll}
              className="w-5 h-5 rounded border-primary text-primary focus:ring-primary"
            />
            <span className="font-medium">全选</span>
          </label>
          <span className="text-sm text-muted-foreground">
            共 {cart.length} 件商品
          </span>
        </div>

        {cart.map((item) => (
          <div
            key={item.id}
            className={`bg-card rounded-xl p-4 transition-all ${
              item.selected ? 'shadow-sm' : 'opacity-60'
            }`}
          >
            <div className="flex gap-3">
              {/* Checkbox */}
              <input
                type="checkbox"
                checked={item.selected}
                onChange={() => handleToggleItem(item.id)}
                className="w-5 h-5 rounded border-primary text-primary focus:ring-primary flex-shrink-0 mt-8"
              />

              {/* Image */}
              <Link to={`/product/${item.product.id}`} className="flex-shrink-0">
                <div className="w-24 h-24 rounded-xl overflow-hidden">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </Link>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <Link to={`/product/${item.product.id}`}>
                  <h3 className="font-medium line-clamp-2 mb-1">{item.product.name}</h3>
                </Link>
                
                {item.product.specifications.length > 0 && (
                  <p className="text-xs text-muted-foreground mb-2">
                    {Object.entries(item.specifications).map(([k, v]) => `${k}: ${v}`).join(' | ')}
                  </p>
                )}

                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-primary font-bold">
                      ${formatPrice(item.product.price)}
                    </span>
                    {item.product.discount && (
                      <span className="text-xs text-muted-foreground line-through ml-1">
                        ${formatPrice(item.product.originalPrice)}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 rounded-lg border border-input flex items-center justify-center hover:bg-muted transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center font-semibold">{item.quantity}</span>
                    <button
                      onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 rounded-lg border border-input flex items-center justify-center hover:bg-muted transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Delete */}
              <button
                onClick={() => handleRemoveItem(item.id)}
                className="text-muted-foreground hover:text-destructive transition-colors self-start"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Coupons */}
      {availableCoupons.length > 0 && (
        <div className="mx-4 mb-4 p-4 bg-card rounded-xl border border-primary/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Tag className="w-5 h-5 text-primary" />
              <span className="font-medium">可用优惠券</span>
            </div>
            <Badge variant="destructive">{availableCoupons.length} 张</Badge>
          </div>
        </div>
      )}

      {/* Bottom Bar */}
      <div className="fixed bottom-16 left-0 right-0 bg-background border-t border-border z-40">
        <div className="max-w-lg mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-muted-foreground">共 {selectedItems.length} 件</span>
            <div className="text-right">
              <span className="text-muted-foreground">合计：</span>
              <span className="text-xl font-bold text-primary">${formatPrice(totalAmount)}</span>
              {totalDiscount > 0 && (
                <span className="text-sm text-success ml-2">省 ${formatPrice(totalDiscount)}</span>
              )}
            </div>
          </div>
          <Button
            variant="premium"
            size="lg"
            className="w-full h-12 rounded-xl"
            disabled={selectedItems.length === 0}
            onClick={handleCheckout}
          >
            结算 ({selectedItems.length})
          </Button>
        </div>
      </div>
    </div>
  )
}
