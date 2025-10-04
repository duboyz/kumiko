'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ShoppingCart, Plus, Minus, Trash2, Check, AlertCircle } from 'lucide-react'
import { GetMenuByIdResult, useCreateOrder, CreateOrderItemDto } from '@shared'
import { toast } from 'sonner'

interface CartItem {
  menuItemId: string
  menuItemName: string
  menuItemOptionId?: string
  menuItemOptionName?: string
  price: number
  quantity: number
  specialInstructions?: string
}

interface OrderFormProps {
  menu: GetMenuByIdResult
  restaurantId: string
  className?: string
}

export function OrderForm({ menu, restaurantId, className = '' }: OrderFormProps) {
  const [cart, setCart] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  
  // Customer info
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [customerEmail, setCustomerEmail] = useState('')
  const [pickupDate, setPickupDate] = useState('')
  const [pickupTime, setPickupTime] = useState('12:00')
  const [additionalNote, setAdditionalNote] = useState('')

  const createOrderMutation = useCreateOrder()

  const addToCart = (
    menuItemId: string,
    menuItemName: string,
    price: number,
    menuItemOptionId?: string,
    menuItemOptionName?: string
  ) => {
    const existingIndex = cart.findIndex(
      item => item.menuItemId === menuItemId && item.menuItemOptionId === menuItemOptionId
    )

    if (existingIndex >= 0) {
      const newCart = [...cart]
      newCart[existingIndex].quantity += 1
      setCart(newCart)
    } else {
      setCart([
        ...cart,
        {
          menuItemId,
          menuItemName,
          menuItemOptionId,
          menuItemOptionName,
          price,
          quantity: 1,
        },
      ])
    }
    toast.success(`Added ${menuItemName} to cart`)
  }

  const updateQuantity = (index: number, delta: number) => {
    const newCart = [...cart]
    newCart[index].quantity += delta
    if (newCart[index].quantity <= 0) {
      newCart.splice(index, 1)
    }
    setCart(newCart)
  }

  const removeItem = (index: number) => {
    const newCart = [...cart]
    newCart.splice(index, 1)
    setCart(newCart)
  }

  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)

  const handleSubmitOrder = async () => {
    // Validation
    if (!customerName.trim()) {
      toast.error('Please enter your name')
      return
    }
    if (!customerPhone.trim()) {
      toast.error('Please enter your phone number')
      return
    }
    if (!customerEmail.trim()) {
      toast.error('Please enter your email')
      return
    }
    if (!pickupDate) {
      toast.error('Please select a pickup date')
      return
    }
    if (cart.length === 0) {
      toast.error('Your cart is empty')
      return
    }

    try {
      const orderItems: CreateOrderItemDto[] = cart.map(item => ({
        menuItemId: item.menuItemId,
        menuItemOptionId: item.menuItemOptionId,
        quantity: item.quantity,
        specialInstructions: item.specialInstructions,
      }))

      // Format pickup date as ISO string
      const pickupDateISO = new Date(pickupDate).toISOString()
      
      // Format pickup time as HH:mm:ss
      const pickupTimeFormatted = pickupTime.includes(':') 
        ? (pickupTime.split(':').length === 2 ? `${pickupTime}:00` : pickupTime)
        : '12:00:00'

      await createOrderMutation.mutateAsync({
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerEmail: customerEmail.trim(),
        pickupDate: pickupDateISO,
        pickupTime: pickupTimeFormatted,
        additionalNote: additionalNote.trim(),
        restaurantId,
        restaurantMenuId: menu.id,
        orderItems,
      })

      toast.success('Order placed successfully!')
      
      // Reset form
      setCart([])
      setCustomerName('')
      setCustomerPhone('')
      setCustomerEmail('')
      setPickupDate('')
      setPickupTime('12:00')
      setAdditionalNote('')
      setIsCheckoutOpen(false)
      setIsCartOpen(false)
    } catch (error) {
      toast.error('Failed to place order. Please try again.')
    }
  }

  return (
    <div className={className}>
      {/* Floating Cart Button */}
      <Dialog open={isCartOpen} onOpenChange={setIsCartOpen}>
        <DialogTrigger asChild>
          <Button
            size="lg"
            className="fixed bottom-6 right-6 rounded-full shadow-lg z-50"
            disabled={cart.length === 0}
          >
            <ShoppingCart className="w-5 h-5 mr-2" />
            Cart ({totalItems})
            {totalAmount > 0 && <Badge className="ml-2">${totalAmount.toFixed(2)}</Badge>}
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Your Cart</DialogTitle>
            <DialogDescription>Review your items before checkout</DialogDescription>
          </DialogHeader>

          {cart.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">Your cart is empty</div>
          ) : (
            <div className="space-y-4">
              {cart.map((item, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium">{item.menuItemName}</h4>
                        {item.menuItemOptionName && (
                          <p className="text-sm text-muted-foreground">Option: {item.menuItemOptionName}</p>
                        )}
                        <p className="text-sm font-semibold text-green-600 mt-1">${item.price.toFixed(2)} each</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => updateQuantity(index, -1)}
                          className="h-8 w-8"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => updateQuantity(index, 1)}
                          className="h-8 w-8"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => removeItem(index)}
                          className="h-8 w-8 text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="text-right mt-2 font-semibold">${(item.price * item.quantity).toFixed(2)}</div>
                  </CardContent>
                </Card>
              ))}

              <div className="border-t pt-4">
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total:</span>
                  <span>${totalAmount.toFixed(2)}</span>
                </div>
              </div>

              <Button onClick={() => setIsCheckoutOpen(true)} className="w-full" size="lg">
                Proceed to Checkout
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Checkout Dialog */}
      <Dialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Checkout</DialogTitle>
            <DialogDescription>Complete your order details</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="customerName">Name *</Label>
                <Input
                  id="customerName"
                  value={customerName}
                  onChange={e => setCustomerName(e.target.value)}
                  placeholder="John Doe"
                />
              </div>
              <div>
                <Label htmlFor="customerPhone">Phone *</Label>
                <Input
                  id="customerPhone"
                  value={customerPhone}
                  onChange={e => setCustomerPhone(e.target.value)}
                  placeholder="555-1234"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="customerEmail">Email *</Label>
              <Input
                id="customerEmail"
                type="email"
                value={customerEmail}
                onChange={e => setCustomerEmail(e.target.value)}
                placeholder="john@example.com"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="pickupDate">Pickup Date *</Label>
                <Input
                  id="pickupDate"
                  type="date"
                  value={pickupDate}
                  onChange={e => setPickupDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div>
                <Label htmlFor="pickupTime">Pickup Time *</Label>
                <Input
                  id="pickupTime"
                  type="time"
                  value={pickupTime}
                  onChange={e => setPickupTime(e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="additionalNote">Additional Notes</Label>
              <Textarea
                id="additionalNote"
                value={additionalNote}
                onChange={e => setAdditionalNote(e.target.value)}
                placeholder="Any special requests or dietary restrictions?"
                rows={3}
              />
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between items-center text-lg font-bold mb-4">
                <span>Total:</span>
                <span>${totalAmount.toFixed(2)}</span>
              </div>
              <Button
                onClick={handleSubmitOrder}
                className="w-full"
                size="lg"
                disabled={createOrderMutation.isPending}
              >
                {createOrderMutation.isPending ? 'Placing Order...' : 'Place Order'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Menu Display */}
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">{menu.name}</h2>
          {menu.description && <p className="text-lg text-muted-foreground">{menu.description}</p>}
        </div>

        <div className="space-y-12">
          {menu.categories.map(category => (
            <div key={category.id}>
              <h3 className="text-2xl font-bold mb-6 border-b pb-2">{category.name}</h3>
              {category.description && <p className="text-muted-foreground mb-6">{category.description}</p>}

              <div className="space-y-6">
                {category.menuCategoryItems
                  .sort((a, b) => a.orderIndex - b.orderIndex)
                  .map(categoryItem => {
                    const item = categoryItem.menuItem
                    if (!item || !item.isAvailable) return null

                    return (
                      <Card key={categoryItem.id} className="overflow-hidden">
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h4 className="text-lg font-semibold mb-2">{item.name}</h4>
                              {item.description && (
                                <p className="text-sm text-muted-foreground mb-3">{item.description}</p>
                              )}

                              {/* Show allergens if present */}
                              {item.allergens && item.allergens.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 mt-2 items-center">
                                  <AlertCircle className="w-3.5 h-3.5 text-orange-500" />
                                  {item.allergens.map(allergen => (
                                    <Badge key={allergen.id} variant="secondary" className="text-xs">
                                      {allergen.name}
                                    </Badge>
                                  ))}
                                </div>
                              )}

                              {item.hasOptions && item.options.length > 0 ? (
                                <div className="mt-4 space-y-2">
                                  {item.options
                                    .sort((a, b) => a.orderIndex - b.orderIndex)
                                    .map(option => (
                                      <div key={option.id} className="flex justify-between items-center">
                                        <div>
                                          <span className="font-medium">{option.name}</span>
                                          {option.description && (
                                            <span className="text-sm text-muted-foreground ml-2">
                                              ({option.description})
                                            </span>
                                          )}
                                        </div>
                                        <div className="flex items-center gap-3">
                                          <span className="font-semibold text-green-600">
                                            ${option.price.toFixed(2)}
                                          </span>
                                          <Button
                                            size="sm"
                                            onClick={() =>
                                              addToCart(item.id, item.name, option.price, option.id, option.name)
                                            }
                                          >
                                            <Plus className="w-4 h-4 mr-1" />
                                            Add
                                          </Button>
                                        </div>
                                      </div>
                                    ))}
                                </div>
                              ) : (
                                <div className="mt-4 flex justify-between items-center">
                                  <span className="text-xl font-bold text-green-600">
                                    ${item.price?.toFixed(2) || 'N/A'}
                                  </span>
                                  <Button onClick={() => addToCart(item.id, item.name, item.price || 0)}>
                                    <Plus className="w-4 h-4 mr-1" />
                                    Add to Cart
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

