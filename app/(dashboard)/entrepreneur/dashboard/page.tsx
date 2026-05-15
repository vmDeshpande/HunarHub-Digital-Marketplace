"use client";

import Link from "next/link";
import {
  Package,
  ShoppingBag,
  DollarSign,
  Star,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Eye,
  Users,
  Briefcase,
  Clock,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { formatPrice, formatDate, getInitials } from "@/lib/utils/helpers";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

// Mock data
const stats = [
  {
    title: "Total Revenue",
    value: "PKR 285,000",
    change: "+12.5%",
    trend: "up",
    icon: DollarSign,
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
  {
    title: "Total Orders",
    value: "156",
    change: "+8.2%",
    trend: "up",
    icon: ShoppingBag,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  {
    title: "Active Products",
    value: "24",
    change: "+2",
    trend: "up",
    icon: Package,
    color: "text-purple-600",
    bgColor: "bg-purple-100",
  },
  {
    title: "Avg. Rating",
    value: "4.9",
    change: "+0.1",
    trend: "up",
    icon: Star,
    color: "text-amber-600",
    bgColor: "bg-amber-100",
  },
];

const revenueData = [
  { name: "Jan", revenue: 45000 },
  { name: "Feb", revenue: 52000 },
  { name: "Mar", revenue: 48000 },
  { name: "Apr", revenue: 61000 },
  { name: "May", revenue: 55000 },
  { name: "Jun", revenue: 67000 },
  { name: "Jul", revenue: 72000 },
];

const recentOrders = [
  {
    _id: "1",
    orderNumber: "HH-2024-001234",
    customer: {
      name: "Ahmed Khan",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    product: "Hand-Embroidered Silk Cushion Cover",
    total: 9250,
    status: "processing",
    createdAt: "2024-01-20",
  },
  {
    _id: "2",
    orderNumber: "HH-2024-001235",
    customer: {
      name: "Sara Ahmed",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    product: "Zardozi Embroidered Clutch Bag",
    total: 8500,
    status: "shipped",
    createdAt: "2024-01-19",
  },
  {
    _id: "3",
    orderNumber: "HH-2024-001236",
    customer: {
      name: "Ayesha Khan",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    product: "Custom Bridal Embroidery",
    total: 45000,
    status: "pending",
    createdAt: "2024-01-18",
  },
];

const pendingRequests = [
  {
    _id: "1",
    title: "Wedding Dress Embroidery",
    customer: {
      name: "Fatima Ali",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    budget: 50000,
    deadline: "2024-02-15",
    createdAt: "2024-01-15",
  },
  {
    _id: "2",
    title: "Corporate Gift Set",
    customer: {
      name: "Imran Malik",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    budget: 25000,
    deadline: "2024-02-01",
    createdAt: "2024-01-18",
  },
];

const topProducts = [
  {
    _id: "1",
    title: "Hand-Embroidered Silk Cushion Cover",
    image: "/placeholder.svg?height=60&width=60",
    sales: 45,
    revenue: 202500,
  },
  {
    _id: "2",
    title: "Zardozi Embroidered Clutch Bag",
    image: "/placeholder.svg?height=60&width=60",
    sales: 32,
    revenue: 272000,
  },
  {
    _id: "3",
    title: "Traditional Phulkari Dupatta",
    image: "/placeholder.svg?height=60&width=60",
    sales: 28,
    revenue: 140000,
  },
];

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
};

export default function EntrepreneurDashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here&apos;s your store overview.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/entrepreneur/products/new">Add Product</Link>
          </Button>
          <Button asChild>
            <Link href="/entrepreneur/services/new">Add Service</Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  <div className="flex items-center gap-1 mt-1">
                    {stat.trend === "up" ? (
                      <TrendingUp className="h-3 w-3 text-green-600" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-red-600" />
                    )}
                    <span
                      className={`text-xs ${
                        stat.trend === "up" ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {stat.change}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      vs last month
                    </span>
                  </div>
                </div>
                <div
                  className={`h-12 w-12 rounded-lg ${stat.bgColor} flex items-center justify-center`}
                >
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Revenue Chart */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Revenue Overview</CardTitle>
            <Button variant="ghost" size="sm">
              View Report
            </Button>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    dataKey="name"
                    className="text-xs"
                    tick={{ fill: "hsl(var(--muted-foreground))" }}
                  />
                  <YAxis
                    className="text-xs"
                    tick={{ fill: "hsl(var(--muted-foreground))" }}
                    tickFormatter={(value) => `${value / 1000}k`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                    formatter={(value: number) => [formatPrice(value), "Revenue"]}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Top Products</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/entrepreneur/products">
                View All
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={product._id} className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-medium">
                    {index + 1}
                  </div>
                  <div className="h-12 w-12 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{product.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {product.sales} sales
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-sm">
                      {formatPrice(product.revenue)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Orders & Requests */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Orders */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Recent Orders</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/entrepreneur/orders">
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
                  className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={order.customer.avatar} />
                    <AvatarFallback>
                      {getInitials(
                        order.customer.name.split(" ")[0],
                        order.customer.name.split(" ")[1] || ""
                      )}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{order.customer.name}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {order.product}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-sm">
                      {formatPrice(order.total)}
                    </p>
                    <Badge
                      variant="secondary"
                      className={`text-xs ${statusColors[order.status]}`}
                    >
                      {order.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pending Requests */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Pending Service Requests</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/entrepreneur/requests">
                View All
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingRequests.map((request) => (
                <div
                  key={request._id}
                  className="p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={request.customer.avatar} />
                        <AvatarFallback>
                          {getInitials(
                            request.customer.name.split(" ")[0],
                            request.customer.name.split(" ")[1] || ""
                          )}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">{request.title}</p>
                        <p className="text-xs text-muted-foreground">
                          by {request.customer.name}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-yellow-50">
                      <Clock className="mr-1 h-3 w-3" />
                      Pending
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      Budget: <span className="font-medium text-foreground">{formatPrice(request.budget)}</span>
                    </span>
                    <span className="text-muted-foreground">
                      Due: {formatDate(request.deadline)}
                    </span>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Button size="sm" className="flex-1">
                      Accept
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats Row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <Eye className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Profile Views</p>
                <p className="text-xl font-bold">1,247</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                <Users className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Repeat Customers</p>
                <p className="text-xl font-bold">38%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <Briefcase className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Services</p>
                <p className="text-xl font-bold">5</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center">
                <Clock className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg Response Time</p>
                <p className="text-xl font-bold">2h</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
