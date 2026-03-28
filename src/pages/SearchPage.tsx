import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { Search, X, TrendingUp, Clock, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { useApp } from '@/context/AppContext'
import { products, categories } from '@/data/mockData'
import ProductCard from '@/components/ProductCard'

export default function SearchPage() {
  const [searchParams] = useSearchParams()
  const { state, dispatch } = useApp()
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [showHistory, setShowHistory] = useState(true)

  const hotKeywords = ['iPhone', '华为', '耐克', '雅诗兰黛', 'MacBook', '戴森']
  const { searchHistory } = state

  const handleSearch = (searchQuery: string) => {
    if (searchQuery.trim()) {
      dispatch({ type: 'ADD_SEARCH_HISTORY', payload: searchQuery.trim() })
      setShowHistory(false)
    }
  }

  const handleClearHistory = () => {
    dispatch({ type: 'CLEAR_SEARCH_HISTORY' })
  }

  const handleRemoveHistory = (keyword: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const newHistory = searchHistory.filter(h => h !== keyword)
    dispatch({ type: 'CLEAR_SEARCH_HISTORY' })
    newHistory.forEach(h => dispatch({ type: 'ADD_SEARCH_HISTORY', payload: h }))
  }

  const filteredProducts = query.trim()
    ? products.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase()) ||
        p.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
      )
    : []

  return (
    <div className="min-h-screen bg-background">
      {/* Search Bar */}
      <div className="sticky top-14 z-30 bg-background/95 backdrop-blur border-b border-border px-4 py-3">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="搜索商品..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch(query)}
              className="pl-12 h-12 rounded-xl bg-muted/50"
              autoFocus
            />
            {query && (
              <button
                onClick={() => { setQuery(''); setShowHistory(true); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
          <Button
            variant="premium"
            className="h-12 px-6 rounded-xl"
            onClick={() => handleSearch(query)}
          >
            搜索
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Search History */}
        {showHistory && searchHistory.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold flex items-center gap-2">
                <Clock className="w-5 h-5 text-muted-foreground" />
                搜索历史
              </h3>
              <button
                onClick={handleClearHistory}
                className="text-sm text-muted-foreground hover:text-primary"
              >
                清空
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {searchHistory.map((keyword) => (
                <button
                  key={keyword}
                  onClick={() => { setQuery(keyword); handleSearch(keyword); }}
                  className="flex items-center gap-2 px-3 py-2 rounded-full bg-muted text-sm hover:bg-muted/80 transition-colors"
                >
                  {keyword}
                  <X
                    className="w-4 h-4 text-muted-foreground hover:text-destructive"
                    onClick={(e) => handleRemoveHistory(keyword, e)}
                  />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Hot Keywords */}
        {showHistory && (
          <div className="mb-6">
            <h3 className="font-semibold flex items-center gap-2 mb-3">
              <TrendingUp className="w-5 h-5 text-primary" />
              热门搜索
            </h3>
            <div className="flex flex-wrap gap-2">
              {hotKeywords.map((keyword, index) => (
                <button
                  key={keyword}
                  onClick={() => { setQuery(keyword); handleSearch(keyword); }}
                  className={`px-3 py-2 rounded-full text-sm transition-colors flex items-center gap-2 ${
                    index < 3 ? 'bg-primary/10 text-primary' : 'bg-muted hover:bg-muted/80'
                  }`}
                >
                  {index < 3 && <span className="text-xs">🔥</span>}
                  {keyword}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Categories Quick Access */}
        {showHistory && (
          <div className="mb-6">
            <h3 className="font-semibold mb-3">热门分类</h3>
            <div className="grid grid-cols-4 gap-3">
              {categories.slice(0, 8).map((category) => (
                <Link
                  key={category.id}
                  to={`/category/${category.id}`}
                  className="flex flex-col items-center p-3 bg-card rounded-xl shadow-sm hover:shadow-md transition-shadow"
                >
                  <span className="text-2xl mb-1">{category.icon}</span>
                  <span className="text-xs">{category.name}</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Search Results */}
        {!showHistory && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-muted-foreground">
                找到 {filteredProducts.length} 件商品
              </p>
              <select className="text-sm bg-transparent outline-none text-muted-foreground">
                <option>综合排序</option>
                <option>销量优先</option>
                <option>价格从低到高</option>
                <option>价格从高到低</option>
              </select>
            </div>

            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-lg font-bold mb-2">未找到相关商品</h3>
                <p className="text-muted-foreground">换个关键词试试吧</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
