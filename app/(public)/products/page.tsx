import { Suspense } from 'react';
import { Metadata } from 'next';
import { ProductsGrid } from '@/components/products/products-grid';
import { ProductFilters } from '@/components/products/product-filters';
import { Skeleton } from '@/components/ui/skeleton';

export const metadata: Metadata = {
  title: 'Browse Products',
  description: 'Discover authentic handmade products from Indian artisans. Shop pottery, textiles, jewelry, and more.',
};

interface ProductsPageProps {
  searchParams: Promise<{
    q?: string;
    category?: string;
    minPrice?: string;
    maxPrice?: string;
    rating?: string;
    sort?: string;
    page?: string;
  }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  
  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Browse Products</h1>
        <p className="text-muted-foreground">
          Discover authentic handmade products from talented Indian artisans
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <aside className="lg:w-64 flex-shrink-0">
          <Suspense fallback={<FiltersSkeleton />}>
            <ProductFilters />
          </Suspense>
        </aside>

        {/* Products Grid */}
        <main className="flex-1">
          <Suspense fallback={<ProductsGridSkeleton />}>
            <ProductsGrid searchParams={params} />
          </Suspense>
        </main>
      </div>
    </div>
  );
}

function FiltersSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-32" />
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-6 w-full" />
        ))}
      </div>
      <Skeleton className="h-8 w-32" />
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-6 w-full" />
        ))}
      </div>
    </div>
  );
}

function ProductsGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 9 }).map((_, i) => (
        <div key={i} className="space-y-3">
          <Skeleton className="aspect-square w-full rounded-lg" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-1/3" />
        </div>
      ))}
    </div>
  );
}
