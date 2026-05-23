"use client";

import Link from "next/link";
import {
  ShoppingBag,
  Heart,
  Star,
  Briefcase,
  Package,
  ArrowRight,
  TrendingUp,
  Clock,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatPrice, formatDate, getInitials } from "@/lib/utils/helpers";

// Mock data
const stats = [
  {
    title: "Total Orders",
    value: "12",
    change: "+2 this month",
    icon: ShoppingBag,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  {
    title: "Service Requests",
    value: "5",
    change: "1 pending",
    icon: Briefcase,
    color: "text-purple-600",
    bgColor: "bg-purple-100",
  },
  {
    title: "Wishlist Items",
    value: "8",
    change: "3 on sale",
    icon: Heart,
    color: "text-red-600",
    bgColor: "bg-red-100",
  },
  {
    title: "Reviews Given",
    value: "7",
    change: "100% completion",
    icon: Star,
    color: "text-amber-600",
    bgColor: "bg-amber-100",
  },
];

const recentOrders = [
  {
    _id: "1",
    orderNumber: "HH-2024-001234",
    product: {
      title: "Hand-Embroidered Silk Cushion Cover",
      image: "https://images.unsplash.com/photo-1574482620811-1aa16ffe3c82?auto=format&fit=crop&w=60&h=60",
    },
    entrepreneur: {
      businessName: "Fatima's Embroidery Studio",
    },
    total: 4500,
    status: "delivered",
    createdAt: "2024-01-15",
  },
  {
    _id: "2",
    orderNumber: "HH-2024-001235",
    product: {
      title: "Traditional Indian Print Shawl",
      image: "https://images.unsplash.com/photo-1536782106527-a00a3d62ce2b?auto=format&fit=crop&w=60&h=60",
    },
    entrepreneur: {
      businessName: "Bangalore Crafts Co.",
    },
    total: 3200,
    status: "shipped",
    createdAt: "2024-01-18",
  },
  {
    _id: "3",
    orderNumber: "HH-2024-001236",
    product: {
      title: "Handcrafted Wooden Box",
      image: "https://images.unsplash.com/photo-1595643707802-412a366f2eff?auto=format&fit=crop&w=60&h=60",
    },
    entrepreneur: {
      businessName: "Pune Woodworks",
    },
    total: 2800,
    status: "processing",
    createdAt: "2024-01-20",
  },
];

const recentRequests = [
  {
    _id: "1",
    title: "Custom Bridal Embroidery",
    service: {
      title: "Custom Embroidery Design & Stitching",
    },
    entrepreneur: {
      businessName: "Fatima's Embroidery Studio",
      avatar: "https://images.unsplash.com/photo-1574482620811-1aa16ffe3c82?auto=format&fit=crop&w=40&h=40",
    },
    status: "in_progress",
    createdAt: "2024-01-10",
  },
  {
    _id: "2",
    title: "Pottery Workshop Request",
    service: {
      title: "Custom Pottery Making",
    },
    entrepreneur: {
      businessName: "Mumbai Blue Pottery",
      avatar: "https://images.unsplash.com/photo-1578500494198-246f612d03b3?auto=format&fit=crop&w=40&h=40",
    },
    status: "pending",
    createdAt: "2024-01-19",
  },
];

const wishlistItems = [
  {
    _id: "1",
    title: "Blue Pottery Vase Set",
    image: "https://images.unsplash.com/photo-1578500494198-246f612d03b3?auto=format&fit=crop&w=80&h=80",
    price: 6500,
    compareAtPrice: 8000,
    entrepreneur: { businessName: "Mumbai Blue Pottery" },
  },
  {
    _id: "2",
    title: "Indian Wool Shawl",
    image: "https://images.unsplash.com/photo-1536782106527-a00a3d62ce2b?auto=format&fit=crop&w=80&h=80",
    price: 12000,
    entrepreneur: { businessName: "Jaipur Crafts" },
  },
];

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
  in_progress: "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
};

export default function CustomerDashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Welcome back!</h1>
        <p className="text-muted-foreground">
          Here&apos;s what&apos;s happening with your orders and requests.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div
                  className={`h-12 w-12 rounded-lg ${stat.bgColor} flex items-center justify-center`}
                >
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.change}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Orders */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Recent Orders</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/customer/orders">
                View All
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div
                  key={order._id}
                  className="flex items-center gap-4 p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                >
                  <div className="h-14 w-14 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                    <img
                      src={order.product.image}
                      alt={order.product.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{order.product.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {order.entrepreneur.businessName}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge
                        variant="secondary"
                        className={`text-xs ${statusColors[order.status]}`}
                      >
                        {order.status.replace("_", " ")}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(order.createdAt)}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formatPrice(order.total)}</p>
                    <p className="text-xs text-muted-foreground">
                      {order.orderNumber}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Service Requests */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Service Requests</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/customer/requests">
                View All
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentRequests.map((request) => (
                <div
                  key={request._id}
                  className="flex items-center gap-4 p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                >
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={request.entrepreneur.avatar} />
                    <AvatarFallback>
                      {getInitials(
                        request.entrepreneur.businessName.split(" ")[0],
                        request.entrepreneur.businessName.split(" ")[1] || ""
                      )}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{request.title}</p>
                    <p className="text-sm text-muted-foreground truncate">
                      {request.service.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {request.entrepreneur.businessName}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge
                      variant="secondary"
                      className={`text-xs ${statusColors[request.status]}`}
                    >
                      {request.status.replace("_", " ")}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDate(request.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Wishlist Preview */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Wishlist</CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/customer/wishlist">
              View All ({wishlistItems.length})
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {wishlistItems.map((item) => (
              <div
                key={item._id}
                className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
              >
                <div className="h-16 w-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{item.title}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {item.entrepreneur.businessName}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-semibold text-sm text-primary">
                      {formatPrice(item.price)}
                    </span>
                    {item.compareAtPrice && (
                      <span className="text-xs text-muted-foreground line-through">
                        {formatPrice(item.compareAtPrice)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
