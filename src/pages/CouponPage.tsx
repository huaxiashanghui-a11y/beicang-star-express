import { useState } from 'react'
import { Tag, Clock, Check, Gift } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useApp } from '@/context/AppContext'
import { coupons as initialCoupons } from '@/data/mockData'

export default function CouponPage() {
  const { state, dispatch } = useApp()
  const [activeTab, setActiveTab] = useState<'available' | 'used' | 'expired'>('available')

  const { coupons } = state
  const allCoupons = [...initialCoupons, ...coupons]

  const availableCoupons = allCoupons.filter(c => !c.isUsed)
  const usedCoupons = allCoupons.filter(c => c.isUsed)

  const formatPrice = (price: number) => (price / 100).toFixed(2)

  const handleUseCoupon = (couponId: string) => {
    dispatch({ type: 'USE_COUPON', payload: couponId })
  }

  const filteredCoupons = activeTab === 'available' 
    ? availableCoupons 
    : activeTab === 'used' 
    ? usedCoupons 
    : []

  return (
    <div className="min-h-screen bg-background">
      {/* Tabs */}
      <div className="sticky top-14 z-30 bg-background/95 backdrop-blur border-b border-border">
        <div className="flex">
          {[
            { id: 'available', label: '可用', count: availableCoupons.length },
            { id: 'used', label: '已使用', count: usedCoupons.length },
            { id: 'expired', label: '已过期', count: 0 },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-4 text-sm font-medium transition-colors border-b-2 ${
                activeTab === tab.id
                  ? 'text-primary border-primary'
                  : 'text-muted-foreground border-transparent'
              }`}
            >
              {tab.label} {tab.count > 0 && `(${tab.count})`}
            </button>
          ))}
        </div>
      </div>

      {/* Coupon List */}
      <div className="p-4 space-y-3">
        {filteredCoupons.length > 0 ? (
          filteredCoupons.map((coupon) => (
            <Card key={coupon.id} className={`overflow-hidden ${
              coupon.isUsed ? 'opacity-60' : ''
            }`}>
              <div className="flex">
                {/* Left - Value */}
                <div className="w-28 gradient-hero flex flex-col items-center justify-center p-4 text-white">
                  {coupon.discountType === 'fixed' ? (
                    <>
                      <span className="text-2xl font-bold">${formatPrice(coupon.discountValue)}</span>
                      <span className="text-xs opacity-80">优惠券</span>
                    </>
                  ) : (
                    <>
                      <span className="text-2xl font-bold">{coupon.discountValue}%</span>
                      <span className="text-xs opacity-80">折扣</span>
                      {coupon.maxDiscount && (
                        <span className="text-[10px] mt-1">最高抵${formatPrice(coupon.maxDiscount)}</span>
                      )}
                    </>
                  )}
                </div>

                {/* Right - Info */}
                <CardContent className="flex-1 p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold">{coupon.name}</h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        {coupon.description}
                      </p>
                    </div>
                    {coupon.isUsed ? (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        已使用
                      </Badge>
                    ) : (
                      <Button
                        variant="premium"
                        size="sm"
                        className="rounded-lg"
                        onClick={() => handleUseCoupon(coupon.id)}
                      >
                        立即领取
                      </Button>
                    )}
                  </div>

                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {coupon.validFrom} - {coupon.validTo}
                    </span>
                  </div>

                  {coupon.minPurchase > 0 && (
                    <p className="text-xs text-warning mt-2">
                      满${formatPrice(coupon.minPurchase)}可用
                    </p>
                  )}

                  {coupon.category && (
                    <Badge variant="outline" className="mt-2 text-[10px]">
                      限{coupon.category}
                    </Badge>
                  )}
                </CardContent>
              </div>

              {/* Dotted Line */}
              <div className="border-t-2 border-dashed border-border mx-4" />

              {/* Redeem Info */}
              <div className="px-4 py-2 text-xs text-muted-foreground">
                使用说明: 下单时自动抵扣 | 可与活动叠加使用
              </div>
            </Card>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-4">
              <Gift className="w-12 h-12 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-bold mb-2">
              {activeTab === 'available' ? '暂无可用优惠券' : '暂无优惠券'}
            </h3>
            <p className="text-muted-foreground text-center">
              {activeTab === 'available' 
                ? '快去领取更多优惠券吧' 
                : activeTab === 'used' 
                ? '已使用的优惠券会显示在这里'
                : '已过期的优惠券会显示在这里'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
