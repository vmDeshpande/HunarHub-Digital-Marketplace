import mongoose, { Schema, Document, Model } from 'mongoose';

export type ServiceRequestStatus = 
  | 'pending'
  | 'reviewing'
  | 'quoted'
  | 'accepted'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'rejected';

export interface IServiceRequest extends Document {
  _id: mongoose.Types.ObjectId;
  requestNumber: string;
  customer: mongoose.Types.ObjectId;
  entrepreneur: mongoose.Types.ObjectId;
  service: mongoose.Types.ObjectId;
  selectedPackage?: string;
  title: string;
  description: string;
  requirements: string;
  attachments: string[];
  budget?: {
    min: number;
    max: number;
    currency: string;
  };
  timeline?: {
    preferredStart?: Date;
    deadline?: Date;
  };
  location?: {
    type: 'onsite' | 'remote';
    address?: string;
    city?: string;
  };
  status: ServiceRequestStatus;
  quote?: {
    amount: number;
    currency: string;
    deliveryTime: number;
    deliveryUnit: 'days' | 'weeks' | 'months';
    validUntil: Date;
    notes?: string;
    quotedAt: Date;
  };
  payment?: {
    status: 'pending' | 'partial' | 'paid' | 'refunded';
    method?: string;
    transactions: {
      amount: number;
      type: 'deposit' | 'milestone' | 'final';
      paidAt: Date;
      transactionId?: string;
    }[];
  };
  milestones?: {
    title: string;
    description?: string;
    dueDate?: Date;
    status: 'pending' | 'in_progress' | 'completed';
    completedAt?: Date;
  }[];
  messages: {
    sender: mongoose.Types.ObjectId;
    message: string;
    attachments?: string[];
    sentAt: Date;
    isRead: boolean;
  }[];
  review?: mongoose.Types.ObjectId;
  statusHistory: {
    status: ServiceRequestStatus;
    timestamp: Date;
    note?: string;
    updatedBy?: mongoose.Types.ObjectId;
  }[];
  completedAt?: Date;
  cancelledAt?: Date;
  cancellationReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const serviceRequestSchema = new Schema<IServiceRequest>(
  {
    requestNumber: {
      type: String,
      required: true,
      unique: true,
    },
    customer: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    entrepreneur: {
      type: Schema.Types.ObjectId,
      ref: 'EntrepreneurProfile',
      required: true,
    },
    service: {
      type: Schema.Types.ObjectId,
      ref: 'Service',
      required: true,
    },
    selectedPackage: String,
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    requirements: {
      type: String,
      required: true,
    },
    attachments: [String],
    budget: {
      min: Number,
      max: Number,
      currency: { type: String, default: 'PKR' },
    },
    timeline: {
      preferredStart: Date,
      deadline: Date,
    },
    location: {
      type: {
        type: String,
        enum: ['onsite', 'remote'],
      },
      address: String,
      city: String,
    },
    status: {
      type: String,
      enum: ['pending', 'reviewing', 'quoted', 'accepted', 'in_progress', 'completed', 'cancelled', 'rejected'],
      default: 'pending',
    },
    quote: {
      amount: Number,
      currency: { type: String, default: 'PKR' },
      deliveryTime: Number,
      deliveryUnit: {
        type: String,
        enum: ['days', 'weeks', 'months'],
      },
      validUntil: Date,
      notes: String,
      quotedAt: Date,
    },
    payment: {
      status: {
        type: String,
        enum: ['pending', 'partial', 'paid', 'refunded'],
        default: 'pending',
      },
      method: String,
      transactions: [{
        amount: Number,
        type: {
          type: String,
          enum: ['deposit', 'milestone', 'final'],
        },
        paidAt: Date,
        transactionId: String,
      }],
    },
    milestones: [{
      title: { type: String, required: true },
      description: String,
      dueDate: Date,
      status: {
        type: String,
        enum: ['pending', 'in_progress', 'completed'],
        default: 'pending',
      },
      completedAt: Date,
    }],
    messages: [{
      sender: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      message: { type: String, required: true },
      attachments: [String],
      sentAt: { type: Date, default: Date.now },
      isRead: { type: Boolean, default: false },
    }],
    review: {
      type: Schema.Types.ObjectId,
      ref: 'Review',
    },
    statusHistory: [{
      status: {
        type: String,
        enum: ['pending', 'reviewing', 'quoted', 'accepted', 'in_progress', 'completed', 'cancelled', 'rejected'],
        required: true,
      },
      timestamp: { type: Date, default: Date.now },
      note: String,
      updatedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    }],
    completedAt: Date,
    cancelledAt: Date,
    cancellationReason: String,
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to add status to history
serviceRequestSchema.pre('save', function () {
  if (this.isModified('status')) {
    this.statusHistory.push({
      status: this.status,
      timestamp: new Date(),
    });
  }
});

// Indexes
serviceRequestSchema.index({ requestNumber: 1 });
serviceRequestSchema.index({ customer: 1 });
serviceRequestSchema.index({ entrepreneur: 1 });
serviceRequestSchema.index({ service: 1 });
serviceRequestSchema.index({ status: 1 });
serviceRequestSchema.index({ createdAt: -1 });
serviceRequestSchema.index({ customer: 1, createdAt: -1 });
serviceRequestSchema.index({ entrepreneur: 1, status: 1, createdAt: -1 });

const ServiceRequest: Model<IServiceRequest> =
  mongoose.models.ServiceRequest ||
  mongoose.model<IServiceRequest>('ServiceRequest', serviceRequestSchema);

export default ServiceRequest;
