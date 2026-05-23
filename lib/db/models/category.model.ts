import mongoose, { Schema, Document, Model } from 'mongoose';

export type CategoryType = 'product' | 'service' | 'both';

export interface ICategory extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  icon?: string;
  parent?: mongoose.Types.ObjectId;
  type: CategoryType;
  isActive: boolean;
  isFeatured: boolean;
  order: number;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
  stats: {
    productCount: number;
    serviceCount: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const categorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      maxlength: 500,
    },
    image: String,
    icon: String,
    parent: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
    },
    type: {
      type: String,
      enum: ['product', 'service', 'both'],
      default: 'both',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
      default: 0,
    },
    seo: {
      metaTitle: String,
      metaDescription: String,
      keywords: [String],
    },
    stats: {
      productCount: { type: Number, default: 0 },
      serviceCount: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
categorySchema.index({ parent: 1 });
categorySchema.index({ type: 1, isActive: 1 });
categorySchema.index({ isFeatured: 1 });
categorySchema.index({ order: 1 });

// Virtual for subcategories
categorySchema.virtual('subcategories', {
  ref: 'Category',
  localField: '_id',
  foreignField: 'parent',
});

categorySchema.set('toJSON', { virtuals: true });
categorySchema.set('toObject', { virtuals: true });

const Category: Model<ICategory> =
  mongoose.models.Category || mongoose.model<ICategory>('Category', categorySchema);

export default Category;
