import Link from 'next/link';
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const footerLinks = {
  marketplace: [
    { name: 'Browse Products', href: '/products' },
    { name: 'Browse Services', href: '/services' },
    { name: 'Featured Artisans', href: '/artisans' },
    { name: 'Categories', href: '/categories' },
    { name: 'New Arrivals', href: '/products?sort=newest' },
  ],
  sellers: [
    { name: 'Become a Seller', href: '/auth/register?role=entrepreneur' },
    { name: 'Seller Dashboard', href: '/entrepreneur' },
    { name: 'Seller Guidelines', href: '/seller-guidelines' },
    { name: 'Success Stories', href: '/success-stories' },
    { name: 'Pricing', href: '/pricing' },
  ],
  support: [
    { name: 'Help Center', href: '/help' },
    { name: 'Contact Us', href: '/contact' },
    { name: 'FAQs', href: '/faqs' },
    { name: 'Shipping Info', href: '/shipping' },
    { name: 'Returns Policy', href: '/returns' },
  ],
  company: [
    { name: 'About HunarHub', href: '/about' },
    { name: 'Our Mission', href: '/mission' },
    { name: 'Careers', href: '/careers' },
    { name: 'Press', href: '/press' },
    { name: 'Blog', href: '/blog' },
  ],
};

const socialLinks = [
  { name: 'Facebook', icon: Facebook, href: 'https://facebook.com/hunarhub' },
  { name: 'Instagram', icon: Instagram, href: 'https://instagram.com/hunarhub' },
  { name: 'Twitter', icon: Twitter, href: 'https://twitter.com/hunarhub' },
  { name: 'YouTube', icon: Youtube, href: 'https://youtube.com/hunarhub' },
];

export function SiteFooter() {
  return (
    <footer className="bg-muted/50 border-t">
      {/* Main Footer */}
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand & Newsletter */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-4">
              <span className="text-2xl font-bold text-primary">HunarHub</span>
            </Link>
            <p className="text-muted-foreground mb-6 max-w-sm">
              Connecting Indian artisans with the world. Discover authentic handcrafted 
              products and support local entrepreneurs.
            </p>
            
            {/* Newsletter */}
            <div className="space-y-2">
              <p className="font-medium">Subscribe to our newsletter</p>
              <form className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="max-w-[240px]"
                />
                <Button type="submit">Subscribe</Button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="mt-6 space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>support@hunarhub.pk</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>+92 300 1234567</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>Lahore, Pakistan</span>
              </div>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold mb-4">Marketplace</h3>
            <ul className="space-y-2">
              {footerLinks.marketplace.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">For Sellers</h3>
            <ul className="space-y-2">
              {footerLinks.sellers.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t">
        <div className="container py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>&copy; {new Date().getFullYear()} HunarHub. All rights reserved.</span>
            <Link href="/privacy" className="hover:text-primary">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-primary">
              Terms of Service
            </Link>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label={social.name}
              >
                <social.icon className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
