import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  ArrowRight,
  Star,
  Shield,
  Truck,
  Heart,
  Package,
  Palette,
  Scissors,
  Gem,
  Shirt,
  Home,
  UtensilsCrossed,
} from 'lucide-react';

// Featured categories
const categories = [
  { name: 'Pottery & Ceramics', icon: Package, href: '/categories/pottery', color: 'bg-orange-100 text-orange-600' },
  { name: 'Textiles & Fabric', icon: Shirt, href: '/categories/textiles', color: 'bg-blue-100 text-blue-600' },
  { name: 'Jewelry', icon: Gem, href: '/categories/jewelry', color: 'bg-purple-100 text-purple-600' },
  { name: 'Handicrafts', icon: Scissors, href: '/categories/handicrafts', color: 'bg-green-100 text-green-600' },
  { name: 'Art & Paintings', icon: Palette, href: '/categories/art', color: 'bg-pink-100 text-pink-600' },
  { name: 'Home Decor', icon: Home, href: '/categories/home-decor', color: 'bg-amber-100 text-amber-600' },
];

// Features
const features = [
  {
    icon: Shield,
    title: 'Verified Artisans',
    description: 'Every artisan is verified to ensure authentic craftsmanship',
  },
  {
    icon: Heart,
    title: 'Support Local',
    description: 'Direct support to Indian artisans and their families',
  },
  {
    icon: Truck,
    title: 'Nationwide Delivery',
    description: 'Fast and reliable shipping across Pakistan',
  },
  {
    icon: Star,
    title: 'Quality Guaranteed',
    description: 'Handpicked products with quality assurance',
  },
];

// Mock featured products
const featuredProducts = [
  {
    _id: '1',
    title: 'Traditional Blue Pottery Vase',
    slug: 'traditional-blue-pottery-vase',
    images: ['/images/placeholder-product.jpg'],
    price: 4500,
    compareAtPrice: 5500,
    rating: { average: 4.8, count: 124 },
    entrepreneur: { businessName: 'Multan Pottery House', slug: 'multan-pottery' },
    stock: 15,
    attributes: { handmade: true },
  },
  {
    _id: '2',
    title: 'Handwoven Sindhi Ajrak Shawl',
    slug: 'handwoven-sindhi-ajrak-shawl',
    images: ['/images/placeholder-product.jpg'],
    price: 3200,
    rating: { average: 4.9, count: 89 },
    entrepreneur: { businessName: 'Sindh Crafts', slug: 'sindh-crafts' },
    stock: 8,
    attributes: { handmade: true },
  },
  {
    _id: '3',
    title: 'Copper Engraved Tea Set',
    slug: 'copper-engraved-tea-set',
    images: ['/images/placeholder-product.jpg'],
    price: 12500,
    compareAtPrice: 15000,
    rating: { average: 4.7, count: 56 },
    entrepreneur: { businessName: 'Peshawar Metal Works', slug: 'peshawar-metal' },
    stock: 5,
    attributes: { handmade: true },
  },
  {
    _id: '4',
    title: 'Truck Art Wooden Jewelry Box',
    slug: 'truck-art-wooden-jewelry-box',
    images: ['/images/placeholder-product.jpg'],
    price: 2800,
    rating: { average: 4.6, count: 203 },
    entrepreneur: { businessName: 'Lahore Art Studio', slug: 'lahore-art' },
    stock: 20,
    attributes: { handmade: true },
  },
];

// Mock featured artisans
const featuredArtisans = [
  {
    _id: '1',
    businessName: 'Multan Pottery House',
    slug: 'multan-pottery',
    tagline: 'Traditional blue pottery since 1965',
    location: { city: 'Multan', country: 'Pakistan' },
    rating: { average: 4.9, count: 312 },
    stats: { totalProducts: 45, totalServices: 3 },
    isVerified: true,
    categories: [{ _id: '1', name: 'Pottery' }],
  },
  {
    _id: '2',
    businessName: 'Sindh Crafts',
    slug: 'sindh-crafts',
    tagline: 'Authentic Sindhi handicrafts',
    location: { city: 'Hyderabad', country: 'Pakistan' },
    rating: { average: 4.8, count: 189 },
    stats: { totalProducts: 78, totalServices: 5 },
    isVerified: true,
    categories: [{ _id: '2', name: 'Textiles' }],
  },
  {
    _id: '3',
    businessName: 'Peshawar Metal Works',
    slug: 'peshawar-metal',
    tagline: 'Master copper and brass artisans',
    location: { city: 'Peshawar', country: 'Pakistan' },
    rating: { average: 4.7, count: 156 },
    stats: { totalProducts: 34, totalServices: 2 },
    isVerified: true,
    categories: [{ _id: '3', name: 'Metalwork' }],
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-background to-accent/10 py-16 md:py-24">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <Badge variant="secondary" className="text-sm">
                Discover Indian Craftsmanship
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-balance">
                Handcrafted with{' '}
                <span className="text-primary">Love & Tradition</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-xl text-pretty">
                Connect directly with skilled Indian artisans. Discover unique handmade 
                products, support local entrepreneurs, and bring authentic craftsmanship 
                into your home.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/products">
                  <Button size="lg" className="gap-2">
                    Explore Products
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/auth/register?role=entrepreneur">
                  <Button size="lg" variant="outline">
                    Become a Seller
                  </Button>
                </Link>
              </div>
              {/* Stats */}
              <div className="flex gap-8 pt-4">
                <div>
                  <p className="text-2xl font-bold text-primary">5,000+</p>
                  <p className="text-sm text-muted-foreground">Products</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary">500+</p>
                  <p className="text-sm text-muted-foreground">Artisans</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary">50,000+</p>
                  <p className="text-sm text-muted-foreground">Happy Customers</p>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="aspect-[4/5] relative rounded-2xl overflow-hidden shadow-lg">
                    <Image
                      src="/images/hero-pottery.jpg"
                      alt="Traditional pottery"
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                  <div className="aspect-square relative rounded-2xl overflow-hidden shadow-lg">
                    <Image
                      src="/images/hero-textiles.jpg"
                      alt="Handwoven textiles"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
                <div className="space-y-4 pt-8">
                  <div className="aspect-square relative rounded-2xl overflow-hidden shadow-lg">
                    <Image
                      src="/images/hero-jewelry.jpg"
                      alt="Traditional jewelry"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="aspect-[4/5] relative rounded-2xl overflow-hidden shadow-lg">
                    <Image
                      src="/images/hero-crafts.jpg"
                      alt="Handicrafts"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-3">Browse by Category</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore our diverse collection of authentic Indian crafts
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <Link key={category.name} href={category.href}>
                <Card className="group hover:shadow-md transition-shadow cursor-pointer border-0">
                  <CardContent className="p-6 text-center">
                    <div
                      className={`mx-auto w-14 h-14 rounded-full ${category.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}
                    >
                      <category.icon className="h-7 w-7" />
                    </div>
                    <h3 className="font-medium text-sm group-hover:text-primary transition-colors">
                      {category.name}
                    </h3>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="container">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold mb-2">Featured Products</h2>
              <p className="text-muted-foreground">
                Handpicked selections from our talented artisans
              </p>
            </div>
            <Link href="/products">
              <Button variant="outline" className="gap-2">
                View All
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <Card key={product._id} className="group overflow-hidden border-0 shadow-sm hover:shadow-md transition-shadow">
                <Link href={`/products/${product.slug}`}>
                  <div className="relative aspect-square overflow-hidden bg-muted">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20" />
                    {product.attributes?.handmade && (
                      <Badge className="absolute top-2 left-2 text-xs" variant="secondary">
                        Handmade
                      </Badge>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <p className="text-xs text-muted-foreground mb-1">
                      {product.entrepreneur?.businessName}
                    </p>
                    <h3 className="font-medium text-sm line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                      {product.title}
                    </h3>
                    <div className="flex items-center gap-1 mb-2">
                      <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs font-medium">{product.rating.average}</span>
                      <span className="text-xs text-muted-foreground">
                        ({product.rating.count})
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-primary">
                        Rs. {product.price.toLocaleString()}
                      </span>
                      {product.compareAtPrice && (
                        <span className="text-sm text-muted-foreground line-through">
                          Rs. {product.compareAtPrice.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => (
              <div key={feature.title} className="text-center">
                <div className="mx-auto w-14 h-14 rounded-full bg-primary-foreground/10 flex items-center justify-center mb-4">
                  <feature.icon className="h-7 w-7" />
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-primary-foreground/80">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Artisans */}
      <section className="py-16">
        <div className="container">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold mb-2">Meet Our Artisans</h2>
              <p className="text-muted-foreground">
                Talented craftspeople preserving Indian heritage
              </p>
            </div>
            <Link href="/artisans">
              <Button variant="outline" className="gap-2">
                View All
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredArtisans.map((artisan) => (
              <Card key={artisan._id} className="group overflow-hidden border-0 shadow-sm hover:shadow-md transition-shadow">
                <Link href={`/artisans/${artisan.slug}`}>
                  <div className="relative h-24 bg-gradient-to-br from-primary/20 to-accent/30" />
                  <CardContent className="p-4 pt-0">
                    <div className="flex justify-center -mt-10 mb-3">
                      <div className="h-20 w-20 rounded-full border-4 border-background bg-primary flex items-center justify-center text-primary-foreground text-xl font-bold shadow-md">
                        {artisan.businessName.charAt(0)}
                      </div>
                    </div>
                    <div className="text-center">
                      <h3 className="font-semibold text-base group-hover:text-primary transition-colors mb-1">
                        {artisan.businessName}
                      </h3>
                      <p className="text-xs text-muted-foreground mb-2">
                        {artisan.tagline}
                      </p>
                      <p className="text-xs text-muted-foreground mb-3">
                        {artisan.location.city}, {artisan.location.country}
                      </p>
                      <div className="flex items-center justify-center gap-1 mb-3">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{artisan.rating.average}</span>
                        <span className="text-xs text-muted-foreground">
                          ({artisan.rating.count} reviews)
                        </span>
                      </div>
                      <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
                        <span>{artisan.stats.totalProducts} Products</span>
                        <span>{artisan.stats.totalServices} Services</span>
                      </div>
                    </div>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">
              Are You a Skilled Artisan?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join HunarHub and connect with thousands of customers looking for authentic 
              Indian craftsmanship. Start selling your products and services today.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/auth/register?role=entrepreneur">
                <Button size="lg" className="gap-2">
                  Start Selling Today
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/seller-guidelines">
                <Button size="lg" variant="outline">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
