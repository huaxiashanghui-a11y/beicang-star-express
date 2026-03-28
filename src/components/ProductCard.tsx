import { Link } from 'react-router-dom'
import { Star, ShoppingCart, Heart } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useApp } from '@/context/AppContext'
import { Product } from '@/types'
import { useState } from 'react'

interface ProductCardProps {
  product: Product
  compact?: boolean
}

export default function ProductCard({ product, compact = false }: ProductCardProps) {
  const { dispatch } = useApp()
  const [isAdding, setIsAdding] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [isFavorited, setIsFavorited] = useState(false)

  const formatPrice = (price: number) => {
    return (price / 100).toFixed(2)
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsAdding(true)
    dispatch({
      type: 'ADD_TO_CART',
      payload: { product, quantity: 1, specifications: {} },
    })
    setTimeout(() => setIsAdding(false), 600)
  }

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsFavorited(!isFavorited)
  }

  if (compact) {
    return (
      <Link to={`/product/${product.id}`} className="block active:scale-95 transition-transform">
        <div className="bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow active:scale-[0.98]">
          <div className="relative aspect-square bg-muted">
            {!imageLoaded && (
              <div className="absolute inset-0 shimmer" />
            )}
            <img
              src={product.images[0]}
              alt={product.name}
              className={`w-full h-full object-cover transition-opacity ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
              loading="lazy"
              onLoad={() => setImageLoaded(true)}
            />
            {product.discount && (
              <Badge variant="destructive" className="absolute top-2 left-2">
                -{product.discount}%
              </Badge>
            )}
            {product.isNew && (
              <Badge className="absolute top-2 right-2 bg-secondary">
                新品
              </Badge>
            )}
          </div>
          <div className="p-3">
            <h3 className="text-sm font-medium line-clamp-2 mb-2 leading-tight">
              {product.name}
            </h3>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-primary font-bold">${formatPrice(product.price)}</span>
                {product.discount && (
                  <span className="text-xs text-muted-foreground line-through ml-1">
                    ${formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>
              <button
                onClick={handleAddToCart}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                  isAdding
                    ? 'bg-success text-white scale-110'
                    : 'bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground'
                }`}
              >
                <ShoppingCart className={`w-4 h-4 ${isAdding ? 'animate-bounce' : ''}`} />
              </button>
            </div>
            <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
              <Star className="w-3 h-3 fill-warning text-warning" />
              <span>{product.rating}</span>
              <span className="ml-auto">已售{product.sales}</span>
            </div>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <Link to={`/product/${product.id}`} className="block active:scale-95 transition-transform">
      <div className="bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-200 hover:-translate-y-1 active:scale-[0.98]">
        <div className="relative aspect-square bg-muted">
          {!imageLoaded && (
            <div className="absolute inset-0 shimmer" />
          )}
          <img
            src={product.images[0]}
            alt={product.name}
            className={`w-full h-full object-cover transition-opacity ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
          />
          {product.discount && (
            <Badge variant="destructive" className="absolute top-2 left-2 font-bold animate-bounce-in">
              -{product.discount}%
            </Badge>
          )}
          {product.isNew && (
            <Badge className="absolute top-2 right-2 bg-secondary font-bold animate-bounce-in">
              新品
            </Badge>
          )}
          <button
            onClick={handleFavorite}
            className={`absolute bottom-2 right-2 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow-sm transition-all ${
              isFavorited ? 'text-destructive scale-110' : 'text-muted-foreground hover:text-destructive'
            }`}
          >
            <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current animate-bounce-in' : ''}`} />
          </button>
        </div>
        <div className="p-3">
          <h3 className="text-sm font-medium line-clamp-2 mb-2 leading-tight min-h-[2.5rem]">
            {product.name}
          </h3>
          <div className="flex items-center gap-1 mb-2">
            <Star className="w-3 h-3 fill-warning text-warning" />
            <span className="text-xs font-medium">{product.rating}</span>
            <span className="text-xs text-muted-foreground ml-auto">
              {product.reviewCount}条评价
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-primary font-bold text-lg">${formatPrice(product.price)}</span>
              {product.discount && (
                <span className="text-xs text-muted-foreground line-through ml-1">
                  ${formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
