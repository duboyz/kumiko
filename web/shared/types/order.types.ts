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
  paymentMethodId?: string
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
  paymentIntentClientSecret?: string | null
}

export interface CreateCheckoutSessionResult {
  checkoutUrl: string
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

export enum OrderStatus {
  Pending = 'Pending',
  Confirmed = 'Confirmed',
  Ready = 'Ready',
  Completed = 'Completed',
  Cancelled = 'Cancelled',
}

export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  [OrderStatus.Pending]: 'bg-yellow-100 text-yellow-800',
  [OrderStatus.Confirmed]: 'bg-blue-100 text-blue-800',
  [OrderStatus.Ready]: 'bg-green-100 text-green-800',
  [OrderStatus.Completed]: 'bg-gray-100 text-gray-800',
  [OrderStatus.Cancelled]: 'bg-red-100 text-red-800',
}

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  [OrderStatus.Pending]: 'Pending',
  [OrderStatus.Confirmed]: 'Confirmed',
  [OrderStatus.Ready]: 'Ready for Pickup',
  [OrderStatus.Completed]: 'Completed',
  [OrderStatus.Cancelled]: 'Cancelled',
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

// Customer order history
export interface CustomerOrderDto {
  id: string
  customerName: string
  customerPhone: string
  customerEmail: string
  pickupDate: string
  pickupTime: string
  status: string
  totalAmount: number
  createdAt: string
  restaurant: CustomerOrderRestaurantDto
}

export interface CustomerOrderRestaurantDto {
  id: string
  name: string
}
