const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

function loadEnv(filePath) {
  const env = {};
  if (!fs.existsSync(filePath)) return env;
  const contents = fs.readFileSync(filePath, 'utf8');
  for (const line of contents.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const [key, ...rest] = trimmed.split('=');
    env[key.trim()] = rest.join('=').trim();
  }
  return env;
}

const envPath = path.join(__dirname, '..', '.env.local');
const env = loadEnv(envPath);
const MONGODB_URI = env.MONGODB_URI || process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('Missing MONGODB_URI in .env.local or environment.');
  process.exit(1);
}

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: String,
    name: { type: String, required: true, trim: true },
    image: String,
    role: { type: String, enum: ['customer', 'entrepreneur', 'admin'], default: 'customer' },
    status: { type: String, enum: ['active', 'suspended', 'pending'], default: 'active' },
    phone: String,
    address: {
      street: String,
      city: String,
      state: String,
      postalCode: String,
      country: { type: String, default: 'India' },
    },
    emailVerified: Date,
    googleId: String,
    wishlist: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
    cart: [
      {
        product: { type: Schema.Types.ObjectId, ref: 'Product' },
        quantity: { type: Number, default: 1, min: 1 },
        selectedVariant: String,
      },
    ],
    notifications: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      sms: { type: Boolean, default: false },
    },
  },
  { timestamps: true }
);

const categorySchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: String,
    image: String,
    icon: String,
    type: { type: String, enum: ['product', 'service', 'both'], default: 'both' },
    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
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
  { timestamps: true }
);

const entrepreneurProfileSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    businessName: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    tagline: String,
    description: { type: String, required: true, maxlength: 2000 },
    logo: String,
    coverImage: String,
    gallery: [String],
    skills: [{ type: Schema.Types.ObjectId, ref: 'Skill' }],
    categories: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
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
    status: { type: String, enum: ['pending', 'approved', 'rejected', 'suspended'], default: 'pending' },
    isVerified: { type: Boolean, default: false },
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
  { timestamps: true }
);

const productSchema = new Schema(
  {
    entrepreneur: { type: Schema.Types.ObjectId, ref: 'EntrepreneurProfile', required: true },
    title: { type: String, required: true, trim: true, maxlength: 200 },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, required: true, maxlength: 5000 },
    shortDescription: { type: String, maxlength: 300 },
    images: { type: [String], required: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    subcategory: { type: Schema.Types.ObjectId, ref: 'Category' },
    tags: [String],
    price: { type: Number, required: true, min: 0 },
    compareAtPrice: { type: Number, min: 0 },
    currency: { type: String, default: 'INR' },
    stock: { type: Number, required: true, min: 0, default: 0 },
    sku: String,
    variants: [
      new Schema(
        {
          name: { type: String, required: true },
          sku: String,
          price: { type: Number, required: true, min: 0 },
          compareAtPrice: { type: Number, min: 0 },
          stock: { type: Number, required: true, min: 0, default: 0 },
          attributes: { type: Map, of: String },
        },
        { _id: true }
      ),
    ],
    hasVariants: { type: Boolean, default: false },
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
    status: { type: String, enum: ['draft', 'pending', 'active', 'rejected', 'archived'], default: 'draft' },
    isActive: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
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
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model('User', userSchema);
const Category = mongoose.models.Category || mongoose.model('Category', categorySchema);
const EntrepreneurProfile =
  mongoose.models.EntrepreneurProfile ||
  mongoose.model('EntrepreneurProfile', entrepreneurProfileSchema);
const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

async function seed() {
  await mongoose.connect(MONGODB_URI, { bufferCommands: false, maxPoolSize: 10 });
  console.log('Connected to MongoDB to seed product data.');

  const categoryData = [
    {
      name: 'Handicrafts',
      slug: 'handicrafts',
      description: 'Beautiful handmade artisan goods from across India.',
      type: 'product',
      isActive: true,
      isFeatured: true,
      order: 1,
      stats: { productCount: 0, serviceCount: 0 },
    },
    {
      name: 'Home Decor',
      slug: 'home-decor',
      description: 'Artisan home decor and furnishings for modern living.',
      type: 'product',
      isActive: true,
      isFeatured: true,
      order: 2,
      stats: { productCount: 0, serviceCount: 0 },
    },
    {
      name: 'Textiles',
      slug: 'textiles',
      description: 'Handwoven fabrics, shawls, and textile crafts.',
      type: 'product',
      isActive: true,
      isFeatured: true,
      order: 3,
      stats: { productCount: 0, serviceCount: 0 },
    },
  ];

  const categories = [];
  for (const data of categoryData) {
    let category = await Category.findOne({ slug: data.slug });
    if (!category) {
      category = await Category.create(data);
      console.log(`Created category: ${data.slug}`);
    } else {
      console.log(`Category exists: ${data.slug}`);
    }
    categories.push(category);
  }

  const entrepreneurEmail = 'artisan@example.com';
  let entrepreneurUser = await User.findOne({ email: entrepreneurEmail });
  if (!entrepreneurUser) {
    entrepreneurUser = await User.create({
      email: entrepreneurEmail,
      password: bcrypt.hashSync('Password123!', 10),
      name: 'Artisan Seller',
      role: 'entrepreneur',
      status: 'active',
      phone: '+91 90000 00000',
      address: { city: 'Jaipur', state: 'Rajasthan', country: 'India' },
    });
    console.log(`Created entrepreneur user: ${entrepreneurEmail}`);
  } else {
    console.log(`Entrepreneur user exists: ${entrepreneurEmail}`);
  }

  let entrepreneurProfile = await EntrepreneurProfile.findOne({ user: entrepreneurUser._id });
  if (!entrepreneurProfile) {
    entrepreneurProfile = await EntrepreneurProfile.create({
      user: entrepreneurUser._id,
      businessName: 'Jaipur Artisans',
      slug: 'jaipur-artisans',
      tagline: 'Authentic handcrafted goods from Jaipur',
      description: 'Jaipur Artisans create traditional handmade crafts using age-old techniques and premium materials.',
      logo: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=200&q=80',
      coverImage: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80',
      ],
      categories: [categories[0]._id, categories[1]._id, categories[2]._id],
      location: { city: 'Jaipur', state: 'Rajasthan', country: 'India' },
      contact: { phone: '+91 90000 00000', email: entrepreneurEmail, website: 'https://jaipur-artisans.example.com' },
      socialLinks: {
        instagram: 'https://instagram.com/jaipur_artisans',
      },
      status: 'approved',
      isVerified: true,
      rating: { average: 4.8, count: 128 },
      stats: { totalProducts: 3, totalServices: 0, totalOrders: 0, totalRevenue: 0 },
    });
    console.log('Created entrepreneur profile: jaipur-artisans');
  } else {
    console.log('Entrepreneur profile exists: jaipur-artisans');
  }

  const productsData = [
    {
      title: 'Block Printed Cotton Shawl',
      slug: 'block-printed-cotton-shawl',
      description: 'A luxurious hand-block printed cotton shawl made by artisans in Jaipur with bright traditional patterns.',
      shortDescription: 'Soft hand-block printed shawl in rich Indian colors.',
      images: [
        'https://images.unsplash.com/photo-1520975911436-47a06d47676b?auto=format&fit=crop&w=800&q=80',
      ],
      category: categories[2]._id,
      tags: ['textiles', 'handmade', 'shawl'],
      price: 1200,
      compareAtPrice: 1600,
      currency: 'INR',
      stock: 24,
      sku: 'HP-SHAWL-001',
      hasVariants: false,
      attributes: {
        material: 'Cotton',
        dimensions: '200 x 70 cm',
        color: 'Red',
        handmade: true,
        customizable: false,
      },
      shipping: { freeShipping: true, shippingCost: 0, processingTime: '3-5 days' },
      status: 'active',
      isActive: true,
      isFeatured: true,
      rating: { average: 4.9, count: 55 },
      stats: { views: 0, sales: 0, wishlistCount: 0 },
      seo: { metaTitle: 'Block Printed Cotton Shawl', metaDescription: 'Buy elegant hand-block printed cotton shawls from Jaipur artisans.', keywords: ['shawl', 'textiles', 'handmade'] },
    },
    {
      title: 'Handcrafted Terracotta Tea Set',
      slug: 'handcrafted-terracotta-tea-set',
      description: 'A rustic handcrafted terracotta tea set perfect for gifting and serving chai in authentic style.',
      shortDescription: 'Rustic terracotta tea set with four cups and kettle.',
      images: [
        'https://images.unsplash.com/photo-1522858547123-3a1ebc2d50b0?auto=format&fit=crop&w=800&q=80',
      ],
      category: categories[0]._id,
      tags: ['pottery', 'home decor', 'tea set'],
      price: 2200,
      compareAtPrice: 2600,
      currency: 'INR',
      stock: 18,
      sku: 'HP-TEA-SET-002',
      hasVariants: false,
      attributes: {
        material: 'Terracotta',
        dimensions: '20 x 20 x 15 cm',
        color: 'Terracotta',
        handmade: true,
        customizable: false,
      },
      shipping: { freeShipping: false, shippingCost: 150, processingTime: '5-7 days' },
      status: 'active',
      isActive: true,
      isFeatured: true,
      rating: { average: 4.7, count: 32 },
      stats: { views: 0, sales: 0, wishlistCount: 0 },
      seo: { metaTitle: 'Terracotta Tea Set', metaDescription: 'Buy a handcrafted terracotta tea set from Jaipur artisans.', keywords: ['terracotta', 'pottery', 'tea set'] },
    },
    {
      title: 'Brass Temple Lamp',
      slug: 'brass-temple-lamp',
      description: 'A polished brass temple lamp ideal for pooja rooms and spiritual gifting.',
      shortDescription: 'Elegant brass temple lamp for home worship.',
      images: [
        'https://images.unsplash.com/photo-1527689368864-3a821dbccc34?auto=format&fit=crop&w=800&q=80',
      ],
      category: categories[1]._id,
      tags: ['brass', 'home decor', 'lighting'],
      price: 1850,
      compareAtPrice: 2100,
      currency: 'INR',
      stock: 12,
      sku: 'HP-LAMP-003',
      hasVariants: false,
      attributes: {
        material: 'Brass',
        dimensions: '15 x 15 x 20 cm',
        color: 'Gold',
        handmade: true,
        customizable: false,
      },
      shipping: { freeShipping: false, shippingCost: 150, processingTime: '4-6 days' },
      status: 'active',
      isActive: true,
      isFeatured: false,
      rating: { average: 4.8, count: 28 },
      stats: { views: 0, sales: 0, wishlistCount: 0 },
      seo: { metaTitle: 'Brass Temple Lamp', metaDescription: 'Buy a handcrafted brass temple lamp for your pooja room.', keywords: ['brass lamp', 'home decor', 'temple lamp'] },
    },
  ];

  for (const data of productsData) {
    const existing = await Product.findOne({ slug: data.slug });
    if (existing) {
      console.log(`Product exists: ${data.slug}`);
      continue;
    }
    await Product.create({
      ...data,
      entrepreneur: entrepreneurProfile._id,
    });
    console.log(`Created product: ${data.slug}`);
  }

  await mongoose.disconnect();
  console.log('Database seeding complete.');
}

seed().catch((error) => {
  console.error('Seed script failed:', error);
  process.exit(1);
});