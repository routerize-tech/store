'use client'

import { useState } from 'react'
import { ShoppingCart, X, Plus, Minus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer'

interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
  image: string
}

interface CartDrawerProps {
  items: CartItem[]
  onUpdateQuantity: (id: number, quantity: number) => void
  onRemoveItem: (id: number) => void
  onCheckout: () => void
}

export function CartDrawer({ items, onUpdateQuantity, onRemoveItem, onCheckout }: CartDrawerProps) {
  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)

  return (
    <Drawer direction="rtl">
      <DrawerTrigger asChild>
        <Button variant="outline" size="sm" className="relative">
          <ShoppingCart className="w-4 h-4 ml-2" />
          السلة
          {items.length > 0 && (
            <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs">
              {items.reduce((sum, item) => sum + item.quantity, 0)}
            </Badge>
          )}
        </Button>
      </DrawerTrigger>
      <DrawerContent className="max-h-[80vh]">
        <DrawerHeader className="text-right">
          <DrawerTitle>سلة التسوق</DrawerTitle>
        </DrawerHeader>
        <div className="px-4 pb-4">
          {items.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingCart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">السلة فارغة</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-4 space-x-reverse">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold">{item.name}</h4>
                        <p className="text-green-600 font-bold">
                          {item.price.toLocaleString()} ج.م
                        </p>
                      </div>
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onRemoveItem(item.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              <Separator />
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold">الإجمالي:</span>
                <span className="text-xl font-bold text-green-600">
                  {total.toLocaleString()} ج.م
                </span>
              </div>
              <Button 
                className="w-full" 
                size="lg"
                onClick={onCheckout}
              >
                إتمام الطلب
              </Button>
            </div>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  )
}