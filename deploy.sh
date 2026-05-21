#!/bin/bash
# Production Deployment Script
# Usage: bash deploy.sh

set -e

echo "🚀 Starting Hunar Hub Production Deployment..."
echo ""

# Check Node version
NODE_VERSION=$(node -v)
echo "✓ Node version: $NODE_VERSION"

# Check pnpm
if ! command -v pnpm &> /dev/null; then
    echo "✗ pnpm not found. Installing..."
    npm install -g pnpm
fi
echo "✓ pnpm is installed"

# Check environment file
if [ ! -f .env.local ]; then
    echo "✗ .env.local not found!"
    echo "  Please copy .env.example to .env.local and fill in the values"
    exit 1
fi
echo "✓ .env.local found"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
pnpm install

# Build project
echo ""
echo "🔨 Building project..."
pnpm build

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Build successful!"
    echo ""
    echo "📊 Build summary:"
    echo "  - Framework: Next.js 14+"
    echo "  - Language: TypeScript"
    echo "  - Database: MongoDB"
    echo "  - Authentication: NextAuth.js"
    echo "  - Hosting: Ready for Vercel/Docker"
    echo ""
    echo "🚀 To start the production server:"
    echo "  pnpm start"
    echo ""
    echo "✨ Project is ready for deployment!"
else
    echo ""
    echo "❌ Build failed. Check errors above."
    exit 1
fi
