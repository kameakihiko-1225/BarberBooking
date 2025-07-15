import React, { useRef, useEffect, useState } from 'react';
import { Play, Pause } from 'lucide-react';
import ImageWithPlaceholder from './ImageWithPlaceholder';

interface LazyMediaProps {
  item: {
    src: string;
    type: 'image' | 'video';
    alt?: string;
  };
  heightClass: string;
  onLoad?: () => void;
  onError?: () => void;
  onClick?: () => void;
}

const LazyMedia: React.FC<LazyMediaProps> = ({ item, heightClass, onLoad, onError, onClick }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const mediaRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!mediaRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsLoaded(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    observer.observe(mediaRef.current);
    return () => observer.disconnect();
  }, []);

  const handleImageLoad = () => {
    setImageLoaded(true);
    onLoad?.();
  };

  const handleImageError = () => {
    setIsError(true);
    onError?.();
  };

  const handleVideoPlay = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      try {
        if (isPlaying) {
          videoRef.current.pause();
          setIsPlaying(false);
        } else {
          // Reset to beginning to prevent freezing issues
          videoRef.current.currentTime = 0;
          await videoRef.current.play();
          setIsPlaying(true);
        }
      } catch (error) {
        console.error('Video play error:', error);
        setIsError(true);
      }
    }
  };

  const getAltText = (src: string) => {
    return src.split('/').pop()?.replace(/[-_]/g, ' ').replace(/\..+$/, '') || 'Gallery item';
  };

  return (
    <div 
      ref={mediaRef} 
      className={`relative ${heightClass} bg-black rounded-lg overflow-hidden group cursor-pointer`}
      onClick={onClick}
    >
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-[var(--premium-accent)] border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {isError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800 text-white">
          <span className="text-sm">Failed to load</span>
        </div>
      )}

      {isLoaded && item.type === 'image' && (
        <ImageWithPlaceholder
          src={item.src}
          alt={getAltText(item.src)}
          className={`w-full ${heightClass} object-cover transition-all duration-1000 group-hover:scale-105`}
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
      )}

      {isLoaded && item.type === 'video' && (
        <div className="relative">
          <video
            ref={videoRef}
            className={`w-full ${heightClass} object-cover transition-all duration-500 group-hover:scale-105`}
            preload="metadata"
            muted
            playsInline
            onError={handleImageError}
            onLoadedData={handleImageLoad}
            onEnded={() => {
              setIsPlaying(false);
              if (videoRef.current) {
                videoRef.current.currentTime = 0;
              }
            }}
            onPause={() => setIsPlaying(false)}
            onPlay={() => setIsPlaying(true)}
          >
            <source src={item.src} type="video/mp4" />
            <source src={item.src} type="video/mov" />
            <source src={item.src} type="video/quicktime" />
            Your browser does not support the video tag.
          </video>
          
          <button
            onClick={handleVideoPlay}
            className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            <div className="bg-white bg-opacity-80 rounded-full p-3">
              {isPlaying ? <Pause size={24} /> : <Play size={24} />}
            </div>
          </button>
        </div>
      )}
    </div>
  );
};

export default LazyMedia;