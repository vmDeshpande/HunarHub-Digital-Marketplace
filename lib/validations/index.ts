import { z } from 'zod';

// Common validations
export const emailSchema = z.string().email('Invalid email address');
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number');

export const phoneSchema = z
  .string()
  .regex(/^(\+92|0)?[0-9]{10}$/, 'Invalid Indian phone number')
  .optional();

// Auth validations
export const signUpSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: emailSchema,
  password: passwordSchema,
  role: z.enum(['customer', 'entrepreneur']).default('customer'),
});

export const signInSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

// User validations
export const updateProfileSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  phone: phoneSchema,
  address: z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    postalCode: z.string().optional(),
    country: z.string().optional(),
  }).optional(),
  notifications: z.object({
    email: z.boolean().optional(),
    push: z.boolean().optional(),
    sms: z.boolean().optional(),
  }).optional(),
});

// Entrepreneur profile validations
export const entrepreneurProfileSchema = z.object({
  businessName: z.string().min(2).max(100),
  tagline: z.string().max(150).optional(),
  description: z.string().min(50).max(2000),
  location: z.object({
    city: z.string().min(2),
    state: z.string().optional(),
    country: z.string().default('Pakistan'),
  }),
  contact: z.object({
    phone: phoneSchema,
    email: z.string().email().optional(),
    whatsapp: z.string().optional(),
    website: z.string().url().optional(),
  }).optional(),
  socialLinks: z.object({
    facebook: z.string().url().optional(),
    instagram: z.string().url().optional(),
    twitter: z.string().url().optional(),
    linkedin: z.string().url().optional(),
  }).optional(),
  skills: z.array(z.string()).optional(),
  categories: z.array(z.string()).optional(),
});

// Product validations
export const productSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().min(20).max(5000),
  shortDescription: z.string().max(300).optional(),
  category: z.string(),
  subcategory: z.string().optional(),
  tags: z.array(z.string()).max(10).optional(),
  price: z.number().positive(),
  compareAtPrice: z.number().positive().optional(),
  stock: z.number().int().min(0),
  sku: z.string().optional(),
  attributes: z.object({
    material: z.string().optional(),
    dimensions: z.string().optional(),
    weight: z.string().optional(),
    color: z.string().optional(),
    handmade: z.boolean().optional(),
    customizable: z.boolean().optional(),
  }).optional(),
  shipping: z.object({
    weight: z.number().optional(),
    dimensions: z.object({
      length: z.number(),
      width: z.number(),
      height: z.number(),
    }).optional(),
    freeShipping: z.boolean().optional(),
    shippingCost: z.number().optional(),
    processingTime: z.string().optional(),
  }).optional(),
});

// Service validations
export const serviceSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().min(50).max(5000),
  shortDescription: z.string().max(300).optional(),
  category: z.string(),
  subcategory: z.string().optional(),
  skills: z.array(z.string()).optional(),
  tags: z.array(z.string()).max(10).optional(),
  pricingType: z.enum(['fixed', 'hourly', 'custom', 'starting_from']),
  price: z.number().positive(),
  deliveryTime: z.object({
    min: z.number().int().positive(),
    max: z.number().int().positive(),
    unit: z.enum(['days', 'weeks', 'months']),
  }),
  packages: z.array(z.object({
    name: z.string(),
    description: z.string(),
    price: z.number().positive(),
    deliveryTime: z.number().int().positive(),
    revisions: z.number().int().optional(),
    features: z.array(z.string()),
  })).optional(),
  location: z.object({
    onsite: z.boolean(),
    remote: z.boolean(),
    areas: z.array(z.string()).optional(),
  }).optional(),
});

// Order validations
export const createOrderSchema = z.object({
  items: z.array(z.object({
    productId: z.string(),
    quantity: z.number().int().positive(),
    selectedVariant: z.string().optional(),
  })).min(1),
  shippingAddress: z.object({
    name: z.string().min(2),
    phone: z.string(),
    street: z.string().min(5),
    city: z.string().min(2),
    state: z.string().optional(),
    postalCode: z.string(),
    country: z.string().default('Pakistan'),
  }),
  paymentMethod: z.enum(['cod', 'bank_transfer', 'easypaisa', 'jazzcash', 'card']),
  customerNotes: z.string().max(500).optional(),
});

// Service request validations
export const serviceRequestSchema = z.object({
  serviceId: z.string(),
  selectedPackage: z.string().optional(),
  title: z.string().min(5).max(200),
  description: z.string().min(20).max(2000),
  requirements: z.string().min(10).max(2000),
  budget: z.object({
    min: z.number().positive(),
    max: z.number().positive(),
  }).optional(),
  timeline: z.object({
    preferredStart: z.string().datetime().optional(),
    deadline: z.string().datetime().optional(),
  }).optional(),
  location: z.object({
    type: z.enum(['onsite', 'remote']),
    address: z.string().optional(),
    city: z.string().optional(),
  }).optional(),
});

// Review validations
export const reviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  title: z.string().max(100).optional(),
  comment: z.string().min(10).max(2000),
});

// Search/filter validations
export const searchQuerySchema = z.object({
  q: z.string().optional(),
  category: z.string().optional(),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
  rating: z.number().min(0).max(5).optional(),
  city: z.string().optional(),
  sort: z.enum(['newest', 'oldest', 'price_asc', 'price_desc', 'rating', 'popular']).optional(),
  page: z.number().int().positive().optional(),
  limit: z.number().int().positive().max(50).optional(),
});

// Types
export type SignUpInput = z.infer<typeof signUpSchema>;
export type SignInInput = z.infer<typeof signInSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type EntrepreneurProfileInput = z.infer<typeof entrepreneurProfileSchema>;
export type ProductInput = z.infer<typeof productSchema>;
export type ServiceInput = z.infer<typeof serviceSchema>;
export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type ServiceRequestInput = z.infer<typeof serviceRequestSchema>;
export type ReviewInput = z.infer<typeof reviewSchema>;
export type SearchQuery = z.infer<typeof searchQuerySchema>;
