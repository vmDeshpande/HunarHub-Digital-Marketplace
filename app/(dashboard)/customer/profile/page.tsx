"use client";

import { useState } from "react";
import Image from "next/image";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Camera,
  Save,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { getInitials } from "@/lib/utils/helpers";

const provinces = [
  "Punjab",
  "Sindh",
  "Khyber Pakhtunkhwa",
  "Balochistan",
  "Islamabad Capital Territory",
  "Azad Kashmir",
  "Gilgit-Baltistan",
];

// Mock user data
const initialUser = {
  firstName: "Ahmed",
  lastName: "Khan",
  email: "ahmed.khan@example.com",
  phone: "+92 300 1234567",
  avatar: "/placeholder.svg?height=150&width=150",
  addresses: [
    {
      _id: "1",
      label: "Home",
      fullName: "Ahmed Khan",
      address: "House 123, Street 4, Block B",
      city: "Lahore",
      province: "Punjab",
      postalCode: "54000",
      phone: "+92 300 1234567",
      isDefault: true,
    },
    {
      _id: "2",
      label: "Office",
      fullName: "Ahmed Khan",
      address: "Office 45, Business Plaza",
      city: "Lahore",
      province: "Punjab",
      postalCode: "54000",
      phone: "+92 301 7654321",
      isDefault: false,
    },
  ],
};

export default function CustomerProfilePage() {
  const [user, setUser] = useState(initialUser);
  const [isLoading, setIsLoading] = useState(false);
  const [editingAddress, setEditingAddress] = useState<string | null>(null);
  const [newAddress, setNewAddress] = useState({
    label: "",
    fullName: "",
    address: "",
    city: "",
    province: "",
    postalCode: "",
    phone: "",
  });

  const handleSaveProfile = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
    toast.success("Profile updated successfully");
  };

  const handleAddAddress = () => {
    const address = {
      ...newAddress,
      _id: Date.now().toString(),
      isDefault: user.addresses.length === 0,
    };
    setUser((prev) => ({
      ...prev,
      addresses: [...prev.addresses, address],
    }));
    setNewAddress({
      label: "",
      fullName: "",
      address: "",
      city: "",
      province: "",
      postalCode: "",
      phone: "",
    });
    toast.success("Address added successfully");
  };

  const handleSetDefaultAddress = (id: string) => {
    setUser((prev) => ({
      ...prev,
      addresses: prev.addresses.map((addr) => ({
        ...addr,
        isDefault: addr._id === id,
      })),
    }));
    toast.success("Default address updated");
  };

  const handleDeleteAddress = (id: string) => {
    setUser((prev) => ({
      ...prev,
      addresses: prev.addresses.filter((addr) => addr._id !== id),
    }));
    toast.success("Address deleted");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">My Profile</h1>
        <p className="text-muted-foreground">
          Manage your personal information and addresses
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Card */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>
              Update your personal details here
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Avatar */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback className="text-2xl">
                    {getInitials(user.firstName, user.lastName)}
                  </AvatarFallback>
                </Avatar>
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
              <div>
                <p className="font-medium">Profile Photo</p>
                <p className="text-sm text-muted-foreground">
                  JPG, PNG or GIF. Max 5MB.
                </p>
              </div>
            </div>

            <Separator />

            {/* Form */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={user.firstName}
                  onChange={(e) =>
                    setUser((prev) => ({ ...prev, firstName: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={user.lastName}
                  onChange={(e) =>
                    setUser((prev) => ({ ...prev, lastName: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={user.email}
                  onChange={(e) =>
                    setUser((prev) => ({ ...prev, email: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={user.phone}
                  onChange={(e) =>
                    setUser((prev) => ({ ...prev, phone: e.target.value }))
                  }
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button onClick={handleSaveProfile} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Account Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-sm text-muted-foreground">Customer</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Mail className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium text-sm">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Phone className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium text-sm">{user.phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Addresses</p>
                <p className="font-medium text-sm">
                  {user.addresses.length} saved
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Addresses */}
      <Card>
        <CardHeader>
          <CardTitle>Saved Addresses</CardTitle>
          <CardDescription>
            Manage your delivery addresses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            {user.addresses.map((address) => (
              <div
                key={address._id}
                className={`p-4 rounded-lg border ${
                  address.isDefault ? "border-primary bg-primary/5" : ""
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{address.label}</span>
                    {address.isDefault && (
                      <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded">
                        Default
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>{address.fullName}</p>
                  <p>{address.address}</p>
                  <p>
                    {address.city}, {address.province} {address.postalCode}
                  </p>
                  <p>{address.phone}</p>
                </div>
                <div className="flex gap-2 mt-3">
                  {!address.isDefault && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSetDefaultAddress(address._id)}
                    >
                      Set Default
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteAddress(address._id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}

            {/* Add New Address */}
            <div className="p-4 rounded-lg border border-dashed">
              <h4 className="font-semibold mb-3">Add New Address</h4>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    placeholder="Label (e.g., Home)"
                    value={newAddress.label}
                    onChange={(e) =>
                      setNewAddress((prev) => ({
                        ...prev,
                        label: e.target.value,
                      }))
                    }
                  />
                  <Input
                    placeholder="Full Name"
                    value={newAddress.fullName}
                    onChange={(e) =>
                      setNewAddress((prev) => ({
                        ...prev,
                        fullName: e.target.value,
                      }))
                    }
                  />
                </div>
                <Input
                  placeholder="Street Address"
                  value={newAddress.address}
                  onChange={(e) =>
                    setNewAddress((prev) => ({
                      ...prev,
                      address: e.target.value,
                    }))
                  }
                />
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    placeholder="City"
                    value={newAddress.city}
                    onChange={(e) =>
                      setNewAddress((prev) => ({
                        ...prev,
                        city: e.target.value,
                      }))
                    }
                  />
                  <Select
                    value={newAddress.province}
                    onValueChange={(value) =>
                      setNewAddress((prev) => ({
                        ...prev,
                        province: value,
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Province" />
                    </SelectTrigger>
                    <SelectContent>
                      {provinces.map((province) => (
                        <SelectItem key={province} value={province}>
                          {province}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    placeholder="Postal Code"
                    value={newAddress.postalCode}
                    onChange={(e) =>
                      setNewAddress((prev) => ({
                        ...prev,
                        postalCode: e.target.value,
                      }))
                    }
                  />
                  <Input
                    placeholder="Phone"
                    value={newAddress.phone}
                    onChange={(e) =>
                      setNewAddress((prev) => ({
                        ...prev,
                        phone: e.target.value,
                      }))
                    }
                  />
                </div>
                <Button
                  className="w-full"
                  onClick={handleAddAddress}
                  disabled={
                    !newAddress.label ||
                    !newAddress.fullName ||
                    !newAddress.address ||
                    !newAddress.city ||
                    !newAddress.province
                  }
                >
                  Add Address
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
