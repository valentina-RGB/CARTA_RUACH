import type { LucideProps } from "lucide-react"

export interface Product {
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  image: string
  
  category: string
  weight: string
  discount?: number
  nutritionalInfo?: {
    kcal: number
    carbs: number
    protein: number
    sugar: number
  },
  sizes?: {
    small?: string
    medium?: string
    large?: string
  },
  ingredients?: {
    name: string
    quantity?: string
    icon?:  React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>
  }[],
  isAvailable: boolean
  isFeatured?: boolean
}

export interface CartItem extends Product {
  quantity: number
}

