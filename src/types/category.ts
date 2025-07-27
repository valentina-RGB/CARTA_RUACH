export interface Category {
  id: string
  name: string
  icon?: string
  color?: string
  description?: string
}

export type ProductCategory = string

export const isValidCategory = (categoryId: string, categories: Category[]): boolean => {
  return categories.some(cat => cat.id === categoryId)
}