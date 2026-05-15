"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Copy,
  Star,
  Package,
  TrendingUp,
  AlertCircle,
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { formatPrice, formatDate } from "@/lib/utils/helpers";
import { toast } from "sonner";

// Mock data
const products = [
  {
    _id: "1",
    title: "Hand-Embroidered Silk Cushion Cover",
    slug: "hand-embroidered-silk-cushion-cover",
    images: ["/placeholder.svg?height=60&width=60"],
    price: 4500,
    compareAtPrice: 5500,
    category: { name: "Home Decor" },
    inventory: { quantity: 15 },
    status: "active",
    rating: 4.8,
    reviewCount: 23,
    sales: 45,
    createdAt: "2024-01-10",
  },
  {
    _id: "2",
    title: "Zardozi Embroidered Clutch Bag",
    slug: "zardozi-embroidered-clutch-bag",
    images: ["/placeholder.svg?height=60&width=60"],
    price: 8500,
    category: { name: "Accessories" },
    inventory: { quantity: 8 },
    status: "active",
    rating: 5.0,
    reviewCount: 15,
    sales: 32,
    createdAt: "2024-01-08",
  },
  {
    _id: "3",
    title: "Traditional Phulkari Dupatta",
    slug: "traditional-phulkari-dupatta",
    images: ["/placeholder.svg?height=60&width=60"],
    price: 5000,
    compareAtPrice: 6000,
    category: { name: "Clothing" },
    inventory: { quantity: 0 },
    status: "out_of_stock",
    rating: 4.7,
    reviewCount: 28,
    sales: 28,
    createdAt: "2024-01-05",
  },
  {
    _id: "4",
    title: "Hand-Painted Truck Art Tray",
    slug: "hand-painted-truck-art-tray",
    images: ["/placeholder.svg?height=60&width=60"],
    price: 3500,
    category: { name: "Home Decor" },
    inventory: { quantity: 20 },
    status: "draft",
    rating: 0,
    reviewCount: 0,
    sales: 0,
    createdAt: "2024-01-20",
  },
  {
    _id: "5",
    title: "Copper Engraved Tea Set",
    slug: "copper-engraved-tea-set",
    images: ["/placeholder.svg?height=60&width=60"],
    price: 9500,
    compareAtPrice: 11000,
    category: { name: "Kitchen" },
    inventory: { quantity: 5 },
    status: "active",
    rating: 4.6,
    reviewCount: 18,
    sales: 15,
    createdAt: "2024-01-12",
  },
];

const statusConfig: Record<string, { label: string; color: string }> = {
  active: { label: "Active", color: "bg-green-100 text-green-800" },
  draft: { label: "Draft", color: "bg-gray-100 text-gray-800" },
  out_of_stock: { label: "Out of Stock", color: "bg-red-100 text-red-800" },
  archived: { label: "Archived", color: "bg-yellow-100 text-yellow-800" },
};

export default function EntrepreneurProductsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || product.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedProducts(filteredProducts.map((p) => p._id));
    } else {
      setSelectedProducts([]);
    }
  };

  const handleSelectProduct = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedProducts((prev) => [...prev, id]);
    } else {
      setSelectedProducts((prev) => prev.filter((p) => p !== id));
    }
  };

  const handleDelete = (id: string) => {
    setProductToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    toast.success("Product deleted successfully");
    setDeleteDialogOpen(false);
    setProductToDelete(null);
  };

  const handleDuplicate = (id: string) => {
    toast.success("Product duplicated");
  };

  // Stats
  const totalProducts = products.length;
  const activeProducts = products.filter((p) => p.status === "active").length;
  const outOfStock = products.filter((p) => p.status === "out_of_stock").length;
  const totalSales = products.reduce((sum, p) => sum + p.sales, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Products</h1>
          <p className="text-muted-foreground">
            Manage your product catalog
          </p>
        </div>
        <Button asChild>
          <Link href="/entrepreneur/products/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <Package className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Products</p>
                <p className="text-xl font-bold">{totalProducts}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-xl font-bold">{activeProducts}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-red-100 flex items-center justify-center">
                <AlertCircle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Out of Stock</p>
                <p className="text-xl font-bold">{outOfStock}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <Star className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Sales</p>
                <p className="text-xl font-bold">{totalSales}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
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
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="out_of_stock">Out of Stock</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Bulk Actions */}
      {selectedProducts.length > 0 && (
        <div className="flex items-center gap-4 p-3 bg-muted rounded-lg">
          <span className="text-sm font-medium">
            {selectedProducts.length} selected
          </span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              Bulk Edit
            </Button>
            <Button variant="outline" size="sm" className="text-destructive">
              Delete Selected
            </Button>
          </div>
        </div>
      )}

      {/* Products Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">
                  <Checkbox
                    checked={
                      selectedProducts.length === filteredProducts.length &&
                      filteredProducts.length > 0
                    }
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>Product</TableHead>
                <TableHead className="hidden md:table-cell">Category</TableHead>
                <TableHead className="hidden sm:table-cell">Stock</TableHead>
                <TableHead>Price</TableHead>
                <TableHead className="hidden lg:table-cell">Sales</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product._id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedProducts.includes(product._id)}
                      onCheckedChange={(checked) =>
                        handleSelectProduct(product._id, checked as boolean)
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                        <Image
                          src={product.images[0]}
                          alt={product.title}
                          width={48}
                          height={48}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <Link
                          href={`/entrepreneur/products/${product._id}`}
                          className="font-medium hover:text-primary line-clamp-1"
                        >
                          {product.title}
                        </Link>
                        {product.rating > 0 && (
                          <div className="flex items-center gap-1 mt-0.5">
                            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                            <span className="text-xs text-muted-foreground">
                              {product.rating} ({product.reviewCount})
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Badge variant="outline">{product.category.name}</Badge>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <span
                      className={
                        product.inventory.quantity === 0
                          ? "text-red-600 font-medium"
                          : product.inventory.quantity < 10
                          ? "text-yellow-600 font-medium"
                          : ""
                      }
                    >
                      {product.inventory.quantity}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div>
                      <span className="font-medium">
                        {formatPrice(product.price)}
                      </span>
                      {product.compareAtPrice && (
                        <span className="text-xs text-muted-foreground line-through ml-1">
                          {formatPrice(product.compareAtPrice)}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {product.sales}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={statusConfig[product.status].color}
                    >
                      {statusConfig[product.status].label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link href={`/products/${product.slug}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/entrepreneur/products/${product._id}/edit`}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDuplicate(product._id)}
                        >
                          <Copy className="mr-2 h-4 w-4" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => handleDelete(product._id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredProducts.length === 0 && (
            <div className="py-12 text-center">
              <Package className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <p className="mt-4 text-muted-foreground">No products found</p>
              <Button asChild className="mt-4">
                <Link href="/entrepreneur/products/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Add your first product
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              product and remove it from your store.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
