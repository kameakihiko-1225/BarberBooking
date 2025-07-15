import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLanguage } from '@/contexts/LanguageContext';
import { useWindowSize } from '@/hooks/useWindowSize';
import LazyMedia from '@/components/LazyMedia';
import MediaModal from '@/components/MediaModal';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { ChevronLeft, Grid, List } from 'lucide-react';

type Media = { src: string; type: 'image' | 'video'; alt?: string };

export default function GalleryPage() {
  const { t } = useLanguage();
  const { width } = useWindowSize();
  const isMobile = width < 768;
  const [viewMode, setViewMode] = useState<'grid' | 'masonry'>('grid');
  const [filter, setFilter] = useState<'all' | 'images' | 'videos'>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const { data: galleryMedia = [], isLoading, error, refetch } = useQuery<Media[]>({
    queryKey: ['media', 'gallery'],
    queryFn: async () => {
      const res = await fetch('/api/media/gallery');
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return res.json();
    },
    staleTime: 5 * 60 * 1000,
    retry: 3,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 10000),
    select: (data) => data.map(item => ({
      ...item,
      alt: item.src.split('/').pop()?.replace(/[-_]/g, ' ').replace(/\..+$/, '') || 'Gallery item'
    })),
  });

  const filteredMedia = galleryMedia.filter(item => {
    if (filter === 'all') return true;
    if (filter === 'images') return item.type === 'image';
    if (filter === 'videos') return item.type === 'video';
    return true;
  });

  const getGridClass = () => {
    if (isMobile) return 'grid-cols-2';
    return viewMode === 'grid' ? 'grid-cols-3 md:grid-cols-4 lg:grid-cols-5' : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4';
  };

  const handleMediaClick = (index: number) => {
    setSelectedIndex(index);
    setModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-deep-black text-white pt-40">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-center h-64">
            <div className="w-12 h-12 border-2 border-[var(--premium-accent)] border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-deep-black text-white pt-40">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">{t('gallery.title')}</h1>
            <p className="text-red-400 mb-4">Error loading gallery: {error.message}</p>
            <Button onClick={() => refetch()} variant="outline">
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-deep-black text-white pt-40">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" asChild>
              <Link href="/">
                <ChevronLeft size={20} />
                {t('common.back')}
              </Link>
            </Button>
          </div>
          
          <h1 className="font-serif text-4xl md:text-6xl font-bold mb-4">
            {t('gallery.title')} <span className="premium-accent">{t('gallery.title.highlight')}</span>
          </h1>
          
          <p className="text-gray-300 text-lg mb-8">
            {t('gallery.description')}
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          {/* Filter Controls */}
          <div className="flex gap-2">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              onClick={() => setFilter('all')}
              size="sm"
            >
              All ({galleryMedia.length})
            </Button>
            <Button
              variant={filter === 'images' ? 'default' : 'outline'}
              onClick={() => setFilter('images')}
              size="sm"
            >
              Images ({galleryMedia.filter(item => item.type === 'image').length})
            </Button>
            <Button
              variant={filter === 'videos' ? 'default' : 'outline'}
              onClick={() => setFilter('videos')}
              size="sm"
            >
              Videos ({galleryMedia.filter(item => item.type === 'video').length})
            </Button>
          </div>

          {/* View Mode Controls */}
          {!isMobile && (
            <div className="flex gap-2 ml-auto">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                onClick={() => setViewMode('grid')}
                size="sm"
              >
                <Grid size={16} />
              </Button>
              <Button
                variant={viewMode === 'masonry' ? 'default' : 'outline'}
                onClick={() => setViewMode('masonry')}
                size="sm"
              >
                <List size={16} />
              </Button>
            </div>
          )}
        </div>

        {/* Gallery Grid */}
        <div className={`grid ${getGridClass()} gap-4`}>
          {filteredMedia.map((item, index) => (
            <LazyMedia
              key={`${item.src}-${index}`}
              item={item}
              heightClass={isMobile ? 'h-40' : 'h-56'}
              onClick={() => handleMediaClick(index)}
            />
          ))}
        </div>

        {/* Empty State */}
        {filteredMedia.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">
              No {filter === 'all' ? 'media' : filter} found
            </p>
          </div>
        )}
      </div>

      {/* Media Modal */}
      <MediaModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        media={filteredMedia}
        initialIndex={selectedIndex}
      />
    </div>
  );
}