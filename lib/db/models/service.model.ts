import mongoose, { Schema, Document, Model } from 'mongoose';

export type ServiceStatus = 'draft' | 'pending' | 'active' | 'rejected' | 'archived';
export type PricingType = 'fixed' | 'hourly' | 'custom' | 'starting_from';

export interface IServicePackage {
  name: string;
  description: string;
  price: number;
  deliveryTime: number; // in days
  revisions?: number;
  features: string[];
}

export interface IService extends Document {
  _id: mongoose.Types.ObjectId;
  entrepreneur: mongoose.Types.ObjectId;
  title: string;
  slug: string;
  description: string;
  shortDescription?: string;
  images: string[];
  category: mongoose.Types.ObjectId;
  subcategory?: mongoose.Types.ObjectId;
  skills: mongoose.Types.ObjectId[];
  tags: string[];
  pricingType: PricingType;
  price: number;
  currency: string;
  packages: IServicePackage[];
  deliveryTime: {
    min: number;
    max: number;
    unit: 'days' | 'weeks' | 'months';
  };
  availability: {
    isAvailable: boolean;
    leadTime?: number; // days
    maxConcurrentProjects?: number;
    currentProjects?: number;
  };
  location: {
    onsite: boolean;
    remote: boolean;
    areas?: string[];
  };
  status: ServiceStatus;
  isActive: boolean;
  isFeatured: boolean;
  rating: {
    average: number;
    count: number;
  };
  stats: {
    views: number;
    inquiries: number;
    completedProjects: number;
  };
  portfolio: {
    title: string;
    description?: string;
    image: string;
  }[];
  faqs: {
    question: string;
    answer: string;
  }[];
  seo: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const servicePackageSchema = new Schema<IServicePackage>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  deliveryTime: { type: Number, required: true },
  revisions: Number,
  features: [String],
}, { _id: true });

const serviceSchema = new Schema<IService>(
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
    skills: [{
      type: Schema.Types.ObjectId,
      ref: 'Skill',
    }],
    tags: [String],
    pricingType: {
      type: String,
      enum: ['fixed', 'hourly', 'custom', 'starting_from'],
      default: 'fixed',
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      default: 'PKR',
    },
    packages: [servicePackageSchema],
    deliveryTime: {
      min: { type: Number, required: true },
      max: { type: Number, required: true },
      unit: {
        type: String,
        enum: ['days', 'weeks', 'months'],
        default: 'days',
      },
    },
    availability: {
      isAvailable: { type: Boolean, default: true },
      leadTime: Number,
      maxConcurrentProjects: Number,
      currentProjects: { type: Number, default: 0 },
    },
    location: {
      onsite: { type: Boolean, default: false },
      remote: { type: Boolean, default: true },
      areas: [String],
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
      inquiries: { type: Number, default: 0 },
      completedProjects: { type: Number, default: 0 },
    },
    portfolio: [{
      title: { type: String, required: true },
      description: String,
      image: { type: String, required: true },
    }],
    faqs: [{
      question: { type: String, required: true },
      answer: { type: String, required: true },
    }],
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
serviceSchema.index({ slug: 1 });
serviceSchema.index({ entrepreneur: 1 });
serviceSchema.index({ category: 1, subcategory: 1 });
serviceSchema.index({ skills: 1 });
serviceSchema.index({ status: 1, isActive: 1 });
serviceSchema.index({ price: 1 });
serviceSchema.index({ 'rating.average': -1 });
serviceSchema.index({ isFeatured: 1 });
serviceSchema.index({ createdAt: -1 });
serviceSchema.index({ tags: 1 });
serviceSchema.index({ 'location.onsite': 1, 'location.remote': 1 });
serviceSchema.index({ title: 'text', description: 'text', tags: 'text' });

const Service: Model<IService> =
  mongoose.models.Service || mongoose.model<IService>('Service', serviceSchema);

export default Service;
