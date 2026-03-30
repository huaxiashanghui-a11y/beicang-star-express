import React from 'react'
import { ShoppingCart, Minus, Plus, Trash2, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string
}

interface CartPanelProps {
  onClose: () => void
  onCheckout?: () => void
}

// 模拟购物车数据
const mockCartItems: CartItem[] = [
  {
    id: '1',
    name: 'iPhone 15 Pro Max',
    price: 9999,
    quantity: 1,
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=100&h=100&fit=crop',
  },
  {
    id: '2',
    name: 'AirPods Pro 2',
    price: 1899,
    quantity: 2,
    image: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=100&h=100&fit=crop',
  },
]

/**
 * 购物车悬浮窗内容面板
 */
export default function CartPanel({ onClose, onCheckout }: CartPanelProps) {
  const [items] = React.useState<CartItem[]>(mockCartItems)

  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <div className="flex flex-col h-full">
      {/* 头部 */}
      <div className="px-4 py-3 bg-orange-50 border-b border-orange-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-orange-500" />
            <span className="font-medium text-gray-800">购物车</span>
          </div>
          <span className="text-sm text-orange-600">{totalItems}件商品</span>
        </div>
      </div>

      {/* 商品列表 */}
      <div className="flex-1 overflow-y-auto">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <ShoppingCart className="w-16 h-16 mb-3 opacity-30" />
            <p>购物车是空的</p>
          </div>
        ) : (
          <div className="p-4 space-y-3">
            {items.map((item) => (
              <div key={item.id} className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{item.name}</p>
                  <p className="text-orange-500 font-semibold">¥{item.price}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <button className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300">
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-sm w-6 text-center">{item.quantity}</span>
                    <button className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300">
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-red-500">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 底部结算 */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="flex items-center justify-between mb-3">
          <span className="text-gray-600">合计</span>
          <span className="text-xl font-bold text-orange-500">¥{totalPrice.toLocaleString()}</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            继续购物
          </button>
          <button
            onClick={onCheckout}
            className="flex-1 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center justify-center gap-1"
          >
            去结算
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

// 导出图标组件
export const CartIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
)
