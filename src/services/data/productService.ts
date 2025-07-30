import type { Product } from "@/types/product";

import { MemoryCache } from "../cache/MemoryCache";
import { LocalStorageCache } from "../cache/LocalStorageCache";
import { GoogleSheetsClient } from "../network/googleSheertsClient";
import { networkDetector } from "../network/networkDetector";

import { CacheManager } from "../cache/CacheManager";
import { convertDriveImageUrl } from "@/utils/converDriveUrls";
import { parsePrice } from "@/utils/parsePrices";

export class ProductService {
  private cacheManager: CacheManager<Product[]>;
  private sheetsClient: GoogleSheetsClient;
  private readonly CACHE_KEY = 'products';

  constructor() {
    // Configurar cache con múltiples providers
    this.cacheManager = new CacheManager<Product[]>(5 * 60 * 1000); // 5 minutos
    this.cacheManager.addProvider(new MemoryCache<Product[]>('Products Memory'));
    this.cacheManager.addProvider(new LocalStorageCache<Product[]>('ruach', 'Products Storage'));

    // Configurar cliente de Google Sheets
    this.sheetsClient = new GoogleSheetsClient({
      spreadsheetId: import.meta.env.VITE_SPREADSHEET_ID,
      apiKey: import.meta.env.VITE_GOOGLE_SHEETS_API_KEY,
      sheetName: "Productos",
      sheetIndex: 0
    });
  }

  async loadProducts(): Promise<Product[]> {
    try {
      // 1️⃣ Intentar cache primero
      const cached = await this.cacheManager.get(this.CACHE_KEY);
      if (cached) {
        console.log("📋 Productos cargados desde cache");
        return cached;
      }

      // 2️⃣ Verificar conectividad
      const isOnline = await networkDetector.isOnline();
      if (!isOnline) {
        console.log("🔌 Sin conexión - no hay productos en cache");
        return [];
      }

      // 3️⃣ Cargar desde Google Sheets
      console.log("🌐 Cargando productos desde Google Sheets...");
      await this.sheetsClient.connect();
      const rows = await this.sheetsClient.getSheetData();

      // 4️⃣ Transformar datos
      const products = this.transformRowsToProducts(rows);

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

  private transformRowsToProducts(rows: any[]): Product[] {
    return rows.map((row, index) => ({
      id: row.get("id") || `product-${Date.now()}-${index}`,
      name: row.get("name") || "",
      description: row.get("description") || "",
      price: parsePrice(row.get("price")) || 0,
      image: convertDriveImageUrl(row.get("image")),
      category: row.get("category") || "bread",
      weight: row.get("weight") || "100g",
      nutritionalInfo: {
        kcal: parseInt(row.get("kcal")) || 0,
        carbs: parseInt(row.get("carbs")) || 0,
        protein: parseInt(row.get("protein")) || 0,
        sugar: parseInt(row.get("sugar")) || 0,
      },
      sizes: {
        small: row.get("sizeSmall"),
        medium: row.get("sizeMedium"),
        large: row.get("sizeLarge"),
      },
      ingredients: this.parseIngredients(row.get("ingredients")),
      isAvailable: row.get("isAvailable") !== "false",
      isFeatured: row.get("isFeatured") === "true",
      originalPrice: parseFloat(row.get("originalPrice")) || undefined,
      discount: parseInt(row.get("discount")) || undefined,
    }));
  }

  private parseIngredients(ingredientsStr: string) {
    if (!ingredientsStr) return [];
    try {
      return ingredientsStr.split(",").map((ing) => ({ name: ing.trim() }));
    } catch {
      return [];
    }
  }

  async refreshProducts(): Promise<Product[]> {
    await this.cacheManager.invalidate(this.CACHE_KEY);
    return this.loadProducts();
  }

  async clearCache(): Promise<void> {
    await this.cacheManager.clear();
  }

  getCacheStatus() {
    return this.cacheManager.getStatus();
  }
}

// Export singleton
export const productService = new ProductService();