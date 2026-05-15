"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Tags,
  Package,
  Eye,
  EyeOff,
  GripVertical,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

// Mock data
const categories = [
  {
    _id: "1",
    name: "Embroidery",
    slug: "embroidery",
    description: "Traditional Indian embroidery including zardozi, resham, and more",
    image: "/placeholder.svg?height=60&width=60",
    productCount: 156,
    serviceCount: 23,
    isActive: true,
    isFeatured: true,
    order: 1,
  },
  {
    _id: "2",
    name: "Pottery",
    slug: "pottery",
    description: "Handcrafted pottery including blue pottery from Multan",
    image: "/placeholder.svg?height=60&width=60",
    productCount: 89,
    serviceCount: 12,
    isActive: true,
    isFeatured: true,
    order: 2,
  },
  {
    _id: "3",
    name: "Woodwork",
    slug: "woodwork",
    description: "Carved wooden items from Swat and Chiniot",
    image: "/placeholder.svg?height=60&width=60",
    productCount: 67,
    serviceCount: 8,
    isActive: true,
    isFeatured: false,
    order: 3,
  },
  {
    _id: "4",
    name: "Textiles",
    slug: "textiles",
    description: "Traditional fabrics including Ajrak, Khadi, and handwoven textiles",
    image: "/placeholder.svg?height=60&width=60",
    productCount: 234,
    serviceCount: 15,
    isActive: true,
    isFeatured: true,
    order: 4,
  },
  {
    _id: "5",
    name: "Jewelry",
    slug: "jewelry",
    description: "Traditional and contemporary Indian jewelry",
    image: "/placeholder.svg?height=60&width=60",
    productCount: 145,
    serviceCount: 5,
    isActive: true,
    isFeatured: false,
    order: 5,
  },
  {
    _id: "6",
    name: "Home Decor",
    slug: "home-decor",
    description: "Decorative items for home including truck art and traditional crafts",
    image: "/placeholder.svg?height=60&width=60",
    productCount: 178,
    serviceCount: 10,
    isActive: true,
    isFeatured: true,
    order: 6,
  },
  {
    _id: "7",
    name: "Leather Goods",
    slug: "leather-goods",
    description: "Handcrafted leather products",
    image: "/placeholder.svg?height=60&width=60",
    productCount: 45,
    serviceCount: 3,
    isActive: false,
    isFeatured: false,
    order: 7,
  },
];

export default function AdminCategoriesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<typeof categories[0] | null>(
    null
  );
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    isActive: true,
    isFeatured: false,
  });

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEdit = (category: typeof categories[0]) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description,
      isActive: category.isActive,
      isFeatured: category.isFeatured,
    });
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setCategoryToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    toast.success("Category deleted");
    setDeleteDialogOpen(false);
    setCategoryToDelete(null);
  };

  const handleSave = () => {
    if (editingCategory) {
      toast.success("Category updated");
    } else {
      toast.success("Category created");
    }
    setDialogOpen(false);
    setEditingCategory(null);
    setFormData({ name: "", description: "", isActive: true, isFeatured: false });
  };

  const handleAddNew = () => {
    setEditingCategory(null);
    setFormData({ name: "", description: "", isActive: true, isFeatured: false });
    setDialogOpen(true);
  };

  const toggleActive = (id: string, isActive: boolean) => {
    toast.success(isActive ? "Category activated" : "Category deactivated");
  };

  const toggleFeatured = (id: string, isFeatured: boolean) => {
    toast.success(isFeatured ? "Category featured" : "Category unfeatured");
  };

  // Stats
  const totalCategories = categories.length;
  const activeCategories = categories.filter((c) => c.isActive).length;
  const featuredCategories = categories.filter((c) => c.isFeatured).length;
  const totalProducts = categories.reduce((sum, c) => sum + c.productCount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Categories</h1>
          <p className="text-muted-foreground">
            Manage product and service categories
          </p>
        </div>
        <Button onClick={handleAddNew}>
          <Plus className="mr-2 h-4 w-4" />
          Add Category
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <Tags className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Categories</p>
                <p className="text-xl font-bold">{totalCategories}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                <Eye className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-xl font-bold">{activeCategories}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <Tags className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Featured</p>
                <p className="text-xl font-bold">{featuredCategories}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center">
                <Package className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Products</p>
                <p className="text-xl font-bold">{totalProducts}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search categories..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Categories Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]"></TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="hidden md:table-cell">Products</TableHead>
                <TableHead className="hidden md:table-cell">Services</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden sm:table-cell">Featured</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCategories.map((category) => (
                <TableRow key={category._id}>
                  <TableCell>
                    <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                        <Image
                          src={category.image}
                          alt={category.name}
                          width={48}
                          height={48}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-medium">{category.name}</p>
                        <p className="text-sm text-muted-foreground line-clamp-1 max-w-[200px]">
                          {category.description}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Badge variant="outline">{category.productCount}</Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Badge variant="outline">{category.serviceCount}</Badge>
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={category.isActive}
                      onCheckedChange={(checked) =>
                        toggleActive(category._id, checked)
                      }
                    />
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <Switch
                      checked={category.isFeatured}
                      onCheckedChange={(checked) =>
                        toggleFeatured(category._id, checked)
                      }
                    />
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
                        <DropdownMenuItem onClick={() => handleEdit(category)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => handleDelete(category._id)}
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

          {filteredCategories.length === 0 && (
            <div className="py-12 text-center">
              <Tags className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <p className="mt-4 text-muted-foreground">No categories found</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? "Edit Category" : "Add New Category"}
            </DialogTitle>
            <DialogDescription>
              {editingCategory
                ? "Update the category details"
                : "Create a new category for products and services"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="Category name"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Brief description of the category"
                rows={3}
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="active">Active</Label>
              <Switch
                id="active"
                checked={formData.isActive}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({ ...prev, isActive: checked }))
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="featured">Featured</Label>
              <Switch
                id="featured"
                checked={formData.isFeatured}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({ ...prev, isFeatured: checked }))
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {editingCategory ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Category?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. Products and services in this
              category will need to be reassigned.
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
