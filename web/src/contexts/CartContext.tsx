'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface CartItem {
  menuItemId: string
  name: string
  description: string
  price: number
  quantity: number
  specialInstructions?: string
}

export interface CartContextType {
  items: CartItem[]
  restaurantId: string | null
  restaurantName: string | null
  addItem: (item: Omit<CartItem, 'quantity'>, restaurantId: string, restaurantName: string) => void
  removeItem: (menuItemId: string) => void
  updateQuantity: (menuItemId: string, quantity: number) => void
  updateInstructions: (menuItemId: string, instructions: string) => void
  clearCart: () => void
  getTotalItems: () => number
  getTotalAmount: () => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const CART_STORAGE_KEY = 'cart'

interface CartStorage {
  items: CartItem[]
  restaurantId: string | null
  restaurantName: string | null
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [restaurantId, setRestaurantId] = useState<string | null>(null)
  const [restaurantName, setRestaurantName] = useState<string | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  // Load cart from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(CART_STORAGE_KEY)
    if (stored) {
      try {
        const data: CartStorage = JSON.parse(stored)
        setItems(data.items || [])
        setRestaurantId(data.restaurantId || null)
        setRestaurantName(data.restaurantName || null)
      } catch (error) {
        console.error('Failed to load cart from localStorage:', error)
      }
    }
    setIsLoaded(true)
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      const data: CartStorage = { items, restaurantId, restaurantName }
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(data))
    }
  }, [items, restaurantId, restaurantName, isLoaded])

  const addItem = (item: Omit<CartItem, 'quantity'>, newRestaurantId: string, newRestaurantName: string) => {
    // If cart has items from a different restaurant, confirm clearing
    if (restaurantId && restaurantId !== newRestaurantId) {
      if (!confirm(`Your cart contains items from ${restaurantName}. Clear cart and add items from ${newRestaurantName}?`)) {
        return
      }
      setItems([])
    }

    setRestaurantId(newRestaurantId)
    setRestaurantName(newRestaurantName)

    setItems(prev => {
      const existing = prev.find(i => i.menuItemId === item.menuItemId)
      if (existing) {
        return prev.map(i =>
          i.menuItemId === item.menuItemId ? { ...i, quantity: i.quantity + 1 } : i
        )
      }
      return [...prev, { ...item, quantity: 1 }]
    })
  }

  const removeItem = (menuItemId: string) => {
    setItems(prev => prev.filter(i => i.menuItemId !== menuItemId))
  }

  const updateQuantity = (menuItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(menuItemId)
      return
    }
    setItems(prev =>
      prev.map(i => (i.menuItemId === menuItemId ? { ...i, quantity } : i))
    )
  }

  const updateInstructions = (menuItemId: string, instructions: string) => {
    setItems(prev =>
      prev.map(i =>
        i.menuItemId === menuItemId ? { ...i, specialInstructions: instructions } : i
      )
    )
  }

  const clearCart = () => {
    setItems([])
    setRestaurantId(null)
    setRestaurantName(null)
  }

  const getTotalItems = () => {
    return items.reduce((sum, item) => sum + item.quantity, 0)
  }

  const getTotalAmount = () => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  }

  return (
    <CartContext.Provider
      value={{
        items,
        restaurantId,
        restaurantName,
        addItem,
        removeItem,
        updateQuantity,
        updateInstructions,
        clearCart,
        getTotalItems,
        getTotalAmount,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
