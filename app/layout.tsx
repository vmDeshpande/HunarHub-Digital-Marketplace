import type { Metadata, Viewport } from 'next'
import { Analytics } from '@vercel/analytics/next'
import { AuthProvider } from '@/components/providers/auth-provider'
import { Toaster } from '@/components/ui/sonner'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'HunarHub - Indian Artisan Marketplace',
    template: '%s | HunarHub',
  },
  description: 'Discover authentic Indian craftsmanship. Connect with skilled artisans, browse handmade products, and support local entrepreneurs.',
  keywords: ['Indian artisans', 'handmade products', 'crafts', 'marketplace', 'local entrepreneurs', 'handcrafted', 'traditional crafts'],
  authors: [{ name: 'HunarHub' }],
  creator: 'HunarHub',
  openGraph: {
    type: 'website',
    locale: 'en_PK',
    url: 'https://hunarhub.pk',
    siteName: 'HunarHub',
    title: 'HunarHub - Indian Artisan Marketplace',
    description: 'Discover authentic Indian craftsmanship. Connect with skilled artisans and support local entrepreneurs.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HunarHub - Indian Artisan Marketplace',
    description: 'Discover authentic Indian craftsmanship.',
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#c75a3a' },
    { media: '(prefers-color-scheme: dark)', color: '#1a1410' },
  ],
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased bg-background">
        <AuthProvider>
          {children}
          <Toaster position="top-right" />
        </AuthProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
