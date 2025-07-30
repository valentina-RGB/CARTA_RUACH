import { motion } from 'framer-motion'
import { Badge } from '@/common/ui/badge'
import { OptimizedImage } from '@/components/OptimizedImage'
import type { Product } from '@/types/product'
import { memo, useMemo } from 'react'

interface ProductCardProps {
  product: Product
  onProductClick: (product: Product) => void
  index: number
}

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price)
  }

export const ProductCard = memo(({ product, onProductClick, index }: ProductCardProps) => {

    const formattedPrice = useMemo(() => {
    return product.price ? formatPrice(product.price) : "Ver detalles"
  }, [product.price])

  return (
    <motion.div
      className="group bg-white w-full rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer border
      h-[45vh] min-h-[250px] max-h-[350px]
      sm:h-[45vh] sm:min-h-[350px] sm:max-h-[450px]
      md:h-[50vh] md:min-h-[400px] md:max-h-[500px]
      lg:h-[55vh] lg:min-h-[450px] lg:max-h-[550px]
      xl:h-[60vh] xl:min-h-[500px] xl:max-h-[600px]
      2xl:h-[65vh] 2xl:min-h-[550px] 2xl:max-h-[650px]"
      onClick={() => onProductClick(product)}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Image Section */}
      <div className="relative overflow-hidden 
      h-36 xs:h-40 sm:h-44 md:h-48 lg:h-52 xl:h-56 2xl:h-60">
      <OptimizedImage
        src={product.image}
        alt={product.name}
        className="group-hover:scale-110 transition-transform duration-700 w-full h-full object-cover"
        width={400}
        height={400}
        loading={index < 3 ? 'eager' : 'lazy'}
      />
      
      {/* Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Discount Badge */}
      {product.discount && (
        <div className="absolute top-2 right-2 sm:top-3 sm:right-3">
        <Badge className="bg-red-500 text-white text-xs px-2 py-1 sm:px-3 sm:py-1 rounded-full shadow-lg">
          {product.discount} OFF
        </Badge>
        </div>
      )}

      {/* Premium Indicator */}
      <div className="absolute top-2 left-2 sm:top-3 sm:left-3">
        <div className="bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
        <span className="text-amber-500 text-xs">★</span>
        <span className="text-amber-800 text-xs font-medium">Hoy</span>
        </div>
      </div>
      </div>
      
      {/* Content Section */}
      <div className="p-3 sm:p-4 md:p-5 lg:p-6 flex flex-col h-[calc(100%-9rem)] sm:h-[calc(100%-11rem)] md:h-[calc(100%-12rem)] lg:h-[calc(100%-13rem)] xl:h-[calc(100%-14rem)] 2xl:h-[calc(100%-15rem)]">
      {/* Title */}
      <motion.h3 
        className="font-bold text-amber-900 group-hover:text-amber-800 transition-colors mb-2
        text-sm sm:text-base md:text-lg lg:text-xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {product.name}
      </motion.h3>
      
      {/* Description hint */}
      <p className="text-amber-700 mb-3 line-clamp-2 flex-grow
        text-xs sm:text-sm md:text-sm lg:text-base">
        {product.description}
      </p>
      
      {/* Price Section */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-baseline gap-2">
        <span className={`${!product.price ? "text-sm sm:text-base md:text-lg text-amber-600":"text-lg sm:text-xl md:text-2xl text-amber-800"} font-bold `}>
         {formattedPrice}
        </span>
        {product.originalPrice && (
          <span className="text-amber-600 text-xs sm:text-sm line-through">
          ${product.originalPrice.toFixed(2)}
          </span>
        )}
        </div>
      </div>
      
      {/* Action Indicator */}
      <motion.div 
        className="pt-3 border-t border-amber-100 flex items-center justify-center text-amber-600 font-medium opacity-0 group-hover:opacity-100 transition-all duration-300
        text-sm sm:text-base"
        initial={{ y: 10 }}
        whileHover={{ y: 0 }}
      >
        <span>Ver detalles</span>
        <motion.span 
        className="ml-2"
        animate={{ x: [0, 5, 0] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
        >
        →
        </motion.span>
      </motion.div>
      </div>
    </motion.div>
  )
});
