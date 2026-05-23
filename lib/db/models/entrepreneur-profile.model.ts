import mongoose, { Schema, Document, Model } from 'mongoose';

export type ProfileStatus = 'pending' | 'approved' | 'rejected' | 'suspended';

export interface IEntrepreneurProfile extends Document {
  _id: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  businessName: string;
  slug: string;
  tagline?: string;
  description: string;
  logo?: string;
  coverImage?: string;
  gallery: string[];
  skills: mongoose.Types.ObjectId[];
  categories: mongoose.Types.ObjectId[];
  location: {
    city: string;
    state?: string;
    country: string;
  };
  contact: {
    phone?: string;
    email?: string;
    whatsapp?: string;
    website?: string;
  };
  socialLinks: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
  };
  status: ProfileStatus;
  isVerified: boolean;
  verificationDate?: Date;
  rating: {
    average: number;
    count: number;
  };
  stats: {
    totalProducts: number;
    totalServices: number;
    totalOrders: number;
    totalRevenue: number;
  };
  bankDetails?: {
    accountTitle: string;
    accountNumber: string;
    bankName: string;
    branchCode?: string;
  };
  cnicNumber?: string;
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const entrepreneurProfileSchema = new Schema<IEntrepreneurProfile>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    businessName: {
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
    tagline: {
      type: String,
      maxlength: 150,
    },
    description: {
      type: String,
      required: true,
      maxlength: 2000,
    },
    logo: String,
    coverImage: String,
    gallery: [String],
    skills: [{
      type: Schema.Types.ObjectId,
      ref: 'Skill',
    }],
    categories: [{
      type: Schema.Types.ObjectId,
      ref: 'Category',
    }],
    location: {
      city: { type: String, required: true },
      state: String,
      country: { type: String, default: 'India' },
    },
    contact: {
      phone: String,
      email: String,
      whatsapp: String,
      website: String,
    },
    socialLinks: {
      facebook: String,
      instagram: String,
      twitter: String,
      linkedin: String,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'suspended'],
      default: 'pending',
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationDate: Date,
    rating: {
      average: { type: Number, default: 0, min: 0, max: 5 },
      count: { type: Number, default: 0 },
    },
    stats: {
      totalProducts: { type: Number, default: 0 },
      totalServices: { type: Number, default: 0 },
      totalOrders: { type: Number, default: 0 },
      totalRevenue: { type: Number, default: 0 },
    },
    bankDetails: {
      accountTitle: String,
      accountNumber: String,
      bankName: String,
      branchCode: String,
    },
    cnicNumber: String,
    rejectionReason: String,
  },
  {
    timestamps: true,
  }
);

// Indexes
entrepreneurProfileSchema.index({ status: 1 });
entrepreneurProfileSchema.index({ 'location.city': 1 });
entrepreneurProfileSchema.index({ categories: 1 });
entrepreneurProfileSchema.index({ skills: 1 });
entrepreneurProfileSchema.index({ 'rating.average': -1 });
entrepreneurProfileSchema.index({ businessName: 'text', description: 'text' });

const EntrepreneurProfile: Model<IEntrepreneurProfile> =
  mongoose.models.EntrepreneurProfile ||
  mongoose.model<IEntrepreneurProfile>('EntrepreneurProfile', entrepreneurProfileSchema);

export default EntrepreneurProfile;
