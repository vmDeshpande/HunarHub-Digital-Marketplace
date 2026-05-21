"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Heart,
  Settings,
  User,
  Store,
  BarChart3,
  MessageSquare,
  Bell,
  Star,
  Briefcase,
  Users,
  Tags,
  FileText,
  Shield,
  Menu,
  X,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { getInitials } from "@/lib/utils/helpers";
import { signOut } from "next-auth/react";

interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
  badge?: number;
  roles?: string[];
}

const customerNavItems: NavItem[] = [
  { title: "Overview", href: "/customer/dashboard", icon: LayoutDashboard },
  { title: "My Orders", href: "/customer/orders", icon: ShoppingBag, badge: 2 },
  // { title: "Service Requests", href: "/customer/requests", icon: Briefcase },
  { title: "Wishlist", href: "/customer/wishlist", icon: Heart, badge: 5 },
  // { title: "Messages", href: "/customer/messages", icon: MessageSquare, badge: 3 },
  // { title: "Reviews", href: "/customer/reviews", icon: Star },
  { title: "Profile", href: "/customer/profile", icon: User },
  // { title: "Settings", href: "/customer/settings", icon: Settings },
];

const entrepreneurNavItems: NavItem[] = [
  { title: "Overview", href: "/entrepreneur/dashboard", icon: LayoutDashboard },
  { title: "My Products", href: "/entrepreneur/products", icon: Package },
  { title: "My Services", href: "/entrepreneur/services", icon: Briefcase },
  { title: "Orders", href: "/entrepreneur/orders", icon: ShoppingBag, badge: 4 },
  { title: "Service Requests", href: "/entrepreneur/requests", icon: FileText, badge: 2 },
  { title: "Analytics", href: "/entrepreneur/analytics", icon: BarChart3 },
  // { title: "Messages", href: "/entrepreneur/messages", icon: MessageSquare, badge: 5 },
  // { title: "Reviews", href: "/entrepreneur/reviews", icon: Star },
  // { title: "Store Settings", href: "/entrepreneur/store", icon: Store },
  { title: "Profile", href: "/entrepreneur/profile", icon: User },
  // { title: "Settings", href: "/entrepreneur/settings", icon: Settings },
];

const adminNavItems: NavItem[] = [
  { title: "Overview", href: "/admin/dashboard", icon: LayoutDashboard },
  { title: "Users", href: "/admin/users", icon: Users },
  { title: "Products", href: "/admin/products", icon: Package },
  // { title: "Services", href: "/admin/services", icon: Briefcase },
  { title: "Categories", href: "/admin/categories", icon: Tags },
  // { title: "Skills", href: "/admin/skills", icon: Star },
  { title: "Orders", href: "/admin/orders", icon: ShoppingBag },
  // { title: "Reports", href: "/admin/reports", icon: FileText },
  // { title: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  // { title: "Settings", href: "/admin/settings", icon: Settings },
];

function Sidebar({
  navItems,
  pathname,
  userRole,
  onNavigate,
}: {
  navItems: NavItem[];
  pathname: string;
  userRole: string;
  onNavigate?: () => void;
}) {
  return (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/" className="flex items-center gap-2" onClick={onNavigate}>
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">H</span>
          </div>
          <span className="font-bold text-xl">HunarHub</span>
        </Link>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <div className="space-y-1">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== `/${userRole}/dashboard` &&
                pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                <span className="flex-1">{item.title}</span>
                {item.badge && (
                  <Badge
                    variant={isActive ? "secondary" : "default"}
                    className="h-5 min-w-[20px] px-1.5"
                  >
                    {item.badge}
                  </Badge>
                )}
              </Link>
            );
          })}
        </div>
      </ScrollArea>

      {/* Role Switcher (for users with multiple roles) */}
      <div className="border-t p-4">
        <p className="text-xs text-muted-foreground mb-2">Current Role</p>
        <Badge variant="outline" className="capitalize">
          <Shield className="mr-1 h-3 w-3" />
          {userRole}
        </Badge>
      </div>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Determine which navigation to show based on the current path
  let navItems = customerNavItems;
  let userRole = "customer";

  if (pathname.startsWith("/entrepreneur")) {
    navItems = entrepreneurNavItems;
    userRole = "entrepreneur";
  } else if (pathname.startsWith("/admin")) {
    navItems = adminNavItems;
    userRole = "admin";
  }

  // Mock user for development
  const user = session?.user || {
    name: "Demo User",
    email: "demo@hunarhub.pk",
    image: "/placeholder.svg?height=40&width=40",
  };

  return (
    <div className="flex min-h-screen bg-muted/30">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 border-r bg-background">
        <Sidebar navItems={navItems} pathname={pathname} userRole={userRole} />
      </aside>

      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="p-0 w-64">
          <Sidebar
            navItems={navItems}
            pathname={pathname}
            userRole={userRole}
            onNavigate={() => setSidebarOpen(false)}
          />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex-1 lg:pl-64">
        {/* Header */}
        <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-background px-4 lg:px-6">
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>

          {/* Search (optional) */}
          <div className="flex-1" />

          {/* Right Side Actions */}
          <div className="flex items-center gap-2">
            {/* Notifications */}
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-medium text-primary-foreground flex items-center justify-center">
                3
              </span>
              <span className="sr-only">Notifications</span>
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2 px-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.image || undefined} />
                    <AvatarFallback>
                      {getInitials(user.name?.split(" ")[0] || "", user.name?.split(" ")[1] || "")}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden md:inline-block text-sm font-medium">
                    {user.name}
                  </span>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href={`/${userRole}/profile`}>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/${userRole}/settings`}>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/">
                    <Store className="mr-2 h-4 w-4" />
                    Back to Marketplace
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={() => signOut({ callbackUrl: "/" })}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
