import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, ChevronRight, Flame, Sparkles } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { useApp } from '@/context/AppContext'
import { products, categories, banners } from '@/data/mockData'
import ProductCard from '@/components/ProductCard'
import { HomePageSkeleton } from '@/components/Skeleton'
import Carousel from '@/components/Carousel'
import MarqueeNotice from '@/components/MarqueeNotice'
import SectionTitle from '@/components/SectionTitle'

export default function HomePage() {
  const [currentBanner, setCurrentBanner] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const { state } = useApp()

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500)
    return () => clearTimeout(timer)
  }, [])

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

  if (loading) {
    return <HomePageSkeleton />
  }

  return (
    <div className="bg-gradient-to-b from-primary/5 via-background to-background">
      {/* Search Bar */}
      <div className="sticky top-14 z-30 px-4 py-3 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="relative">
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
      </div>

      {/* Marquee Notice */}
      <MarqueeNotice />

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

        {/* Categories */}
        <div className="px-3 sm:px-4 pb-6">
          <SectionTitle
            title="热门分类"
            icon={<span className="text-base sm:text-lg">📦</span>}
            accentColor="primary"
            showMore
            moreText="查看全部"
            moreHref="/search"
            className="mb-3"
          />
          <div className="grid grid-cols-4 gap-2 sm:gap-3">
            {categories.slice(0, 8).map((category) => (
              <Link
                key={category.id}
                to={`/category/${category.id}`}
                className="flex flex-col items-center p-2 sm:p-3 bg-card rounded-lg sm:rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center text-xl sm:text-2xl mb-1 sm:mb-2">
                  {category.icon}
                </div>
                <span className="text-xs font-medium text-center leading-tight">{category.name}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Flash Sale */}
        <div className="px-3 sm:px-4 pb-6">
          <SectionTitle
            title="限时秒杀"
            icon={<Flame className="w-4 h-4 sm:w-5 sm:h-5" />}
            accentColor="orange"
            showMore
            moreText="更多"
            moreHref="/search?tag=flash"
            className="mb-3"
          />
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            {hotProducts.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} compact />
            ))}
          </div>
        </div>

        {/* New Arrivals */}
        <div className="px-3 sm:px-4 pb-6">
          <SectionTitle
            title="新品推荐"
            icon={<Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />}
            accentColor="secondary"
            showMore
            moreText="更多"
            moreHref="/search?tag=new"
            className="mb-3"
          />
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            {newProducts.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>

        {/* Recommended For You */}
        <div className="px-3 sm:px-4 pb-6">
          <SectionTitle
            title="为你推荐"
            accentColor="primary"
            className="mb-3"
          />
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
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
