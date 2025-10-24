'use client'

import { useState } from 'react'
import { ShoppingCart, Search, Menu, X, Phone, Mail, Facebook, MessageCircle, Send, Video, Star, Filter, ChevronDown, Bell, Contact, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useCart } from '@/hooks/use-cart'
import { CartSidebar } from '@/components/cart/cart-sidebar'
import { ProductModal } from '@/components/product/product-modal'

const categories = [
  { id: 'computers', name: 'كمبيوتر ولابتوب', icon: '💻' },
  { id: 'mobile', name: 'موبايل وتابلت', icon: '📱' },
  { id: 'networking', name: 'شبكات وإنترنت', icon: '🌐' },
  { id: 'cameras', name: 'كاميرات مراقبة', icon: '📹' },
  { id: 'audio', name: 'سماعات وصوتيات', icon: '🎧' },
  { id: 'accessories', name: 'إكسسوارات', icon: '🔌' }
]

const products = [
  {
    id: 3,
    name: 'كاميرا مراقبة 4K',
    category: 'cameras',
    price: 1299,
    image: '/images/products/camera.jpg',
    rating: 4.7,
    reviews: 203,
    description: 'كاميرا مراقبة خارجية بدقة 4K مع رؤية ليلية',
    stock: 30,
    features: [
      'دقة 4K Ultra HD',
      'رؤية ليلية حتى 30 متر',
      'مقاومة للطقس IP66',
      'تسجيل مستمر على السحابة',
      'كشف الحركة الذكي'
    ]
  },
  {
    id: 1,
    name: 'لابتوب Dell XPS 15',
    category: 'computers',
    price: 25000,
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300&h=300&fit=crop',
    rating: 4.5,
    reviews: 128,
    description: 'لابتوب عالي الأداء مع شاشة 4K ومعالج Intel Core i7',
    stock: 15,
    features: [
      'شاشة 15.6 بوصة بدقة 4K',
      'معالج Intel Core i7 الجيل 12',
      'ذاكرة RAM 16GB DDR5',
      'مساحة تخزين 512GB NVMe SSD',
      'كارت شاشة NVIDIA RTX 3050 Ti'
    ]
  },
  {
    id: 5,
    name: 'iPhone 15 Pro',
    category: 'mobile',
    price: 18000,
    image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=300&h=300&fit=crop',
    rating: 4.9,
    reviews: 567,
    description: 'أحدث iPhone مع معالج A17 Pro وكاميرا احترافية',
    stock: 10,
    features: [
      'شاشة Super Retina XDR بحجم 6.1 بوصة',
      'معالج A17 Pro',
      'كاميرا احترافية 48MP',
      'مقاومة للماء IP68',
      'دعم 5G'
    ]
  },
  {
    id: 2,
    name: 'راوتر Wi-Fi 6',
    category: 'networking',
    price: 899,
    image: '/images/products/router.jpg',
    rating: 4.3,
    reviews: 89,
    description: 'راوتر عالي السرعة يدعم Wi-Fi 6 وتقنية Mesh',
    stock: 50,
    features: [
      'سرعة تصل إلى 3000Mbps',
      'دعم Wi-Fi 6 (802.11ax)',
      'تقنية Mesh للتغطية الشاملة',
      '4 منافذ Ethernet Gigabit',
      'منفذ USB 3.0'
    ]
  },
  {
    id: 8,
    name: 'Access Point Wi-Fi 6E',
    category: 'networking',
    price: 1599,
    image: '/images/products/accesspoint.jpg',
    rating: 4.6,
    reviews: 156,
    description: 'Access Point احترافي يدعم Wi-Fi 6E للتغطية الشاملة',
    stock: 20,
    features: [
      'دعم Wi-Fi 6E (6GHz)',
      'سرعة تصل إلى 5400Mbps',
      'تقنية MU-MIMO و OFDMA',
      'تغطية مساحة 200 متر مربع',
      'إدارة مركزية عبر السحابة'
    ]
  },
  {
    id: 4,
    name: 'سماعات Sony WH-1000XM4',
    category: 'audio',
    price: 2499,
    image: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=300&h=300&fit=crop',
    rating: 4.8,
    reviews: 342,
    description: 'سماعات لاسلكية مع إلغاء ضوضاء متقدم',
    stock: 25,
    features: [
      'إلغاء ضوضاء رقمي متقدم',
      'عمر بطارية 30 ساعة',
      'صوت عالي الجودة Hi-Res',
      'اتصال Bluetooth 5.0',
      'ميكروفون عالي الجودة للمكالمات'
    ]
  },
  {
    id: 7,
    name: 'كيبورد لاسلكي ميكانيكي',
    category: 'accessories',
    price: 899,
    image: '/images/products/keyboard.jpg',
    rating: 4.4,
    reviews: 92,
    description: 'كيبورد ميكانيكي لاسلكي مع إضاءة RGB',
    stock: 35,
    features: [
      'مفاتيح ميكانيكية Blue Switch',
      'إضاءة RGB قابلة للتخصيص',
      'اتصال Bluetooth 5.0 و USB-C',
      'عمر بطارية 2000mAh',
      'تصميم مضاد للماء'
    ]
  },
  {
    id: 6,
    name: 'ماوس لاسلكي Logitech MX Master',
    category: 'accessories',
    price: 599,
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=300&h=300&fit=crop',
    rating: 4.6,
    reviews: 178,
    description: 'ماوس احترافي لاسلكي مع تحكم دقيق',
    stock: 40,
    features: [
      'دقة 4000 DPI',
      'اتصال Bluetooth و USB',
      'عمر بطارية 70 يوم',
      'تصميم مريح للاستخدام الطويل',
      'عجلة تمرير مغناطيسية'
    ]
  }
]

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('name')
  const [selectedProduct, setSelectedProduct] = useState<typeof products[0] | null>(null)
  const [notifications, setNotifications] = useState(3)
  const [isContactModalOpen, setIsContactModalOpen] = useState(false)
  
  const cart = useCart()

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price
      case 'price-high':
        return b.price - a.price
      case 'rating':
        return b.rating - a.rating
      default:
        return a.name.localeCompare(b.name)
    }
  })

  const addToCart = (product: typeof products[0]) => {
    cart.addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image
    })
  }

  const openProductDetails = (product: typeof products[0]) => {
    setSelectedProduct(product)
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-reverse space-x-4">
              <h1 className="text-2xl font-bold text-primary">Routerize</h1>
            </div>

            {/* Search Bar */}
            <div className="hidden md:flex flex-1 max-w-lg mx-8">
              <div className="relative w-full">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="ابحث عن منتجات..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-10 text-right"
                />
              </div>
            </div>

            {/* Notifications */}
            <div className="flex items-center space-x-reverse space-x-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="relative">
                    <Bell className="w-5 h-5" />
                    {notifications > 0 && (
                      <Badge className="absolute -top-2 -right-2 bg-red-500 text-white w-5 h-5 flex items-center justify-center text-xs">
                        {notifications}
                      </Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <DropdownMenuItem className="flex items-start space-x-reverse space-x-3 p-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="font-medium">طلب جديد</p>
                      <p className="text-sm text-gray-600">لابتوب Dell XPS 15 تم طلبه</p>
                      <p className="text-xs text-gray-400">منذ 5 دقائق</p>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-start space-x-reverse space-x-3 p-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="font-medium">منتج جديد</p>
                      <p className="text-sm text-gray-600">iPhone 15 Pro متاح الآن</p>
                      <p className="text-xs text-gray-400">منذ ساعة</p>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-start space-x-reverse space-x-3 p-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="font-medium">عرض خاص</p>
                      <p className="text-sm text-gray-600">خصم 20% على جميع السماعات</p>
                      <p className="text-xs text-gray-400">منذ 3 ساعات</p>
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button variant="outline" size="sm" className="relative" onClick={() => cart.setIsOpen(true)}>
                <ShoppingCart className="w-5 h-5" />
                {cart.getTotalItems() > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-primary text-primary-foreground w-5 h-5 flex items-center justify-center text-xs">
                    {cart.getTotalItems()}
                  </Badge>
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden px-4 pb-3">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="ابحث عن منتجات..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10 text-right"
            />
          </div>
        </div>
      </header>

      {/* Categories */}
      <section className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-reverse space-x-2 overflow-x-auto">
            <Button
              variant={selectedCategory === 'all' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setSelectedCategory('all')}
              className="whitespace-nowrap"
            >
              جميع المنتجات
            </Button>
            {categories.map(category => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className="whitespace-nowrap"
              >
                <span className="ml-2">{category.icon}</span>
                {category.name}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary/80 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">متجر Routerize الإلكتروني</h2>
          <p className="text-xl mb-6">أفضل مستلزمات الكمبيوتر وكاميرات المراقبة والموبايل والشبكات</p>
          <div className="flex justify-center">
            <Button 
              variant="secondary" 
              size="lg" 
              className="bg-white text-primary hover:bg-gray-100"
            >
              <Contact className="w-5 h-5 ml-2" />
              تواصل معنا الآن
            </Button>
          </div>
        </div>
      </section>

  

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Sort and Filter */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
          <h3 className="text-2xl font-semibold">
            {selectedCategory === 'all' ? 'جميع المنتجات' : categories.find(c => c.id === selectedCategory)?.name}
            <span className="text-gray-500 mr-2">({sortedProducts.length} منتج)</span>
          </h3>
          <div className="flex items-center space-x-reverse space-x-4">
            <span className="text-sm text-gray-600">ترتيب حسب:</span>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">الاسم</SelectItem>
                <SelectItem value="price-low">السعر: منخفض إلى مرتفع</SelectItem>
                <SelectItem value="price-high">السعر: مرتفع إلى منخفض</SelectItem>
                <SelectItem value="rating">التقييم</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedProducts.map(product => (
            <Card key={product.id} className="group hover:shadow-lg transition-shadow cursor-pointer" onClick={() => openProductDetails(product)}>
              <CardHeader className="p-4">
                <div className="aspect-square bg-gray-100 rounded-lg mb-3 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <CardTitle className="text-lg line-clamp-2">{product.name}</CardTitle>
                <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="flex items-center mb-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600 mr-2">({product.reviews})</span>
                </div>
                <div className="text-2xl font-bold text-primary mb-3">
                  {product.price.toLocaleString('ar-EG')} ج.م
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Button
                  onClick={(e) => {
                    e.stopPropagation()
                    addToCart(product)
                  }}
                  className="w-full"
                  size="sm"
                >
                  <ShoppingCart className="w-4 h-4 ml-2" />
                  أضف للسلة
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>

      {/* Product Modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={addToCart}
        />
      )}

      {/* Cart Sidebar */}
      {/* <CartSidebar /> */}

  
    </div>
  )
}