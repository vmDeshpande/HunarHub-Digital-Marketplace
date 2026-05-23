'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useCartStore } from '@/lib/stores/cart-store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import {
  ArrowLeft,
  Trash2,
  Plus,
  Minus,
  ShoppingCart,
  Loader2,
} from 'lucide-react';
import { formatPrice } from '@/lib/utils/helpers';

export default function CartPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { items, removeItem, updateQuantity, getSubtotal, clearCart } = useCartStore();
  const [isLoading, setIsLoading] = useState(status === 'loading');

  // Redirect if not logged in
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login?callbackUrl=/cart');
    }
  }, [status, router]);

  useEffect(() => {
    setIsLoading(status === 'loading');
  }, [status]);

  const subtotal = getSubtotal();
  const shipping = subtotal > 5000 ? 0 : 250;
  const total = subtotal + shipping;

  const handleCheckout = () => {
    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    router.push('/checkout');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 py-8">
      <div className="container max-w-6xl">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Continue Shopping
        </Link>

        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

        {items.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <ShoppingCart className="h-16 w-16 text-muted-foreground/30 mb-4" />
              <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
              <p className="text-muted-foreground mb-6 text-center">
                Start adding items to your cart to see them here
              </p>
              <Button size="lg" asChild>
                <Link href="/products">Browse Products</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Cart Items ({items.length})</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {items.map((item) => (
                    <div key={item.productId}>
                      <div className="flex gap-4">
                        {/* Product Image */}
                        <div className="relative h-24 w-24 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
                          <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            className="object-cover"
                          />
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <Link
                            href={`/products/${item.slug}`}
                            className="font-semibold hover:text-primary line-clamp-2"
                          >
                            {item.title}
                          </Link>
                          <p className="text-sm text-muted-foreground mt-1">
                            By {item.entrepreneur.businessName}
                          </p>
                          {item.variant && (
                            <p className="text-sm text-muted-foreground">
                              Variant: {item.variant}
                            </p>
                          )}
                          <p className="font-semibold mt-2">
                            {formatPrice(item.price)}
                          </p>
                        </div>

                        {/* Quantity & Remove */}
                        <div className="flex flex-col items-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            onClick={() => removeItem(item.productId)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>

                          {/* Quantity Selector */}
                          <div className="flex items-center gap-1 border rounded-lg p-1">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() =>
                                updateQuantity(item.productId, item.quantity - 1)
                              }
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center text-sm font-semibold">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() =>
                                updateQuantity(item.productId, item.quantity + 1)
                              }
                              disabled={item.quantity >= item.maxQuantity}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>

                          {/* Item Total */}
                          <p className="font-bold text-lg">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                      <Separator className="mt-6" />
                    </div>
                  ))}

                  {/* Clear Cart */}
                  <Button
                    variant="outline"
                    className="w-full text-muted-foreground"
                    onClick={clearCart}
                  >
                    Clear Cart
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Cart Summary */}
            <div>
              <Card className="sticky top-20">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Subtotal */}
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">{formatPrice(subtotal)}</span>
                  </div>

                  {/* Shipping */}
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="font-medium">
                      {shipping === 0 ? (
                        <span className="text-green-600">Free</span>
                      ) : (
                        formatPrice(shipping)
                      )}
                    </span>
                  </div>

                  {/* Free Shipping Message */}
                  {subtotal < 5000 && (
                    <div className="text-xs text-amber-600 bg-amber-50 dark:bg-amber-950 p-2 rounded">
                      Add {formatPrice(5000 - subtotal)} more for free shipping
                    </div>
                  )}

                  <Separator />

                  {/* Total */}
                  <div className="flex justify-between">
                    <span className="font-semibold">Total</span>
                    <span className="text-lg font-bold">{formatPrice(total)}</span>
                  </div>

                  {/* Checkout Button */}
                  <Button
                    className="w-full"
                    size="lg"
                    onClick={handleCheckout}
                  >
                    Proceed to Checkout
                  </Button>

                  {/* Continue Shopping */}
                  <Button
                    variant="outline"
                    className="w-full"
                    asChild
                  >
                    <Link href="/products">Continue Shopping</Link>
                  </Button>

                  {/* Trust Badges */}
                  <div className="pt-4 border-t space-y-2 text-xs text-muted-foreground">
                    <p className="flex items-center gap-2">
                      <span>✓</span> Secure checkout
                    </p>
                    <p className="flex items-center gap-2">
                      <span>✓</span> Support local artisans
                    </p>
                    <p className="flex items-center gap-2">
                      <span>✓</span> Quality guaranteed
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
