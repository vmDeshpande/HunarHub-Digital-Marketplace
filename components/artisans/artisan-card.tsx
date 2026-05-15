'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Star, MapPin, Package, Briefcase, BadgeCheck } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getInitials } from '@/lib/utils/helpers';

interface ArtisanCardProps {
  artisan: {
    _id: string;
    businessName: string;
    slug: string;
    tagline?: string;
    logo?: string;
    coverImage?: string;
    location: {
      city: string;
      country: string;
    };
    rating: {
      average: number;
      count: number;
    };
    stats: {
      totalProducts: number;
      totalServices: number;
    };
    isVerified: boolean;
    categories?: {
      _id: string;
      name: string;
    }[];
  };
}

export function ArtisanCard({ artisan }: ArtisanCardProps) {
  return (
    <Card className="group overflow-hidden border-0 shadow-sm hover:shadow-md transition-shadow">
      <Link href={`/artisans/${artisan.slug}`}>
        {/* Cover Image */}
        <div className="relative h-24 bg-gradient-to-br from-primary/20 to-accent/30">
          {artisan.coverImage && (
            <Image
              src={artisan.coverImage}
              alt={`${artisan.businessName} cover`}
              fill
              className="object-cover"
            />
          )}
        </div>

        <CardContent className="p-4 pt-0">
          {/* Avatar */}
          <div className="flex justify-center -mt-10 mb-3">
            <Avatar className="h-20 w-20 border-4 border-background shadow-md">
              <AvatarImage src={artisan.logo} alt={artisan.businessName} />
              <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                {getInitials(artisan.businessName)}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* Info */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-1.5 mb-1">
              <h3 className="font-semibold text-base group-hover:text-primary transition-colors">
                {artisan.businessName}
              </h3>
              {artisan.isVerified && (
                <BadgeCheck className="h-4 w-4 text-primary" />
              )}
            </div>

            {artisan.tagline && (
              <p className="text-xs text-muted-foreground line-clamp-1 mb-2">
                {artisan.tagline}
              </p>
            )}

            {/* Location */}
            <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mb-3">
              <MapPin className="h-3 w-3" />
              <span>{artisan.location.city}, {artisan.location.country}</span>
            </div>

            {/* Rating */}
            {artisan.rating.count > 0 && (
              <div className="flex items-center justify-center gap-1 mb-3">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">{artisan.rating.average.toFixed(1)}</span>
                <span className="text-xs text-muted-foreground">
                  ({artisan.rating.count} reviews)
                </span>
              </div>
            )}

            {/* Stats */}
            <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground mb-3">
              {artisan.stats.totalProducts > 0 && (
                <div className="flex items-center gap-1">
                  <Package className="h-3 w-3" />
                  <span>{artisan.stats.totalProducts} Products</span>
                </div>
              )}
              {artisan.stats.totalServices > 0 && (
                <div className="flex items-center gap-1">
                  <Briefcase className="h-3 w-3" />
                  <span>{artisan.stats.totalServices} Services</span>
                </div>
              )}
            </div>

            {/* Categories */}
            {artisan.categories && artisan.categories.length > 0 && (
              <div className="flex flex-wrap justify-center gap-1">
                {artisan.categories.slice(0, 3).map((category) => (
                  <Badge key={category._id} variant="secondary" className="text-xs">
                    {category.name}
                  </Badge>
                ))}
                {artisan.categories.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{artisan.categories.length - 3}
                  </Badge>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
