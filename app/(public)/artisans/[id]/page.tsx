"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Star,
  MapPin,
  Calendar,
  MessageSquare,
  CheckCircle,
  Share2,
  Globe,
  Instagram,
  Facebook,
  Briefcase,
  Award,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ProductCard } from "@/components/products/product-card";
import { ServiceCard } from "@/components/services/service-card";
import { formatDate, getInitials } from "@/lib/utils/helpers";

// Mock data
const mockArtisan = {
  _id: "1",
  user: {
    _id: "1",
    firstName: "Fatima",
    lastName: "Hassan",
    avatar: "/placeholder.svg?height=150&width=150",
  },
  businessName: "Fatima's Embroidery Studio",
  bio: "Master embroiderer with over 15 years of experience in traditional Indian crafts. I specialize in zardozi, resham work, and contemporary fusion designs. My passion is preserving and promoting our rich cultural heritage through intricate handwork.",
  tagline: "Preserving Tradition, Creating Art",
  location: {
    city: "Lahore",
    province: "Punjab",
    country: "Pakistan",
  },
  skills: [
    { _id: "1", name: "Zardozi" },
    { _id: "2", name: "Hand Embroidery" },
    { _id: "3", name: "Resham Work" },
    { _id: "4", name: "Gota Work" },
    { _id: "5", name: "Mirror Work" },
  ],
  categories: [
    { _id: "1", name: "Embroidery" },
    { _id: "2", name: "Bridal Wear" },
  ],
  rating: 4.9,
  reviewCount: 127,
  completedOrders: 342,
  responseTime: "2 hours",
  responseRate: 98,
  memberSince: "2020-03-15",
  verified: true,
  featured: true,
  coverImage: "/placeholder.svg?height=400&width=1200",
  socialLinks: {
    website: "https://fatimaembroidery.pk",
    instagram: "fatima_embroidery",
    facebook: "fatimaembroidery",
  },
  achievements: [
    { title: "Top Rated Seller", icon: "star" },
    { title: "100+ Orders", icon: "briefcase" },
    { title: "Fast Responder", icon: "clock" },
  ],
};

const mockProducts = [
  {
    _id: "1",
    title: "Hand-Embroidered Silk Cushion Cover",
    slug: "hand-embroidered-silk-cushion-cover",
    price: 4500,
    compareAtPrice: 5500,
    images: ["/placeholder.svg?height=400&width=400"],
    rating: 4.8,
    reviewCount: 23,
    category: { name: "Home Decor" },
    entrepreneur: mockArtisan,
    inStock: true,
    featured: true,
  },
  {
    _id: "2",
    title: "Zardozi Embroidered Clutch Bag",
    slug: "zardozi-embroidered-clutch-bag",
    price: 8500,
    images: ["/placeholder.svg?height=400&width=400"],
    rating: 5.0,
    reviewCount: 15,
    category: { name: "Accessories" },
    entrepreneur: mockArtisan,
    inStock: true,
  },
];

const mockServices = [
  {
    _id: "1",
    title: "Custom Embroidery Design & Stitching",
    slug: "custom-embroidery-design-stitching",
    description:
      "Professional embroidery services for traditional Indian designs.",
    pricing: { type: "hourly", basePrice: 2500 },
    deliveryTime: { min: 7, max: 21, unit: "days" },
    images: ["/placeholder.svg?height=400&width=400"],
    rating: 4.9,
    reviewCount: 89,
    category: { name: "Embroidery" },
    entrepreneur: mockArtisan,
    featured: true,
  },
];

const mockReviews = [
  {
    _id: "1",
    customer: {
      firstName: "Ayesha",
      lastName: "Khan",
      avatar: "/placeholder.svg?height=50&width=50",
    },
    rating: 5,
    comment:
      "Absolutely stunning embroidery work! Fatima understood exactly what I wanted for my wedding outfit.",
    createdAt: "2024-01-15",
    type: "service",
  },
  {
    _id: "2",
    customer: {
      firstName: "Sara",
      lastName: "Ahmed",
      avatar: "/placeholder.svg?height=50&width=50",
    },
    rating: 5,
    comment:
      "Beautiful cushion covers! The quality is exceptional and the delivery was fast.",
    createdAt: "2024-01-10",
    type: "product",
  },
];

export default function ArtisanProfilePage() {
  const params = useParams();
  const [activeTab, setActiveTab] = useState("products");

  const artisan = mockArtisan;
  const products = mockProducts;
  const services = mockServices;
  const reviews = mockReviews;

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Cover Image */}
      <div className="relative h-48 md:h-64 lg:h-80 bg-gradient-to-r from-primary/20 to-primary/5">
        <Image
          src={artisan.coverImage}
          alt={artisan.businessName}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
      </div>

      <div className="container">
        {/* Profile Header */}
        <div className="relative -mt-16 md:-mt-20">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row md:items-end gap-4">
                {/* Avatar */}
                <div className="relative -mt-20 md:-mt-24">
                  <Avatar className="h-32 w-32 md:h-40 md:w-40 border-4 border-background shadow-lg">
                    <AvatarImage src={artisan.user.avatar} />
                    <AvatarFallback className="text-3xl">
                      {getInitials(
                        artisan.user.firstName,
                        artisan.user.lastName
                      )}
                    </AvatarFallback>
                  </Avatar>
                  {artisan.verified && (
                    <div className="absolute bottom-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
                      <CheckCircle className="h-5 w-5" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h1 className="text-2xl md:text-3xl font-bold">
                          {artisan.businessName}
                        </h1>
                        {artisan.featured && (
                          <Badge className="bg-primary/10 text-primary">
                            Featured
                          </Badge>
                        )}
                      </div>
                      <p className="text-muted-foreground mt-1">
                        {artisan.user.firstName} {artisan.user.lastName}
                      </p>
                      {artisan.tagline && (
                        <p className="text-sm italic text-muted-foreground mt-1">
                          &ldquo;{artisan.tagline}&rdquo;
                        </p>
                      )}

                      <div className="flex flex-wrap items-center gap-4 mt-3 text-sm">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                          <span className="font-semibold">{artisan.rating}</span>
                          <span className="text-muted-foreground">
                            ({artisan.reviewCount} reviews)
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          <span>
                            {artisan.location.city}, {artisan.location.province}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>
                            Member since {formatDate(artisan.memberSince)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button>
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Contact
                      </Button>
                      <Button variant="outline" size="icon">
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {artisan.completedOrders}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Orders Completed
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {artisan.rating}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Average Rating
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {artisan.responseRate}%
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Response Rate
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    ~{artisan.responseTime}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Response Time
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid gap-6 lg:grid-cols-3 mt-6 pb-12">
          {/* Sidebar */}
          <div className="space-y-6">
            {/* About */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">About</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {artisan.bio}
                </p>
              </CardContent>
            </Card>

            {/* Skills */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Skills & Expertise</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {artisan.skills.map((skill) => (
                    <Badge key={skill._id} variant="secondary">
                      {skill.name}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Achievements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {artisan.achievements.map((achievement, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-2 rounded-lg bg-muted/50"
                    >
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        {achievement.icon === "star" && (
                          <Award className="h-5 w-5 text-primary" />
                        )}
                        {achievement.icon === "briefcase" && (
                          <Briefcase className="h-5 w-5 text-primary" />
                        )}
                        {achievement.icon === "clock" && (
                          <Clock className="h-5 w-5 text-primary" />
                        )}
                      </div>
                      <span className="font-medium text-sm">
                        {achievement.title}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Social Links */}
            {artisan.socialLinks && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Connect</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {artisan.socialLinks.website && (
                      <a
                        href={artisan.socialLinks.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                      >
                        <Globe className="h-4 w-4" />
                        Website
                      </a>
                    )}
                    {artisan.socialLinks.instagram && (
                      <a
                        href={`https://instagram.com/${artisan.socialLinks.instagram}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                      >
                        <Instagram className="h-4 w-4" />
                        @{artisan.socialLinks.instagram}
                      </a>
                    )}
                    {artisan.socialLinks.facebook && (
                      <a
                        href={`https://facebook.com/${artisan.socialLinks.facebook}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                      >
                        <Facebook className="h-4 w-4" />
                        {artisan.socialLinks.facebook}
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="w-full justify-start">
                <TabsTrigger value="products">
                  Products ({products.length})
                </TabsTrigger>
                <TabsTrigger value="services">
                  Services ({services.length})
                </TabsTrigger>
                <TabsTrigger value="reviews">
                  Reviews ({reviews.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="products" className="mt-6">
                {products.length > 0 ? (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {products.map((product) => (
                      <ProductCard key={product._id} product={product} />
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <p className="text-muted-foreground">
                        No products listed yet.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="services" className="mt-6">
                {services.length > 0 ? (
                  <div className="grid gap-4">
                    {services.map((service) => (
                      <ServiceCard key={service._id} service={service} />
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <p className="text-muted-foreground">
                        No services offered yet.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="reviews" className="mt-6">
                <Card>
                  <CardContent className="pt-6">
                    {reviews.length > 0 ? (
                      <div className="space-y-6">
                        {reviews.map((review) => (
                          <div key={review._id} className="space-y-3">
                            <div className="flex items-start gap-3">
                              <Avatar>
                                <AvatarImage src={review.customer.avatar} />
                                <AvatarFallback>
                                  {getInitials(
                                    review.customer.firstName,
                                    review.customer.lastName
                                  )}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="font-medium">
                                      {review.customer.firstName}{" "}
                                      {review.customer.lastName}
                                    </p>
                                    <Badge
                                      variant="outline"
                                      className="text-xs mt-1"
                                    >
                                      {review.type === "product"
                                        ? "Product"
                                        : "Service"}
                                    </Badge>
                                  </div>
                                  <span className="text-xs text-muted-foreground">
                                    {formatDate(review.createdAt)}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1 mt-1">
                                  {Array.from({ length: 5 }).map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`h-3 w-3 ${
                                        i < review.rating
                                          ? "fill-amber-400 text-amber-400"
                                          : "text-muted-foreground/30"
                                      }`}
                                    />
                                  ))}
                                </div>
                                <p className="mt-2 text-sm text-muted-foreground">
                                  {review.comment}
                                </p>
                              </div>
                            </div>
                            <Separator />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center text-muted-foreground py-8">
                        No reviews yet.
                      </p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
