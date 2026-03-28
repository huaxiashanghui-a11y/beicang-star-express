import { Link } from 'react-router-dom'
import { Star, ShoppingCart, Heart } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useApp } from '@/context/AppContext'
import { Product } from '@/types'

interface ProductCardProps {
  product: Product
  compact?: boolean
}

export default function ProductCard({ product, compact = false }: ProductCardProps) {
  const { dispatch } = useApp()

  const formatPrice = (price: number) => {
    return (price / 100).toFixed(2)
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    dispatch({
      type: 'ADD_TO_CART',
      payload: { product, quantity: 1, specifications: {} },
    })
  }

  if (compact) {
    return (
      <Link to={`/product/${product.id}`} className="block">
        <div className="bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
          <div className="relative aspect-square">
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover"
              loading="lazy"
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
                className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <ShoppingCart className="w-4 h-4" />
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
    <Link to={`/product/${product.id}`} className="block">
      <div className="bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
        <div className="relative aspect-square">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          {product.discount && (
            <Badge variant="destructive" className="absolute top-2 left-2 font-bold">
              -{product.discount}%
            </Badge>
          )}
          {product.isNew && (
            <Badge className="absolute top-2 right-2 bg-secondary font-bold">
              新品
            </Badge>
          )}
          <button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
            }}
            className="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-white/90 text-muted-foreground flex items-center justify-center hover:text-destructive transition-colors shadow-sm"
          >
            <Heart className="w-4 h-4" />
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
