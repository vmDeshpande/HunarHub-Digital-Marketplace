import slugify from 'slugify';
import { nanoid } from 'nanoid';

/**
 * Generate a URL-friendly slug from a string
 */
export function generateSlug(text: string, uniqueId = true): string {
  const slug = slugify(text, {
    lower: true,
    strict: true,
    trim: true,
  });
  
  return uniqueId ? `${slug}-${nanoid(6)}` : slug;
}

/**
 * Generate order/request number
 */
export function generateOrderNumber(prefix = 'ORD'): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = nanoid(4).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

/**
 * Format price in PKR
 */
export function formatPrice(
  amount: number,
  currency = 'PKR',
  locale = 'en-PK'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format number with commas
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-PK').format(num);
}

/**
 * Calculate discount percentage
 */
export function calculateDiscountPercentage(
  originalPrice: number,
  salePrice: number
): number {
  if (originalPrice <= salePrice) return 0;
  return Math.round(((originalPrice - salePrice) / originalPrice) * 100);
}

/**
 * Truncate text to a specified length
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

/**
 * Get initials from name
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Format date relative to now
 */
export function formatRelativeDate(date: Date | string): string {
  const now = new Date();
  const target = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - target.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  
  return target.toLocaleDateString('en-PK', {
    day: 'numeric',
    month: 'short',
    year: target.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  });
}

/**
 * Format date
 */
export function formatDate(
  date: Date | string,
  options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }
): string {
  return new Date(date).toLocaleDateString('en-PK', options);
}

/**
 * Calculate average rating
 */
export function calculateAverageRating(ratings: number[]): number {
  if (ratings.length === 0) return 0;
  const sum = ratings.reduce((acc, val) => acc + val, 0);
  return Math.round((sum / ratings.length) * 10) / 10;
}

/**
 * Parse query params to MongoDB filter
 */
export function parseSearchParams(params: Record<string, string | undefined>): {
  filter: Record<string, unknown>;
  sort: Record<string, 1 | -1>;
  page: number;
  limit: number;
} {
  const filter: Record<string, unknown> = {};
  let sort: Record<string, 1 | -1> = { createdAt: -1 };
  const page = Math.max(1, parseInt(params.page || '1', 10));
  const limit = Math.min(50, Math.max(1, parseInt(params.limit || '12', 10)));

  // Text search
  if (params.q) {
    filter.$text = { $search: params.q };
  }

  // Category filter
  if (params.category) {
    filter.category = params.category;
  }

  // Price range
  if (params.minPrice || params.maxPrice) {
    filter.price = {};
    if (params.minPrice) filter.price.$gte = parseFloat(params.minPrice);
    if (params.maxPrice) filter.price.$lte = parseFloat(params.maxPrice);
  }

  // Rating filter
  if (params.rating) {
    filter['rating.average'] = { $gte: parseFloat(params.rating) };
  }

  // City filter
  if (params.city) {
    filter['location.city'] = params.city;
  }

  // Sorting
  switch (params.sort) {
    case 'newest':
      sort = { createdAt: -1 };
      break;
    case 'oldest':
      sort = { createdAt: 1 };
      break;
    case 'price_asc':
      sort = { price: 1 };
      break;
    case 'price_desc':
      sort = { price: -1 };
      break;
    case 'rating':
      sort = { 'rating.average': -1 };
      break;
    case 'popular':
      sort = { 'stats.sales': -1 };
      break;
  }

  return { filter, sort, page, limit };
}

/**
 * Get pagination metadata
 */
export function getPaginationMeta(
  total: number,
  page: number,
  limit: number
): {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
} {
  const totalPages = Math.ceil(total / limit);
  return {
    total,
    page,
    limit,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
}

/**
 * Validate MongoDB ObjectId
 */
export function isValidObjectId(id: string): boolean {
  return /^[0-9a-fA-F]{24}$/.test(id);
}

/**
 * Sleep utility for rate limiting
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: Parameters<T>) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
