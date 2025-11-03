import React, { useEffect, useState, useRef } from 'react'
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAuth } from '@/contexts/auth.context'
import { orderService } from '@/services/order.service'
import { OrderDto } from '@/types/order.types'
import OrderDetailModal from '@/components/OrderDetailModal'
import { notificationService } from '@/services/notification.service'

export default function HomeScreen() {
  const { selectedLocationId, selectedLocation } = useAuth()
  const [orders, setOrders] = useState<OrderDto[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<OrderDto | null>(null)
  const [modalVisible, setModalVisible] = useState(false)

  const notificationListener = useRef<any>(null)
  const responseListener = useRef<any>(null)

  useEffect(() => {
    if (selectedLocationId) {
      loadOrders()
    }
  }, [selectedLocationId])

  useEffect(() => {
    // Set up notification handlers
    notificationListener.current = notificationService.addNotificationReceivedListener(
      (notification) => {
        console.log('Notification received:', notification)
        // Refresh orders when notification is received
        if (selectedLocationId) {
          loadOrders()
        }
      }
    )

    responseListener.current = notificationService.addNotificationResponseListener(
      (response) => {
        console.log('Notification tapped:', response)
        // Refresh orders when notification is tapped
        if (selectedLocationId) {
          loadOrders()
        }
      }
    )

    return () => {
      notificationListener.current?.remove()
      responseListener.current?.remove()
    }
  }, [selectedLocationId])

  const loadOrders = async (isRefresh = false) => {
    if (!selectedLocationId) return

    try {
      if (isRefresh) setIsRefreshing(true)
      const result = await orderService.getRestaurantOrders(selectedLocationId)
      setOrders(result.orders)
    } catch (error) {
      Alert.alert('Error', 'Failed to load orders')
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return '#FFA500'
      case 'confirmed':
        return '#007AFF'
      case 'ready':
        return '#34C759'
      case 'completed':
        return '#8E8E93'
      case 'cancelled':
        return '#FF3B30'
      default:
        return '#8E8E93'
    }
  }

  const handleOrderPress = (order: OrderDto) => {
    setSelectedOrder(order)
    setModalVisible(true)
  }

  const handleCloseModal = () => {
    setModalVisible(false)
    setSelectedOrder(null)
  }

  if (isLoading) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#000" />
        <Text style={styles.loadingText}>Loading orders...</Text>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Orders</Text>
          {selectedLocation && (
            <Text style={styles.subtitle}>{selectedLocation.restaurant.name}</Text>
          )}
        </View>
      </View>

      <View style={styles.listContainer}>
        {orders.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No orders yet</Text>
            <Text style={styles.emptySubtext}>Orders will appear here when customers place them</Text>
          </View>
        ) : (
          <FlatList
            data={orders}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={() => loadOrders(true)}
                tintColor="#000"
              />
            }
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.orderCard}
                activeOpacity={0.7}
                onPress={() => handleOrderPress(item)}
              >
                <View style={styles.orderHeader}>
                  <View style={styles.orderHeaderLeft}>
                    <Text style={styles.customerName}>{item.customerName}</Text>
                    <Text style={styles.orderDate}>{formatDate(item.createdAt)}</Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
                    <Text style={styles.statusText}>{item.status}</Text>
                  </View>
                </View>

                <View style={styles.orderDetails}>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Pickup:</Text>
                    <Text style={styles.detailValue}>
                      {formatDate(item.pickupDate)} at {item.pickupTime}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Items:</Text>
                    <Text style={styles.detailValue}>{item.orderItems.length} items</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Total:</Text>
                    <Text style={styles.totalAmount}>{formatCurrency(item.totalAmount)}</Text>
                  </View>
                </View>

                {item.orderItems.length > 0 && (
                  <View style={styles.itemsList}>
                    {item.orderItems.slice(0, 3).map((orderItem) => (
                      <Text key={orderItem.id} style={styles.itemText}>
                        {orderItem.quantity}x {orderItem.menuItemName}
                        {orderItem.menuItemOptionName && ` (${orderItem.menuItemOptionName})`}
                      </Text>
                    ))}
                    {item.orderItems.length > 3 && (
                      <Text style={styles.moreItems}>+{item.orderItems.length - 3} more items</Text>
                    )}
                  </View>
                )}
              </TouchableOpacity>
            )}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        )}
      </View>

      <OrderDetailModal
        visible={modalVisible}
        order={selectedOrder}
        onClose={handleCloseModal}
        onStatusUpdate={() => loadOrders()}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 24,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    backgroundColor: '#000000',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    color: '#a0a0a0',
    fontWeight: '500',
  },
  listContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
  },
  list: {
    padding: 16,
    paddingTop: 20,
    paddingBottom: 32,
  },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  orderHeaderLeft: {
    flex: 1,
  },
  customerName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 13,
    color: '#9ca3af',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    marginLeft: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
    textTransform: 'capitalize',
  },
  orderDetails: {
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    paddingTop: 12,
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    color: '#1f2937',
    fontWeight: '600',
  },
  totalAmount: {
    fontSize: 16,
    color: '#000',
    fontWeight: '700',
  },
  itemsList: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    gap: 4,
  },
  itemText: {
    fontSize: 13,
    color: '#6b7280',
  },
  moreItems: {
    fontSize: 13,
    color: '#9ca3af',
    fontStyle: 'italic',
    marginTop: 4,
  },
  separator: {
    height: 12,
  },
});
