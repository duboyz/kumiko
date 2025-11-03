import React, { useState } from 'react'
import {
  Modal,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { OrderDto } from '@/types/order.types'
import { orderService } from '@/services/order.service'

interface OrderDetailModalProps {
  visible: boolean
  order: OrderDto | null
  onClose: () => void
  onStatusUpdate?: () => void
}

export default function OrderDetailModal({ visible, order, onClose, onStatusUpdate }: OrderDetailModalProps) {
  const [isUpdating, setIsUpdating] = useState(false)

  if (!order) return null

  const availableStatuses = ['Pending', 'Confirmed', 'Ready', 'Completed', 'Cancelled']

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
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

  const handleStatusChange = async (newStatus: string) => {
    if (newStatus === order.status) return

    Alert.alert(
      'Change Status',
      `Change order status to ${newStatus}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: async () => {
            setIsUpdating(true)
            try {
              await orderService.updateOrderStatus(order.id, newStatus)
              Alert.alert('Success', 'Order status updated successfully')
              onStatusUpdate?.()
              onClose()
            } catch (error) {
              Alert.alert('Error', error instanceof Error ? error.message : 'Failed to update status')
            } finally {
              setIsUpdating(false)
            }
          },
        },
      ]
    )
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.backButton}>
            <Text style={styles.backButtonText}>‹</Text>
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Order Details</Text>
            <Text style={styles.orderId}>#{order.id.substring(0, 8)}</Text>
          </View>
          <View style={styles.headerRight} />
        </View>

        <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <View style={styles.statusSection}>
              <Text style={styles.statusSectionTitle}>Current Status</Text>
              <View style={[styles.statusBadgeLarge, { backgroundColor: getStatusColor(order.status) }]}>
                <Text style={styles.statusTextLarge}>{order.status}</Text>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Change Status</Text>
              <View style={styles.statusSelectContainer}>
                {availableStatuses.map((status) => (
                  <TouchableOpacity
                    key={status}
                    style={[
                      styles.statusSelectOption,
                      order.status === status && styles.statusSelectOptionActive,
                    ]}
                    onPress={() => handleStatusChange(status)}
                    disabled={isUpdating}
                    activeOpacity={0.7}
                  >
                    <View
                      style={[
                        styles.statusDot,
                        { backgroundColor: getStatusColor(status) },
                      ]}
                    />
                    <Text
                      style={[
                        styles.statusSelectText,
                        order.status === status && styles.statusSelectTextActive,
                      ]}
                    >
                      {status}
                    </Text>
                    {order.status === status && (
                      <Text style={styles.checkIcon}>✓</Text>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
              {isUpdating && (
                <View style={styles.updatingOverlay}>
                  <ActivityIndicator color="#000" />
                  <Text style={styles.updatingText}>Updating status...</Text>
                </View>
              )}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Customer Information</Text>
              <View style={styles.infoCard}>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Name</Text>
                  <Text style={styles.infoValue}>{order.customerName}</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Phone</Text>
                  <Text style={styles.infoValue}>{order.customerPhone}</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Email</Text>
                  <Text style={[styles.infoValue, styles.emailText]}>{order.customerEmail}</Text>
                </View>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Pickup Details</Text>
              <View style={styles.infoCard}>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Date</Text>
                  <Text style={styles.infoValue}>{formatDate(order.pickupDate)}</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Time</Text>
                  <Text style={styles.infoValue}>{order.pickupTime}</Text>
                </View>
              </View>
            </View>

            {order.additionalNote && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Additional Notes</Text>
                <View style={styles.noteCard}>
                  <Text style={styles.noteText}>{order.additionalNote}</Text>
                </View>
              </View>
            )}

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Order Items</Text>
              <View style={styles.itemsCard}>
                {order.orderItems.map((item, index) => (
                  <View key={item.id}>
                    {index > 0 && <View style={styles.divider} />}
                    <View style={styles.orderItem}>
                      <View style={styles.orderItemLeft}>
                        <Text style={styles.quantityText}>{item.quantity}x</Text>
                        <View style={styles.itemDetails}>
                          <Text style={styles.itemName}>{item.menuItemName}</Text>
                          {item.menuItemOptionName && (
                            <Text style={styles.itemOption}>{item.menuItemOptionName}</Text>
                          )}
                          {item.specialInstructions && (
                            <Text style={styles.itemInstructions}>
                              Note: {item.specialInstructions}
                            </Text>
                          )}
                        </View>
                      </View>
                      <Text style={styles.itemPrice}>{formatCurrency(item.priceAtOrder)}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.totalSection}>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total Amount</Text>
                <Text style={styles.totalAmount}>{formatCurrency(order.totalAmount)}</Text>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Order Timeline</Text>
              <View style={styles.infoCard}>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Created</Text>
                  <Text style={styles.infoValue}>{formatDate(order.createdAt)}</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Updated</Text>
                  <Text style={styles.infoValue}>{formatDate(order.updatedAt)}</Text>
                </View>
              </View>
            </View>
          </ScrollView>
      </SafeAreaView>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: '#000000',
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -8,
  },
  backButtonText: {
    fontSize: 36,
    color: '#ffffff',
    fontWeight: '300',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
  },
  orderId: {
    fontSize: 12,
    color: '#a0a0a0',
    marginTop: 2,
    fontFamily: 'monospace',
  },
  headerRight: {
    width: 40,
  },
  scrollContent: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -4,
  },
  statusSection: {
    padding: 20,
    alignItems: 'center',
  },
  statusSectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statusBadgeLarge: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
  },
  statusTextLarge: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    textTransform: 'capitalize',
  },
  statusSelectContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
  },
  statusSelectOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
    gap: 12,
  },
  statusSelectOptionActive: {
    backgroundColor: '#f9fafb',
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  statusSelectText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#1f2937',
    textTransform: 'capitalize',
  },
  statusSelectTextActive: {
    fontWeight: '600',
  },
  checkIcon: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
  },
  updatingOverlay: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  updatingText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 12,
  },
  infoCard: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    color: '#1f2937',
    fontWeight: '600',
    textAlign: 'right',
    flex: 1,
    marginLeft: 16,
  },
  emailText: {
    fontSize: 13,
  },
  divider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 4,
  },
  noteCard: {
    backgroundColor: '#fef3c7',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#f59e0b',
  },
  noteText: {
    fontSize: 14,
    color: '#92400e',
    lineHeight: 20,
  },
  itemsCard: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 16,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 12,
  },
  orderItemLeft: {
    flexDirection: 'row',
    flex: 1,
    gap: 8,
  },
  quantityText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1f2937',
    minWidth: 32,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  itemOption: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 2,
  },
  itemInstructions: {
    fontSize: 12,
    color: '#9ca3af',
    fontStyle: 'italic',
    marginTop: 4,
  },
  itemPrice: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1f2937',
    marginLeft: 12,
  },
  totalSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#000',
    padding: 20,
    borderRadius: 12,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
  },
})
