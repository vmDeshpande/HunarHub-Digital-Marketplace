# Production Deployment Guide

## Prerequisites
- Node.js 18.x or higher
- MongoDB Atlas cluster
- Google OAuth credentials
- UploadThing account

## Environment Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/vmDeshpande/HunarHub-Digital-Marketplace
   cd HunarHub-Digital-Marketplace
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Update `.env.local` with your production values:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `NEXTAUTH_URL`: Your production domain (https://yourdomain.com)
   - `NEXTAUTH_SECRET`: Generate a strong secret key
   - `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET`: From Google Cloud Console
   - `UPLOADTHING_TOKEN`: From UploadThing dashboard

## Building for Production

```bash
# Build the project
pnpm build

# Test the production build locally
pnpm start
```

## Database Setup

1. **MongoDB Connection String**
   - Go to MongoDB Atlas
   - Create a cluster or use existing one
   - Add IP whitelist (or 0.0.0.0/0 for development)
   - Copy connection string with username/password

2. **Database Initialization**
   - Connect with the provided URI
   - Collections are automatically created via Mongoose schemas

## Deployment Options

### Vercel (Recommended for Next.js)
1. Push code to GitHub
2. Import project on Vercel
3. Add environment variables
4. Deploy automatically

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN pnpm install
RUN pnpm build
EXPOSE 3000
CMD ["pnpm", "start"]
```

### Traditional Server
1. Build the project
2. Upload `.next/` folder, `public/`, and `package.json`
3. Install dependencies on server
4. Run with process manager (PM2, systemd)

## Security Checklist

- [ ] Set strong `NEXTAUTH_SECRET`
- [ ] Use HTTPS only
- [ ] Enable CORS properly
- [ ] Validate all user inputs
- [ ] Use environment variables for secrets
- [ ] Set up database backups
- [ ] Enable MongoDB authentication
- [ ] Use IP whitelist in production
- [ ] Set up rate limiting
- [ ] Monitor error logs
- [ ] Regular security updates

## Monitoring

### Recommended Tools
- Sentry for error tracking
- LogRocket for session replay
- MongoDB Atlas monitoring
- Google Analytics for user insights

### Health Check
```
GET /api/health
```

## Troubleshooting

### Database Connection Issues
- Verify `MONGODB_URI` format
- Check IP whitelist in MongoDB Atlas
- Ensure credentials are correct

### Authentication Issues
- Verify `NEXTAUTH_URL` matches deployment domain
- Check `NEXTAUTH_SECRET` is set
- Ensure OAuth credentials are correct

### File Upload Issues
- Verify `UPLOADTHING_TOKEN` is correct
- Check file size limits
- Ensure proper CORS configuration

## Support

For issues, check:
1. Application logs
2. MongoDB Atlas logs
3. Vercel/hosting provider logs
4. Browser console for client-side errors
