import type { Product } from '@/types/product'
import type { Category } from '@/types/category'

// Función para validar IDs únicos en desarrollo
export const validateUniqueIds = {
  products: (products: Product[]) => {
    if (process.env.NODE_ENV !== 'development') return true
    
    const ids = products.map(p => p.id)
    const uniqueIds = new Set(ids)
    
    if (ids.length !== uniqueIds.size) {
      console.error('🚨 PRODUCTOS CON IDs DUPLICADOS:', {
        total: ids.length,
        únicos: uniqueIds.size,
        duplicados: ids.filter((id, index) => ids.indexOf(id) !== index)
      })
      return false
    }
    
    console.log('✅ Todos los productos tienen IDs únicos')
    return true
  },
  
  categories: (categories: Category[]) => {
    if (process.env.NODE_ENV !== 'development') return true
    
    const ids = categories.map(c => c.id)
    const uniqueIds = new Set(ids)
    
    if (ids.length !== uniqueIds.size) {
      console.error('🚨 CATEGORÍAS CON IDs DUPLICADOS:', {
        total: ids.length,
        únicos: uniqueIds.size,
        duplicados: ids.filter((id, index) => ids.indexOf(id) !== index)
      })
      return false
    }
    
    console.log('✅ Todas las categorías tienen IDs únicos')
    return true
  }
}
