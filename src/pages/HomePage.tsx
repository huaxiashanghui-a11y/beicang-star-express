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

// 本地服务模块配置 - 8个独立图标模块
const localServices = [
  { id: 'notice', title: '木姐公告', icon: '📢', color: 'bg-red-50 text-red-600', href: '/announcements' },
  { id: 'house', title: '房屋租赁', icon: '🏠', color: 'bg-blue-50 text-blue-600', href: '/housing' },
  { id: 'secondhand', title: '二手信息', icon: '🔄', color: 'bg-purple-50 text-purple-600', href: '/secondhand' },
  { id: 'exchange', title: '换汇', icon: '💱', color: 'bg-green-50 text-green-600', href: '/exchange' },
  { id: 'food', title: '美食', icon: '🍜', color: 'bg-orange-50 text-orange-600', href: '/food' },
  { id: 'visa', title: '签证', icon: '📋', color: 'bg-cyan-50 text-cyan-600', href: '/visa' },
  { id: 'entertainment', title: '娱乐', icon: '🎉', color: 'bg-pink-50 text-pink-600', href: '/entertainment' },
  { id: 'car', title: '汽修', icon: '🚗', color: 'bg-gray-50 text-gray-600', href: '/car' },
]

export default function HomePage() {
  const [currentBanner, setCurrentBanner] = useState(0)
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

  if (loading) {
    return <HomePageSkeleton />
  }

  return (
    <div className="bg-gradient-to-b from-primary/5 via-background to-background">
      {/* 1. 木姐公告（跑马灯） */}
      <MarqueeNotice />

      <div className="max-w-lg mx-auto">
        {/* 2. 轮播活动 Banner */}
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

        {/* 3. 新增8个功能图标模块（独立模块） */}
        <div className="px-3 sm:px-4 pb-6">
          <div className="grid grid-cols-4 gap-2 sm:gap-3">
            {localServices.map((service) => (
              <Link
                key={service.id}
                to={service.href}
                className="flex flex-col items-center p-2 sm:p-3 bg-card rounded-lg sm:rounded-xl shadow-sm hover:shadow-md transition-shadow active:scale-95"
              >
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center text-xl sm:text-2xl mb-1 sm:mb-2 ${service.color}`}>
                  {service.icon}
                </div>
                <span className="text-xs font-medium text-center leading-tight">{service.title}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* 4. 热门分类（在新增功能下方） */}
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

        {/* 5. 限时秒杀 */}
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

        {/* 6. 新品推荐 */}
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

        {/* 7. 为你推荐 */}
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
