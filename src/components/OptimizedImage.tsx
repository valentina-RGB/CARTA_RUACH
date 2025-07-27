import { useState, useCallback } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  loading?: 'lazy' | 'eager';
  fallbackSrc?: string;
}

export function OptimizedImage({
  src,
  alt,
  className = '',
  width,
  height,
  loading = 'lazy',
  fallbackSrc = 'https://via.placeholder.com/400x400/f3f4f6/9ca3af?text=Imagen+no+disponible'
}: OptimizedImageProps) {
  const [imageError, setImageError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Convertir URLs de Unsplash a WebP cuando sea posible
  const getOptimizedSrc = useCallback((originalSrc: string) => {
    if (originalSrc.includes('unsplash.com')) {
      const url = new URL(originalSrc);
      url.searchParams.set('fm', 'webp'); // Formato WebP
      url.searchParams.set('q', '80'); // Calidad 80%
      return url.toString();
    }
    return originalSrc;
  }, []);

  const handleImageLoad = useCallback(() => {
    setIsLoaded(true);
  }, []);

  const handleImageError = useCallback(() => {
    setImageError(true);
    setIsLoaded(true);
  }, []);

  const imageSrc = imageError ? fallbackSrc : getOptimizedSrc(src);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Placeholder mientras carga */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          <div className="w-8 h-8 text-gray-400">
            <svg className="w-full h-full" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      )}
      
      {/* Imagen principal */}
      <img
        src={imageSrc}
        alt={alt}
        width={width}
        height={height}
        loading={loading}
        decoding="async"
        className={`transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        } w-full h-full object-cover`}
        onLoad={handleImageLoad}
        onError={handleImageError}
      />
    </div>
  );
}
