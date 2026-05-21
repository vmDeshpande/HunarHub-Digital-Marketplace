'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { X, Star } from 'lucide-react';
import { formatPrice } from '@/lib/utils/helpers';

// Mock categories - will be fetched from API
const categories = [
  { id: '1', name: 'Pottery & Ceramics', count: 234 },
  { id: '2', name: 'Textiles & Fabric', count: 456 },
  { id: '3', name: 'Jewelry', count: 189 },
  { id: '4', name: 'Handicrafts', count: 312 },
  { id: '5', name: 'Art & Paintings', count: 145 },
  { id: '6', name: 'Home Decor', count: 278 },
  { id: '7', name: 'Leather Goods', count: 98 },
  { id: '8', name: 'Woodwork', count: 167 },
];

const cities = [
  'Delhi',
  'Mumbai',
  'Bangalore',
  'Hyderabad',
  'Pune',
  'Jaipur',
  'Ahmedabad',
  'Goa',
];

export function ProductFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [priceRange, setPriceRange] = useState([
    parseInt(searchParams.get('minPrice') || '0'),
    parseInt(searchParams.get('maxPrice') || '50000'),
  ]);

  const selectedCategory = searchParams.get('category');
  const selectedRating = searchParams.get('rating');
  const selectedCity = searchParams.get('city');

  const updateFilters = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete('page'); // Reset to page 1 when filters change
    router.push(`/products?${params.toString()}`);
  };

  const clearAllFilters = () => {
    router.push('/products');
  };

  const activeFiltersCount = [
    selectedCategory,
    selectedRating,
    selectedCity,
    searchParams.get('minPrice'),
    searchParams.get('maxPrice'),
  ].filter(Boolean).length;

  return (
    <div className="space-y-6">
      {/* Active Filters */}
      {activeFiltersCount > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Active Filters</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
            >
              Clear all
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedCategory && (
              <Badge variant="secondary" className="gap-1">
                {categories.find((c) => c.id === selectedCategory)?.name}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => updateFilters('category', null)}
                />
              </Badge>
            )}
            {selectedRating && (
              <Badge variant="secondary" className="gap-1">
                {selectedRating}+ Stars
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => updateFilters('rating', null)}
                />
              </Badge>
            )}
            {selectedCity && (
              <Badge variant="secondary" className="gap-1">
                {selectedCity}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => updateFilters('city', null)}
                />
              </Badge>
            )}
          </div>
        </div>
      )}

      <Accordion type="multiple" defaultValue={['categories', 'price', 'rating']} className="w-full">
        {/* Categories */}
        <AccordionItem value="categories">
          <AccordionTrigger className="text-sm font-medium">
            Categories
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id={`category-${category.id}`}
                      checked={selectedCategory === category.id}
                      onCheckedChange={(checked) =>
                        updateFilters('category', checked ? category.id : null)
                      }
                    />
                    <Label
                      htmlFor={`category-${category.id}`}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {category.name}
                    </Label>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    ({category.count})
                  </span>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Price Range */}
        <AccordionItem value="price">
          <AccordionTrigger className="text-sm font-medium">
            Price Range
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <Slider
                value={priceRange}
                onValueChange={setPriceRange}
                max={50000}
                step={500}
                className="w-full"
              />
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  placeholder="Min"
                  value={priceRange[0]}
                  onChange={(e) =>
                    setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])
                  }
                  className="h-8 text-sm"
                />
                <span className="text-muted-foreground">-</span>
                <Input
                  type="number"
                  placeholder="Max"
                  value={priceRange[1]}
                  onChange={(e) =>
                    setPriceRange([priceRange[0], parseInt(e.target.value) || 50000])
                  }
                  className="h-8 text-sm"
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{formatPrice(priceRange[0])}</span>
                <span>{formatPrice(priceRange[1])}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => {
                  const params = new URLSearchParams(searchParams.toString());
                  params.set('minPrice', priceRange[0].toString());
                  params.set('maxPrice', priceRange[1].toString());
                  params.delete('page');
                  router.push(`/products?${params.toString()}`);
                }}
              >
                Apply Price Filter
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Rating */}
        <AccordionItem value="rating">
          <AccordionTrigger className="text-sm font-medium">
            Rating
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {[4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center gap-2">
                  <Checkbox
                    id={`rating-${rating}`}
                    checked={selectedRating === rating.toString()}
                    onCheckedChange={(checked) =>
                      updateFilters('rating', checked ? rating.toString() : null)
                    }
                  />
                  <Label
                    htmlFor={`rating-${rating}`}
                    className="flex items-center gap-1 text-sm font-normal cursor-pointer"
                  >
                    {Array.from({ length: rating }).map((_, i) => (
                      <Star
                        key={i}
                        className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                    <span className="text-muted-foreground">& up</span>
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Location */}
        <AccordionItem value="location">
          <AccordionTrigger className="text-sm font-medium">
            Artisan Location
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {cities.map((city) => (
                <div key={city} className="flex items-center gap-2">
                  <Checkbox
                    id={`city-${city}`}
                    checked={selectedCity === city}
                    onCheckedChange={(checked) =>
                      updateFilters('city', checked ? city : null)
                    }
                  />
                  <Label
                    htmlFor={`city-${city}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {city}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Attributes */}
        <AccordionItem value="attributes">
          <AccordionTrigger className="text-sm font-medium">
            Attributes
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Checkbox id="handmade" />
                <Label htmlFor="handmade" className="text-sm font-normal cursor-pointer">
                  Handmade Only
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="customizable" />
                <Label htmlFor="customizable" className="text-sm font-normal cursor-pointer">
                  Customizable
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="free-shipping" />
                <Label htmlFor="free-shipping" className="text-sm font-normal cursor-pointer">
                  Free Shipping
                </Label>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
