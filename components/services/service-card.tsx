'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, Star, Clock, MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { formatPrice, getImageByName, getInitials } from '@/lib/utils/helpers';

interface ServiceCardProps {
  service: {
    _id: string;
    title: string;
    slug: string;
    shortDescription?: string;
    images: string[];
    price: number;
    pricingType: string;
    deliveryTime: {
      min: number;
      max: number;
      unit: string;
    };
    rating: {
      average: number;
      count: number;
    };
    entrepreneur?: {
      businessName: string;
      slug: string;
      logo?: string;
      location?: {
        city: string;
      };
      isVerified?: boolean;
    };
    location?: {
      onsite: boolean;
      remote: boolean;
    };
  };
}

export function ServiceCard({ service }: ServiceCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  const getPriceLabel = () => {
    switch (service.pricingType) {
      case 'hourly':
        return `${formatPrice(service.price)}/hr`;
      case 'starting_from':
        return `From ${formatPrice(service.price)}`;
      case 'custom':
        return 'Custom Quote';
      default:
        return formatPrice(service.price);
    }
  };

  const imageSrc = imageError
    ? getImageByName(service.title)
    : service.images[0] || getImageByName(service.title);

  return (
    <Card className="group overflow-hidden border-0 shadow-sm hover:shadow-md transition-shadow">
      <Link href={`/services/${service.slug}`}>
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          <Image
            src={imageSrc}
            alt={service.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            onError={() => setImageError(true)}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />

          {/* Location Badges */}
          <div className="absolute top-2 left-2 flex gap-1">
            {service.location?.remote && (
              <Badge variant="secondary" className="text-xs">
                Remote
              </Badge>
            )}
            {service.location?.onsite && (
              <Badge variant="secondary" className="text-xs">
                On-site
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
        </div>

        <CardContent className="p-4">
          {/* Artisan Info */}
          {service.entrepreneur && (
            <div className="flex items-center gap-2 mb-3">
              <Avatar className="h-6 w-6">
                <AvatarImage src={service.entrepreneur.logo} alt={service.entrepreneur.businessName} />
                <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                  {getInitials(service.entrepreneur.businessName)}
                </AvatarFallback>
              </Avatar>
              <div className="flex items-center gap-1">
                <span className="text-xs text-muted-foreground">
                  {service.entrepreneur.businessName}
                </span>
                {service.entrepreneur.isVerified && (
                  <Badge variant="secondary" className="h-4 px-1 text-[10px]">
                    Verified
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Title */}
          <h3 className="font-medium text-sm line-clamp-2 mb-2 group-hover:text-primary transition-colors">
            {service.title}
          </h3>

          {/* Rating */}
          {service.rating.count > 0 && (
            <div className="flex items-center gap-1 mb-2">
              <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
              <span className="text-xs font-medium">{service.rating.average.toFixed(1)}</span>
              <span className="text-xs text-muted-foreground">
                ({service.rating.count} reviews)
              </span>
            </div>
          )}

          {/* Meta Info */}
          <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>
                {service.deliveryTime.min === service.deliveryTime.max
                  ? `${service.deliveryTime.min} ${service.deliveryTime.unit}`
                  : `${service.deliveryTime.min}-${service.deliveryTime.max} ${service.deliveryTime.unit}`}
              </span>
            </div>
            {service.entrepreneur?.location?.city && (
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                <span>{service.entrepreneur.location.city}</span>
              </div>
            )}
          </div>

          {/* Price */}
          <div className="flex items-center justify-between">
            <span className="font-semibold text-primary">
              {getPriceLabel()}
            </span>
            <Button variant="outline" size="sm" className="h-7 text-xs">
              Get Quote
            </Button>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
