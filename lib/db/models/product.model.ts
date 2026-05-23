import mongoose, { Schema, Document, Model } from 'mongoose';

export type ProductStatus = 'draft' | 'pending' | 'active' | 'rejected' | 'archived';

export interface IProductVariant {
  name: string;
  sku?: string;
  price: number;
  compareAtPrice?: number;
  stock: number;
  attributes: Record<string, string>;
}

export interface IProduct extends Document {
  _id: mongoose.Types.ObjectId;
  entrepreneur: mongoose.Types.ObjectId;
  title: string;
  slug: string;
  description: string;
  shortDescription?: string;
  images: string[];
  category: mongoose.Types.ObjectId;
  subcategory?: mongoose.Types.ObjectId;
  tags: string[];
  price: number;
  compareAtPrice?: number;
  currency: string;
  stock: number;
  sku?: string;
  variants: IProductVariant[];
  hasVariants: boolean;
  attributes: {
    material?: string;
    dimensions?: string;
    weight?: string;
    color?: string;
    handmade?: boolean;
    customizable?: boolean;
  };
  shipping: {
    weight?: number;
    dimensions?: {
      length: number;
      width: number;
      height: number;
    };
    freeShipping: boolean;
    shippingCost?: number;
    processingTime?: string;
  };
  status: ProductStatus;
  isActive: boolean;
  isFeatured: boolean;
  rating: {
    average: number;
    count: number;
  };
  stats: {
    views: number;
    sales: number;
    wishlistCount: number;
  };
  seo: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const productVariantSchema = new Schema<IProductVariant>({
  name: { type: String, required: true },
  sku: String,
  price: { type: Number, required: true, min: 0 },
  compareAtPrice: { type: Number, min: 0 },
  stock: { type: Number, required: true, min: 0, default: 0 },
  attributes: { type: Map, of: String },
}, { _id: true });

const productSchema = new Schema<IProduct>(
  {
    entrepreneur: {
      type: Schema.Types.ObjectId,
      ref: 'EntrepreneurProfile',
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: true,
      maxlength: 5000,
    },
    shortDescription: {
      type: String,
      maxlength: 300,
    },
    images: {
      type: [String],
      required: true,
      validate: [
        (val: string[]) => val.length >= 1,
        'At least one image is required',
      ],
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    subcategory: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
    },
    tags: [String],
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    compareAtPrice: {
      type: Number,
      min: 0,
    },
    currency: {
      type: String,
      default: 'PKR',
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    sku: String,
    variants: [productVariantSchema],
    hasVariants: {
      type: Boolean,
      default: false,
    },
    attributes: {
      material: String,
      dimensions: String,
      weight: String,
      color: String,
      handmade: { type: Boolean, default: true },
      customizable: { type: Boolean, default: false },
    },
    shipping: {
      weight: Number,
      dimensions: {
        length: Number,
        width: Number,
        height: Number,
      },
      freeShipping: { type: Boolean, default: false },
      shippingCost: Number,
      processingTime: String,
    },
    status: {
      type: String,
      enum: ['draft', 'pending', 'active', 'rejected', 'archived'],
      default: 'draft',
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    rating: {
      average: { type: Number, default: 0, min: 0, max: 5 },
      count: { type: Number, default: 0 },
    },
    stats: {
      views: { type: Number, default: 0 },
      sales: { type: Number, default: 0 },
      wishlistCount: { type: Number, default: 0 },
    },
    seo: {
      metaTitle: String,
      metaDescription: String,
      keywords: [String],
    },
    rejectionReason: String,
  },
  {
    timestamps: true,
  }
);

// Indexes
productSchema.index({ entrepreneur: 1 });
productSchema.index({ category: 1, subcategory: 1 });
productSchema.index({ status: 1, isActive: 1 });
productSchema.index({ price: 1 });
productSchema.index({ 'rating.average': -1 });
productSchema.index({ isFeatured: 1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ tags: 1 });
productSchema.index({ title: 'text', description: 'text', tags: 'text' });

// Virtual for discount percentage
productSchema.virtual('discountPercentage').get(function () {
  if (this.compareAtPrice && this.compareAtPrice > this.price) {
    return Math.round(((this.compareAtPrice - this.price) / this.compareAtPrice) * 100);
  }
  return 0;
});

// Virtual for in-stock status
productSchema.virtual('inStock').get(function () {
  if (this.hasVariants) {
    return this.variants.some((v) => v.stock > 0);
  }
  return this.stock > 0;
});

productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>('Product', productSchema);

export default Product;
