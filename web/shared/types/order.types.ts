// Order types matching backend

export interface CreateOrderCommand {
  customerName: string
  customerPhone: string
  customerEmail: string
  pickupDate: string // ISO date string
  pickupTime: string // HH:mm:ss format
  additionalNote: string
  restaurantId: string
  restaurantMenuId: string
  orderItems: CreateOrderItemDto[]
}

export interface CreateOrderItemDto {
  menuItemId: string
  menuItemOptionId?: string
  quantity: number
  specialInstructions?: string
}

export interface CreateOrderResult {
  id: string
  customerName: string
  customerPhone: string
  customerEmail: string
  pickupDate: string
  pickupTime: string
  additionalNote: string
  status: OrderStatus
  totalAmount: number
  restaurantId: string
  restaurantMenuId: string
}

export interface GetRestaurantOrdersResult {
  orders: OrderDto[]
}

export interface OrderDto {
  id: string
  customerName: string
  customerPhone: string
  customerEmail: string
  pickupDate: string
  pickupTime: string
  additionalNote: string
  status: OrderStatus
  totalAmount: number
  restaurantId: string
  restaurantMenuId: string
  orderItems: OrderItemDto[]
  createdAt: string
  updatedAt: string
}

export interface OrderItemDto {
  id: string
  menuItemId: string
  menuItemName: string
  menuItemOptionId?: string
  menuItemOptionName?: string
  quantity: number
  priceAtOrder: number
  specialInstructions?: string
}

export interface UpdateOrderStatusCommand {
  orderId: string
  status: OrderStatus
}

export interface UpdateOrderStatusResult {
  id: string
  status: OrderStatus
  updatedAt: string
}

export type OrderStatus = 'Pending' | 'Confirmed' | 'Ready' | 'Completed' | 'Cancelled'

export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  Pending: 'bg-yellow-100 text-yellow-800',
  Confirmed: 'bg-blue-100 text-blue-800',
  Ready: 'bg-green-100 text-green-800',
  Completed: 'bg-gray-100 text-gray-800',
  Cancelled: 'bg-red-100 text-red-800',
}

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  Pending: 'Pending',
  Confirmed: 'Confirmed',
  Ready: 'Ready for Pickup',
  Completed: 'Completed',
  Cancelled: 'Cancelled',
}

export interface GetOrderByIdResult {
  id: string
  customerName: string
  customerPhone: string
  customerEmail: string
  pickupDate: string
  pickupTime: string
  additionalNote: string
  status: OrderStatus
  totalAmount: number
  restaurant: RestaurantInfoDto
  orderItems: OrderItemDto[]
  createdAt: string
  updatedAt: string
}

export interface RestaurantInfoDto {
  id: string
  name: string
  address: string
  city: string
  currency: string
}

