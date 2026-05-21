'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Star, ThumbsUp, BadgeCheck } from 'lucide-react';
import { getInitials, formatRelativeDate } from '@/lib/utils/helpers';

interface Review {
  _id: string;
  reviewer: { name: string; image?: string };
  rating: number;
  title?: string;
  comment: string;
  createdAt: Date;
  isVerifiedPurchase?: boolean;
}

interface ProductTabsProps {
  product: {
    description: string;
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
    reviews?: Review[];
  };
}

export function ProductTabs({ product }: ProductTabsProps) {
  // Calculate rating distribution
  const ratingDistribution = [5, 4, 3, 2, 1].map((stars) => {
    const count = product.reviews?.filter((r) => r.rating === stars).length || 0;
    const percentage = product.rating.count > 0 ? (count / product.rating.count) * 100 : 0;
    return { stars, count, percentage };
  });

  return (
    <Tabs defaultValue="description" className="w-full" id="reviews">
      <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
        <TabsTrigger
          value="description"
          className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
        >
          Description
        </TabsTrigger>
        <TabsTrigger
          value="specifications"
          className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
        >
          Specifications
        </TabsTrigger>
        <TabsTrigger
          value="shipping"
          className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
        >
          Shipping & Returns
        </TabsTrigger>
        <TabsTrigger
          value="reviews"
          className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
        >
          Reviews ({product.rating.count})
        </TabsTrigger>
      </TabsList>

      <TabsContent value="description" className="mt-6">
        <div className="prose prose-sm max-w-none">
          <div className="whitespace-pre-wrap text-muted-foreground leading-relaxed">
            {product.description}
          </div>
        </div>
      </TabsContent>

      <TabsContent value="specifications" className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Product Specifications</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {product.attributes?.material && (
                <div className="flex justify-between py-2 border-b">
                  <dt className="text-muted-foreground">Material</dt>
                  <dd className="font-medium">{product.attributes.material}</dd>
                </div>
              )}
              {product.attributes?.dimensions && (
                <div className="flex justify-between py-2 border-b">
                  <dt className="text-muted-foreground">Dimensions</dt>
                  <dd className="font-medium">{product.attributes.dimensions}</dd>
                </div>
              )}
              {product.attributes?.weight && (
                <div className="flex justify-between py-2 border-b">
                  <dt className="text-muted-foreground">Weight</dt>
                  <dd className="font-medium">{product.attributes.weight}</dd>
                </div>
              )}
              {product.attributes?.color && (
                <div className="flex justify-between py-2 border-b">
                  <dt className="text-muted-foreground">Color</dt>
                  <dd className="font-medium">{product.attributes.color}</dd>
                </div>
              )}
              <div className="flex justify-between py-2 border-b">
                <dt className="text-muted-foreground">Handmade</dt>
                <dd className="font-medium">
                  {product.attributes?.handmade ? 'Yes' : 'No'}
                </dd>
              </div>
              <div className="flex justify-between py-2 border-b">
                <dt className="text-muted-foreground">Customizable</dt>
                <dd className="font-medium">
                  {product.attributes?.customizable ? 'Yes' : 'No'}
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="shipping" className="mt-6">
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Shipping Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="font-medium">Processing Time</p>
                <p className="text-sm text-muted-foreground">
                  {product.shipping?.processingTime || '3-5 business days'}
                </p>
              </div>
              <div>
                <p className="font-medium">Shipping Cost</p>
                <p className="text-sm text-muted-foreground">
                  {product.shipping?.freeShipping
                    ? 'Free shipping across India'
                    : `₹ ${product.shipping?.shippingCost || 300} within India`}
                </p>
              </div>
              <div>
                <p className="font-medium">Delivery Areas</p>
                <p className="text-sm text-muted-foreground">
                  We deliver to all major cities in India. Remote areas may take additional time.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Returns & Refunds</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="font-medium">Return Policy</p>
                <p className="text-sm text-muted-foreground">
                  7-day return policy for unused items in original packaging.
                </p>
              </div>
              <div>
                <p className="font-medium">Refund Process</p>
                <p className="text-sm text-muted-foreground">
                  Refunds are processed within 5-7 business days after we receive the returned item.
                </p>
              </div>
              <div>
                <p className="font-medium">Exchange</p>
                <p className="text-sm text-muted-foreground">
                  Exchanges are subject to product availability.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="reviews" className="mt-6">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Rating Summary */}
          <Card className="lg:col-span-1">
            <CardContent className="pt-6">
              <div className="text-center mb-6">
                <div className="text-5xl font-bold text-primary">
                  {product.rating.average.toFixed(1)}
                </div>
                <div className="flex items-center justify-center gap-1 my-2">
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
                </div>
                <p className="text-sm text-muted-foreground">
                  Based on {product.rating.count} reviews
                </p>
              </div>

              <div className="space-y-3">
                {ratingDistribution.map(({ stars, count, percentage }) => (
                  <div key={stars} className="flex items-center gap-3">
                    <span className="text-sm w-12">{stars} stars</span>
                    <Progress value={percentage} className="flex-1 h-2" />
                    <span className="text-sm text-muted-foreground w-8">
                      {count}
                    </span>
                  </div>
                ))}
              </div>

              <Button className="w-full mt-6">Write a Review</Button>
            </CardContent>
          </Card>

          {/* Reviews List */}
          <div className="lg:col-span-2 space-y-6">
            {product.reviews && product.reviews.length > 0 ? (
              product.reviews.map((review) => (
                <Card key={review._id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <Avatar>
                        <AvatarImage src={review.reviewer.image} />
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {getInitials(review.reviewer.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{review.reviewer.name}</span>
                            {review.isVerifiedPurchase && (
                              <Badge variant="secondary" className="text-xs gap-1">
                                <BadgeCheck className="h-3 w-3" />
                                Verified Purchase
                              </Badge>
                            )}
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {formatRelativeDate(review.createdAt)}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 mb-2">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-muted-foreground'
                              }`}
                            />
                          ))}
                        </div>
                        {review.title && (
                          <p className="font-medium mb-1">{review.title}</p>
                        )}
                        <p className="text-muted-foreground">{review.comment}</p>
                        <Button variant="ghost" size="sm" className="mt-2 gap-1">
                          <ThumbsUp className="h-4 w-4" />
                          Helpful
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">
                  No reviews yet. Be the first to review this product!
                </p>
                <Button>Write a Review</Button>
              </div>
            )}
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}
