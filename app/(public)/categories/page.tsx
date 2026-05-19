import Link from 'next/link';
import { Metadata } from 'next';
import { ArrowRight, Gem, Home, Package, Palette, Scissors, Shirt } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const metadata: Metadata = {
  title: 'Categories',
  description: 'Browse HunarHub products and services by craft category.',
};

const categories = [
  {
    name: 'Pottery & Ceramics',
    description: 'Blue pottery, vessels, tableware, and decorative ceramic pieces.',
    icon: Package,
    href: '/products?category=pottery',
    color: 'bg-orange-100 text-orange-700',
    count: '120+',
  },
  {
    name: 'Textiles & Fabric',
    description: 'Ajrak, shawls, handwoven fabric, embroidery, and stitched goods.',
    icon: Shirt,
    href: '/products?category=textiles',
    color: 'bg-blue-100 text-blue-700',
    count: '210+',
  },
  {
    name: 'Jewelry',
    description: 'Traditional jewelry, metalwork, pearls, stones, and custom pieces.',
    icon: Gem,
    href: '/products?category=jewelry',
    color: 'bg-purple-100 text-purple-700',
    count: '95+',
  },
  {
    name: 'Handicrafts',
    description: 'Woodwork, truck art, carved boxes, keepsakes, and folk craft.',
    icon: Scissors,
    href: '/products?category=handicrafts',
    color: 'bg-green-100 text-green-700',
    count: '160+',
  },
  {
    name: 'Art & Paintings',
    description: 'Canvas work, miniature painting, calligraphy, and custom artwork.',
    icon: Palette,
    href: '/services?category=art-design',
    color: 'bg-pink-100 text-pink-700',
    count: '80+',
  },
  {
    name: 'Home Decor',
    description: 'Cushions, wall pieces, table accents, lighting, and room decor.',
    icon: Home,
    href: '/products?category=home-decor',
    color: 'bg-amber-100 text-amber-700',
    count: '140+',
  },
];

export default function CategoriesPage() {
  return (
    <div className="container py-8">
      <div className="mb-8">
        <Badge variant="secondary" className="mb-3">
          Craft Directory
        </Badge>
        <h1 className="text-3xl font-bold mb-2">Browse Categories</h1>
        <p className="text-muted-foreground max-w-2xl">
          Explore handmade products and artisan services through focused craft categories.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <Link key={category.name} href={category.href}>
            <Card className="h-full border-0 shadow-sm transition-shadow hover:shadow-md">
              <CardContent className="flex h-full flex-col p-6">
                <div className="mb-5 flex items-start justify-between gap-4">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${category.color}`}>
                    <category.icon className="h-6 w-6" />
                  </div>
                  <Badge variant="outline">{category.count}</Badge>
                </div>
                <h2 className="text-lg font-semibold">{category.name}</h2>
                <p className="mt-2 flex-1 text-sm leading-6 text-muted-foreground">
                  {category.description}
                </p>
                <div className="mt-5 flex items-center gap-2 text-sm font-medium text-primary">
                  Explore
                  <ArrowRight className="h-4 w-4" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
