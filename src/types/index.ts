// User types
export interface User {
  id: string
  name: string
  email: string
  phone: string
  avatar?: string
  address?: Address
  balance: number
  points: number
  country?: string
  language?: string
  theme?: 'light' | 'dark' | 'system'
  wechat?: string
  telegram?: string
  createdAt: string
}

export interface Address {
  id: string
  name: string
  phone: string
  country: string
  province: string
  city: string
  district: string
  street: string
  postalCode: string
  isDefault: boolean
}

// Product types
export interface Product {
  id: string
  name: string
  description: string
  price: number
  originalPrice: number
  images: string[]
  category: string
  subcategory?: string
  rating: number
  reviewCount: number
  sales: number
  stock: number
  specifications: Specification[]
  seller: Seller
  tags: string[]
  isHot?: boolean
  isNew?: boolean
  isRecommended?: boolean
  discount?: number
}

export interface Specification {
  name: string
  value: string
}

export interface Seller {
  id: string
  name: string
  avatar: string
  rating: number
  products: number
}

// Category types
export interface Category {
  id: string
  name: string
  icon: string
  image?: string
  subcategories?: Subcategory[]
}

export interface Subcategory {
  id: string
  name: string
  parentId: string
}

// Cart types
export interface CartItem {
  id: string
  product: Product
  quantity: number
  selected: boolean
  specifications: Record<string, string>
}

// Order types
export interface Order {
  id: string
  orderNumber: string
  orderType?: OrderType
  items: OrderItem[]
  totalAmount: number
  originalAmount: number
  discount: number
  status: OrderStatus
  shippingAddress: Address
  paymentMethod: PaymentMethod
  paymentStatus: PaymentStatus
  createdAt: string
  updatedAt: string
  estimatedDelivery?: string
  trackingNumber?: string
  notes?: string
}

export interface OrderItem {
  id: string
  product: Product
  quantity: number
  price: number
  specifications: Record<string, string>
}

export type OrderStatus = 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'completed' | 'cancelled' | 'refunding' | 'refunded'
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded'
export type OrderType = 'mall' | 'errands' | 'exchange' | 'shopping' | 'secondhand'

// Review types
export interface Review {
  id: string
  productId: string
  user: User
  rating: number
  content: string
  images?: string[]
  createdAt: string
  helpful: number
}

// Notification types
export interface Notification {
  id: string
  type: NotificationType
  title: string
  content: string
  image?: string
  isRead: boolean
  createdAt: string
  actionUrl?: string
}

export type NotificationType = 'order' | 'promotion' | 'system' | 'social'

// Payment types
export interface PaymentMethod {
  id: string
  name: string
  icon: string
  description: string
}

// Coupon types
export interface Coupon {
  id: string
  name: string
  description: string
  discountType: 'percentage' | 'fixed'
  discountValue: number
  minPurchase: number
  maxDiscount?: number
  validFrom: string
  validTo: string
  isUsed: boolean
  category?: string
}
