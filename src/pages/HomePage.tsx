import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, Bell, ChevronRight, Flame, Sparkles, Shield, Truck, CreditCard, Headphones } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { useApp } from '@/context/AppContext'
import { products, categories, banners } from '@/data/mockData'
import ProductCard from '@/components/ProductCard'

export default function HomePage() {
  const [currentBanner, setCurrentBanner] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()
  const { state } = useApp()

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  const hotProducts = products.filter(p => p.isHot).slice(0, 6)
  const recommendedProducts = products.slice(0, 8)
  const newProducts = products.filter(p => p.isNew)

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  return (
    <div className="bg-gradient-to-b from-primary/5 via-background to-background">
      {/* Search Bar */}
      <div className="sticky top-14 z-30 px-4 py-3 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="搜索商品..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="pl-12 h-12 rounded-xl bg-muted/50"
            />
          </div>
          <Link to="/notifications">
            <Button variant="ghost" size="icon" className="h-12 w-12 rounded-xl relative">
              <Bell className="w-5 h-5" />
              {state.notifications.filter(n => !n.isRead).length > 0 && (
                <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full" />
              )}
            </Button>
          </Link>
        </div>
      </div>

      <div className="max-w-lg mx-auto">
        {/* Hero Banner */}
        <div className="px-4 py-4">
          <div className="relative h-44 rounded-2xl overflow-hidden shadow-xl">
            {banners.map((banner, index) => (
              <div
                key={banner.id}
                className={`absolute inset-0 transition-opacity duration-500 ${
                  index === currentBanner ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <img
                  src={banner.image}
                  alt={banner.title}
                  className="w-full h-full object-cover"
                />
                <div className={`absolute inset-0 bg-gradient-to-r ${banner.gradient} opacity-60`} />
                <div className="absolute inset-0 flex flex-col justify-center px-6">
                  <h2 className="text-2xl font-bold text-white mb-1">{banner.title}</h2>
                  <p className="text-white/90 text-sm">{banner.subtitle}</p>
                </div>
              </div>
            ))}
            
            {/* Banner Dots */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
              {banners.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentBanner(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentBanner ? 'w-6 bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Quick Services */}
        <div className="px-4 pb-4">
          <div className="grid grid-cols-4 gap-3">
            {[
              { icon: Shield, label: '正品保障', color: 'text-green-600' },
              { icon: Truck, label: '全球物流', color: 'text-blue-600' },
              { icon: CreditCard, label: '安全支付', color: 'text-purple-600' },
              { icon: Headphones, label: '在线客服', color: 'text-orange-600' },
            ].map((service, index) => (
              <div key={index} className="flex flex-col items-center p-3 bg-card rounded-xl shadow-sm">
                <service.icon className={`w-6 h-6 ${service.color} mb-1`} />
                <span className="text-xs text-muted-foreground">{service.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div className="px-4 pb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <span className="w-1 h-5 bg-primary rounded-full" />
              热门分类
            </h2>
            <Link to="/search" className="text-sm text-muted-foreground flex items-center gap-1 hover:text-primary">
              查看更多 <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {categories.slice(0, 8).map((category) => (
              <Link
                key={category.id}
                to={`/category/${category.id}`}
                className="flex flex-col items-center p-3 bg-card rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center text-2xl mb-2">
                  {category.icon}
                </div>
                <span className="text-xs font-medium">{category.name}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Flash Sale */}
        <div className="px-4 pb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <span className="w-1 h-5 bg-primary rounded-full" />
              <Flame className="w-5 h-5 text-primary" />
              限时秒杀
            </h2>
            <Link to="/search?tag=flash" className="text-sm text-muted-foreground flex items-center gap-1 hover:text-primary">
              更多 <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {hotProducts.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} compact />
            ))}
          </div>
        </div>

        {/* New Arrivals */}
        <div className="px-4 pb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <span className="w-1 h-5 bg-secondary rounded-full" />
              <Sparkles className="w-5 h-5 text-secondary" />
              新品推荐
            </h2>
            <Link to="/search?tag=new" className="text-sm text-muted-foreground flex items-center gap-1 hover:text-secondary">
              更多 <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {newProducts.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>

        {/* Recommended For You */}
        <div className="px-4 pb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <span className="w-1 h-5 bg-primary rounded-full" />
              为你推荐
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {recommendedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>

        {/* Bottom Padding */}
        <div className="h-8" />
      </div>
    </div>
  )
}
