# Environment Variables Guide

## Required Variables

### Database
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database_name?retryWrites=true&w=majority
```
- Get from MongoDB Atlas
- Include username and password
- Use a dedicated database user with minimal permissions

### Authentication - NextAuth
```
NEXTAUTH_URL=https://yourdomain.com (production) or http://localhost:3000 (development)
NEXTAUTH_SECRET=generate-with-`openssl rand -base64 32`
```
- URL must match your deployment domain exactly
- Secret must be at least 32 characters
- Generate: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

### Google OAuth
```
GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxxxx
```
- Get from [Google Cloud Console](https://console.cloud.google.com)
- Create OAuth 2.0 credential
- Set authorized origins to your domain
- Keep secret private

### File Uploads - UploadThing
```
UPLOADTHING_TOKEN=sk_live_xxxxx
```
- Get from [UploadThing Dashboard](https://uploadthing.com)
- Use live token in production
- Use test token in development

### Application
```
NODE_ENV=production (or development)
NEXT_PUBLIC_API_URL=https://yourdomain.com/api
```

## Optional Variables

### Analytics
```
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
```
- Get from Google Analytics
- Prefix with NEXT_PUBLIC_ to expose to frontend

### Monitoring (Sentry)
```
NEXT_PUBLIC_SENTRY_DSN=https://xxxxx@xxxxx.ingest.sentry.io/xxxxx
SENTRY_AUTH_TOKEN=sntrys_xxxxx
```

### Payment (Future Implementation)
```
STRIPE_PUBLIC_KEY=pk_live_xxxxx
STRIPE_SECRET_KEY=sk_live_xxxxx
```

## Environment-Specific Setup

### Development (.env.local)
```
MONGODB_URI=mongodb+srv://dev_user:dev_pass@test-cluster.mongodb.net/hunar_hub_dev
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=dev-secret-32-characters-long
GOOGLE_CLIENT_ID=dev-client-id
GOOGLE_CLIENT_SECRET=dev-client-secret
UPLOADTHING_TOKEN=sk_test_xxxxx
NODE_ENV=development
```

### Production (Platform Secrets)
```
MONGODB_URI=mongodb+srv://prod_user:prod_pass@prod-cluster.mongodb.net/hunar_hub
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=strong-secret-32-characters-min
GOOGLE_CLIENT_ID=prod-client-id
GOOGLE_CLIENT_SECRET=prod-client-secret
UPLOADTHING_TOKEN=sk_live_xxxxx
NODE_ENV=production
```

## Generating Secrets

### NEXTAUTH_SECRET
```bash
# Option 1: OpenSSL
openssl rand -base64 32

# Option 2: Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Option 3: Python
python -c "import secrets; print(secrets.token_hex(32))"
```

### API Keys
- Never commit to git
- Use `.env.local` for development
- Use platform secrets manager for production (Vercel, GitHub Secrets, etc.)

## Security Best Practices

1. **Never commit secrets** to version control
2. **Use `.env.local`** for local development
3. **Rotate keys** regularly
4. **Use strong passwords** for database users
5. **Enable 2FA** on all service accounts
6. **Monitor API usage** for unusual activity
7. **Backup** `.env.local` securely
8. **Review** environment variables before deployment

## Deployment Platforms

### Vercel
1. Go to Project Settings → Environment Variables
2. Add production, preview, and development variables
3. Redeploy to apply changes

### Docker / Self-Hosted
1. Create `.env` file in deployment directory
2. Load variables in your process manager (systemd, Docker, PM2)
3. Ensure file permissions are restricted (600)

### GitHub Actions
1. Go to Settings → Secrets and variables → Actions
2. Create secrets for sensitive variables
3. Reference in workflow: `${{ secrets.SECRET_NAME }}`

## Troubleshooting

### Database Connection Failed
- Check MONGODB_URI format
- Verify IP whitelist in MongoDB Atlas
- Confirm username/password are correct
- Check network connectivity

### Authentication Not Working
- Verify NEXTAUTH_URL matches domain
- Ensure NEXTAUTH_SECRET is set
- Check Google OAuth credentials are valid
- Clear browser cookies/cache

### File Uploads Failing
- Verify UPLOADTHING_TOKEN is correct
- Check file size limits
- Ensure CORS is properly configured
- Review upload error logs
