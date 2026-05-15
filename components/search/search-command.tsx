'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import { Badge } from '@/components/ui/badge';
import { Package, Wrench, User, Search, Loader2 } from 'lucide-react';
import { formatPrice } from '@/lib/utils/helpers';
import { useDebounce } from '@/hooks/use-debounce';

interface SearchResult {
  products: Array<{
    _id: string;
    title: string;
    slug: string;
    images: Array<{ url: string }>;
    price: number;
    entrepreneur?: { businessName: string };
  }>;
  services: Array<{
    _id: string;
    title: string;
    slug: string;
    images: Array<{ url: string }>;
    pricing: { basePrice: number };
    entrepreneur?: { businessName: string };
  }>;
  artisans: Array<{
    _id: string;
    businessName: string;
    coverImage?: string;
    specializations: string[];
    user?: { firstName: string; lastName: string; avatar?: string };
  }>;
}

export function SearchCommand() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const debouncedQuery = useDebounce(query, 300);

  // Keyboard shortcut
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  // Search API call
  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery || searchQuery.length < 2) {
      setResults(null);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/v1/search?q=${encodeURIComponent(searchQuery)}&limit=5`);
      const data = await response.json();
      
      if (data.success) {
        setResults(data.data);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    performSearch(debouncedQuery);
  }, [debouncedQuery, performSearch]);

  const handleSelect = (type: string, slug: string) => {
    setOpen(false);
    setQuery('');
    router.push(`/${type}/${slug}`);
  };

  const hasResults = results && (
    results.products.length > 0 || 
    results.services.length > 0 || 
    results.artisans.length > 0
  );

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="relative flex items-center gap-2 w-full max-w-sm px-3 py-2 text-sm text-muted-foreground bg-muted/50 border rounded-lg hover:bg-muted transition-colors"
      >
        <Search className="h-4 w-4" />
        <span className="flex-1 text-left">Search products, services...</span>
        <kbd className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 text-xs font-mono bg-background border rounded">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput 
          placeholder="Search products, services, artisans..." 
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          {isLoading && (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          )}

          {!isLoading && query.length >= 2 && !hasResults && (
            <CommandEmpty>No results found for &quot;{query}&quot;</CommandEmpty>
          )}

          {!isLoading && hasResults && (
            <>
              {results.products.length > 0 && (
                <CommandGroup heading="Products">
                  {results.products.map((product) => (
                    <CommandItem
                      key={product._id}
                      onSelect={() => handleSelect('products', product.slug)}
                      className="flex items-center gap-3 cursor-pointer"
                    >
                      <div className="relative w-10 h-10 rounded-md overflow-hidden bg-muted flex-shrink-0">
                        {product.images?.[0]?.url ? (
                          <Image
                            src={product.images[0].url}
                            alt={product.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <Package className="w-full h-full p-2 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{product.title}</p>
                        {product.entrepreneur && (
                          <p className="text-xs text-muted-foreground truncate">
                            by {product.entrepreneur.businessName}
                          </p>
                        )}
                      </div>
                      <span className="text-sm font-medium text-primary">
                        {formatPrice(product.price)}
                      </span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}

              {results.services.length > 0 && (
                <>
                  <CommandSeparator />
                  <CommandGroup heading="Services">
                    {results.services.map((service) => (
                      <CommandItem
                        key={service._id}
                        onSelect={() => handleSelect('services', service.slug)}
                        className="flex items-center gap-3 cursor-pointer"
                      >
                        <div className="relative w-10 h-10 rounded-md overflow-hidden bg-muted flex-shrink-0">
                          {service.images?.[0]?.url ? (
                            <Image
                              src={service.images[0].url}
                              alt={service.title}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <Wrench className="w-full h-full p-2 text-muted-foreground" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{service.title}</p>
                          {service.entrepreneur && (
                            <p className="text-xs text-muted-foreground truncate">
                              by {service.entrepreneur.businessName}
                            </p>
                          )}
                        </div>
                        <span className="text-sm font-medium text-primary">
                          From {formatPrice(service.pricing.basePrice)}
                        </span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </>
              )}

              {results.artisans.length > 0 && (
                <>
                  <CommandSeparator />
                  <CommandGroup heading="Artisans">
                    {results.artisans.map((artisan) => (
                      <CommandItem
                        key={artisan._id}
                        onSelect={() => handleSelect('artisans', artisan._id)}
                        className="flex items-center gap-3 cursor-pointer"
                      >
                        <div className="relative w-10 h-10 rounded-full overflow-hidden bg-muted flex-shrink-0">
                          {artisan.user?.avatar ? (
                            <Image
                              src={artisan.user.avatar}
                              alt={artisan.businessName}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <User className="w-full h-full p-2 text-muted-foreground" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{artisan.businessName}</p>
                          <div className="flex gap-1 mt-0.5">
                            {artisan.specializations?.slice(0, 2).map((spec) => (
                              <Badge key={spec} variant="secondary" className="text-xs py-0">
                                {spec}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </>
              )}
            </>
          )}

          {!query && (
            <CommandGroup heading="Quick Links">
              <CommandItem onSelect={() => { setOpen(false); router.push('/products'); }}>
                <Package className="mr-2 h-4 w-4" />
                Browse all products
              </CommandItem>
              <CommandItem onSelect={() => { setOpen(false); router.push('/services'); }}>
                <Wrench className="mr-2 h-4 w-4" />
                Browse all services
              </CommandItem>
              <CommandItem onSelect={() => { setOpen(false); router.push('/artisans'); }}>
                <User className="mr-2 h-4 w-4" />
                Meet our artisans
              </CommandItem>
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}
