# HunarHub Backend Documentation

## Overview

HunarHub uses a **Next.js Full-Stack approach** with:
- **Frontend**: React components with TypeScript
- **Backend**: Next.js API Routes (`/app/api`)
- **Database**: MongoDB Atlas
- **Authentication**: NextAuth.js
- **File Storage**: UploadThing

There is **NO separate backend server** - everything is integrated into the Next.js application.

## Architecture

### API Routes Structure
```
app/api/
├── v1/
│   ├── orders/
│   │   └── route.ts          # Order management (GET, POST)
│   ├── products/
│   │   ├── route.ts          # Product listing & creation (GET, POST)
│   │   └── [slug]/
│   │       └── route.ts      # Single product, update, delete
│   ├── services/
│   │   └── route.ts          # Service management (GET, POST)
│   ├── reviews/
│   │   └── route.ts          # Review management (GET, POST)
│   ├── users/
│   │   └── route.ts          # User profile (GET, PUT)
│   ├── artisans/
│   │   ├── route.ts          # List all entrepreneurs
│   │   └── [id]/
│   │       └── route.ts      # Single entrepreneur profile
│   ├── service-requests/
│   │   └── route.ts          # Service requests (GET, POST)
│   ├── entrepreneur/
│   │   └── profile/
│   │       └── route.ts      # Entrepreneur profile management
│   ├── categories/
│   │   └── route.ts          # Category management
│   ├── notifications/
│   │   └── route.ts          # User notifications
│   └── search/
│       └── route.ts          # Global search endpoint
└── auth/
    ├── [...nextauth]/
    │   └── route.ts          # NextAuth authentication
    └── register/
        └── route.ts          # User registration
```

## Database Models

### User Model
```typescript
- _id: ObjectId (primary key)
- email: string (unique)
- firstName: string
- lastName: string
- phone?: string
- avatar?: string
- role: 'customer' | 'entrepreneur' | 'admin'
- status: 'active' | 'suspended' | 'deleted'
- password: string (hashed)
- createdAt: Date
- updatedAt: Date
```

### Product Model
```typescript
- _id: ObjectId
- title: string
- description: string
- shortDescription?: string
- slug: string (unique)
- price: number
- compareAtPrice?: number
- stock: number
- category: ObjectId (ref: Category)
- entrepreneur: ObjectId (ref: EntrepreneurProfile)
- images: string[] (URLs from UploadThing)
- status: 'active' | 'inactive' | 'draft'
- rating: { average: number, count: number }
- viewCount: number
- featured: boolean
- attributes?: { material, dimensions, color, handmade, customizable }
- createdAt: Date
- updatedAt: Date
```

### Order Model
```typescript
- _id: ObjectId
- orderNumber: string (unique, e.g., "ORD-20260522-001")
- customer: ObjectId (ref: User)
- entrepreneur: ObjectId (ref: EntrepreneurProfile)
- items: [
    {
      product: ObjectId (ref: Product)
      title: string
      image: string
      quantity: number
      price: number
      subtotal: number
    }
  ]
- subtotal: number
- shippingCost: number (0 if >= 5000)
- discount: number
- total: number
- shippingAddress: {
    name: string
    phone: string
    street: string
    city: string
    state: string
    postalCode: string
    country: string
  }
- paymentMethod: 'cod' | 'bank_transfer' | 'easypaisa' | 'jazzcash' | 'card'
- status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
- paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded'
- statusHistory: [{ status, timestamp, note }]
- customerNotes?: string
- createdAt: Date
- updatedAt: Date
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/[...nextauth]` - NextAuth endpoints (signin, callback, etc)

### Products
- `GET /api/v1/products` - List all products (with filters, pagination)
  - Query: `?page=1&limit=12&category=&minPrice=&maxPrice=&search=&featured=`
- `POST /api/v1/products` - Create product (entrepreneur only)
- `GET /api/v1/products/[slug]` - Get single product
- `PUT /api/v1/products/[slug]` - Update product (entrepreneur only)
- `DELETE /api/v1/products/[slug]` - Delete product (entrepreneur only)

### Orders
- `GET /api/v1/orders` - Get user's orders (customer sees own, entrepreneur sees orders for their products)
  - Query: `?page=1&limit=10&status=`
- `POST /api/v1/orders` - Create new order (customer only)
  - **Body**:
    ```json
    {
      "items": [
        {
          "productId": "valid-mongodb-objectid",
          "quantity": 1,
          "variant": "optional-variant"
        }
      ],
      "shippingAddress": {
        "fullName": "Customer Name",
        "phone": "+91 9975XXXXXX",
        "address": "Street address",
        "city": "City Name",
        "state": "State",
        "postalCode": "422001",
        "country": "India"
      },
      "paymentMethod": "cod",
      "customerNotes": "Optional notes"
    }
    ```

### Services
- `GET /api/v1/services` - List all services
- `POST /api/v1/services` - Create service (entrepreneur only)

### Service Requests
- `GET /api/v1/service-requests` - Get service requests
- `POST /api/v1/service-requests` - Create service request (customer only)

### Reviews
- `GET /api/v1/reviews` - Get reviews
- `POST /api/v1/reviews` - Create review (customer only)

### Users
- `GET /api/v1/users` - Get current user profile or all users (admin)
- `PUT /api/v1/users` - Update user profile

### Artisans (EntrepreneurProfiles)
- `GET /api/v1/artisans` - List all entrepreneurs
- `GET /api/v1/artisans/[id]` - Get entrepreneur profile with products/services

## Required Environment Variables

### Development (.env.local)
```bash
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database

# Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=dev-secret-32-characters-min

# OAuth (optional for development)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# File uploads
UPLOADTHING_TOKEN=sk_test_xxxxx

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NODE_ENV=development
```

### Production
- Use environment variables provided by your hosting platform (Vercel, Netlify, etc.)
- Set `NEXTAUTH_URL` to your production domain
- Use production tokens for OAuth and file uploads

## Testing the Checkout Flow

### Step 1: Create Test Data
```bash
1. Register as customer at /auth/register
2. Register as entrepreneur at /auth/register?role=entrepreneur
3. Create a product as entrepreneur at /entrepreneur/products/new
```

### Step 2: Test Order Creation
```bash
1. Login as customer
2. Add product to cart from /products page
3. Go to /cart to review cart items
4. Click "Proceed to Checkout"
5. Fill shipping address
6. Select payment method (COD recommended for testing)
7. Submit order
```

### Step 3: Verify Database
```bash
# Check MongoDB Atlas
1. Orders collection should have new document
2. Product stock should be reduced
3. Notification should be created for entrepreneur
```

## Common Issues & Solutions

### Issue: Checkout returns 401 Unauthorized
**Solution**: 
- Verify user is logged in with NextAuth
- Check `NEXTAUTH_URL` matches your domain (localhost:3000 for dev)
- Check session is properly created

### Issue: Checkout returns 400 Validation Failed
**Solution**:
- Verify `productId` is valid MongoDB ObjectId (24 hex characters)
- Ensure all required fields are provided in request
- Check shipping address fields: fullName, phone, address, city, state, postalCode

### Issue: Order created but no inventory update
**Solution**:
- Check Product model has `stock` field
- Verify `findByIdAndUpdate` is executing (check logs)
- Ensure database transactions are working

### Issue: Cannot connect to MongoDB
**Solution**:
- Verify `MONGODB_URI` is correct and connection string is accessible
- Check MongoDB Atlas network access whitelist includes your IP
- Test connection with MongoDB Compass using the same URI

### Issue: NextAuth session not persisting
**Solution**:
- Ensure `NEXTAUTH_SECRET` is set (at least 32 characters)
- Check browser cookies are enabled
- Clear browser cache/cookies and try again
- Verify `NEXTAUTH_URL` matches exact domain (with or without www)

## Development Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Check TypeScript
npx tsc --noEmit
```

## Database Connection Details

The project uses MongoDB Atlas with the following configuration:
- **Connection Method**: Mongoose ODM
- **Caching**: Global connection cache to reuse connections
- **Models Location**: `/lib/db/models/`
- **Connection File**: `/lib/db/mongoose.ts`

### MongoDB Atlas URL Format
```
mongodb+srv://username:password@cluster-name.mongodb.net/database-name?retryWrites=true&w=majority
```

## Security Best Practices

1. **Authentication**
   - All protected routes check `session?.user` with NextAuth
   - Roles are validated (customer-only, entrepreneur-only, admin-only)
   - Passwords are hashed with bcrypt

2. **Input Validation**
   - All API inputs validated with Zod schemas
   - ObjectIds validated before database queries
   - String length and format validation

3. **Database**
   - Use environment variables for connection strings
   - Never commit `.env.local` or secrets
   - Use dedicated database user with minimal permissions

4. **File Uploads**
   - Using UploadThing for secure file uploads
   - Only images allowed
   - File size limits enforced

## Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy automatically on push

### Other Platforms
1. Build: `npm run build`
2. Start: `npm start`
3. Set all environment variables
4. Ensure Node.js version >= 18

## Next Steps

1. Set up MongoDB Atlas cluster with proper credentials
2. Configure Google OAuth in Google Cloud Console
3. Set proper environment variables for your environment
4. Test registration and order flow end-to-end
5. Set up monitoring and logging
6. Configure backup strategy for database
