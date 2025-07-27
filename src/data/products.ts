import type { Product } from '@/types/product'
import { Beef, Soup } from 'lucide-react'
export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Almuerzo con Cerdo',
    description: 'Savor the authentic essence of our Almuerzo con Res — soft inside, irresistibly flaky outside. Expertly crafted from premium ingredients. It\'s an authentic taste of Parisian bliss to remember and savor. Elevate your moments with the ultimate French pastry experience.',
    price: 18.000,
    image: '/src/assets/carne_cerdo.png',
    category: 'croissant',
    weight: '100g',
    nutritionalInfo: {
      kcal: 180,
      carbs: 15,
      protein: 4,
      sugar: 2
    },
    ingredients:[
    {
      name: 'Cerdo',
      quantity: '150g',
      icon: Beef
    },
    {name: 'Arroz'},
    {name: 'Ensalada'},
    {name: 'Frijoles', icon: Soup}

    ],
    isAvailable: true,
    isFeatured: true
  }
]
