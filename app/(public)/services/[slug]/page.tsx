"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import useSWR from "swr";
import {
  Star,
  Clock,
  MapPin,
  Calendar,
  MessageSquare,
  Heart,
  Share2,
  CheckCircle,
  ArrowLeft,
  User,
  Briefcase,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { formatPrice, formatDate, getInitials } from "@/lib/utils/helpers";

// Mock data - will be replaced with API call
const mockService = {
  _id: "1",
  title: "Custom Embroidery Design & Stitching",
  slug: "custom-embroidery-design-stitching",
  description:
    "Professional embroidery services for traditional Indian designs including intricate threadwork, zardozi, and contemporary patterns. I specialize in bridal wear, formal attire, and home decor items.",
  longDescription: `With over 15 years of experience in traditional Indian embroidery, I offer custom design and stitching services that bring your vision to life.

My expertise includes:
- Zardozi (gold/silver threadwork)
- Resham (silk thread embroidery)
- Gota work
- Mirror work (shisha)
- Kashmiri embroidery
- Contemporary fusion designs

Each piece is handcrafted with attention to detail, using premium threads and materials. Whether you need embroidery for a bridal outfit, formal wear, or home decor, I ensure the highest quality craftsmanship.`,
  category: { _id: "1", name: "Embroidery", slug: "embroidery" },
  skills: [
    { _id: "1", name: "Zardozi" },
    { _id: "2", name: "Hand Embroidery" },
    { _id: "3", name: "Resham Work" },
  ],
  pricing: {
    type: "hourly",
    basePrice: 2500,
    currency: "PKR",
  },
  deliveryTime: {
    min: 7,
    max: 21,
    unit: "days",
  },
  images: [
    "/placeholder.svg?height=600&width=600",
    "/placeholder.svg?height=600&width=600",
    "/placeholder.svg?height=600&width=600",
  ],
  entrepreneur: {
    _id: "1",
    user: {
      _id: "1",
      firstName: "Fatima",
      lastName: "Hassan",
      avatar: "/placeholder.svg?height=100&width=100",
    },
    businessName: "Fatima's Embroidery Studio",
    bio: "Master embroiderer with 15+ years of experience in traditional Indian crafts.",
    location: {
      city: "Lahore",
      province: "Punjab",
    },
    rating: 4.9,
    reviewCount: 127,
    completedOrders: 342,
    responseTime: "2 hours",
    memberSince: "2020-03-15",
    verified: true,
  },
  rating: 4.9,
  reviewCount: 89,
  completedRequests: 156,
  responseRate: 98,
  featured: true,
  status: "active",
};

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
      "Absolutely stunning embroidery work! Fatima understood exactly what I wanted for my wedding outfit. The zardozi work was impeccable.",
    createdAt: "2024-01-15",
    images: ["/placeholder.svg?height=100&width=100"],
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
      "Professional service from start to finish. The communication was excellent and the final product exceeded my expectations.",
    createdAt: "2024-01-10",
  },
  {
    _id: "3",
    customer: {
      firstName: "Zainab",
      lastName: "Ali",
      avatar: "/placeholder.svg?height=50&width=50",
    },
    rating: 4,
    comment:
      "Beautiful work and reasonable pricing. Delivery took a bit longer than expected but the quality made it worth the wait.",
    createdAt: "2024-01-05",
  },
];

const fetcher = (url: string) => fetch(url).then((res) => res.json());

function ServiceDetailSkeleton() {
  return (
    <div className="container py-8">
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="aspect-video w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    </div>
  );
}

export default function ServiceDetailPage() {
  const params = useParams();
  const [selectedImage, setSelectedImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [requestDialogOpen, setRequestDialogOpen] = useState(false);

  // In production, fetch from API
  // const { data: service, error, isLoading } = useSWR(
  //   `/api/v1/services/${params.slug}`,
  //   fetcher
  // );

  const service = mockService;
  const reviews = mockReviews;
  const isLoading = false;

  if (isLoading) {
    return <ServiceDetailSkeleton />;
  }

  if (!service) {
    return (
      <div className="container py-16 text-center">
        <h1 className="text-2xl font-bold">Service Not Found</h1>
        <p className="mt-2 text-muted-foreground">
          The service you&apos;re looking for doesn&apos;t exist.
        </p>
        <Button asChild className="mt-4">
          <Link href="/services">Browse Services</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container py-8">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground">
            Home
          </Link>
          <span>/</span>
          <Link href="/services" className="hover:text-foreground">
            Services
          </Link>
          <span>/</span>
          <Link
            href={`/services?category=${service.category.slug}`}
            className="hover:text-foreground"
          >
            {service.category.name}
          </Link>
          <span>/</span>
          <span className="text-foreground">{service.title}</span>
        </nav>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title & Badges */}
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                {service.featured && (
                  <Badge className="bg-primary/10 text-primary">Featured</Badge>
                )}
                <Badge variant="outline">{service.category.name}</Badge>
              </div>
              <h1 className="text-2xl font-bold md:text-3xl text-balance">
                {service.title}
              </h1>
              <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <span className="font-medium text-foreground">
                    {service.rating}
                  </span>
                  <span>({service.reviewCount} reviews)</span>
                </div>
                <div className="flex items-center gap-1">
                  <Briefcase className="h-4 w-4" />
                  <span>{service.completedRequests} orders completed</span>
                </div>
              </div>
            </div>

            {/* Image Gallery */}
            <div className="space-y-3">
              <div className="relative aspect-video overflow-hidden rounded-lg border bg-muted">
                <Image
                  src={service.images[selectedImage]}
                  alt={service.title}
                  fill
                  className="object-cover"
                />
              </div>
              {service.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {service.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border-2 transition-colors ${
                        selectedImage === index
                          ? "border-primary"
                          : "border-transparent hover:border-muted-foreground/50"
                      }`}
                    >
                      <Image
                        src={image}
                        alt={`${service.title} ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Tabs */}
            <Tabs defaultValue="description" className="w-full">
              <TabsList className="w-full justify-start">
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="reviews">
                  Reviews ({service.reviewCount})
                </TabsTrigger>
                <TabsTrigger value="faq">FAQ</TabsTrigger>
              </TabsList>

              <TabsContent value="description" className="mt-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="prose prose-sm max-w-none dark:prose-invert">
                      <p className="text-muted-foreground leading-relaxed">
                        {service.description}
                      </p>
                      <Separator className="my-4" />
                      <div className="whitespace-pre-line text-muted-foreground leading-relaxed">
                        {service.longDescription}
                      </div>
                    </div>

                    <div className="mt-6">
                      <h3 className="font-semibold mb-3">Skills & Expertise</h3>
                      <div className="flex flex-wrap gap-2">
                        {service.skills.map((skill) => (
                          <Badge key={skill._id} variant="secondary">
                            {skill.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reviews" className="mt-4">
                <Card>
                  <CardContent className="pt-6">
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
                                <p className="font-medium">
                                  {review.customer.firstName}{" "}
                                  {review.customer.lastName}
                                </p>
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
                              {review.images && review.images.length > 0 && (
                                <div className="mt-3 flex gap-2">
                                  {review.images.map((img, idx) => (
                                    <div
                                      key={idx}
                                      className="relative h-16 w-16 overflow-hidden rounded-md border"
                                    >
                                      <Image
                                        src={img}
                                        alt="Review image"
                                        fill
                                        className="object-cover"
                                      />
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                          <Separator />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="faq" className="mt-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium">
                          What materials do you use?
                        </h4>
                        <p className="mt-1 text-sm text-muted-foreground">
                          I use premium quality threads including real zari,
                          silk resham, and high-quality synthetic options based
                          on your budget and requirements.
                        </p>
                      </div>
                      <Separator />
                      <div>
                        <h4 className="font-medium">
                          Can you work on my own fabric?
                        </h4>
                        <p className="mt-1 text-sm text-muted-foreground">
                          Yes, I accept customer-provided fabric. Please ensure
                          it&apos;s suitable for embroidery work.
                        </p>
                      </div>
                      <Separator />
                      <div>
                        <h4 className="font-medium">
                          Do you offer rush orders?
                        </h4>
                        <p className="mt-1 text-sm text-muted-foreground">
                          Rush orders are available for an additional fee.
                          Please contact me to discuss your timeline.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Pricing Card */}
            <Card className="sticky top-4">
              <CardContent className="pt-6">
                <div className="text-center mb-4">
                  <div className="text-3xl font-bold text-primary">
                    {formatPrice(service.pricing.basePrice)}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Starting price / {service.pricing.type}
                  </p>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Delivery Time
                    </span>
                    <span className="font-medium">
                      {service.deliveryTime.min}-{service.deliveryTime.max}{" "}
                      {service.deliveryTime.unit}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      Response Rate
                    </span>
                    <span className="font-medium">{service.responseRate}%</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Dialog
                    open={requestDialogOpen}
                    onOpenChange={setRequestDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <Button className="w-full" size="lg">
                        <Calendar className="mr-2 h-4 w-4" />
                        Request Service
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                      <DialogHeader>
                        <DialogTitle>Request Service</DialogTitle>
                        <DialogDescription>
                          Describe your requirements and the artisan will
                          respond with a quote.
                        </DialogDescription>
                      </DialogHeader>
                      <form className="space-y-4 mt-4">
                        <div className="space-y-2">
                          <Label htmlFor="title">Project Title</Label>
                          <Input
                            id="title"
                            placeholder="e.g., Bridal Dress Embroidery"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="description">
                            Project Description
                          </Label>
                          <Textarea
                            id="description"
                            placeholder="Describe your requirements, design preferences, timeline, etc."
                            rows={4}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="budget">Budget (PKR)</Label>
                            <Input
                              id="budget"
                              type="number"
                              placeholder="Your budget"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="deadline">Deadline</Label>
                            <Input id="deadline" type="date" />
                          </div>
                        </div>
                        <Button
                          type="submit"
                          className="w-full"
                          onClick={(e) => {
                            e.preventDefault();
                            setRequestDialogOpen(false);
                          }}
                        >
                          Submit Request
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>

                  <Button variant="outline" className="w-full">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Contact Artisan
                  </Button>
                </div>

                <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsWishlisted(!isWishlisted)}
                  >
                    <Heart
                      className={`mr-2 h-4 w-4 ${
                        isWishlisted
                          ? "fill-red-500 text-red-500"
                          : ""
                      }`}
                    />
                    Save
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Share2 className="mr-2 h-4 w-4" />
                    Share
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Artisan Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">About the Artisan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-3">
                  <Avatar className="h-14 w-14">
                    <AvatarImage src={service.entrepreneur.user.avatar} />
                    <AvatarFallback>
                      {getInitials(
                        service.entrepreneur.user.firstName,
                        service.entrepreneur.user.lastName
                      )}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/artisans/${service.entrepreneur._id}`}
                        className="font-semibold hover:text-primary"
                      >
                        {service.entrepreneur.businessName}
                      </Link>
                      {service.entrepreneur.verified && (
                        <CheckCircle className="h-4 w-4 text-primary" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {service.entrepreneur.user.firstName}{" "}
                      {service.entrepreneur.user.lastName}
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      <span className="text-sm font-medium">
                        {service.entrepreneur.rating}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        ({service.entrepreneur.reviewCount} reviews)
                      </span>
                    </div>
                  </div>
                </div>

                <p className="mt-3 text-sm text-muted-foreground line-clamp-2">
                  {service.entrepreneur.bio}
                </p>

                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>
                      {service.entrepreneur.location.city},{" "}
                      {service.entrepreneur.location.province}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Briefcase className="h-4 w-4" />
                    <span>
                      {service.entrepreneur.completedOrders} orders completed
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>
                      Responds in ~{service.entrepreneur.responseTime}
                    </span>
                  </div>
                </div>

                <Button variant="outline" className="w-full mt-4" asChild>
                  <Link href={`/artisans/${service.entrepreneur._id}`}>
                    View Full Profile
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
