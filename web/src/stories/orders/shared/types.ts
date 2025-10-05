export interface CartItem {
  menuItemId: string
  menuItemName: string
  menuItemOptionId?: string
  menuItemOptionName?: string
  price: number
  quantity: number
  specialInstructions?: string
}

export interface CustomerInfo {
  name: string
  phone: string
  email: string
  pickupDate: string
  pickupTime: string
  additionalNote: string
}
