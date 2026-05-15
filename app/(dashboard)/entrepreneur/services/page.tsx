'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import useSWR from 'swr';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import {
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Clock,
  Star,
  Wrench,
} from 'lucide-react';
import { formatPrice, formatDate } from '@/lib/utils/helpers';

const fetcher = (url: string) => fetch(url).then(res => res.json());

interface Service {
  _id: string;
  title: string;
  slug: string;
  images: Array<{ url: string }>;
  pricing: {
    basePrice: number;
    priceType: string;
  };
  duration: {
    estimatedDays: number;
  };
  status: string;
  stats: {
    totalRequests: number;
    completedRequests: number;
    averageRating: number;
    totalReviews: number;
  };
  createdAt: string;
}

export default function EntrepreneurServicesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  
  const { data, error, isLoading, mutate } = useSWR<{
    success: boolean;
    data: { services: Service[] };
  }>('/api/v1/services?entrepreneur=me', fetcher);

  const handleStatusChange = async (serviceId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/v1/services/${serviceId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error('Failed to update service');

      toast.success('Service status updated');
      mutate();
    } catch {
      toast.error('Failed to update service status');
    }
  };

  const handleDelete = async (serviceId: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return;

    try {
      const response = await fetch(`/api/v1/services/${serviceId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete service');

      toast.success('Service deleted');
      mutate();
    } catch {
      toast.error('Failed to delete service');
    }
  };

  const services = data?.data?.services || [];
  const filteredServices = services.filter(service =>
    service.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    total: services.length,
    active: services.filter(s => s.status === 'active').length,
    totalRequests: services.reduce((sum, s) => sum + (s.stats?.totalRequests || 0), 0),
    avgRating: services.length > 0
      ? services.reduce((sum, s) => sum + (s.stats?.averageRating || 0), 0) / services.length
      : 0,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">My Services</h1>
          <p className="text-muted-foreground">Manage your service offerings</p>
        </div>
        <Button asChild>
          <Link href="/entrepreneur/services/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Service
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Services</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.active}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalRequests}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avg Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgRating.toFixed(1)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search services..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Services Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-16 w-16 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="p-6 text-center text-muted-foreground">
              Failed to load services
            </div>
          ) : filteredServices.length === 0 ? (
            <div className="p-12 text-center">
              <Wrench className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-semibold mb-2">No services yet</h3>
              <p className="text-muted-foreground mb-4">
                Start by adding your first service offering
              </p>
              <Button asChild>
                <Link href="/entrepreneur/services/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Service
                </Link>
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Service</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Requests</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredServices.map((service) => (
                  <TableRow key={service._id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-muted">
                          {service.images?.[0]?.url ? (
                            <Image
                              src={service.images[0].url}
                              alt={service.title}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Wrench className="h-5 w-5 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        <div>
                          <Link 
                            href={`/services/${service.slug}`}
                            className="font-medium hover:text-primary"
                          >
                            {service.title}
                          </Link>
                          <p className="text-xs text-muted-foreground">
                            Added {formatDate(service.createdAt)}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <span className="font-medium">
                          {formatPrice(service.pricing.basePrice)}
                        </span>
                        <span className="text-xs text-muted-foreground block">
                          {service.pricing.priceType}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {service.duration.estimatedDays} days
                    </TableCell>
                    <TableCell>
                      {service.stats?.totalRequests || 0}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                        <span>{(service.stats?.averageRating || 0).toFixed(1)}</span>
                        <span className="text-xs text-muted-foreground">
                          ({service.stats?.totalReviews || 0})
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          service.status === 'active'
                            ? 'default'
                            : service.status === 'paused'
                            ? 'secondary'
                            : 'outline'
                        }
                      >
                        {service.status}
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
                          <DropdownMenuItem asChild>
                            <Link href={`/entrepreneur/services/${service._id}/edit`}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/services/${service.slug}`} target="_blank">
                              <Eye className="mr-2 h-4 w-4" />
                              View
                            </Link>
                          </DropdownMenuItem>
                          {service.status === 'active' ? (
                            <DropdownMenuItem
                              onClick={() => handleStatusChange(service._id, 'paused')}
                            >
                              <EyeOff className="mr-2 h-4 w-4" />
                              Pause
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem
                              onClick={() => handleStatusChange(service._id, 'active')}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              Activate
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            onClick={() => handleDelete(service._id)}
                            className="text-destructive"
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
          )}
        </CardContent>
      </Card>
    </div>
  );
}
