'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import {
  Star,
  Heart,
  ShoppingCart,
  Minus,
  Plus,
  Truck,
  Shield,
  RotateCcw,
  BadgeCheck,
  Share2,
} from 'lucide-react';
import { formatPrice, getInitials } from '@/lib/utils/helpers';
import { toast } from 'sonner';

interface ProductInfoProps {
  product: {
    _id: string;
    title: string;
    shortDescription?: string;
    price: number;
    compareAtPrice?: number;
    currency: string;
    stock: number;
    sku?: string;
    attributes?: {
      material?: string;
      dimensions?: string;
      weight?: string;
      color?: string;
      handmade?: boolean;
      customizable?: boolean;
    };
    shipping?: {
      freeShipping?: boolean;
      shippingCost?: number;
      processingTime?: string;
    };
    rating: {
      average: number;
      count: number;
    };
    entrepreneur: {
      _id: string;
      businessName: string;
      slug: string;
      tagline?: string;
      logo?: string;
      isVerified?: boolean;
      rating?: { average: number; count: number };
      location?: { city: string; country: string };
    };
  };
}

export function ProductInfo({ product }: ProductInfoProps) {
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const discountPercentage =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
      : 0;

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    toast.success('Added to cart', {
      description: `${quantity} x ${product.title}`,
    });
    setIsAddingToCart(false);
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: product.title,
        text: product.shortDescription,
        url: window.location.href,
      });
    } catch {
      await navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard');
    }
  };

  return (
    <div className="space-y-6">
      {/* Badges */}
      <div className="flex flex-wrap gap-2">
        {product.attributes?.handmade && (
          <Badge variant="secondary">Handmade</Badge>
        )}
        {product.attributes?.customizable && (
          <Badge variant="outline">Customizable</Badge>
        )}
        {discountPercentage > 0 && (
          <Badge variant="destructive">-{discountPercentage}% OFF</Badge>
        )}
        {product.stock <= 5 && product.stock > 0 && (
          <Badge variant="outline" className="text-orange-600 border-orange-600">
            Only {product.stock} left
          </Badge>
        )}
      </div>

      {/* Title */}
      <h1 className="text-2xl md:text-3xl font-bold">{product.title}</h1>

      {/* Rating */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-5 w-5 ${
                i < Math.floor(product.rating.average)
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-muted-foreground'
              }`}
            />
          ))}
          <span className="ml-2 font-medium">{product.rating.average}</span>
        </div>
        <Link
          href="#reviews"
          className="text-sm text-muted-foreground hover:text-primary"
        >
          {product.rating.count} reviews
        </Link>
      </div>

      {/* Price */}
      <div className="flex items-baseline gap-3">
        <span className="text-3xl font-bold text-primary">
          {formatPrice(product.price, product.currency)}
        </span>
        {product.compareAtPrice && product.compareAtPrice > product.price && (
          <span className="text-lg text-muted-foreground line-through">
            {formatPrice(product.compareAtPrice, product.currency)}
          </span>
        )}
      </div>

      {/* Description */}
      {product.shortDescription && (
        <p className="text-muted-foreground">{product.shortDescription}</p>
      )}

      <Separator />

      {/* Artisan Info */}
      <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
        <Avatar className="h-12 w-12">
          <AvatarImage src={product.entrepreneur.logo} alt={product.entrepreneur.businessName} />
          <AvatarFallback className="bg-primary text-primary-foreground">
            {getInitials(product.entrepreneur.businessName)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <Link
              href={`/artisans/${product.entrepreneur.slug}`}
              className="font-medium hover:text-primary transition-colors"
            >
              {product.entrepreneur.businessName}
            </Link>
            {product.entrepreneur.isVerified && (
              <BadgeCheck className="h-4 w-4 text-primary" />
            )}
          </div>
          {product.entrepreneur.location && (
            <p className="text-xs text-muted-foreground">
              {product.entrepreneur.location.city}, {product.entrepreneur.location.country}
            </p>
          )}
        </div>
        <Link href={`/artisans/${product.entrepreneur.slug}`}>
          <Button variant="outline" size="sm">
            View Shop
          </Button>
        </Link>
      </div>

      <Separator />

      {/* Quantity & Add to Cart */}
      {product.stock > 0 ? (
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">Quantity:</span>
            <div className="flex items-center border rounded-lg">
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-r-none"
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <Input
                type="number"
                value={quantity}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  if (val >= 1 && val <= product.stock) {
                    setQuantity(val);
                  }
                }}
                className="h-10 w-16 text-center border-0 rounded-none"
                min={1}
                max={product.stock}
              />
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-l-none"
                onClick={() => handleQuantityChange(1)}
                disabled={quantity >= product.stock}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <span className="text-sm text-muted-foreground">
              {product.stock} available
            </span>
          </div>

          <div className="flex gap-3">
            <Button
              size="lg"
              className="flex-1"
              onClick={handleAddToCart}
              disabled={isAddingToCart}
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              {isAddingToCart ? 'Adding...' : 'Add to Cart'}
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => setIsWishlisted(!isWishlisted)}
            >
              <Heart
                className={`h-5 w-5 ${
                  isWishlisted ? 'fill-destructive text-destructive' : ''
                }`}
              />
            </Button>
            <Button size="lg" variant="outline" onClick={handleShare}>
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
        </div>
      ) : (
        <div className="p-4 bg-muted rounded-lg text-center">
          <p className="font-medium text-destructive">Out of Stock</p>
          <p className="text-sm text-muted-foreground mt-1">
            This item is currently unavailable
          </p>
          <Button variant="outline" className="mt-3">
            Notify When Available
          </Button>
        </div>
      )}

      <Separator />

      {/* Product Attributes */}
      {product.attributes && (
        <div className="space-y-2">
          <h3 className="font-medium">Product Details</h3>
          <dl className="grid grid-cols-2 gap-2 text-sm">
            {product.sku && (
              <>
                <dt className="text-muted-foreground">SKU</dt>
                <dd>{product.sku}</dd>
              </>
            )}
            {product.attributes.material && (
              <>
                <dt className="text-muted-foreground">Material</dt>
                <dd>{product.attributes.material}</dd>
              </>
            )}
            {product.attributes.dimensions && (
              <>
                <dt className="text-muted-foreground">Dimensions</dt>
                <dd>{product.attributes.dimensions}</dd>
              </>
            )}
            {product.attributes.weight && (
              <>
                <dt className="text-muted-foreground">Weight</dt>
                <dd>{product.attributes.weight}</dd>
              </>
            )}
            {product.attributes.color && (
              <>
                <dt className="text-muted-foreground">Color</dt>
                <dd>{product.attributes.color}</dd>
              </>
            )}
          </dl>
        </div>
      )}

      {/* Shipping & Guarantees */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
        <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
          <Truck className="h-5 w-5 text-primary flex-shrink-0" />
          <div>
            <p className="text-sm font-medium">
              {product.shipping?.freeShipping ? 'Free Shipping' : 'Fast Delivery'}
            </p>
            <p className="text-xs text-muted-foreground">
              {product.shipping?.processingTime || '3-5 business days'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
          <Shield className="h-5 w-5 text-primary flex-shrink-0" />
          <div>
            <p className="text-sm font-medium">Secure Payment</p>
            <p className="text-xs text-muted-foreground">100% protected</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
          <RotateCcw className="h-5 w-5 text-primary flex-shrink-0" />
          <div>
            <p className="text-sm font-medium">Easy Returns</p>
            <p className="text-xs text-muted-foreground">7-day return policy</p>
          </div>
        </div>
      </div>
    </div>
  );
}
