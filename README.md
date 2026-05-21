# Hunar Hub - E-Commerce Platform for Indian Artisans

A modern, full-stack e-commerce platform dedicated to showcasing and selling handcrafted products from Indian artisans and entrepreneurs. Built with Next.js, React, MongoDB, and TypeScript.

## 🌟 Features

### For Customers
- Browse and search artisan products
- Discover talented Indian artisans
- Service request system for custom work
- Secure checkout with multiple payment options
- Wishlist and cart management
- Order tracking and history
- User reviews and ratings

### For Entrepreneurs/Artisans
- Complete seller dashboard
- Product and service management
- Sales analytics and reporting
- Order management system
- Business profile customization
- Customer reviews management
- Financial reports

### For Administrators
- User and seller management
- Product approval system
- Order monitoring
- Analytics dashboard
- Category management
- Report generation

## 🛠 Tech Stack

**Frontend:**
- Next.js 14+ (App Router)
- React 18+
- TypeScript
- Tailwind CSS
- Shadcn/ui Components
- Zustand (State Management)
- React Hook Form
- Zod (Validation)

**Backend:**
- Next.js API Routes
- NextAuth.js (Authentication)
- MongoDB & Mongoose
- REST API

**Infrastructure:**
- Vercel (Deployment)
- MongoDB Atlas (Database)
- UploadThing (File Uploads)
- Google OAuth

## 📦 Getting Started

### Prerequisites
- Node.js 18.x or higher
- pnpm (recommended) or npm
- MongoDB Atlas account
- Google OAuth credentials

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/vmDeshpande/HunarHub-Digital-Marketplace
   cd HunarHub-Digital-Marketplace
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Setup environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Update `.env.local` with your credentials:
   ```
   MONGODB_URI=your_mongodb_uri
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your_secret_key
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   UPLOADTHING_TOKEN=your_uploadthing_token
   ```

4. **Start development server**
   ```bash
   pnpm dev
   ```

5. **Open browser**
   ```
   http://localhost:3000
   ```

## 📚 Project Structure

```
hunar-hub-web-app/
├── app/                          # Next.js app directory
│   ├── (dashboard)/              # Protected dashboard routes
│   │   ├── admin/                # Admin panel
│   │   ├── entrepreneur/         # Seller dashboard
│   │   └── customer/             # Customer dashboard
│   ├── (public)/                 # Public routes
│   │   ├── artisans/             # Artisan profiles
│   │   ├── products/             # Product pages
│   │   ├── services/             # Service pages
│   │   └── checkout/             # Checkout flow
│   ├── auth/                     # Authentication pages
│   ├── api/                      # API routes
│   └── layout.tsx                # Root layout
├── components/                   # React components
│   ├── ui/                       # Shadcn UI components
│   ├── products/                 # Product-related components
│   ├── layout/                   # Layout components
│   ├── dashboard/                # Dashboard components
│   └── ...
├── hooks/                        # Custom React hooks
├── lib/                          # Utility functions & config
│   ├── auth/                     # NextAuth configuration
│   ├── db/                       # Database & models
│   ├── validations/              # Zod schemas
│   ├── utils/                    # Helper functions
│   └── stores/                   # Zustand stores
├── public/                       # Static assets
├── styles/                       # Global styles
└── middleware.ts                 # Next.js middleware
```

## 🚀 Development

### Available Scripts

```bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run linter
pnpm lint

# Run linter with fixes
pnpm lint --fix
```

### Database Models

- **User** - Customer and authentication
- **EngineerProfile** - Seller/Artisan profile
- **Product** - Products offered
- **Order** - Customer orders
- **Service** - Services offered
- **Review** - Product and service reviews
- **Category** - Product categories

## 🔐 Authentication

- Email/Password authentication with bcrypt
- Google OAuth 2.0 integration
- JWT-based sessions
- Role-based access control (Customer, Entrepreneur, Admin)

## 💳 Payment & Orders

- Order creation and tracking
- Multiple shipping address support
- Order status updates
- Invoice generation (ready for implementation)

## 📸 File Uploads

- Profile images via UploadThing
- Product images (multiple)
- Service images
- Cover images
- Automatic resizing and optimization

## 📊 API Documentation

See [API.md](./API.md) for complete API documentation.

## 🚢 Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Import project on Vercel
3. Add environment variables
4. Deploy automatically on push

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

## 🆘 Support

For issues and questions:
1. Check existing documentation
2. Review API documentation
3. Check issue tracker
4. Contact development team


## Built with ❤️ for Indian artisans and craftspeople

---

**Last Updated:** May 2026  
**Status:** Production Ready
