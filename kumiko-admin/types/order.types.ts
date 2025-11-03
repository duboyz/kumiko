export interface OrderItemDto {
  id: string
  menuItemId: string
  menuItemName: string
  menuItemOptionId?: string | null
  menuItemOptionName?: string | null
  quantity: number
  priceAtOrder: number
  specialInstructions?: string | null
}

export interface OrderDto {
  id: string
  customerName: string
  customerPhone: string
  customerEmail: string
  pickupDate: string
  pickupTime: string
  additionalNote: string
  status: string
  totalAmount: number
  restaurantId: string
  restaurantMenuId: string
  orderItems: OrderItemDto[]
  createdAt: string
  updatedAt: string
}

export interface GetRestaurantOrdersQuery {
  restaurantId: string
}

export interface GetRestaurantOrdersResult {
  orders: OrderDto[]
}

export interface UpdateOrderStatusResult {
  id: string
  status: string
  updatedAt: string
}
