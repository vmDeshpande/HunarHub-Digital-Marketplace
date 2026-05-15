import mongoose, { Schema, Document, Model } from 'mongoose';
import bcrypt from 'bcryptjs';

export type UserRole = 'customer' | 'entrepreneur' | 'admin';
export type UserStatus = 'active' | 'suspended' | 'pending';

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  email: string;
  password?: string;
  name: string;
  image?: string;
  role: UserRole;
  status: UserStatus;
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
  emailVerified?: Date;
  googleId?: string;
  wishlist: mongoose.Types.ObjectId[];
  cart: {
    product: mongoose.Types.ObjectId;
    quantity: number;
    selectedVariant?: string;
  }[];
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      minlength: 8,
      select: false,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    image: String,
    role: {
      type: String,
      enum: ['customer', 'entrepreneur', 'admin'],
      default: 'customer',
    },
    status: {
      type: String,
      enum: ['active', 'suspended', 'pending'],
      default: 'active',
    },
    phone: {
      type: String,
      trim: true,
    },
    address: {
      street: String,
      city: String,
      state: String,
      postalCode: String,
      country: { type: String, default: 'Pakistan' },
    },
    emailVerified: Date,
    googleId: {
      type: String,
      sparse: true,
    },
    wishlist: [{
      type: Schema.Types.ObjectId,
      ref: 'Product',
    }],
    cart: [{
      product: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
      quantity: {
        type: Number,
        default: 1,
        min: 1,
      },
      selectedVariant: String,
    }],
    notifications: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      sms: { type: Boolean, default: false },
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) {
    return next();
  }
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

// Index for efficient queries
userSchema.index({ email: 1 });
userSchema.index({ role: 1, status: 1 });
userSchema.index({ googleId: 1 });

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', userSchema);

export default User;
