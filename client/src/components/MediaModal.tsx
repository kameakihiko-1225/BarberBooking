import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ImageWithPlaceholder from './ImageWithPlaceholder';

interface MediaModalProps {
  isOpen: boolean;
  onClose: () => void;
  media: Array<{ src: string; type: 'image' | 'video'; alt?: string }>;
  initialIndex: number;
}

export default function MediaModal({ isOpen, onClose, media, initialIndex }: MediaModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  useEffect(() => {
    if (!isOpen) {
      setIsPlaying(false);
      if (videoRef.current) {
        videoRef.current.pause();
      }
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          goToPrevious();
          break;
        case 'ArrowRight':
          goToNext();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex]);

  const goToPrevious = () => {
    setCurrentIndex(prev => (prev > 0 ? prev - 1 : media.length - 1));
    setIsPlaying(false);
  };

  const goToNext = () => {
    setCurrentIndex(prev => (prev < media.length - 1 ? prev + 1 : 0));
    setIsPlaying(false);
  };

  const toggleVideoPlay = async () => {
    if (videoRef.current) {
      try {
        if (isPlaying) {
          videoRef.current.pause();
        } else {
          await videoRef.current.play();
        }
        setIsPlaying(!isPlaying);
      } catch (error) {
        console.error('Video play error:', error);
      }
    }
  };

  if (!isOpen || !media[currentIndex]) return null;

  const currentItem = media[currentIndex];

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center">
      <div className="relative w-full h-full flex items-center justify-center p-4">
        {/* Close Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 text-white hover:bg-white/10"
        >
          <X size={24} />
        </Button>

        {/* Navigation Buttons */}
        {media.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-white hover:bg-white/10"
            >
              <ChevronLeft size={32} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 text-white hover:bg-white/10"
            >
              <ChevronRight size={32} />
            </Button>
          </>
        )}

        {/* Media Content */}
        <div className="max-w-4xl max-h-full">
          {currentItem.type === 'image' ? (
            <ImageWithPlaceholder
              src={currentItem.src}
              alt={currentItem.alt || 'Gallery image'}
              className="max-w-full max-h-full object-contain"
            />
          ) : (
            <div className="relative">
              <video
                ref={videoRef}
                src={currentItem.src}
                className="max-w-full max-h-full object-contain"
                controls={false}
                playsInline
                muted
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleVideoPlay}
                className="absolute inset-0 flex items-center justify-center text-white hover:bg-white/10"
              >
                <div className="bg-black bg-opacity-50 rounded-full p-4">
                  {isPlaying ? <Pause size={32} /> : <Play size={32} />}
                </div>
              </Button>
            </div>
          )}
        </div>

        {/* Media Counter */}
        {media.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black bg-opacity-50 px-3 py-1 rounded text-white text-sm">
            {currentIndex + 1} / {media.length}
          </div>
        )}
      </div>
    </div>
  );
}