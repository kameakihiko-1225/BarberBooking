import React, { useState, useRef, useEffect } from 'react';

interface ImageWithPlaceholderProps {
  src: string;
  alt: string;
  className?: string;
  onLoad?: () => void;
  onError?: () => void;
}

export default function ImageWithPlaceholder({
  src,
  alt,
  className,
  onLoad,
  onError,
}: ImageWithPlaceholderProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [showPlaceholder, setShowPlaceholder] = useState(true);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!imgRef.current) return;

    const img = imgRef.current;
    
    const handleLoad = () => {
      console.log('[ImageWithPlaceholder] Loaded:', src);
      setIsLoaded(true);
      setShowPlaceholder(false);
      onLoad?.();
    };

    const handleError = () => {
      console.log('[ImageWithPlaceholder] Error loading:', src);
      setIsError(true);
      setShowPlaceholder(false);
      onError?.();
    };

    img.addEventListener('load', handleLoad);
    img.addEventListener('error', handleError);

    return () => {
      img.removeEventListener('load', handleLoad);
      img.removeEventListener('error', handleError);
    };
  }, [onLoad, onError]);

  const generatePlaceholderSVG = (width: number, height: number) => {
    const svg = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#2D3748;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#1A202C;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#grad)"/>
        <rect x="20%" y="40%" width="60%" height="20%" fill="#4A5568" opacity="0.5" rx="4"/>
      </svg>
    `;
    return `data:image/svg+xml;base64,${btoa(svg)}`;
  };

  if (isError) {
    return (
      <div className={`flex items-center justify-center bg-gray-800 ${className}`}>
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" className="text-gray-400">
          <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" fill="currentColor"/>
        </svg>
      </div>
    );
  }

  return (
    <div className="relative">
      {showPlaceholder && (
        <div className={`absolute inset-0 ${className}`}>
          <img
            src={generatePlaceholderSVG(400, 300)}
            alt="Loading..."
            className={`w-full h-full object-cover ${className}`}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-[var(--premium-accent)] border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      )}
      
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        className={`transition-opacity duration-500 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        } ${className}`}
        loading="lazy"
      />
    </div>
  );
}