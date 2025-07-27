import { motion } from 'framer-motion'
import { Badge } from '@/common/ui/badge'
import { OptimizedImage } from '@/components/OptimizedImage'
import type { Product } from '@/types/product'

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

export const ProductCard = ({ product, onProductClick, index }: ProductCardProps) => {
  return (
    <motion.div
      className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer border"
      onClick={() => onProductClick(product)}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Image Section */}
      <div className="relative overflow-hidden h-48">
        <OptimizedImage
          src={product.image}
          alt={product.name}
          className="group-hover:scale-110 transition-transform duration-700"
          width={400}
          height={400}
          loading={index < 3 ? 'eager' : 'lazy'}
        />
        
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Discount Badge */}
        {product.discount && (
          <div className="absolute top-3 right-3">
            <Badge className="bg-red-500 text-white text-xs px-3 py-1 rounded-full shadow-lg">
              {product.discount} OFF
            </Badge>
          </div>
        )}

        {/* Premium Indicator */}
        <div className="absolute top-3 left-3">
          <div className="bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
            <span className="text-amber-500 text-xs">★</span>
            <span className="text-amber-800 text-xs font-medium">Hoy</span>
          </div>
        </div>
      </div>
      
      {/* Content Section */}
      <div className="p-6">
        {/* Title */}
        <motion.h3 
          className="font-bold text-amber-900 text-lg mb-2 group-hover:text-amber-800 transition-colors"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {product.name}
        </motion.h3>
        
        {/* Description hint */}
        <p className="text-amber-700 text-sm mb-4 line-clamp-2">
            {product.description}
        </p>
        
        {/* Price Section */}
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-amber-800">
             {product.price ?formatPrice(product.price): "Ver detalles"}
            </span>
            {product.originalPrice && (
              <span className="text-amber-600 text-sm line-through">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
          
          {/* Weight/Portion */}
          {/* <div className="text-right">
            <span className="text-amber-800 text-xs block">
              Porción
            </span>
            <span className="text-amber-800 text-sm font-medium">
              {product.weight}
            </span>
          </div> */}
        </div>
        
        {/* Action Indicator */}
        <motion.div 
          className="mt-4 pt-4 border-t border-amber-100 flex items-center justify-center text-amber-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-all duration-300"
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
}
