"use client";

import Link from "next/link";
import {
  Users,
  Package,
  ShoppingBag,
  DollarSign,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  AlertTriangle,
  CheckCircle,
  Clock,
  Briefcase,
  Star,
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
  BarChart,
  Bar,
} from "recharts";

// Mock data
const stats = [
  {
    title: "Total Users",
    value: "2,847",
    change: "+12.5%",
    trend: "up",
    icon: Users,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  {
    title: "Total Products",
    value: "1,234",
    change: "+8.2%",
    trend: "up",
    icon: Package,
    color: "text-purple-600",
    bgColor: "bg-purple-100",
  },
  {
    title: "Total Orders",
    value: "5,678",
    change: "+15.3%",
    trend: "up",
    icon: ShoppingBag,
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
  {
    title: "Revenue",
    value: "PKR 12.5M",
    change: "+22.1%",
    trend: "up",
    icon: DollarSign,
    color: "text-amber-600",
    bgColor: "bg-amber-100",
  },
];

const revenueData = [
  { name: "Jan", revenue: 850000, orders: 234 },
  { name: "Feb", revenue: 920000, orders: 267 },
  { name: "Mar", revenue: 880000, orders: 245 },
  { name: "Apr", revenue: 1050000, orders: 312 },
  { name: "May", revenue: 980000, orders: 289 },
  { name: "Jun", revenue: 1150000, orders: 345 },
  { name: "Jul", revenue: 1250000, orders: 378 },
];

const pendingApprovals = [
  {
    _id: "1",
    type: "entrepreneur",
    name: "Ali Crafts",
    user: {
      name: "Ali Hassan",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=40&h=40",
    },
    requestedAt: "2024-01-20",
    status: "pending",
  },
  {
    _id: "2",
    type: "product",
    name: "Handwoven Carpet",
    user: {
      name: "Fatima's Textiles",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=40&h=40",
    },
    requestedAt: "2024-01-19",
    status: "pending",
  },
  {
    _id: "3",
    type: "service",
    name: "Custom Pottery Workshop",
    user: {
      name: "Mumbai Blue Pottery",
      avatar: "https://images.unsplash.com/photo-1578500494198-246f612d03b3?auto=format&fit=crop&w=40&h=40",
    },
    requestedAt: "2024-01-18",
    status: "pending",
  },
];

const recentActivity = [
  {
    _id: "1",
    action: "New user registered",
    details: "Ahmed Khan joined as a customer",
    time: "5 minutes ago",
    type: "user",
  },
  {
    _id: "2",
    action: "Order completed",
    details: "Order #HH-2024-001234 delivered",
    time: "15 minutes ago",
    type: "order",
  },
  {
    _id: "3",
    action: "Product approved",
    details: "Hand-Embroidered Shawl is now live",
    time: "1 hour ago",
    type: "product",
  },
  {
    _id: "4",
    action: "New entrepreneur",
    details: "Jaipur Crafts verified and approved",
    time: "2 hours ago",
    type: "entrepreneur",
  },
  {
    _id: "5",
    action: "Review flagged",
    details: "Review on product #123 reported",
    time: "3 hours ago",
    type: "alert",
  },
];

const topEntrepreneurs = [
  {
    _id: "1",
    businessName: "Fatima's Embroidery Studio",
    avatar: "https://images.unsplash.com/photo-1574482620811-1aa16ffe3c82?auto=format&fit=crop&w=40&h=40",
    revenue: 285000,
    orders: 156,
    rating: 4.9,
  },
  {
    _id: "2",
    businessName: "Mumbai Blue Pottery",
    avatar: "https://images.unsplash.com/photo-1578500494198-246f612d03b3?auto=format&fit=crop&w=40&h=40",
    revenue: 245000,
    orders: 128,
    rating: 4.8,
  },
  {
    _id: "3",
    businessName: "Kashmir Crafts",
    avatar: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=40&h=40",
    revenue: 198000,
    orders: 95,
    rating: 4.9,
  },
];

const systemHealth = [
  { name: "API Response Time", value: 98, status: "healthy" },
  { name: "Database Uptime", value: 99.9, status: "healthy" },
  { name: "Payment Gateway", value: 100, status: "healthy" },
  { name: "Image CDN", value: 95, status: "warning" },
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Platform overview and management
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Download Report</Button>
          <Button>View Analytics</Button>
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
            <CardTitle className="text-lg">Platform Revenue</CardTitle>
            <Button variant="ghost" size="sm">
              View Details
            </Button>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor="hsl(var(--primary))"
                        stopOpacity={0.3}
                      />
                      <stop
                        offset="95%"
                        stopColor="hsl(var(--primary))"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-muted"
                  />
                  <XAxis
                    dataKey="name"
                    className="text-xs"
                    tick={{ fill: "hsl(var(--muted-foreground))" }}
                  />
                  <YAxis
                    className="text-xs"
                    tick={{ fill: "hsl(var(--muted-foreground))" }}
                    tickFormatter={(value) => `${value / 1000000}M`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                    formatter={(value: number) => [
                      formatPrice(value),
                      "Revenue",
                    ]}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorRev)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Pending Approvals */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Pending Approvals</CardTitle>
            <Badge variant="secondary">{pendingApprovals.length}</Badge>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingApprovals.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={item.user.avatar} />
                    <AvatarFallback>
                      {getInitials(
                        item.user.name.split(" ")[0],
                        item.user.name.split(" ")[1] || ""
                      )}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{item.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.user.name}
                    </p>
                  </div>
                  <Badge variant="outline" className="capitalize">
                    {item.type}
                  </Badge>
                </div>
              ))}
              <Button variant="outline" className="w-full" asChild>
                <Link href="/admin/products">
                  View All
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity & Entrepreneurs */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Activity */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Recent Activity</CardTitle>
            <Button variant="ghost" size="sm">
              View All
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity._id} className="flex items-start gap-3">
                  <div
                    className={`h-8 w-8 rounded-full flex items-center justify-center ${
                      activity.type === "alert"
                        ? "bg-red-100"
                        : activity.type === "order"
                        ? "bg-green-100"
                        : activity.type === "product"
                        ? "bg-purple-100"
                        : "bg-blue-100"
                    }`}
                  >
                    {activity.type === "alert" ? (
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                    ) : activity.type === "order" ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : activity.type === "product" ? (
                      <Package className="h-4 w-4 text-purple-600" />
                    ) : (
                      <Users className="h-4 w-4 text-blue-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">
                      {activity.details}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Entrepreneurs */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Top Entrepreneurs</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/users?role=entrepreneur">
                View All
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topEntrepreneurs.map((entrepreneur, index) => (
                <div
                  key={entrepreneur._id}
                  className="flex items-center gap-3 p-3 rounded-lg border bg-card"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-medium">
                    {index + 1}
                  </div>
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={entrepreneur.avatar} />
                    <AvatarFallback>
                      {getInitials(
                        entrepreneur.businessName.split(" ")[0],
                        entrepreneur.businessName.split(" ")[1] || ""
                      )}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">
                      {entrepreneur.businessName}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{entrepreneur.orders} orders</span>
                      <span>|</span>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                        {entrepreneur.rating}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-sm">
                      {formatPrice(entrepreneur.revenue)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Health */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">System Health</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {systemHealth.map((metric) => (
              <div key={metric.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{metric.name}</span>
                  <Badge
                    variant={
                      metric.status === "healthy" ? "default" : "secondary"
                    }
                    className={
                      metric.status === "healthy"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }
                  >
                    {metric.value}%
                  </Badge>
                </div>
                <Progress
                  value={metric.value}
                  className={`h-2 ${
                    metric.status === "warning" ? "[&>div]:bg-yellow-500" : ""
                  }`}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
