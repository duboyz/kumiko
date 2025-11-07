import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { CartItem, CustomerInfo } from '@/stories/orders/shared/types'
import { Currency } from '../types'

interface CartStore {
  cart: CartItem[]
  customerInfo: CustomerInfo
  restaurantId: string | null
  menuId: string | null
  currency: Currency

  // Cart actions
  addToCart: (
    menuItemId: string,
    menuItemName: string,
    price: number,
    menuItemOptionId?: string,
    menuItemOptionName?: string
  ) => void
  updateQuantity: (index: number, delta: number) => void
  removeItem: (index: number) => void
  clearCart: () => void

  // Customer info actions
  setCustomerInfo: (field: keyof CustomerInfo, value: string) => void
  clearCustomerInfo: () => void

  // Restaurant context
  setRestaurantContext: (restaurantId: string, menuId: string, currency: Currency) => void

  // Computed
  getTotalAmount: () => number
  getItemCount: () => number
}

const getTodayDate = (): string => {
  const today = new Date()
  return today.toISOString().split('T')[0]
}

const initialCustomerInfo: CustomerInfo = {
  name: '',
  phone: '',
  email: '',
  pickupDate: getTodayDate(),
  pickupTime: '12:00',
  additionalNote: '',
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cart: [],
      customerInfo: initialCustomerInfo,
      restaurantId: null,
      menuId: null,
      currency: Currency.USD,

      addToCart: (menuItemId, menuItemName, price, menuItemOptionId, menuItemOptionName) => {
        const { cart } = get()
        const existingIndex = cart.findIndex(
          item => item.menuItemId === menuItemId && item.menuItemOptionId === menuItemOptionId
        )

        if (existingIndex >= 0) {
          const newCart = [...cart]
          newCart[existingIndex].quantity += 1
          set({ cart: newCart })
        } else {
          set({
            cart: [
              ...cart,
              {
                menuItemId,
                menuItemName,
                menuItemOptionId,
                menuItemOptionName,
                price,
                quantity: 1,
              },
            ],
          })
        }
      },

      updateQuantity: (index, delta) => {
        const { cart } = get()
        const newCart = [...cart]
        newCart[index].quantity += delta
        if (newCart[index].quantity <= 0) {
          newCart.splice(index, 1)
        }
        set({ cart: newCart })
      },

      removeItem: index => {
        const { cart } = get()
        const newCart = [...cart]
        newCart.splice(index, 1)
        set({ cart: newCart })
      },

      clearCart: () => set({ cart: [] }),

      setCustomerInfo: (field, value) => {
        const { customerInfo } = get()
        set({ customerInfo: { ...customerInfo, [field]: value } })
      },

      clearCustomerInfo: () =>
        set({
          customerInfo: {
            ...initialCustomerInfo,
            pickupDate: getTodayDate(),
          },
        }),

      setRestaurantContext: (restaurantId, menuId, currency) => {
        set({ restaurantId, menuId, currency })
      },

      getTotalAmount: () => {
        const { cart } = get()
        return cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
      },

      getItemCount: () => {
        const { cart } = get()
        return cart.reduce((sum, item) => sum + item.quantity, 0)
      },
    }),
    {
      name: 'cart-storage',
    }
  )
)
