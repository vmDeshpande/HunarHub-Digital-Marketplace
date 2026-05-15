'use client';

import { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog';

interface ProductGalleryProps {
  images: string[];
  title: string;
}

export function ProductGallery({ images, title }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});

  const handlePrevious = () => {
    setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleImageError = (index: number) => {
    setImageErrors((prev) => ({ ...prev, [index]: true }));
  };

  const getImageSrc = (index: number) => {
    return imageErrors[index] ? '/images/placeholder-product.jpg' : images[index];
  };

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <Dialog>
        <DialogTrigger asChild>
          <div className="relative aspect-square rounded-lg overflow-hidden bg-muted cursor-zoom-in group">
            <Image
              src={getImageSrc(selectedIndex)}
              alt={`${title} - Image ${selectedIndex + 1}`}
              fill
              className="object-cover"
              priority
              onError={() => handleImageError(selectedIndex)}
            />
            
            {/* Zoom Icon */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
              <div className="bg-background/90 rounded-full p-3">
                <ZoomIn className="h-5 w-5" />
              </div>
            </div>

            {/* Navigation Arrows */}
            {images.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background shadow-md"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrevious();
                  }}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background shadow-md"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNext();
                  }}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </>
            )}

            {/* Image Counter */}
            <div className="absolute bottom-2 right-2 bg-background/80 px-2 py-1 rounded text-xs font-medium">
              {selectedIndex + 1} / {images.length}
            </div>
          </div>
        </DialogTrigger>
        <DialogContent className="max-w-4xl">
          <div className="relative aspect-square">
            <Image
              src={getImageSrc(selectedIndex)}
              alt={`${title} - Image ${selectedIndex + 1}`}
              fill
              className="object-contain"
              onError={() => handleImageError(selectedIndex)}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Thumbnail Grid */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={cn(
                'relative w-20 h-20 flex-shrink-0 rounded-md overflow-hidden border-2 transition-colors',
                selectedIndex === index
                  ? 'border-primary'
                  : 'border-transparent hover:border-muted-foreground/50'
              )}
            >
              <Image
                src={imageErrors[index] ? '/images/placeholder-product.jpg' : image}
                alt={`${title} - Thumbnail ${index + 1}`}
                fill
                className="object-cover"
                onError={() => handleImageError(index)}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
