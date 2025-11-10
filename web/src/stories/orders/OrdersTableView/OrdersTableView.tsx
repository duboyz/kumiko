'use client'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Eye, Phone, Mail } from 'lucide-react'
import { OrderDto, ORDER_STATUS_COLORS, ORDER_STATUS_LABELS, OrderStatus, useUpdateOrderStatus, Currency, formatPrice, useLocationSelection } from '@shared'
import { toast } from 'sonner'
import { useState } from 'react'
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

export function OrdersTableView({ orders }: OrdersTableViewProps) {
    const t = useTranslations('orders')
    const { selectedLocation } = useLocationSelection()
    const currency = selectedLocation?.currency ?? Currency.USD
    const updateOrderStatus = useUpdateOrderStatus()
    const [selectedOrder, setSelectedOrder] = useState<OrderDto | null>(null)

    const handleStatusChange = async (orderId: string, newStatus: string) => {
        try {
            await updateOrderStatus.mutateAsync({ orderId, status: newStatus })
            toast.success(t('orderStatusUpdatedSuccessfully'))
        } catch (error) {
            toast.error(t('failedToUpdateStatus'))
        }
    }

    if (orders.length === 0) {
        return (
            <div className="text-center py-12 bg-muted/50 rounded-lg">
                <p className="text-muted-foreground">{t('noOrdersToDisplay')}</p>
            </div>
        )
    }

    return (
        <>
            <div className="border rounded-lg overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/50">
                            <TableHead>{t('orderNumber')}</TableHead>
                            <TableHead>{t('customer')}</TableHead>
                            <TableHead>{t('contact')}</TableHead>
                            <TableHead>{t('pickup')}</TableHead>
                            <TableHead>{t('items')}</TableHead>
                            <TableHead>{t('total')}</TableHead>
                            <TableHead>{t('status')}</TableHead>
                            <TableHead>{t('actions')}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {orders.map(order => (
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

