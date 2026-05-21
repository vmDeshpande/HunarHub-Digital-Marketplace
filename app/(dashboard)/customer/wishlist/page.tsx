"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Heart,
  ShoppingCart,
  Trash2,
  Star,
  Search,
  Grid3X3,
  List,
  Tag,
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { formatPrice } from "@/lib/utils/helpers";
import { toast } from "sonner";

// Mock data
const wishlistItems = [
  {
    _id: "1",
    product: {
      _id: "p1",
      title: "Blue Pottery Vase Set",
      slug: "blue-pottery-vase-set",
      images: ["/placeholder.svg?height=300&width=300"],
      price: 6500,
      compareAtPrice: 8000,
      rating: 4.8,
      reviewCount: 23,
      inStock: true,
      category: { name: "Home Decor" },
      entrepreneur: {
        businessName: "Mumbai Blue Pottery",
        avatar: "/placeholder.svg?height=40&width=40",
      },
    },
    addedAt: "2024-01-10",
  },
  {
    _id: "2",
    product: {
      _id: "p2",
      title: "Indian Wool Shawl",
      slug: "indian-wool-shawl",
      images: ["/placeholder.svg?height=300&width=300"],
      price: 12000,
      rating: 4.9,
      reviewCount: 45,
      inStock: true,
      category: { name: "Clothing" },
      entrepreneur: {
        businessName: "Jaipur Crafts",
        avatar: "/placeholder.svg?height=40&width=40",
      },
    },
    addedAt: "2024-01-12",
  },
  {
    _id: "3",
    product: {
      _id: "p3",
      title: "Hand-Painted Art Panel",
      slug: "hand-painted-art-panel",
      images: ["/placeholder.svg?height=300&width=300"],
      price: 15000,
      compareAtPrice: 18000,
      rating: 5.0,
      reviewCount: 12,
      inStock: false,
      category: { name: "Art" },
      entrepreneur: {
        businessName: "Delhi Art Studio",
        avatar: "/placeholder.svg?height=40&width=40",
      },
    },
    addedAt: "2024-01-15",
  },
  {
    _id: "4",
    product: {
      _id: "p4",
      title: "Handwoven Indian Ralli Quilt",
      slug: "handwoven-indian-ralli-quilt",
      images: ["/placeholder.svg?height=300&width=300"],
      price: 8500,
      rating: 4.7,
      reviewCount: 34,
      inStock: true,
      category: { name: "Home Decor" },
      entrepreneur: {
        businessName: "Bangalore Textiles",
        avatar: "/placeholder.svg?height=40&width=40",
      },
    },
    addedAt: "2024-01-18",
  },
  {
    _id: "5",
    product: {
      _id: "p5",
      title: "Copper Engraved Tea Set",
      slug: "copper-engraved-tea-set",
      images: ["/placeholder.svg?height=300&width=300"],
      price: 9500,
      compareAtPrice: 11000,
      rating: 4.6,
      reviewCount: 28,
      inStock: true,
      category: { name: "Kitchen" },
      entrepreneur: {
        businessName: "Hyderabad Metalworks",
        avatar: "/placeholder.svg?height=40&width=40",
      },
    },
    addedAt: "2024-01-20",
  },
];

export default function CustomerWishlistPage() {
  const [items, setItems] = useState(wishlistItems);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filteredItems = items
    .filter((item) =>
      item.product.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.product.price - b.product.price;
        case "price-high":
          return b.product.price - a.product.price;
        case "rating":
          return b.product.rating - a.product.rating;
        default:
          return (
            new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()
          );
      }
    });

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item._id !== id));
    toast.success("Item removed from wishlist");
  };

  const addToCart = (item: (typeof items)[0]) => {
    if (!item.product.inStock) {
      toast.error("This item is currently out of stock");
      return;
    }
    toast.success("Item added to cart");
  };

  const onSaleCount = items.filter((item) => item.product.compareAtPrice).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">My Wishlist</h1>
          <p className="text-muted-foreground">
            {items.length} items saved • {onSaleCount} on sale
          </p>
        </div>
        {items.length > 0 && (
          <Button variant="outline">
            <ShoppingCart className="mr-2 h-4 w-4" />
            Add All to Cart
          </Button>
        )}
      </div>

      {/* Filters */}
      {items.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search wishlist..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex gap-2">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Recently Added</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex border rounded-md">
              <Button
                variant={viewMode === "grid" ? "secondary" : "ghost"}
                size="icon"
                onClick={() => setViewMode("grid")}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "secondary" : "ghost"}
                size="icon"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Items */}
      {filteredItems.length > 0 ? (
        viewMode === "grid" ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredItems.map((item) => (
              <Card key={item._id} className="overflow-hidden group">
                <div className="relative aspect-square bg-muted">
                  <Image
                    src={item.product.images[0]}
                    alt={item.product.title}
                    fill
                    className="object-cover"
                  />
                  {item.product.compareAtPrice && (
                    <Badge className="absolute top-2 left-2 bg-red-500">
                      <Tag className="mr-1 h-3 w-3" />
                      Sale
                    </Badge>
                  )}
                  {!item.product.inStock && (
                    <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                      <Badge variant="secondary">Out of Stock</Badge>
                    </div>
                  )}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="secondary"
                          size="icon"
                          className="h-8 w-8"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Remove from wishlist?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will remove &quot;{item.product.title}&quot; from
                            your wishlist.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => removeItem(item._id)}>
                            Remove
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
                <CardContent className="p-4">
                  <Link
                    href={`/products/${item.product.slug}`}
                    className="font-medium hover:text-primary line-clamp-2"
                  >
                    {item.product.title}
                  </Link>
                  <p className="text-sm text-muted-foreground mt-1">
                    {item.product.entrepreneur.businessName}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                    <span className="text-sm font-medium">
                      {item.product.rating}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      ({item.product.reviewCount})
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-lg font-bold text-primary">
                      {formatPrice(item.product.price)}
                    </span>
                    {item.product.compareAtPrice && (
                      <span className="text-sm text-muted-foreground line-through">
                        {formatPrice(item.product.compareAtPrice)}
                      </span>
                    )}
                  </div>
                  <Button
                    className="w-full mt-3"
                    size="sm"
                    disabled={!item.product.inStock}
                    onClick={() => addToCart(item)}
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    {item.product.inStock ? "Add to Cart" : "Out of Stock"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredItems.map((item) => (
              <Card key={item._id}>
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <div className="relative h-24 w-24 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                      <Image
                        src={item.product.images[0]}
                        alt={item.product.title}
                        fill
                        className="object-cover"
                      />
                      {item.product.compareAtPrice && (
                        <Badge className="absolute top-1 left-1 bg-red-500 text-xs px-1">
                          Sale
                        </Badge>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <Link
                            href={`/products/${item.product.slug}`}
                            className="font-medium hover:text-primary"
                          >
                            {item.product.title}
                          </Link>
                          <p className="text-sm text-muted-foreground">
                            {item.product.entrepreneur.businessName}
                          </p>
                          <div className="flex items-center gap-1 mt-1">
                            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                            <span className="text-sm">
                              {item.product.rating} ({item.product.reviewCount})
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-lg font-bold text-primary">
                            {formatPrice(item.product.price)}
                          </span>
                          {item.product.compareAtPrice && (
                            <span className="block text-sm text-muted-foreground line-through">
                              {formatPrice(item.product.compareAtPrice)}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-3">
                        <Button
                          size="sm"
                          disabled={!item.product.inStock}
                          onClick={() => addToCart(item)}
                        >
                          <ShoppingCart className="mr-2 h-4 w-4" />
                          {item.product.inStock ? "Add to Cart" : "Out of Stock"}
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Remove
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Remove from wishlist?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                This will remove &quot;{item.product.title}&quot;
                                from your wishlist.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => removeItem(item._id)}
                              >
                                Remove
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )
      ) : (
        <Card>
          <CardContent className="py-16 text-center">
            <Heart className="mx-auto h-16 w-16 text-muted-foreground/30" />
            <h3 className="mt-4 text-lg font-semibold">Your wishlist is empty</h3>
            <p className="mt-2 text-muted-foreground">
              Start adding items you love to your wishlist
            </p>
            <Button asChild className="mt-4">
              <Link href="/products">Browse Products</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
