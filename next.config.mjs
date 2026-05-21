/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Enable strict type checking in production
    ignoreBuildErrors: false,
  },
  images: {
    // Enable image optimization for production
    unoptimized: false,
    domains: [
      'uploadthing.com',
      'utfs.io',
      'placeholder.com',
      'images.unsplash.com',
    ],
  },
  // Compression and optimization
  compress: true,
  // Security headers
  headers: async () => {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
  // Redirects for deprecated routes
  redirects: async () => {
    return [];
  },
};

export default nextConfig;
