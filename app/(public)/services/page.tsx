import { Metadata } from 'next';
import Link from 'next/link';
import { ServiceCard } from '@/components/services/service-card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, SlidersHorizontal } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Browse Services',
  description: 'Find skilled artisan services for custom work, repairs, and more.',
};

// Mock data
const mockServices = [
  {
    _id: '1',
    title: 'Custom Pottery & Ceramics Design',
    slug: 'custom-pottery-ceramics-design',
    shortDescription: 'Get custom-made pottery pieces designed to your specifications',
    images: ['/images/placeholder-service.jpg'],
    price: 5000,
    pricingType: 'starting_from',
    deliveryTime: { min: 7, max: 14, unit: 'days' },
    rating: { average: 4.9, count: 87 },
    entrepreneur: {
      businessName: 'Mumbai Pottery House',
      slug: 'mumbai-pottery',
      location: { city: 'Mumbai' },
      isVerified: true,
    },
    location: { onsite: false, remote: true },
  },
  {
    _id: '2',
    title: 'Embroidery & Custom Stitching',
    slug: 'embroidery-custom-stitching',
    shortDescription: 'Traditional and modern embroidery services for clothing and home decor',
    images: ['/images/placeholder-service.jpg'],
    price: 2000,
    pricingType: 'hourly',
    deliveryTime: { min: 3, max: 7, unit: 'days' },
    rating: { average: 4.8, count: 156 },
    entrepreneur: {
      businessName: 'Delhi Embroidery Studio',
      slug: 'delhi-embroidery',
      location: { city: 'Delhi' },
      isVerified: true,
    },
    location: { onsite: true, remote: true },
  },
  {
    _id: '3',
    title: 'Jewelry Repair & Restoration',
    slug: 'jewelry-repair-restoration',
    shortDescription: 'Expert repair and restoration of traditional and modern jewelry',
    images: ['/images/placeholder-service.jpg'],
    price: 1500,
    pricingType: 'custom',
    deliveryTime: { min: 2, max: 5, unit: 'days' },
    rating: { average: 4.7, count: 92 },
    entrepreneur: {
      businessName: 'Bangalore Gold Works',
      slug: 'bangalore-gold',
      location: { city: 'Bangalore' },
      isVerified: true,
    },
    location: { onsite: true, remote: false },
  },
  {
    _id: '4',
    title: 'Custom Woodworking & Furniture',
    slug: 'custom-woodworking-furniture',
    shortDescription: 'Handcrafted wooden furniture and custom woodwork pieces',
    images: ['/images/placeholder-service.jpg'],
    price: 15000,
    pricingType: 'starting_from',
    deliveryTime: { min: 2, max: 4, unit: 'weeks' },
    rating: { average: 4.9, count: 64 },
    entrepreneur: {
      businessName: 'Pune Masters',
      slug: 'pune-masters',
      location: { city: 'Pune' },
      isVerified: true,
    },
    location: { onsite: true, remote: true },
  },
  {
    _id: '5',
    title: 'Art & Decorative Painting',
    slug: 'art-decorative-painting',
    shortDescription: 'Vibrant Indian art for walls and custom items',
    images: ['/images/placeholder-service.jpg'],
    price: 3000,
    pricingType: 'starting_from',
    deliveryTime: { min: 5, max: 10, unit: 'days' },
    rating: { average: 4.6, count: 128 },
    entrepreneur: {
      businessName: 'Jaipur Art Collective',
      slug: 'jaipur-art',
      location: { city: 'Jaipur' },
      isVerified: false,
    },
    location: { onsite: true, remote: true },
  },
  {
    _id: '6',
    title: 'Leather Crafting & Repair',
    slug: 'leather-crafting-repair',
    shortDescription: 'Custom leather goods and professional repair services',
    images: ['/images/placeholder-service.jpg'],
    price: 2500,
    pricingType: 'fixed',
    deliveryTime: { min: 4, max: 8, unit: 'days' },
    rating: { average: 4.5, count: 73 },
    entrepreneur: {
      businessName: 'Ahmedabad Leather Works',
      slug: 'ahmedabad-leather',
      location: { city: 'Ahmedabad' },
      isVerified: true,
    },
    location: { onsite: false, remote: true },
  },
];

const serviceCategories = [
  'All Services',
  'Custom Design',
  'Repair & Restoration',
  'Home Services',
  'Art & Design',
  'Tailoring & Stitching',
];

export default function ServicesPage() {
  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Browse Services</h1>
        <p className="text-muted-foreground">
          Find skilled artisans for custom work, repairs, and specialized craftsmanship
        </p>
      </div>

      {/* Search & Filters Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search services..."
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {serviceCategories.map((category) => (
                <SelectItem key={category} value={category.toLowerCase().replace(/\s+/g, '-')}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select defaultValue="newest">
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="rating">Top Rated</SelectItem>
              <SelectItem value="price_asc">Price: Low to High</SelectItem>
              <SelectItem value="price_desc">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2 mb-8">
        {serviceCategories.map((category, index) => (
          <Badge
            key={category}
            variant={index === 0 ? 'default' : 'outline'}
            className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            {category}
          </Badge>
        ))}
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockServices.map((service) => (
          <ServiceCard key={service._id} service={service} />
        ))}
      </div>

      {/* Load More */}
      <div className="flex justify-center mt-12">
        <Button variant="outline" size="lg">
          Load More Services
        </Button>
      </div>
    </div>
  );
}
