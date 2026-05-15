'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ProductCard } from './product-card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Grid3X3, List, ChevronLeft, ChevronRight } from 'lucide-react';

interface ProductsGridProps {
  searchParams: {
    q?: string;
    category?: string;
    minPrice?: string;
    maxPrice?: string;
    rating?: string;
    sort?: string;
    page?: string;
  };
}

// Mock data - will be replaced with API call
const mockProducts = [
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
  {
    _id: '5',
    title: 'Kashmiri Embroidered Cushion Covers',
    slug: 'kashmiri-embroidered-cushion-covers',
    images: ['/images/placeholder-product.jpg'],
    price: 1800,
    rating: { average: 4.5, count: 78 },
    entrepreneur: { businessName: 'Kashmir Crafts', slug: 'kashmir-crafts' },
    stock: 30,
    attributes: { handmade: true },
  },
  {
    _id: '6',
    title: 'Lacquer Ware Decorative Bowl',
    slug: 'lacquer-ware-decorative-bowl',
    images: ['/images/placeholder-product.jpg'],
    price: 3500,
    rating: { average: 4.4, count: 45 },
    entrepreneur: { businessName: 'Chiniot Woodcraft', slug: 'chiniot-woodcraft' },
    stock: 12,
    attributes: { handmade: true },
  },
];

export function ProductsGrid({ searchParams }: ProductsGridProps) {
  const router = useRouter();
  const urlSearchParams = useSearchParams();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const currentPage = parseInt(searchParams.page || '1');
  const sort = searchParams.sort || 'newest';
  const totalProducts = mockProducts.length;
  const totalPages = Math.ceil(totalProducts / 12);

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(urlSearchParams.toString());
    params.set('sort', value);
    params.delete('page');
    router.push(`/products?${params.toString()}`);
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(urlSearchParams.toString());
    params.set('page', page.toString());
    router.push(`/products?${params.toString()}`);
  };

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          Showing <span className="font-medium">{totalProducts}</span> products
        </p>

        <div className="flex items-center gap-4">
          {/* Sort */}
          <Select value={sort} onValueChange={handleSortChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="price_asc">Price: Low to High</SelectItem>
              <SelectItem value="price_desc">Price: High to Low</SelectItem>
              <SelectItem value="rating">Top Rated</SelectItem>
              <SelectItem value="popular">Most Popular</SelectItem>
            </SelectContent>
          </Select>

          {/* View Toggle */}
          <div className="flex items-center border rounded-lg">
            <Button
              variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
              size="icon"
              className="h-9 w-9 rounded-r-none"
              onClick={() => setViewMode('grid')}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'secondary' : 'ghost'}
              size="icon"
              className="h-9 w-9 rounded-l-none"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Products */}
      {mockProducts.length > 0 ? (
        <div
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'space-y-4'
          }
        >
          {mockProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <Grid3X3 className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium mb-2">No products found</h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your filters or search terms
          </p>
          <Button variant="outline" onClick={() => router.push('/products')}>
            Clear Filters
          </Button>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-8">
          <Button
            variant="outline"
            size="icon"
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={currentPage === page ? 'default' : 'outline'}
              size="icon"
              onClick={() => handlePageChange(page)}
            >
              {page}
            </Button>
          ))}

          <Button
            variant="outline"
            size="icon"
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
