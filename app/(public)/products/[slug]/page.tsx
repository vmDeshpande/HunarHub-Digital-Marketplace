import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ProductGallery } from '@/components/products/product-gallery';
import { ProductInfo } from '@/components/products/product-info';
import { ProductTabs } from '@/components/products/product-tabs';
import { ProductCard } from '@/components/products/product-card';
import { ChevronRight } from 'lucide-react';
import connectToDatabase from '@/lib/db/mongoose';
import { Product, Review } from '@/lib/db/models';
import mongoose from 'mongoose';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

async function getProduct(slug: string) {
  await connectToDatabase();

  const product = (await Product.findOne({ slug, status: 'active' })
    .populate('category', 'name slug')
    .populate({
      path: 'entrepreneur',
      select: 'businessName slug tagline logo isVerified rating location',
      populate: { path: 'user', select: 'firstName lastName avatar' },
    })
    .lean()) as any;

  return product;
}

async function getProductReviews(productId: mongoose.Types.ObjectId) {
  const reviews = (await Review.find({ product: productId, status: 'approved' })
    .populate('customer', 'firstName lastName avatar')
    .sort({ createdAt: -1 })
    .lean()) as any[];

  return reviews.map((review: any) => ({
    ...review,
    reviewer: {
      name: review.customer
        ? `${review.customer.firstName || ''} ${review.customer.lastName || ''}`.trim()
        : 'Anonymous',
      image: review.customer?.avatar || '',
    },
  }));
}

async function getRelatedProducts(product: any) {
  const query: Record<string, unknown> = {
    status: 'active',
    _id: { $ne: product._id },
  };

  if (product.category?._id) {
    query.category = product.category._id;
  } else if (product.entrepreneur?._id) {
    query.entrepreneur = product.entrepreneur._id;
  }

  return Product.find(query)
    .populate('entrepreneur', 'businessName slug')
    .sort({ createdAt: -1 })
    .limit(4)
    .lean();
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    return { title: 'Product Not Found' };
  }

  return {
    title: product.title,
    description: product.shortDescription || product.description?.slice(0, 160) || '',
    openGraph: {
      title: product.title,
      description: product.shortDescription || product.description?.slice(0, 160) || '',
      images: Array.isArray(product.images) ? product.images : [product.images || ''],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  const reviews = await getProductReviews(product._id);
  const relatedProducts = await getRelatedProducts(product);

  return (
    <div className="container py-8">
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
        <Link href="/" className="hover:text-primary transition-colors">
          Home
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link href="/products" className="hover:text-primary transition-colors">
          Products
        </Link>
        <ChevronRight className="h-4 w-4" />
        {product.category?.slug ? (
          <Link
            href={`/categories/${product.category.slug}`}
            className="hover:text-primary transition-colors"
          >
            {product.category.name}
          </Link>
        ) : (
          <span className="text-muted-foreground">Product</span>
        )}
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground truncate max-w-[200px]">
          {product.title}
        </span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
        <ProductGallery images={product.images || []} title={product.title} />
        <ProductInfo product={{ ...product, reviews }} />
      </div>

      <ProductTabs product={{ ...product, reviews }} />

      <section className="mt-16">
        <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {relatedProducts.map((relatedProduct) => (
            <ProductCard key={relatedProduct._id.toString()} product={relatedProduct as any} />
          ))}
        </div>
      </section>
    </div>
  );
}
