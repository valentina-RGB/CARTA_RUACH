import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'

interface LazyImageProps {
  src: string
  alt: string
  className?: string
  placeholderClassName?: string
  onLoad?: () => void
  onError?: () => void
}

export const LazyImage = ({ 
  src, 
  alt, 
  className = '', 
  placeholderClassName = '',
  onLoad,
  onError 
}: LazyImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isInView, setIsInView] = useState(false)
  const [hasError, setHasError] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    const currentImg = imgRef.current
    if (!currentImg) return

    // Intersection Observer para lazy loading
    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observerRef.current?.disconnect()
        }
      },
      {
        rootMargin: '50px' // Cargar imagen 50px antes de que sea visible
      }
    )

    observerRef.current.observe(currentImg)

    return () => {
      observerRef.current?.disconnect()
    }
  }, [])

  const handleLoad = () => {
    setIsLoaded(true)
    onLoad?.()
  }

  const handleError = () => {
    setHasError(true)
    onError?.()
  }

  // Placeholder optimizado
  const PlaceholderSkeleton = () => (
    <div className={`${className} ${placeholderClassName} bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse flex items-center justify-center`}>
      <svg 
        className="w-8 h-8 text-gray-400" 
        fill="currentColor" 
        viewBox="0 0 20 20"
        aria-hidden="true"
      >
        <path 
          fillRule="evenodd" 
          d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" 
          clipRule="evenodd" 
        />
      </svg>
    </div>
  )

  // Error fallback optimizado
  const ErrorFallback = () => (
    <div className={`${className} bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center text-orange-600`}>
      <div className="text-center">
        <svg className="w-8 h-8 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
        <span className="text-xs font-medium">{alt}</span>
      </div>
    </div>
  )

  if (hasError) {
    return <ErrorFallback />
  }

  if (!isInView) {
    return <PlaceholderSkeleton />
  }

  return (
    <div className="relative">
      {!isLoaded && <PlaceholderSkeleton />}
      
      <motion.img
        ref={imgRef}
        src={src}
        alt={alt}
        className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
        onLoad={handleLoad}
        onError={handleError}
        loading="lazy"
        decoding="async"
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        style={{
          position: isLoaded ? 'relative' : 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%'
        }}
      />
    </div>
  )
}
