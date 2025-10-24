'use client'

import { useState } from 'react'
import { X, Plus, Minus, ShoppingCart, Star, Heart, Share2, Truck, Shield, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

interface ProductModalProps {
  isOpen: boolean
  onClose: () => void
  product: {
    id: number
    name: string
    price: number
    image: string
    rating: number
    reviews: number
    description: string
    category: string
    stock: number
    features?: string[]
  }
  onAddToCart: (product: any) => void
}

export function ProductModal({ isOpen, onClose, product, onAddToCart }: ProductModalProps) {
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)

  if (!isOpen || !product) return null

  const productImages = [product.image] // Can be extended with more images

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      onAddToCart(product)
    }
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="absolute inset-4 md:inset-8 bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-xl font-semibold">تفاصيل المنتج</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
              {/* Images */}
              <div className="space-y-4">
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={productImages[selectedImage]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex space-x-reverse space-x-2">
                  {productImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${
                        selectedImage === index ? 'border-primary' : 'border-gray-200'
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

              {/* Product Info */}
              <div className="space-y-4">
                <div>
                  <Badge variant="secondary" className="mb-2">
                    {product.category}
                  </Badge>
                  <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
                  
                  {/* Rating */}
                  <div className="flex items-center space-x-reverse space-x-2 mb-4">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">
                      {product.rating} ({product.reviews} تقييم)
                    </span>
                  </div>

                  {/* Price */}
                  <div className="text-3xl font-bold text-primary mb-4">
                    {product.price.toLocaleString('ar-EG')} ج.م
                  </div>

                  {/* Stock */}
                  <div className="flex items-center space-x-reverse space-x-2 mb-4">
                    <Badge variant={product.stock > 0 ? "default" : "destructive"}>
                      {product.stock > 0 ? `متوفر (${product.stock} قطعة)` : 'نفد المخزون'}
                    </Badge>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 mb-6">{product.description}</p>

                  {/* Features */}
                  {product.features && product.features.length > 0 && (
                    <div className="mb-6">
                      <h3 className="font-semibold mb-2">المميزات:</h3>
                      <ul className="list-disc list-inside space-y-1 text-gray-600">
                        {product.features.map((feature, index) => (
                          <li key={index}>{feature}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <Separator className="my-6" />

                  {/* Quantity and Add to Cart */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-reverse space-x-4">
                      <span className="font-semibold">الكمية:</span>
                      <div className="flex items-center space-x-reverse space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <span className="w-12 text-center font-semibold">{quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setQuantity(quantity + 1)}
                          disabled={quantity >= product.stock}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex space-x-reverse space-x-2">
                      <Button
                        onClick={handleAddToCart}
                        className="flex-1"
                        size="lg"
                        disabled={product.stock === 0}
                      >
                        <ShoppingCart className="w-5 h-5 ml-2" />
                        أضف للسلة
                      </Button>
                      <Button variant="outline" size="lg">
                        <Heart className="w-5 h-5" />
                      </Button>
                      <Button variant="outline" size="lg">
                        <Share2 className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="border-t p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4 flex items-center space-x-reverse space-x-3">
                    <Truck className="w-8 h-8 text-primary" />
                    <div>
                      <h4 className="font-semibold">شحن سريع</h4>
                      <p className="text-sm text-gray-600">توصيل خلال 24-48 ساعة</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 flex items-center space-x-reverse space-x-3">
                    <Shield className="w-8 h-8 text-primary" />
                    <div>
                      <h4 className="font-semibold">ضمان الجودة</h4>
                      <p className="text-sm text-gray-600">منتجات أصلية مع ضمان</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 flex items-center space-x-reverse space-x-3">
                    <RotateCcw className="w-8 h-8 text-primary" />
                    <div>
                      <h4 className="font-semibold">إرجاع سهل</h4>
                      <p className="text-sm text-gray-600">إرجاع خلال 14 يوم</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}