import { Metadata } from 'next';
import { ArtisanCard } from '@/components/artisans/artisan-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, MapPin } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Meet Our Artisans',
  description: 'Discover talented Indian artisans preserving traditional craftsmanship.',
};

// Mock data
const mockArtisans = [
  {
    _id: '1',
    businessName: 'Mumbai Pottery House',
    slug: 'mumbai-pottery',
    tagline: 'Traditional blue pottery since 1965',
    location: { city: 'Mumbai', country: 'India' },
    rating: { average: 4.9, count: 312 },
    stats: { totalProducts: 45, totalServices: 3 },
    isVerified: true,
    categories: [{ _id: '1', name: 'Pottery' }, { _id: '2', name: 'Ceramics' }],
  },
  {
    _id: '2',
    businessName: 'Bangalore Crafts',
    slug: 'bangalore-crafts',
    tagline: 'Authentic Indian handicrafts',
    location: { city: 'Bangalore', country: 'India' },
    rating: { average: 4.8, count: 189 },
    stats: { totalProducts: 78, totalServices: 5 },
    isVerified: true,
    categories: [{ _id: '3', name: 'Textiles' }, { _id: '4', name: 'Embroidery' }],
  },
  {
    _id: '3',
    businessName: 'Hyderabad Metal Works',
    slug: 'hyderabad-metal',
    tagline: 'Master copper and brass artisans',
    location: { city: 'Hyderabad', country: 'India' },
    rating: { average: 4.7, count: 156 },
    stats: { totalProducts: 34, totalServices: 2 },
    isVerified: true,
    categories: [{ _id: '5', name: 'Metalwork' }],
  },
  {
    _id: '4',
    businessName: 'Delhi Art Studio',
    slug: 'delhi-art',
    tagline: 'Contemporary meets traditional art',
    location: { city: 'Delhi', country: 'India' },
    rating: { average: 4.6, count: 203 },
    stats: { totalProducts: 56, totalServices: 8 },
    isVerified: true,
    categories: [{ _id: '6', name: 'Art' }, { _id: '7', name: 'Paintings' }],
  },
  {
    _id: '5',
    businessName: 'Jaipur Crafts',
    slug: 'jaipur-crafts',
    tagline: 'Exquisite Indian embroidery',
    location: { city: 'Jaipur', country: 'India' },
    rating: { average: 4.8, count: 145 },
    stats: { totalProducts: 89, totalServices: 4 },
    isVerified: true,
    categories: [{ _id: '4', name: 'Embroidery' }, { _id: '3', name: 'Textiles' }],
  },
  {
    _id: '6',
    businessName: 'Pune Woodcraft',
    slug: 'pune-woodcraft',
    tagline: 'Heritage woodworking excellence',
    location: { city: 'Pune', country: 'India' },
    rating: { average: 4.9, count: 178 },
    stats: { totalProducts: 42, totalServices: 6 },
    isVerified: true,
    categories: [{ _id: '8', name: 'Woodwork' }, { _id: '9', name: 'Furniture' }],
  },
  {
    _id: '7',
    businessName: 'Ahmedabad Leather Arts',
    slug: 'ahmedabad-leather',
    tagline: 'Premium leather craftsmanship',
    location: { city: 'Ahmedabad', country: 'India' },
    rating: { average: 4.5, count: 98 },
    stats: { totalProducts: 67, totalServices: 3 },
    isVerified: false,
    categories: [{ _id: '10', name: 'Leather' }],
  },
  {
    _id: '8',
    businessName: 'Goa Stone Carvers',
    slug: 'goa-stone',
    tagline: 'Ancient stone carving traditions',
    location: { city: 'Goa', country: 'India' },
    rating: { average: 4.7, count: 67 },
    stats: { totalProducts: 28, totalServices: 2 },
    isVerified: true,
    categories: [{ _id: '11', name: 'Stone Carving' }],
  },
];

const cities = [
  'All Cities',
  'Delhi',
  'Mumbai',
  'Bangalore',
  'Hyderabad',
  'Jaipur',
  'Pune',
  'Ahmedabad',
  'Goa',
];

const skills = [
  'All Skills',
  'Pottery',
  'Textiles',
  'Embroidery',
  'Metalwork',
  'Woodwork',
  'Leather',
  'Painting',
  'Jewelry',
];

export default function ArtisansPage() {
  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Meet Our Artisans</h1>
        <p className="text-muted-foreground">
          Discover talented Indian craftspeople preserving traditional heritage
        </p>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search artisans by name or skill..."
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Select defaultValue="all-cities">
            <SelectTrigger className="w-[150px]">
              <MapPin className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Location" />
            </SelectTrigger>
            <SelectContent>
              {cities.map((city) => (
                <SelectItem key={city} value={city.toLowerCase().replace(/\s+/g, '-')}>
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select defaultValue="all-skills">
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Skill" />
            </SelectTrigger>
            <SelectContent>
              {skills.map((skill) => (
                <SelectItem key={skill} value={skill.toLowerCase().replace(/\s+/g, '-')}>
                  {skill}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select defaultValue="rating">
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rating">Top Rated</SelectItem>
              <SelectItem value="reviews">Most Reviews</SelectItem>
              <SelectItem value="products">Most Products</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Skill Pills */}
      <div className="flex flex-wrap gap-2 mb-8">
        {skills.map((skill, index) => (
          <Badge
            key={skill}
            variant={index === 0 ? 'default' : 'outline'}
            className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            {skill}
          </Badge>
        ))}
      </div>

      {/* Stats */}
      <div className="flex gap-8 mb-8 pb-8 border-b">
        <div>
          <p className="text-2xl font-bold text-primary">{mockArtisans.length}+</p>
          <p className="text-sm text-muted-foreground">Verified Artisans</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-primary">15+</p>
          <p className="text-sm text-muted-foreground">Cities</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-primary">20+</p>
          <p className="text-sm text-muted-foreground">Craft Categories</p>
        </div>
      </div>

      {/* Artisans Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {mockArtisans.map((artisan) => (
          <ArtisanCard key={artisan._id} artisan={artisan} />
        ))}
      </div>

      {/* Load More */}
      <div className="flex justify-center mt-12">
        <Button variant="outline" size="lg">
          Load More Artisans
        </Button>
      </div>
    </div>
  );
}
