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
  },

  {
    id: '2',
    name: 'Croissantopia',
    description: 'Experience our signature croissant with layers of buttery perfection. Golden, flaky, and absolutely divine.',
    price: 10.00,
    image: '/api/placeholder/300/300',
    category: 'croissant',
    weight: '80g',
    nutritionalInfo: {
      kcal: 165,
      carbs: 12,
      protein: 3,
      sugar: 1
    },
    isAvailable: true
  },
  {
    id: '3',
    name: 'Breadsville',
    description: 'Artisan bread baked fresh daily with organic ingredients. Perfect for any meal.',
    price: 14.50,
    image: '/api/placeholder/300/300',
    category: 'bread',
    weight: '180g',
    nutritionalInfo: {
      kcal: 220,
      carbs: 45,
      protein: 8,
      sugar: 3
    },
    isAvailable: true
  },
  {
    id: '4',
    name: 'Chocolate Chip Cookie',
    description: 'Classic chocolate chip cookies with premium Belgian chocolate chunks.',
    price: 8.00,
    originalPrice: 10.00,
    discount: 20,
    image: '/api/placeholder/300/300',
    category: 'cookie',
    weight: '60g',
    nutritionalInfo: {
      kcal: 195,
      carbs: 28,
      protein: 2,
      sugar: 15
    },
    isAvailable: true
  },
  {
    id: '5',
    name: 'Blueberry Muffin',
    description: 'Fluffy muffins packed with fresh blueberries and a hint of vanilla.',
    price: 9.50,
    image: '/api/placeholder/300/300',
    category: 'muffin',
    weight: '120g',
    nutritionalInfo: {
      kcal: 210,
      carbs: 32,
      protein: 4,
      sugar: 18
    },
    isAvailable: true
  },
  {
    id: '6',
    name: 'French Baguette',
    description: 'Traditional French baguette with crispy crust and soft interior.',
    price: 12.00,
    image: '/api/placeholder/300/300',
    category: 'bread',
    weight: '250g',
    nutritionalInfo: {
      kcal: 280,
      carbs: 58,
      protein: 10,
      sugar: 2
    },
    isAvailable: true
  }
]
