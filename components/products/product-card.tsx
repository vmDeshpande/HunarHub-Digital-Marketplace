'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, Star, ShoppingCart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { formatPrice } from '@/lib/utils/helpers';

interface ProductCardProps {
  product: {
    _id: string;
    title: string;
    slug: string;
    images: string[];
    price: number;
    compareAtPrice?: number;
    rating: {
      average: number;
      count: number;
    };
    entrepreneur?: {
      businessName: string;
      slug: string;
    };
    stock: number;
    attributes?: {
      handmade?: boolean;
    };
  };
  showQuickAdd?: boolean;
}

export function ProductCard({ product, showQuickAdd = true }: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [imageError, setImageError] = useState(false);

  const discountPercentage =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
      : 0;

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
    // TODO: Implement wishlist API
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // TODO: Implement add to cart
  };

  return (
    <Card className="group overflow-hidden border-0 shadow-sm hover:shadow-md transition-shadow">
      <Link href={`/products/${product.slug}`}>
        <div className="relative aspect-square overflow-hidden bg-muted">
          <Image
            src={imageError ? '/images/placeholder-product.jpg' : product.images[0] || '/images/placeholder-product.jpg'}
            alt={product.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            onError={() => setImageError(true)}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
          
          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {discountPercentage > 0 && (
              <Badge variant="destructive" className="text-xs">
                -{discountPercentage}%
              </Badge>
            )}
            {product.attributes?.handmade && (
              <Badge variant="secondary" className="text-xs">
                Handmade
              </Badge>
            )}
            {product.stock === 0 && (
              <Badge variant="outline" className="text-xs bg-background">
                Out of Stock
              </Badge>
            )}
          </div>

          {/* Wishlist Button */}
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              'absolute top-2 right-2 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm',
              'opacity-0 group-hover:opacity-100 transition-opacity',
              isWishlisted && 'opacity-100'
            )}
            onClick={handleWishlistToggle}
          >
            <Heart
              className={cn(
                'h-4 w-4',
                isWishlisted && 'fill-destructive text-destructive'
              )}
            />
          </Button>

          {/* Quick Add Button */}
          {showQuickAdd && product.stock > 0 && (
            <Button
              variant="secondary"
              size="sm"
              className={cn(
                'absolute bottom-2 left-1/2 -translate-x-1/2',
                'opacity-0 group-hover:opacity-100 transition-opacity'
              )}
              onClick={handleQuickAdd}
            >
              <ShoppingCart className="h-4 w-4 mr-1" />
              Add to Cart
            </Button>
          )}
        </div>

        <CardContent className="p-4">
          {/* Artisan */}
          {product.entrepreneur && (
            <p className="text-xs text-muted-foreground mb-1">
              {product.entrepreneur.businessName}
            </p>
          )}

          {/* Title */}
          <h3 className="font-medium text-sm line-clamp-2 mb-2 group-hover:text-primary transition-colors">
            {product.title}
          </h3>

          {/* Rating */}
          {product.rating.count > 0 && (
            <div className="flex items-center gap-1 mb-2">
              <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
              <span className="text-xs font-medium">{product.rating.average.toFixed(1)}</span>
              <span className="text-xs text-muted-foreground">
                ({product.rating.count})
              </span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center gap-2">
            <span className="font-semibold text-primary">
              {formatPrice(product.price)}
            </span>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
