import { motion } from 'framer-motion'

interface LoadingSkeletonProps {
  className?: string
  type?: 'card' | 'text' | 'circle' | 'button'
  count?: number
}

export const LoadingSkeleton = ({ 
  className = '', 
  type = 'card', 
  count = 1 
}: LoadingSkeletonProps) => {
  const renderSkeleton = () => {
    switch (type) {
      case 'card':
        return (
          <div className={`${className} bg-white rounded-2xl overflow-hidden shadow-sm border animate-pulse`}>
            <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300" />
            <div className="p-4 space-y-3">
              <div className="h-6 bg-gray-200 rounded-lg w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-2/3" />
              <div className="flex justify-between items-center mt-4">
                <div className="h-6 bg-gray-200 rounded w-20" />
                <div className="h-8 bg-gray-200 rounded-full w-16" />
              </div>
            </div>
          </div>
        )
      
      case 'circle':
        return (
          <div className={`${className} w-12 h-12 bg-gray-200 rounded-full animate-pulse`} />
        )
      
      case 'button':
        return (
          <div className={`${className} h-10 bg-gray-200 rounded-full animate-pulse`} />
        )
      
      case 'text':
        return (
          <div className={`${className} h-4 bg-gray-200 rounded animate-pulse`} />
        )
      
      default:
        return (
          <div className={`${className} bg-gray-200 rounded animate-pulse`} />
        )
    }
  }

  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          {renderSkeleton()}
        </motion.div>
      ))}
    </>
  )
}

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export const LoadingSpinner = ({ size = 'md', className = '' }: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  }

  return (
    <motion.div
      className={`${sizeClasses[size]} ${className}`}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    >
      <svg
        className="w-full h-full text-orange-600"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </motion.div>
  )
}
