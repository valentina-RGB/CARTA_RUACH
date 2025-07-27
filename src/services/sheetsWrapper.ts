// Wrapper para cargar Google Sheets de forma asíncrona y evitar conflictos ESM/CommonJS
import type { Product } from '@/types/product';
import type { Category } from '@/types/category';

let sheetsServiceInstance: any = null;

// Función para cargar el servicio de forma lazy
async function loadSheetsService() {
  if (!sheetsServiceInstance) {
    try {
      // Importación dinámica para evitar conflictos en tiempo de compilación
      const { sheetsService } = await import('@/data/Google_sheetService');
      sheetsServiceInstance = sheetsService;
    } catch (error) {
      console.warn('🔄 Error cargando Google Sheets service, usando fallback:', error);
      // Fallback en caso de error
      return null;
    }
  }
  return sheetsServiceInstance;
}

// Wrapper para productos
export async function loadProducts(): Promise<Product[]> {
  try {
    const service = await loadSheetsService();
    if (service) {
      return await service.loadProducts();
    }
  } catch (error) {
    console.warn('📊 Fallback: Error cargando productos desde Google Sheets:', error);
  }
  
  // Fallback a mock data
  const { mockProducts } = await import('@/data/products');
  return mockProducts;
}

// Wrapper para categorías  
export async function loadCategories(): Promise<Category[]> {
  try {
    const service = await loadSheetsService();
    if (service) {
      return await service.loadCategories();
    }
  } catch (error) {
    console.warn('📂 Fallback: Error cargando categorías desde Google Sheets:', error);
  }
  
  // Fallback a categorías mock
  return [
    { id: 'all', name: 'Todos' },
    { id: 'croissant', name: 'Almuerzos' },
    { id: 'breakfast', name: 'Desayunos' }
  ];
}
