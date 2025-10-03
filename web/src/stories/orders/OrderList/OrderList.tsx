'use client'

import { useOrders } from '@shared'
import { OrderCard } from '../OrderCard'
import { LoadingState, ErrorState, EmptyState } from '@/components'
import { ShoppingBag } from 'lucide-react'

export function OrderList() {
  const { data, isLoading, error } = useOrders()

  if (isLoading) {
    return <LoadingState variant="centered" />
  }

  if (error) {
    return <ErrorState title="Failed to Load Orders" message="Unable to fetch orders. Please try again." variant="inline" />
  }

  if (!data || !data.orders || data.orders.length === 0) {
    return (
      <EmptyState
        icon={ShoppingBag}
        title="No Orders Yet"
        description="Orders from customers will appear here"
      />
    )
  }

  return (
    <div className="space-y-4">
      {data.orders.map(order => (
        <OrderCard key={order.id} order={order} />
      ))}
    </div>
  )
}
