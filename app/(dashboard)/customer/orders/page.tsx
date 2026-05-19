"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  Filter,
  Package,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  Eye,
  MessageSquare,
  Star,
  ChevronDown,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { formatPrice, formatDate, getInitials } from "@/lib/utils/helpers";

// Mock data
const orders = [
  {
    _id: "1",
    orderNumber: "HH-2024-001234",
    items: [
      {
        product: {
          _id: "p1",
          title: "Hand-Embroidered Silk Cushion Cover",
          images: ["/placeholder.svg?height=80&width=80"],
        },
        quantity: 2,
        price: 4500,
        variant: "Red / Large",
      },
    ],
    entrepreneur: {
      _id: "e1",
      businessName: "Fatima's Embroidery Studio",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    subtotal: 9000,
    shipping: 250,
    total: 9250,
    status: "delivered",
    paymentStatus: "paid",
    shippingAddress: {
      fullName: "Ahmed Khan",
      address: "House 123, Street 4",
      city: "Lahore",
      province: "Punjab",
      postalCode: "54000",
      phone: "+92 300 1234567",
    },
    tracking: {
      number: "PK123456789",
      carrier: "TCS",
      url: "https://tcs.com.pk/track",
    },
    timeline: [
      { status: "pending", date: "2024-01-15T10:00:00Z", note: "Order placed" },
      { status: "confirmed", date: "2024-01-15T11:30:00Z", note: "Order confirmed by seller" },
      { status: "processing", date: "2024-01-16T09:00:00Z", note: "Preparing your order" },
      { status: "shipped", date: "2024-01-17T14:00:00Z", note: "Shipped via TCS" },
      { status: "delivered", date: "2024-01-19T16:00:00Z", note: "Delivered successfully" },
    ],
    createdAt: "2024-01-15",
    canReview: true,
  },
  {
    _id: "2",
    orderNumber: "HH-2024-001235",
    items: [
      {
        product: {
          _id: "p2",
          title: "Traditional Ajrak Print Shawl",
          images: ["/placeholder.svg?height=80&width=80"],
        },
        quantity: 1,
        price: 3200,
        variant: "Blue Pattern",
      },
    ],
    entrepreneur: {
      _id: "e2",
      businessName: "Sindhi Crafts Co.",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    subtotal: 3200,
    shipping: 200,
    total: 3400,
    status: "shipped",
    paymentStatus: "paid",
    shippingAddress: {
      fullName: "Ahmed Khan",
      address: "House 123, Street 4",
      city: "Lahore",
      province: "Punjab",
      postalCode: "54000",
      phone: "+92 300 1234567",
    },
    tracking: {
      number: "PK987654321",
      carrier: "Leopards",
      url: "https://leopardscourier.com/track",
    },
    timeline: [
      { status: "pending", date: "2024-01-18T10:00:00Z", note: "Order placed" },
      { status: "confirmed", date: "2024-01-18T12:00:00Z", note: "Order confirmed" },
      { status: "shipped", date: "2024-01-19T10:00:00Z", note: "Shipped via Leopards" },
    ],
    createdAt: "2024-01-18",
    canReview: false,
  },
  {
    _id: "3",
    orderNumber: "HH-2024-001236",
    items: [
      {
        product: {
          _id: "p3",
          title: "Handcrafted Wooden Box",
          images: ["/placeholder.svg?height=80&width=80"],
        },
        quantity: 1,
        price: 2800,
      },
    ],
    entrepreneur: {
      _id: "e3",
      businessName: "Swat Woodworks",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    subtotal: 2800,
    shipping: 300,
    total: 3100,
    status: "processing",
    paymentStatus: "paid",
    shippingAddress: {
      fullName: "Ahmed Khan",
      address: "House 123, Street 4",
      city: "Lahore",
      province: "Punjab",
      postalCode: "54000",
      phone: "+92 300 1234567",
    },
    timeline: [
      { status: "pending", date: "2024-01-20T10:00:00Z", note: "Order placed" },
      { status: "confirmed", date: "2024-01-20T14:00:00Z", note: "Order confirmed" },
      { status: "processing", date: "2024-01-21T09:00:00Z", note: "Crafting your item" },
    ],
    createdAt: "2024-01-20",
    canReview: false,
  },
];

const statusConfig: Record<
  string,
  { label: string; icon: React.ElementType; color: string }
> = {
  pending: { label: "Pending", icon: Clock, color: "bg-yellow-100 text-yellow-800" },
  confirmed: { label: "Confirmed", icon: CheckCircle, color: "bg-blue-100 text-blue-800" },
  processing: { label: "Processing", icon: Package, color: "bg-purple-100 text-purple-800" },
  shipped: { label: "Shipped", icon: Truck, color: "bg-indigo-100 text-indigo-800" },
  delivered: { label: "Delivered", icon: CheckCircle, color: "bg-green-100 text-green-800" },
  cancelled: { label: "Cancelled", icon: XCircle, color: "bg-red-100 text-red-800" },
};

function OrderDetailsDialog({ order }: { order: typeof orders[0] }) {
  const StatusIcon = statusConfig[order.status].icon;

  return (
    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Order {order.orderNumber}</DialogTitle>
        <DialogDescription>
          Placed on {formatDate(order.createdAt)}
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-6 mt-4">
        {/* Status */}
        <div className="flex items-center justify-between">
          <Badge className={statusConfig[order.status].color}>
            <StatusIcon className="mr-1 h-3 w-3" />
            {statusConfig[order.status].label}
          </Badge>
          {order.tracking && (
            <a
              href={order.tracking.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary hover:underline"
            >
              Track: {order.tracking.number}
            </a>
          )}
        </div>

        {/* Timeline */}
        <div>
          <h4 className="font-medium mb-3">Order Timeline</h4>
          <div className="space-y-3">
            {order.timeline.map((event, index) => {
              const EventIcon = statusConfig[event.status]?.icon || Clock;
              return (
                <div key={index} className="flex gap-3">
                  <div
                    className={`h-8 w-8 rounded-full flex items-center justify-center ${
                      index === order.timeline.length - 1
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    <EventIcon className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{event.note}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(event.date).toLocaleString()}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <Separator />

        {/* Items */}
        <div>
          <h4 className="font-medium mb-3">Items</h4>
          <div className="space-y-3">
            {order.items.map((item, index) => (
              <div key={index} className="flex gap-3 p-3 rounded-lg bg-muted/50">
                <div className="h-16 w-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                  <Image
                    src={item.product.images[0]}
                    alt={item.product.title}
                    width={64}
                    height={64}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{item.product.title}</p>
                  {"variant" in item && item.variant && (
                    <p className="text-sm text-muted-foreground">{item.variant}</p>
                  )}
                  <p className="text-sm">Qty: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{formatPrice(item.price)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Shipping Address */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <h4 className="font-medium mb-2">Shipping Address</h4>
            <div className="text-sm text-muted-foreground">
              <p>{order.shippingAddress.fullName}</p>
              <p>{order.shippingAddress.address}</p>
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.province}
              </p>
              <p>{order.shippingAddress.postalCode}</p>
              <p>{order.shippingAddress.phone}</p>
            </div>
          </div>
          <div>
            <h4 className="font-medium mb-2">Order Summary</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>{formatPrice(order.shipping)}</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 justify-end">
          <Button variant="outline" size="sm">
            <MessageSquare className="mr-2 h-4 w-4" />
            Contact Seller
          </Button>
          {order.canReview && (
            <Button size="sm">
              <Star className="mr-2 h-4 w-4" />
              Write Review
            </Button>
          )}
        </div>
      </div>
    </DialogContent>
  );
}

export default function CustomerOrdersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<typeof orders[0] | null>(null);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.some((item) =>
        item.product.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">My Orders</h1>
        <p className="text-muted-foreground">
          Track and manage your orders
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search orders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="shipped">Shipped</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Orders Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order</TableHead>
                <TableHead className="hidden md:table-cell">Seller</TableHead>
                <TableHead className="hidden sm:table-cell">Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => {
                const StatusIcon = statusConfig[order.status].icon;
                return (
                  <TableRow key={order._id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-lg overflow-hidden bg-muted flex-shrink-0 hidden sm:block">
                          <Image
                            src={order.items[0].product.images[0]}
                            alt={order.items[0].product.title}
                            width={48}
                            height={48}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium text-sm">
                            {order.orderNumber}
                          </p>
                          <p className="text-xs text-muted-foreground truncate max-w-[150px]">
                            {order.items[0].product.title}
                            {order.items.length > 1 &&
                              ` +${order.items.length - 1} more`}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={order.entrepreneur.avatar} />
                          <AvatarFallback className="text-xs">
                            {getInitials(
                              order.entrepreneur.businessName.split(" ")[0],
                              order.entrepreneur.businessName.split(" ")[1] || ""
                            )}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm">
                          {order.entrepreneur.businessName}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <span className="text-sm text-muted-foreground">
                        {formatDate(order.createdAt)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={`text-xs ${statusConfig[order.status].color}`}
                      >
                        <StatusIcon className="mr-1 h-3 w-3" />
                        {statusConfig[order.status].label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatPrice(order.total)}
                    </TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSelectedOrder(order)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <OrderDetailsDialog order={order} />
                      </Dialog>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {filteredOrders.length === 0 && (
            <div className="py-12 text-center">
              <Package className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <p className="mt-4 text-muted-foreground">No orders found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
