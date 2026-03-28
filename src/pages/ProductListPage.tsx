import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Filter, Grid3X3, List, ChevronDown, SlidersHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { products, categories } from '@/data/mockData'
import ProductCard from '@/components/ProductCard'

export default function ProductListPage() {
  const { categoryId } = useParams()
  const [sortBy, setSortBy] = useState('popular')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilter, setShowFilter] = useState(false)
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 999999])
  const [selectedRating, setSelectedRating] = useState(0)

  const category = categories.find(c => c.id === categoryId)
  const categoryProducts = categoryId
    ? products.filter(p => p.category === category?.name)
    : products

  const sortOptions = [
    { value: 'popular', label: '综合排序' },
    { value: 'sales', label: '销量优先' },
    { value: 'price-low', label: '价格从低到高' },
    { value: 'price-high', label: '价格从高到低' },
    { value: 'rating', label: '评分最高' },
  ]

  const filteredProducts = [...categoryProducts].sort((a, b) => {
    switch (sortBy) {
      case 'sales':
        return b.sales - a.sales
      case 'price-low':
        return a.price - b.price
      case 'price-high':
        return b.price - a.price
      case 'rating':
        return b.rating - a.rating
      default:
        return 0
    }
  })

  return (
    <div className="min-h-screen bg-background">
      {/* Sticky Header */}
      <div className="sticky top-14 z-30 bg-background/95 backdrop-blur border-b border-border">
        {/* Category Banner */}
        {category && (
          <div
            className="h-32 bg-cover bg-center relative"
            style={{ backgroundImage: `url(${category.image})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-4 left-4 text-white">
              <h1 className="text-2xl font-bold">{category.name}</h1>
              <p className="text-sm opacity-80">{categoryProducts.length} 件商品</p>
            </div>
          </div>
        )}

        {/* Sort & Filter Bar */}
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
            {sortOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setSortBy(option.value)}
                className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors ${
                  sortBy === option.value
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowFilter(!showFilter)}
            className="ml-2"
          >
            <SlidersHorizontal className="w-5 h-5" />
          </Button>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center justify-between px-4 pb-2">
          <p className="text-sm text-muted-foreground">
            共 {filteredProducts.length} 件商品
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-primary/10 text-primary' : 'text-muted-foreground'
              }`}
            >
              <Grid3X3 className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list' ? 'bg-primary/10 text-primary' : 'text-muted-foreground'
              }`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Filter Panel */}
      {showFilter && (
        <div className="px-4 py-4 bg-card border-b border-border animate-slide-in-down">
          <div className="mb-4">
            <h3 className="font-semibold mb-3">价格区间</h3>
            <div className="flex items-center gap-3">
              <input
                type="number"
                placeholder="最低价"
                value={priceRange[0] / 100 || ''}
                onChange={(e) => setPriceRange([Number(e.target.value) * 100, priceRange[1]])}
                className="w-28 h-10 rounded-lg border border-input bg-background px-3 text-sm"
              />
              <span className="text-muted-foreground">-</span>
              <input
                type="number"
                placeholder="最高价"
                value={priceRange[1] === 999999 ? '' : priceRange[1] / 100}
                onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value) * 100 || 999999])}
                className="w-28 h-10 rounded-lg border border-input bg-background px-3 text-sm"
              />
            </div>
          </div>

          <div className="mb-4">
            <h3 className="font-semibold mb-3">评分</h3>
            <div className="flex gap-2">
              {[4, 3, 2, 1].map((rating) => (
                <button
                  key={rating}
                  onClick={() => setSelectedRating(selectedRating === rating ? 0 : rating)}
                  className={`px-3 py-1.5 rounded-lg text-sm flex items-center gap-1 transition-colors ${
                    selectedRating === rating
                      ? 'bg-warning text-white'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {rating}+ <span className="text-[10px]">星</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                setPriceRange([0, 999999])
                setSelectedRating(0)
              }}
            >
              重置
            </Button>
            <Button
              variant="premium"
              className="flex-1"
              onClick={() => setShowFilter(false)}
            >
              应用筛选
            </Button>
          </div>
        </div>
      )}

      {/* Product Grid */}
      <div className="px-4 py-4">
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-2 gap-3">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredProducts.map((product) => (
              <Link
                key={product.id}
                to={`/product/${product.id}`}
                className="flex gap-3 bg-card rounded-xl p-3 shadow-sm"
              >
                <div className="w-28 h-28 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium line-clamp-2 mb-2">{product.name}</h3>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                    <span className="text-warning">★</span>
                    <span>{product.rating}</span>
                    <span className="mx-2">|</span>
                    <span>{product.reviewCount}条评价</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-primary">
                      ${(product.price / 100).toFixed(2)}
                    </span>
                    {product.discount && (
                      <Badge variant="destructive">-{product.discount}%</Badge>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-lg font-semibold mb-2">暂无商品</h3>
            <p className="text-muted-foreground">试试其他分类或筛选条件</p>
          </div>
        )}
      </div>
    </div>
  )
}
