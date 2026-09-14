"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import type { ImageRecord } from "@/components/towboatus-ntx/exact/data";

interface ImageSlideshowProps {
  images: ImageRecord[];
  interval?: number;
  className?: string;
  aspectRatio?: string;
  sizes?: string;
  priority?: boolean;
  objectFit?: "cover" | "contain";
  objectPosition?: string;
}

export default function ImageSlideshow({
  images,
  interval = 6000,
  className = "",
  aspectRatio,
  sizes = "100vw",
  priority = false,
  objectFit = "cover",
  objectPosition = "center",
}: ImageSlideshowProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, interval);

    return () => clearInterval(timer);
  }, [images.length, interval]);

  if (images.length === 0) return null;

  const containerClasses = aspectRatio
    ? `${className} relative w-full`
    : `${className} relative w-full h-full`;

  if (images.length === 1) {
    const image = images[0];
    return (
      <div className={containerClasses} style={aspectRatio ? { aspectRatio } : undefined}>
        <Image
          src={image.public_url}
          alt={image.alt_text || image.title}
          fill
          className={`object-${objectFit}`}
          style={{ objectPosition }}
          sizes={sizes}
          priority={priority}
        />
      </div>
    );
  }

  return (
    <div className={containerClasses} style={aspectRatio ? { aspectRatio } : undefined}>
      {images.map((image, index) => (
        <Image
          key={image.id}
          src={image.public_url}
          alt={image.alt_text || image.title}
          fill
          className={`object-${objectFit} transition-opacity duration-1000 ease-in-out`}
          style={{
            opacity: index === currentIndex ? 1 : 0,
            zIndex: index === currentIndex ? 1 : 0,
            objectPosition,
          }}
          sizes={sizes}
          priority={priority && index === 0}
        />
      ))}
    </div>
  );
}
