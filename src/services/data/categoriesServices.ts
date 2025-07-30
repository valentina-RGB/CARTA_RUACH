
import { MemoryCache } from "../cache/MemoryCache";
import { LocalStorageCache } from "../cache/LocalStorageCache";
import { GoogleSheetsClient } from "../network/googleSheertsClient";
import { networkDetector } from "../network/networkDetector";

import { CacheManager } from "../cache/CacheManager";
import { convertDriveImageUrl } from "@/utils/converDriveUrls";
import type { Category } from "@/types/category";

export class CategoriesService {
  private cacheManager: CacheManager<Category[]>;
  private sheetsClient: GoogleSheetsClient;
  private readonly CACHE_KEY = 'categories';

  constructor() {
    // Configurar cache con múltiples providers
    this.cacheManager = new CacheManager<Category[]>(5 * 60 * 1000); // 5 minutos
    this.cacheManager.addProvider(new MemoryCache<Category[]>('Categories Memory'));
    this.cacheManager.addProvider(new LocalStorageCache<Category[]>('ruach', 'Categories Storage'));

    // Configurar cliente de Google Sheets
    this.sheetsClient = new GoogleSheetsClient({
      spreadsheetId: import.meta.env.VITE_SPREADSHEET_ID,
      apiKey: import.meta.env.VITE_GOOGLE_SHEETS_API_KEY,
      sheetName: "Categorías",
      sheetIndex: 0
    });
  }

  async loadCategories(): Promise<Category[]> {
    try {
      // 1️⃣ Intentar cache primero
      const cached = await this.cacheManager.get(this.CACHE_KEY);
      if (cached) {
        console.log("📋 Categorías cargadas desde cache");
        return cached;
      }

      // 2️⃣ Verificar conectividad
      const isOnline = await networkDetector.isOnline();
      if (!isOnline) {
        console.log("🔌 Sin conexión - no hay categorías en cache");
        return [];
      }

      // 3️⃣ Cargar desde Google Sheets
      console.log("🌐 Cargando productos desde Google Sheets...");
      await this.sheetsClient.connect();
      const rows = await this.sheetsClient.getSheetData();

      // 4️⃣ Transformar datos
      const products = this. transformRowsToCategories(rows);

      // 5️⃣ Guardar en cache
      await this.cacheManager.set(this.CACHE_KEY, products);

      console.log(`✅ ${products.length} productos cargados y cacheados`);
      return products;

    } catch (error) {
      console.error("❌ Error cargando productos:", error);
      
      // Fallback: intentar cache expirado como último recurso
      // TODO: Implementar cache con TTL extendido para emergencias
      return [];
    }
  }

  private transformRowsToCategories(rows: any[]): Category[] {
    return rows.map((row, index) => ({
      id: row.get("id") || `category-${Date.now()}-${index}`,
        name: row.get("name") || "",
        icon: convertDriveImageUrl(row.get("icon")) || "🍽️",
        color: row.get("color") || "#f97316",
        description: row.get("description") || "",
    }));
  }


  async refreshCategories(): Promise<Category[]> {
    await this.cacheManager.invalidate(this.CACHE_KEY);
    return this.loadCategories();
  }

  async clearCache(): Promise<void> {
    await this.cacheManager.clear();
  }

  getCacheStatus() {
    return this.cacheManager.getStatus();
  }
}

// Export singleton
export const categoriesService = new CategoriesService();