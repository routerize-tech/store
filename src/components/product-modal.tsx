'use client'

import { useState } from 'react'
import { X, ShoppingCart, Heart, Share2, Star, Truck, Shield, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

interface Product {
  id: number
  name: string
  category: string
  price: number
  image: string
  description: string
  specifications?: string[]
  inStock?: boolean
  rating?: number
}

interface ProductModalProps {
  product: Product | null
  isOpen: boolean
  onClose: () => void
  onAddToCart: (product: Product) => void
}

export function ProductModal({ product, isOpen, onClose, onAddToCart }: ProductModalProps) {
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)

  if (!product) return null

  const images = [product.image] // Can add more images later

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-right">
          <DialogTitle>{product.name}</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Product Images */}
          <div>
            <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden mb-4">
              <img 
                src={images[selectedImage]} 
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex space-x-2 space-x-reverse">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-20 h-20 rounded overflow-hidden border-2 ${
                    selectedImage === index ? 'border-blue-500' : 'border-gray-300'
                  }`}
                >
                  <img 
                    src={image} 
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-4">
            <div>
              <Badge className="mb-2">{product.category}</Badge>
              <div className="flex items-center space-x-2 space-x-reverse mb-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-4 h-4 ${
                        i < (product.rating || 4) 
                          ? 'text-yellow-400 fill-current' 
                          : 'text-gray-300'
                      }`} 
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-500">
                  ({product.rating || 4}.0) 125 تقييم
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold text-green-600">
                {product.price.toLocaleString()} ج.م
              </span>
              <Badge variant={product.inStock !== false ? "default" : "destructive"}>
                {product.inStock !== false ? "متوفر" : "نفذ المخزون"}
              </Badge>
            </div>

            <p className="text-gray-600">{product.description}</p>

            {product.specifications && (
              <div>
                <h4 className="font-semibold mb-2">المواصفات:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                  {product.specifications.map((spec, index) => (
                    <li key={index}>{spec}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="grid grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <Truck className="w-6 h-6 mx-auto mb-2 text-blue-500" />
                  <p className="text-xs">شحن سريع</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Shield className="w-6 h-6 mx-auto mb-2 text-green-500" />
                  <p className="text-xs">ضمان أصلي</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <RotateCcw className="w-6 h-6 mx-auto mb-2 text-purple-500" />
                  <p className="text-xs">إرجاع خلال 7 أيام</p>
                </CardContent>
              </Card>
            </div>

            <Separator />

            <div className="flex items-center space-x-4 space-x-reverse">
              <div className="flex items-center space-x-2 space-x-reverse">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  -
                </Button>
                <span className="w-12 text-center">{quantity}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  +
                </Button>
              </div>
              <Button 
                className="flex-1"
                onClick={() => {
                  onAddToCart(product)
                  onClose()
                }}
                disabled={product.inStock === false}
              >
                <ShoppingCart className="w-4 h-4 ml-2" />
                أضف للسلة
              </Button>
              <Button variant="outline" size="sm">
                <Heart className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}