import React, { useState, useEffect } from 'react'
import {
    View,
    Text,
    Modal,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Pressable,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'

type OrderStatus = 'pending' | 'confirmed' | 'ready' | 'completed' | 'cancelled'
type SortOption = 'createdDate' | 'pickupDate'

interface OrderFiltersModalProps {
    visible: boolean
    onClose: () => void
    selectedStatuses: OrderStatus[]
    sortBy: SortOption
    onApply: (statuses: OrderStatus[], sortBy: SortOption) => void
}

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; description: string }> = {
    pending: {
        label: 'Pending',
        color: '#FFA500',
        description: 'Awaiting confirmation',
    },
    confirmed: {
        label: 'Confirmed',
        color: '#007AFF',
        description: 'Being prepared',
    },
    ready: {
        label: 'Ready',
        color: '#34C759',
        description: 'Ready for pickup',
    },
    completed: {
        label: 'Completed',
        color: '#8E8E93',
        description: 'Picked up',
    },
    cancelled: {
        label: 'Cancelled',
        color: '#FF3B30',
        description: 'Order cancelled',
    },
}

export default function OrderFiltersModal({
    visible,
    onClose,
    selectedStatuses,
    sortBy,
    onApply,
}: OrderFiltersModalProps) {
    const [localStatuses, setLocalStatuses] = useState<OrderStatus[]>(selectedStatuses)
    const [localSortBy, setLocalSortBy] = useState<SortOption>(sortBy)

    // Sync local state with props when modal opens
    useEffect(() => {
        if (visible) {
            setLocalStatuses(selectedStatuses)
            setLocalSortBy(sortBy)
        }
    }, [visible, selectedStatuses, sortBy])

    const toggleStatus = (status: OrderStatus) => {
        setLocalStatuses((prev) => {
            if (prev.includes(status)) {
                return prev.filter((s) => s !== status)
            } else {
                return [...prev, status]
            }
        })
    }

    const handleApply = () => {
        onApply(localStatuses, localSortBy)
        onClose()
    }

    const handleClear = () => {
        setLocalStatuses([])
        setLocalSortBy('createdDate')
    }

    const handleCancel = () => {
        // Reset to original values
        setLocalStatuses(selectedStatuses)
        setLocalSortBy(sortBy)
        onClose()
    }

    return (
        <Modal
            visible={visible}
            animationType="fade"
            transparent={true}
            onRequestClose={handleCancel}
        >
            <Pressable style={styles.backdrop} onPress={handleCancel}>
                <Pressable style={styles.modalContainer} onPress={(e) => e.stopPropagation()}>
                    {/* Header */}
                    <View style={styles.header}>
                        <View>
                            <Text style={styles.headerTitle}>Filter & Sort</Text>
                            <Text style={styles.headerSubtitle}>
                                {localStatuses.length === 0 ? 'All orders' : `${localStatuses.length} status${localStatuses.length === 1 ? '' : 'es'} selected`}
                            </Text>
                        </View>
                        <TouchableOpacity onPress={handleCancel} style={styles.closeButton}>
                            <Ionicons name="close" size={24} color="#000" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.content}>
                        {/* Order Status Section */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Order Status</Text>
                            <View style={styles.statusOptions}>
                                {(Object.keys(STATUS_CONFIG) as OrderStatus[]).map((status) => {
                                    const config = STATUS_CONFIG[status]
                                    const isSelected = localStatuses.includes(status)

                                    return (
                                        <TouchableOpacity
                                            key={status}
                                            style={[
                                                styles.statusCard,
                                                isSelected && styles.statusCardSelected,
                                            ]}
                                            onPress={() => toggleStatus(status)}
                                            activeOpacity={0.7}
                                        >
                                            <View style={styles.statusCardContent}>
                                                <View
                                                    style={[
                                                        styles.statusIconCircle,
                                                        { backgroundColor: config.color },
                                                    ]}
                                                >

                                                </View>
                                                <View style={styles.statusCardText}>
                                                    <Text style={[styles.statusLabel, isSelected && styles.statusLabelSelected]}>
                                                        {config.label}
                                                    </Text>
                                                    <Text style={styles.statusDescription}>{config.description}</Text>
                                                </View>
                                            </View>
                                            {isSelected && (
                                                <Ionicons name="checkmark-circle" size={22} color="#000" />
                                            )}
                                        </TouchableOpacity>
                                    )
                                })}
                            </View>
                        </View>

                        {/* Sort Section */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Sort By</Text>
                            <View style={styles.sortOptions}>
                                <TouchableOpacity
                                    style={[
                                        styles.sortCard,
                                        localSortBy === 'createdDate' && styles.sortCardSelected,
                                    ]}
                                    onPress={() => setLocalSortBy('createdDate')}
                                >
                                    <View style={styles.sortCardContent}>
                                        <Ionicons
                                            name="calendar-outline"
                                            size={20}
                                            color={localSortBy === 'createdDate' ? '#000' : '#666'}
                                        />
                                        <View style={styles.sortCardText}>
                                            <Text
                                                style={[
                                                    styles.sortLabel,
                                                    localSortBy === 'createdDate' && styles.sortLabelSelected,
                                                ]}
                                            >
                                                Created Date
                                            </Text>
                                            <Text style={styles.sortDescription}>Newest orders first</Text>
                                        </View>
                                    </View>
                                    {localSortBy === 'createdDate' && (
                                        <Ionicons name="checkmark-circle" size={22} color="#000" />
                                    )}
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[
                                        styles.sortCard,
                                        localSortBy === 'pickupDate' && styles.sortCardSelected,
                                    ]}
                                    onPress={() => setLocalSortBy('pickupDate')}
                                >
                                    <View style={styles.sortCardContent}>
                                        <Ionicons
                                            name="time-outline"
                                            size={20}
                                            color={localSortBy === 'pickupDate' ? '#000' : '#666'}
                                        />
                                        <View style={styles.sortCardText}>
                                            <Text
                                                style={[
                                                    styles.sortLabel,
                                                    localSortBy === 'pickupDate' && styles.sortLabelSelected,
                                                ]}
                                            >
                                                Pickup Date
                                            </Text>
                                            <Text style={styles.sortDescription}>Upcoming pickups first</Text>
                                        </View>
                                    </View>
                                    {localSortBy === 'pickupDate' && (
                                        <Ionicons name="checkmark-circle" size={22} color="#000" />
                                    )}
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ScrollView>

                    {/* Footer */}
                    <View style={styles.footer}>
                        <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
                            <Text style={styles.clearButtonText}>Clear</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
                            <Text style={styles.applyButtonText}>Apply</Text>
                        </TouchableOpacity>
                    </View>
                </Pressable>
            </Pressable>
        </Modal>
    )
}

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContainer: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        height: '90%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
        flexDirection: 'column',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 24,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#000',
        marginBottom: 4,
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#666',
    },
    closeButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#f5f5f5',
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        flexGrow: 1,
        flexShrink: 1,
        paddingHorizontal: 20,
    },
    section: {
        paddingVertical: 24,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#000',
        marginBottom: 16,
    },
    statusOptions: {
        gap: 12,
    },
    statusCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        borderRadius: 16,
        padding: 16,
        borderWidth: 2,
        borderColor: '#e0e0e0',
    },
    statusCardSelected: {
        backgroundColor: '#fff',
        borderColor: '#000',
    },
    statusCardContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        flex: 1,
    },
    statusIconCircle: {
        width: 24,
        height: 24,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    statusCardText: {
        flex: 1,
    },
    statusLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#666',
        marginBottom: 2,
    },
    statusLabelSelected: {
        color: '#000',
    },
    statusDescription: {
        fontSize: 13,
        color: '#999',
    },
    sortOptions: {
        gap: 12,
    },
    sortCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        borderRadius: 16,
        padding: 16,
        borderWidth: 2,
        borderColor: '#e0e0e0',
    },
    sortCardSelected: {
        backgroundColor: '#fff',
        borderColor: '#000',
    },
    sortCardContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        flex: 1,
    },
    sortCardText: {
        flex: 1,
    },
    sortLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#666',
        marginBottom: 2,
    },
    sortLabelSelected: {
        color: '#000',
    },
    sortDescription: {
        fontSize: 13,
        color: '#999',
    },
    footer: {
        flexDirection: 'row',
        gap: 8,
        paddingHorizontal: 20,
        paddingVertical: 20,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        backgroundColor: '#fff',
    },
    cancelButton: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 12,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#e0e0e0',
        alignItems: 'center',
    },
    cancelButtonText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#666',
    },
    clearButton: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 12,
        backgroundColor: '#f5f5f5',
        alignItems: 'center',
    },
    clearButtonText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#666',
    },
    applyButton: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 12,
        backgroundColor: '#000',
        alignItems: 'center',
    },
    applyButtonText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#fff',
    },
})

