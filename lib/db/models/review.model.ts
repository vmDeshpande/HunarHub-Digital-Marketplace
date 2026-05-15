import mongoose, { Schema, Document, Model } from 'mongoose';

export type ReviewType = 'product' | 'service' | 'entrepreneur';
export type ReviewStatus = 'pending' | 'approved' | 'rejected' | 'flagged';

export interface IReview extends Document {
  _id: mongoose.Types.ObjectId;
  reviewer: mongoose.Types.ObjectId;
  reviewType: ReviewType;
  product?: mongoose.Types.ObjectId;
  service?: mongoose.Types.ObjectId;
  serviceRequest?: mongoose.Types.ObjectId;
  order?: mongoose.Types.ObjectId;
  entrepreneur: mongoose.Types.ObjectId;
  rating: number;
  title?: string;
  comment: string;
  images?: string[];
  status: ReviewStatus;
  isVerifiedPurchase: boolean;
  helpfulCount: number;
  reportCount: number;
  response?: {
    message: string;
    respondedAt: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema = new Schema<IReview>(
  {
    reviewer: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    reviewType: {
      type: String,
      enum: ['product', 'service', 'entrepreneur'],
      required: true,
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
    },
    service: {
      type: Schema.Types.ObjectId,
      ref: 'Service',
    },
    serviceRequest: {
      type: Schema.Types.ObjectId,
      ref: 'ServiceRequest',
    },
    order: {
      type: Schema.Types.ObjectId,
      ref: 'Order',
    },
    entrepreneur: {
      type: Schema.Types.ObjectId,
      ref: 'EntrepreneurProfile',
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    title: {
      type: String,
      maxlength: 100,
    },
    comment: {
      type: String,
      required: true,
      maxlength: 2000,
    },
    images: [String],
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'flagged'],
      default: 'pending',
    },
    isVerifiedPurchase: {
      type: Boolean,
      default: false,
    },
    helpfulCount: {
      type: Number,
      default: 0,
    },
    reportCount: {
      type: Number,
      default: 0,
    },
    response: {
      message: String,
      respondedAt: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
reviewSchema.index({ reviewer: 1 });
reviewSchema.index({ product: 1 });
reviewSchema.index({ service: 1 });
reviewSchema.index({ entrepreneur: 1 });
reviewSchema.index({ reviewType: 1, status: 1 });
reviewSchema.index({ rating: 1 });
reviewSchema.index({ createdAt: -1 });

// Prevent duplicate reviews
reviewSchema.index(
  { reviewer: 1, product: 1 },
  { unique: true, partialFilterExpression: { product: { $exists: true } } }
);
reviewSchema.index(
  { reviewer: 1, service: 1 },
  { unique: true, partialFilterExpression: { service: { $exists: true } } }
);

const Review: Model<IReview> =
  mongoose.models.Review || mongoose.model<IReview>('Review', reviewSchema);

export default Review;
