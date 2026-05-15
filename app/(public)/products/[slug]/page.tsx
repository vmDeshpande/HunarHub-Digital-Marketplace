import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ProductGallery } from '@/components/products/product-gallery';
import { ProductInfo } from '@/components/products/product-info';
import { ProductTabs } from '@/components/products/product-tabs';
import { ProductCard } from '@/components/products/product-card';
import { Badge } from '@/components/ui/badge';
import { ChevronRight } from 'lucide-react';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

// This would be fetched from the database
async function getProduct(slug: string) {
  // Mock product data
  const product = {
    _id: '1',
    title: 'Traditional Blue Pottery Vase - Multan Heritage Collection',
    slug: 'traditional-blue-pottery-vase',
    description: `Experience the timeless beauty of authentic Multan blue pottery with this exquisite handcrafted vase. Each piece is meticulously created using traditional techniques passed down through generations of skilled artisans.

This stunning vase features the signature cobalt blue and white color palette that Multan pottery is renowned for worldwide. The intricate floral and geometric patterns are hand-painted by master craftsmen, making each piece truly unique.

**Features:**
- 100% handmade by skilled Multan artisans
- Traditional cobalt blue and white design
- Lead-free, food-safe glaze
- Perfect for fresh or dried flower arrangements
- Makes an excellent gift for art lovers

**Care Instructions:**
- Hand wash recommended
- Not microwave safe
- Handle with care

Support Indian artisans and bring a piece of cultural heritage into your home with this beautiful pottery piece.`,
    shortDescription: 'Exquisite handcrafted blue pottery vase from Multan, featuring traditional patterns and techniques passed down through generations.',
    images: [
      '/images/placeholder-product.jpg',
      '/images/placeholder-product.jpg',
      '/images/placeholder-product.jpg',
      '/images/placeholder-product.jpg',
    ],
    category: { _id: '1', name: 'Pottery & Ceramics', slug: 'pottery' },
    subcategory: { _id: '2', name: 'Vases', slug: 'vases' },
    tags: ['blue pottery', 'multan', 'handmade', 'traditional', 'home decor'],
    price: 4500,
    compareAtPrice: 5500,
    currency: 'PKR',
    stock: 15,
    sku: 'MBP-V001',
    attributes: {
      material: 'Ceramic Clay',
      dimensions: '25cm height x 15cm diameter',
      weight: '1.2 kg',
      color: 'Blue & White',
      handmade: true,
      customizable: true,
    },
    shipping: {
      freeShipping: false,
      shippingCost: 300,
      processingTime: '3-5 business days',
    },
    rating: {
      average: 4.8,
      count: 124,
    },
    stats: {
      views: 1250,
      sales: 89,
      wishlistCount: 156,
    },
    entrepreneur: {
      _id: '1',
      businessName: 'Multan Pottery House',
      slug: 'multan-pottery',
      tagline: 'Traditional blue pottery since 1965',
      logo: '/images/placeholder-avatar.jpg',
      isVerified: true,
      rating: { average: 4.9, count: 312 },
      location: { city: 'Multan', country: 'Pakistan' },
    },
    reviews: [
      {
        _id: '1',
        reviewer: { name: 'Sarah Khan', image: '' },
        rating: 5,
        title: 'Absolutely beautiful!',
        comment: 'The vase exceeded my expectations. The craftsmanship is incredible and it looks stunning in my living room.',
        createdAt: new Date('2024-01-15'),
        isVerifiedPurchase: true,
      },
      {
        _id: '2',
        reviewer: { name: 'Ahmed Ali', image: '' },
        rating: 4,
        title: 'Great quality',
        comment: 'Very happy with my purchase. The colors are vibrant and the design is authentic Multan pottery.',
        createdAt: new Date('2024-01-10'),
        isVerifiedPurchase: true,
      },
    ],
    createdAt: new Date('2023-06-15'),
  };

  if (slug !== product.slug) {
    return null;
  }

  return product;
}

// Mock related products
const relatedProducts = [
  {
    _id: '2',
    title: 'Blue Pottery Tea Set',
    slug: 'blue-pottery-tea-set',
    images: ['/images/placeholder-product.jpg'],
    price: 8500,
    compareAtPrice: 10000,
    rating: { average: 4.7, count: 89 },
    entrepreneur: { businessName: 'Multan Pottery House', slug: 'multan-pottery' },
    stock: 8,
    attributes: { handmade: true },
  },
  {
    _id: '3',
    title: 'Decorative Blue Pottery Plate',
    slug: 'decorative-blue-pottery-plate',
    images: ['/images/placeholder-product.jpg'],
    price: 2500,
    rating: { average: 4.6, count: 56 },
    entrepreneur: { businessName: 'Multan Pottery House', slug: 'multan-pottery' },
    stock: 20,
    attributes: { handmade: true },
  },
  {
    _id: '4',
    title: 'Blue Pottery Lamp Base',
    slug: 'blue-pottery-lamp-base',
    images: ['/images/placeholder-product.jpg'],
    price: 6500,
    rating: { average: 4.9, count: 34 },
    entrepreneur: { businessName: 'Multan Pottery House', slug: 'multan-pottery' },
    stock: 5,
    attributes: { handmade: true },
  },
  {
    _id: '5',
    title: 'Mini Blue Pottery Bowl Set',
    slug: 'mini-blue-pottery-bowl-set',
    images: ['/images/placeholder-product.jpg'],
    price: 3200,
    rating: { average: 4.5, count: 78 },
    entrepreneur: { businessName: 'Multan Pottery House', slug: 'multan-pottery' },
    stock: 12,
    attributes: { handmade: true },
  },
];

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    return { title: 'Product Not Found' };
  }

  return {
    title: product.title,
    description: product.shortDescription,
    openGraph: {
      title: product.title,
      description: product.shortDescription,
      images: product.images,
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="container py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
        <Link href="/" className="hover:text-primary transition-colors">
          Home
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link href="/products" className="hover:text-primary transition-colors">
          Products
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link
          href={`/categories/${product.category.slug}`}
          className="hover:text-primary transition-colors"
        >
          {product.category.name}
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground truncate max-w-[200px]">
          {product.title}
        </span>
      </nav>

      {/* Product Main Section */}
      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
        <ProductGallery images={product.images} title={product.title} />
        <ProductInfo product={product} />
      </div>

      {/* Product Details Tabs */}
      <ProductTabs product={product} />

      {/* Related Products */}
      <section className="mt-16">
        <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {relatedProducts.map((relatedProduct) => (
            <ProductCard key={relatedProduct._id} product={relatedProduct} />
          ))}
        </div>
      </section>
    </div>
  );
}
