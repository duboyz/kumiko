// Order types
export enum OrderStatus {
  Pending = 'Pending',
  Confirmed = 'Confirmed',
  Preparing = 'Preparing',
  Ready = 'Ready',
  PickedUp = 'PickedUp',
  Cancelled = 'Cancelled',
}

export interface OrderItemCommand {
  menuItemId: string
  quantity: number
  specialInstructions?: string
}

export interface CreateOrderCommand {
  restaurantId: string
  customerName: string
  customerEmail: string
  customerPhone: string
  pickupDateTime: string
  notes?: string
  items: OrderItemCommand[]
}

export interface CreateOrderResult {
  orderId: string
  totalAmount: number
}

export interface OrderItemDto {
  id: string
  itemName: string
  itemDescription: string
  itemPrice: number
  quantity: number
  subtotal: number
  specialInstructions?: string
}

export interface OrderDto {
  id: string
  restaurantId: string
  restaurantName: string
  customerName: string
  customerEmail: string
  customerPhone: string
  pickupDateTime: string
  status: OrderStatus
  totalAmount: number
  notes?: string
  createdAt: string
  items: OrderItemDto[]
}

export interface GetOrdersResult {
  orders: OrderDto[]
}
