'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useCartStore } from '@/lib/stores/cart-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { 
  ArrowLeft, 
  CreditCard, 
  Banknote,
  Truck,
  Shield,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { formatPrice } from '@/lib/utils/helpers';

interface ShippingAddress {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { items, getSubtotal, clearCart } = useCartStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'Pakistan',
  });
  const [orderNotes, setOrderNotes] = useState('');

  // Redirect if not logged in
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login?callbackUrl=/checkout');
    }
  }, [status, router]);

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0 && status === 'authenticated') {
      router.push('/products');
    }
  }, [items, status, router]);

  const handleInputChange = (field: keyof ShippingAddress, value: string) => {
    setShippingAddress(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    const required: (keyof ShippingAddress)[] = ['fullName', 'phone', 'address', 'city', 'state', 'postalCode'];
    for (const field of required) {
      if (!shippingAddress[field]?.trim()) {
        toast.error(`Please enter your ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const orderData = {
        items: items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          variant: item.variant,
          price: item.price,
          customization: item.customization,
        })),
        shippingAddress,
        paymentMethod,
        customerNotes: orderNotes,
        subtotal: getSubtotal(),
        shippingCost: getSubtotal() >= 5000 ? 0 : 250,
        total: getSubtotal() + (getSubtotal() >= 5000 ? 0 : 250),
      };

      const response = await fetch('/api/v1/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to place order');
      }

      clearCart();
      toast.success('Order placed successfully!');
      router.push(`/customer/orders/${result.data._id}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to place order');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === 'loading' || items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const subtotal = getSubtotal();
  const shippingCost = subtotal >= 5000 ? 0 : 250;
  const total = subtotal + shippingCost;

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

        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left: Shipping & Payment */}
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping Address */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="h-5 w-5" />
                    Shipping Address
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name *</Label>
                      <Input
                        id="fullName"
                        value={shippingAddress.fullName}
                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                        placeholder="Muhammad Ali"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={shippingAddress.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="+92 300 1234567"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Street Address *</Label>
                    <Textarea
                      id="address"
                      value={shippingAddress.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      placeholder="House #, Street, Area"
                      rows={2}
                      required
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        value={shippingAddress.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        placeholder="Karachi"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State/Province *</Label>
                      <Input
                        id="state"
                        value={shippingAddress.state}
                        onChange={(e) => handleInputChange('state', e.target.value)}
                        placeholder="Sindh"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="postalCode">Postal Code *</Label>
                      <Input
                        id="postalCode"
                        value={shippingAddress.postalCode}
                        onChange={(e) => handleInputChange('postalCode', e.target.value)}
                        placeholder="75500"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="country">Country</Label>
                      <Input
                        id="country"
                        value={shippingAddress.country}
                        disabled
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Payment Method
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                    <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50 cursor-pointer">
                      <RadioGroupItem value="cod" id="cod" />
                      <Label htmlFor="cod" className="flex-1 cursor-pointer">
                        <div className="flex items-center gap-3">
                          <Banknote className="h-5 w-5 text-primary" />
                          <div>
                            <p className="font-medium">Cash on Delivery</p>
                            <p className="text-sm text-muted-foreground">
                              Pay when you receive your order
                            </p>
                          </div>
                        </div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50 cursor-pointer">
                      <RadioGroupItem value="bank_transfer" id="bank_transfer" />
                      <Label htmlFor="bank_transfer" className="flex-1 cursor-pointer">
                        <div className="flex items-center gap-3">
                          <CreditCard className="h-5 w-5 text-primary" />
                          <div>
                            <p className="font-medium">Bank Transfer</p>
                            <p className="text-sm text-muted-foreground">
                              Transfer to our bank account (details will be sent via email)
                            </p>
                          </div>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>

              {/* Order Notes */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Notes (Optional)</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    placeholder="Any special instructions for your order..."
                    rows={3}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Right: Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Items */}
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {items.map((item) => (
                      <div key={`${item.productId}-${item.variant || 'default'}`} className="flex gap-3">
                        <div className="relative w-16 h-16 rounded-md overflow-hidden bg-muted flex-shrink-0">
                          {item.image ? (
                            <Image
                              src={item.image}
                              alt={item.title}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                              No image
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{item.title}</p>
                          <p className="text-xs text-muted-foreground">
                            Qty: {item.quantity}
                          </p>
                          <p className="text-sm font-medium">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  {/* Totals */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Shipping</span>
                      <span>
                        {shippingCost === 0 ? (
                          <span className="text-green-600">Free</span>
                        ) : (
                          formatPrice(shippingCost)
                        )}
                      </span>
                    </div>
                    {subtotal < 5000 && (
                      <p className="text-xs text-muted-foreground">
                        Add {formatPrice(5000 - subtotal)} more for free shipping
                      </p>
                    )}
                  </div>

                  <Separator />

                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span className="text-primary">{formatPrice(total)}</span>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full" 
                    size="lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Placing Order...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Place Order
                      </>
                    )}
                  </Button>

                  <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                    <Shield className="h-3 w-3" />
                    Secure checkout
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
