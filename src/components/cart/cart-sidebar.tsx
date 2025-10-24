'use client'

import { useState } from 'react'
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

interface CartItem {
  id: number
  name: string
  price: number
  image: string
  quantity: number
}

interface CartSidebarProps {
  isOpen: boolean
  onClose: () => void
  items: CartItem[]
  onUpdateQuantity: (id: number, quantity: number) => void
  onRemoveItem: (id: number) => void
}

export function CartSidebar({ isOpen, onClose, items, onUpdateQuantity, onRemoveItem }: CartSidebarProps) {
  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="absolute left-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <CardTitle className="text-xl flex items-center">
              <ShoppingBag className="w-6 h-6 ml-2" />
              سلة التسوق
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4">
            {items.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingBag className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500">السلة فارغة</p>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map(item => (
                  <Card key={item.id} className="p-4">
                    <div className="flex items-center space-x-reverse space-x-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold line-clamp-2">{item.name}</h4>
                        <p className="text-primary font-bold">{item.price.toLocaleString('ar-EG')} ج.م</p>
                        
                        {/* Quantity Controls */}
                        <div className="flex items-center space-x-reverse space-x-2 mt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onRemoveItem(item.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t p-4 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">المجموع:</span>
                <span className="text-2xl font-bold text-primary">
                  {total.toLocaleString('ar-EG')} ج.م
                </span>
              </div>
              <Separator />
              <div className="space-y-2">
                <Button className="w-full" size="lg">
                  إتمام الطلب
                </Button>
                <Button variant="outline" className="w-full" onClick={onClose}>
                  متابعة التسوق
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}