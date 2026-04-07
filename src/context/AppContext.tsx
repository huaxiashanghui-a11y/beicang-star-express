import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react'
import { User, CartItem, Order, Notification, Address, Coupon } from '@/types'
import { currentUser, products as initialProducts } from '@/data/mockData'
import { getProfile } from '@/api/profile'

interface AppState {
  user: User | null
  isAuthenticated: boolean
  cart: CartItem[]
  orders: Order[]
  notifications: Notification[]
  addresses: Address[]
  coupons: Coupon[]
  searchHistory: string[]
  viewedProducts: string[]
  currentRoute: string
}

type AppAction =
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'UPDATE_USER'; payload: Partial<User> }
  | { type: 'LOGIN'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'ADD_TO_CART'; payload: { product: any; quantity: number; specifications: Record<string, string> } }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'UPDATE_CART_ITEM'; payload: { id: string; quantity: number } }
  | { type: 'TOGGLE_CART_ITEM'; payload: string }
  | { type: 'SELECT_ALL_CART'; payload: boolean }
  | { type: 'CLEAR_CART' }
  | { type: 'ADD_ORDER'; payload: { order: Order } }
  | { type: 'UPDATE_ORDER'; payload: { id: string; updates: Partial<Order> } }
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'MARK_NOTIFICATION_READ'; payload: string }
  | { type: 'MARK_ALL_NOTIFICATIONS_READ' }
  | { type: 'ADD_ADDRESS'; payload: Address }
  | { type: 'UPDATE_ADDRESS'; payload: Address }
  | { type: 'DELETE_ADDRESS'; payload: string }
  | { type: 'USE_COUPON'; payload: string }
  | { type: 'ADD_SEARCH_HISTORY'; payload: string }
  | { type: 'CLEAR_SEARCH_HISTORY' }
  | { type: 'ADD_VIEWED_PRODUCT'; payload: string }
  | { type: 'SET_ROUTE'; payload: string }

const initialState: AppState = {
  user: null,
  isAuthenticated: false,
  cart: [],
  orders: [],
  notifications: [],
  addresses: [
    {
      id: '1',
      name: '张三',
      phone: '+95 9 123 4567',
      country: '缅甸',
      province: '仰光省',
      city: '仰光',
      district: '甘马育区',
      street: '甘敏路123号',
      postalCode: '11041',
      isDefault: true,
    },
  ],
  coupons: [],
  searchHistory: ['iPhone', '华为', '耐克运动鞋'],
  viewedProducts: [],
  currentRoute: '/',
}

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload, isAuthenticated: !!action.payload }
    case 'UPDATE_USER':
      return { ...state, user: state.user ? { ...state.user, ...action.payload } : null }
    case 'LOGIN':
      return { ...state, user: action.payload, isAuthenticated: true }
    case 'LOGOUT':
      return { ...state, user: null, isAuthenticated: false }
    case 'ADD_TO_CART': {
      const existingItem = state.cart.find(
        item => item.product.id === action.payload.product.id
      )
      if (existingItem) {
        return {
          ...state,
          cart: state.cart.map(item =>
            item.product.id === action.payload.product.id
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          ),
        }
      }
      return {
        ...state,
        cart: [
          ...state.cart,
          {
            id: `cart-${Date.now()}`,
            product: action.payload.product,
            quantity: action.payload.quantity,
            selected: true,
            specifications: action.payload.specifications,
          },
        ],
      }
    }
    case 'REMOVE_FROM_CART':
      return { ...state, cart: state.cart.filter(item => item.id !== action.payload) }
    case 'UPDATE_CART_ITEM':
      return {
        ...state,
        cart: state.cart.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      }
    case 'TOGGLE_CART_ITEM':
      return {
        ...state,
        cart: state.cart.map(item =>
          item.id === action.payload ? { ...item, selected: !item.selected } : item
        ),
      }
    case 'SELECT_ALL_CART':
      return {
        ...state,
        cart: state.cart.map(item => ({ ...item, selected: action.payload })),
      }
    case 'CLEAR_CART':
      return { ...state, cart: [] }
    case 'ADD_ORDER':
      return { ...state, orders: [action.payload.order, ...state.orders], cart: [] }
    case 'UPDATE_ORDER':
      return {
        ...state,
        orders: state.orders.map(order =>
          order.id === action.payload.id
            ? { ...order, ...action.payload.updates }
            : order
        ),
      }
    case 'ADD_NOTIFICATION':
      return { ...state, notifications: [action.payload, ...state.notifications] }
    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        notifications: state.notifications.map(n =>
          n.id === action.payload ? { ...n, isRead: true } : n
        ),
      }
    case 'MARK_ALL_NOTIFICATIONS_READ':
      return {
        ...state,
        notifications: state.notifications.map(n => ({ ...n, isRead: true })),
      }
    case 'ADD_ADDRESS':
      return { ...state, addresses: [...state.addresses, action.payload] }
    case 'UPDATE_ADDRESS':
      return {
        ...state,
        addresses: state.addresses.map(a =>
          a.id === action.payload.id ? action.payload : a
        ),
      }
    case 'DELETE_ADDRESS':
      return {
        ...state,
        addresses: state.addresses.filter(a => a.id !== action.payload),
      }
    case 'USE_COUPON':
      return {
        ...state,
        coupons: state.coupons.map(c =>
          c.id === action.payload ? { ...c, isUsed: true } : c
        ),
      }
    case 'ADD_SEARCH_HISTORY':
      return {
        ...state,
        searchHistory: [
          action.payload,
          ...state.searchHistory.filter(s => s !== action.payload),
        ].slice(0, 20),
      }
    case 'CLEAR_SEARCH_HISTORY':
      return { ...state, searchHistory: [] }
    case 'ADD_VIEWED_PRODUCT':
      return {
        ...state,
        viewedProducts: [
          action.payload,
          ...state.viewedProducts.filter(p => p !== action.payload),
        ].slice(0, 50),
      }
    case 'SET_ROUTE':
      return { ...state, currentRoute: action.payload }
    default:
      return state
  }
}

const AppContext = createContext<{
  state: AppState
  dispatch: React.Dispatch<AppAction>
} | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState)

  // 应用启动时从后端获取最新用户数据
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      getProfile()
        .then((res) => {
          if (res.success && res.data) {
            dispatch({ type: 'SET_USER', payload: res.data })
          }
        })
        .catch(() => {
          // 忽略错误，保持本地状态
        })
    }
  }, [])

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}
