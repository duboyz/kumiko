'use client'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Eye, Phone, Mail, Search, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react'
import { OrderDto, ORDER_STATUS_COLORS, ORDER_STATUS_LABELS, OrderStatus, useUpdateOrderStatus, Currency, formatPrice, useLocationSelection } from '@shared'
import { toast } from 'sonner'
import { useState, useMemo } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { useTranslations } from 'next-intl'

interface OrdersTableViewProps {
    orders: OrderDto[]
}

type SortField = 'customerName' | 'pickupDate' | 'totalAmount' | 'status' | 'createdAt'
type SortDirection = 'asc' | 'desc' | null

export function OrdersTableView({ orders }: OrdersTableViewProps) {
    const t = useTranslations('orders')
    const { selectedLocation } = useLocationSelection()
    const currency = selectedLocation?.currency ?? Currency.USD
    const updateOrderStatus = useUpdateOrderStatus()
    const [selectedOrder, setSelectedOrder] = useState<OrderDto | null>(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [sortField, setSortField] = useState<SortField | null>(null)
    const [sortDirection, setSortDirection] = useState<SortDirection>(null)

    const handleStatusChange = async (orderId: string, newStatus: string) => {
        try {
            await updateOrderStatus.mutateAsync({ orderId, status: newStatus })
            toast.success(t('orderStatusUpdatedSuccessfully'))
        } catch (error) {
            toast.error(t('failedToUpdateStatus'))
        }
    }

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            // Cycle through: asc -> desc -> null
            if (sortDirection === 'asc') {
                setSortDirection('desc')
            } else if (sortDirection === 'desc') {
                setSortDirection(null)
                setSortField(null)
            }
        } else {
            setSortField(field)
            setSortDirection('asc')
        }
    }

    const getSortIcon = (field: SortField) => {
        if (sortField !== field) {
            return <ArrowUpDown className="h-4 w-4 ml-1 opacity-40" />
        }
        if (sortDirection === 'asc') {
            return <ArrowUp className="h-4 w-4 ml-1" />
        }
        return <ArrowDown className="h-4 w-4 ml-1" />
    }

    // Filter and sort orders
    const filteredAndSortedOrders = useMemo(() => {
        let filtered = orders

        // Apply search filter
        if (searchTerm) {
            const search = searchTerm.toLowerCase()
            filtered = filtered.filter(order => 
                order.customerName.toLowerCase().includes(search) ||
                order.customerPhone.toLowerCase().includes(search) ||
                order.customerEmail?.toLowerCase().includes(search)
            )
        }

        // Apply sorting
        if (sortField && sortDirection) {
            filtered = [...filtered].sort((a, b) => {
                let aValue: any
                let bValue: any

                switch (sortField) {
                    case 'customerName':
                        aValue = a.customerName.toLowerCase()
                        bValue = b.customerName.toLowerCase()
                        break
                    case 'pickupDate':
                        aValue = new Date(a.pickupDate).getTime()
                        bValue = new Date(b.pickupDate).getTime()
                        break
                    case 'totalAmount':
                        aValue = a.totalAmount
                        bValue = b.totalAmount
                        break
                    case 'status':
                        aValue = a.status
                        bValue = b.status
                        break
                    case 'createdAt':
                        aValue = new Date(a.createdAt).getTime()
                        bValue = new Date(b.createdAt).getTime()
                        break
                    default:
                        return 0
                }

                if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1
                if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1
                return 0
            })
        }

        return filtered
    }, [orders, searchTerm, sortField, sortDirection])

    if (orders.length === 0) {
        return (
            <div className="text-center py-12 bg-muted/50 rounded-lg">
                <p className="text-muted-foreground">{t('noOrdersToDisplay')}</p>
            </div>
        )
    }

    return (
        <>
            {/* Search Input */}
            <div className="mb-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder={t('searchByNamePhoneEmail') || 'Search by name, phone, or email...'}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>
                {searchTerm && (
                    <p className="text-sm text-muted-foreground mt-2">
                        {t('showingResults', { count: filteredAndSortedOrders.length, total: orders.length }) || 
                        `Showing ${filteredAndSortedOrders.length} of ${orders.length} orders`}
                    </p>
                )}
            </div>

            {filteredAndSortedOrders.length === 0 ? (
                <div className="text-center py-12 bg-muted/50 rounded-lg border">
                    <p className="text-muted-foreground">
                        {searchTerm ? t('noOrdersMatchSearch') || 'No orders match your search' : t('noOrdersToDisplay')}
                    </p>
                </div>
            ) : (
                <div className="border rounded-lg overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/50">
                                <TableHead>{t('orderNumber')}</TableHead>
                                <TableHead>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 px-2 flex items-center hover:bg-muted/50"
                                        onClick={() => handleSort('customerName')}
                                    >
                                        {t('customer')}
                                        {getSortIcon('customerName')}
                                    </Button>
                                </TableHead>
                                <TableHead>{t('contact')}</TableHead>
                                <TableHead>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 px-2 flex items-center hover:bg-muted/50"
                                        onClick={() => handleSort('pickupDate')}
                                    >
                                        {t('pickup')}
                                        {getSortIcon('pickupDate')}
                                    </Button>
                                </TableHead>
                                <TableHead>{t('items')}</TableHead>
                                <TableHead>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 px-2 flex items-center hover:bg-muted/50"
                                        onClick={() => handleSort('totalAmount')}
                                    >
                                        {t('total')}
                                        {getSortIcon('totalAmount')}
                                    </Button>
                                </TableHead>
                                <TableHead>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 px-2 flex items-center hover:bg-muted/50"
                                        onClick={() => handleSort('status')}
                                    >
                                        {t('status')}
                                        {getSortIcon('status')}
                                    </Button>
                                </TableHead>
                                <TableHead>{t('actions')}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredAndSortedOrders.map(order => (
                            <TableRow key={order.id} className="hover:bg-muted/30">
                                <TableCell className="font-mono text-xs">
                                    {order.id.slice(0, 8)}
                                </TableCell>
                                <TableCell>
                                    <div>
                                        <p className="font-medium">{order.customerName}</p>
                                        {order.additionalNote && (
                                            <p className="text-xs text-muted-foreground line-clamp-1">{order.additionalNote}</p>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="space-y-1 text-xs">
                                        <div className="flex items-center gap-1">
                                            <Phone className="h-3 w-3" />
                                            {order.customerPhone}
                                        </div>
                                        {order.customerEmail && (
                                            <div className="flex items-center gap-1 text-muted-foreground">
                                                <Mail className="h-3 w-3" />
                                                {order.customerEmail}
                                            </div>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="text-sm">
                                        <p>{new Date(order.pickupDate).toLocaleDateString()}</p>
                                        <p className="text-muted-foreground">{order.pickupTime}</p>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <span className="text-sm">{t('itemsCount', { count: order.orderItems.length })}</span>
                                </TableCell>
                                <TableCell>
                                    <span className="font-semibold">{formatPrice(order.totalAmount, currency)}</span>
                                </TableCell>
                                <TableCell>
                                    <Select
                                        value={order.status}
                                        onValueChange={(value) => handleStatusChange(order.id, value)}
                                        disabled={updateOrderStatus.isPending}
                                    >
                                        <SelectTrigger className="w-[140px]">
                                            <Badge className={ORDER_STATUS_COLORS[order.status]}>
                                                {ORDER_STATUS_LABELS[order.status]}
                                            </Badge>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Pending">{t('pending')}</SelectItem>
                                            <SelectItem value="Confirmed">{t('confirmed')}</SelectItem>
                                            <SelectItem value="Ready">{t('ready')}</SelectItem>
                                            <SelectItem value="Completed">{t('completed')}</SelectItem>
                                            <SelectItem value="Cancelled">{t('cancelled')}</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </TableCell>
                                <TableCell>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setSelectedOrder(order)}
                                    >
                                        <Eye className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            )}

            {/* Order Details Dialog */}
            <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
                <DialogContent className="max-w-2xl">
                    {selectedOrder && (
                        <>
                            <DialogHeader>
                                <DialogTitle>{t('orderDetails')} - {selectedOrder.customerName}</DialogTitle>
                                <DialogDescription>
                                    {t('orderId')}: {selectedOrder.id}
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                                {/* Customer Info */}
                                <div>
                                    <h4 className="font-semibold mb-2">{t('customerInformation')}</h4>
                                    <dl className="grid grid-cols-2 gap-2 text-sm">
                                        <dt className="text-muted-foreground">{t('name')}:</dt>
                                        <dd>{selectedOrder.customerName}</dd>
                                        <dt className="text-muted-foreground">{t('phone')}:</dt>
                                        <dd>{selectedOrder.customerPhone}</dd>
                                        {selectedOrder.customerEmail && (
                                            <>
                                                <dt className="text-muted-foreground">{t('email')}:</dt>
                                                <dd>{selectedOrder.customerEmail}</dd>
                                            </>
                                        )}
                                    </dl>
                                </div>

                                {/* Pickup Info */}
                                <div>
                                    <h4 className="font-semibold mb-2">{t('pickupInformation')}</h4>
                                    <dl className="grid grid-cols-2 gap-2 text-sm">
                                        <dt className="text-muted-foreground">{t('date')}:</dt>
                                        <dd>{new Date(selectedOrder.pickupDate).toLocaleDateString()}</dd>
                                        <dt className="text-muted-foreground">{t('time')}:</dt>
                                        <dd>{selectedOrder.pickupTime}</dd>
                                    </dl>
                                </div>

                                {/* Order Items */}
                                <div>
                                    <h4 className="font-semibold mb-2">{t('orderItems')}</h4>
                                    <div className="space-y-2">
                                        {selectedOrder.orderItems.map(item => (
                                            <div key={item.id} className="flex justify-between items-start p-3 bg-muted rounded-lg">
                                                <div>
                                                    <p className="font-medium">{item.menuItemName}</p>
                                                    {item.menuItemOptionName && (
                                                        <p className="text-sm text-muted-foreground">{item.menuItemOptionName}</p>
                                                    )}
                                                    {item.specialInstructions && (
                                                        <p className="text-xs text-muted-foreground mt-1">{t('note')}: {item.specialInstructions}</p>
                                                    )}
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm">x{item.quantity}</p>
                                                    <p className="font-medium">{formatPrice(item.priceAtOrder * item.quantity, currency)}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Additional Notes */}
                                {selectedOrder.additionalNote && (
                                    <div>
                                        <h4 className="font-semibold mb-2">{t('additionalNotes')}</h4>
                                        <p className="text-sm text-muted-foreground">{selectedOrder.additionalNote}</p>
                                    </div>
                                )}

                                {/* Total */}
                                <div className="flex justify-between items-center pt-4 border-t">
                                    <span className="font-semibold">{t('total')}:</span>
                                    <span className="text-2xl font-bold">{formatPrice(selectedOrder.totalAmount, currency)}</span>
                                </div>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </>
    )
}

