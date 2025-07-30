import { GoogleSpreadsheet } from "google-spreadsheet";
import type { Product } from "@/types/product";
import type { Category } from "@/types/category";

// REEMPLAZA CON TU ID REAL DE GOOGLE SHEETS
const SPREADSHEET_ID = import.meta.env.VITE_SPREADSHEET_ID; // 👈 Cambia esto por tu ID real

class SheetsService {
  private doc: GoogleSpreadsheet;
  private productsCache: { data: Product[], timestamp: number } | null = null;
  private categoriesCache: { data: Category[], timestamp: number } | null = null;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

 // 🔄 NUEVO: Cache offline localStorage
  private readonly OFFLINE_CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 días
  private readonly PRODUCTS_STORAGE_KEY = 'products_offline';
  private readonly CATEGORIES_STORAGE_KEY = 'categories_offline';

  constructor() {
    this.doc = new GoogleSpreadsheet(SPREADSHEET_ID, {
      apiKey: import.meta.env.VITE_GOOGLE_SHEETS_API_KEY,
    });
  }

  private isCacheValid(cache: { timestamp: number } | null): boolean {
    if (!cache) return false;
    return Date.now() - cache.timestamp < this.CACHE_DURATION;
  }

  
  // 🔄 NUEVO: Verificar cache offline
  private isOfflineCacheValid(cache: { timestamp: number } | null): boolean {
    if (!cache) return false;
    return Date.now() - cache.timestamp < this.OFFLINE_CACHE_DURATION;
  }

   // 🔄 NUEVO: Cargar desde localStorage
  private loadFromOfflineCache<T>(storageKey: string): T[] | null {
    try {
      const stored = localStorage.getItem(storageKey);
      if (!stored) return null;

      const parsed = JSON.parse(stored);
      if (this.isOfflineCacheValid(parsed)) {
        console.log(`💾 Cache offline válido (${storageKey})`);
        return parsed.data;
      } else {
        console.log(`🗑️ Cache offline expirado (${storageKey})`);
        localStorage.removeItem(storageKey);
        return null;
      }
    } catch (error) {
      console.error(`❌ Error en cache offline (${storageKey}):`, error);
      localStorage.removeItem(storageKey);
      return null;
    }
  }

   // 🔄 NUEVO: Guardar en localStorage
  private saveToOfflineCache<T>(data: T[], storageKey: string): void {
    try {
      const dataToStore = {
        data,
        timestamp: Date.now()
      };
      localStorage.setItem(storageKey, JSON.stringify(dataToStore));
      console.log(`💾 Guardado en cache offline (${storageKey})`);
    } catch (error) {
      console.error(`❌ Error guardando cache offline (${storageKey}):`, error);
    }
  }

  // 🔄 NUEVO: Detectar conexión
  private async isOnline(): Promise<boolean> {
    if (!navigator.onLine) return false;
    
    try {
       await fetch('https://www.google.com/favicon.ico', {
        method: 'HEAD',
        mode: 'no-cors',
        cache: 'no-cache'
      });
      return true;
    } catch {
      return false;
    }
  }

  private convertDriveImageUrl(url: string): string {
    if (!url) return "/api/placeholder/300/300";

    // Si ya es un enlace directo de Drive, usar proxy optimizado
    if (url.includes("drive.google.com/uc?")) {
      const proxyUrl = `https://images.weserv.nl/?url=${encodeURIComponent(
        url
      )}&w=400&h=400&fit=cover&q=80&output=webp`;
      return proxyUrl;
    }

    // Convertir enlace normal de Drive a enlace con proxy optimizado
    const match = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
    if (match) {
      const directUrl = `https://drive.google.com/uc?export=view&id=${match[1]}`;
      const proxyUrl = `https://images.weserv.nl/?url=${encodeURIComponent(
        directUrl
      )}&w=400&h=400&fit=cover&q=80&output=webp`;
      return proxyUrl;
    }

    // Si es una URL completa de otra fuente, usar proxy también
    if (url.startsWith("http")) {
      const proxyUrl = `https://images.weserv.nl/?url=${encodeURIComponent(
        url
      )}&w=400&h=400&fit=cover&q=80&output=webp`;
      return proxyUrl;
    }

    // Si es una ruta relativa, devolverla tal como está
    return url;
  }

  private parsePrice(priceStr: string): number {
    if (!priceStr) return 0;
    // Eliminar cualquier símbolo de peso colombiano y espacios, pero conservar punto o coma decimal
    const cleaned = priceStr
      .toString()
      .replace(/[\s$COPcop]/g, "") // quita espacios, $, COP, cop
      .replace(/(?<=\d)\.(?=\d{3}(\D|$))/g, "") // elimina puntos de miles, deja decimales
      .replace(/,/g, "."); // cambia coma por punto decimal
    return parseFloat(cleaned) || 0;
  }

  async loadCategories(): Promise<Category[]> {
    try {

      const online = await this.isOnline();

      if (!online) {
        console.log("🔌 Sin internet - intentando cache offline...");
        const offlineData = this.loadFromOfflineCache<Category>(this.CATEGORIES_STORAGE_KEY);
        if (offlineData) {
          this.categoriesCache = { data: offlineData, timestamp: Date.now() };
          return offlineData;
        } else {
          console.log("⚠️ No hay cache offline, usando categorías por defecto");
          return this.getDefaultCategories();
        }
      }

      await this.doc.loadInfo();

      console.log("📊 Google Sheet conectado:", this.doc.title);

      // Buscar la hoja de categorías (puede ser por nombre o índice)
      const categorySheet =
        this.doc.sheetsByTitle["Categorías"] || this.doc.sheetsByIndex[1];

        if (!categorySheet) {
        console.log("⚠️ No se encontró hoja de categorías, usando categorías por defecto");
        const defaultCategories = this.getDefaultCategories();
        this.saveToOfflineCache(defaultCategories, this.CATEGORIES_STORAGE_KEY); // 🔄 NUEVO
        return defaultCategories;
      }

      await categorySheet.loadHeaderRow();
      const rows = await categorySheet.getRows();

      console.log("📂 Categorías encontradas:", rows.length);

      if (rows.length === 0) {
         const defaultCategories = this.getDefaultCategories();
        this.saveToOfflineCache(defaultCategories, this.CATEGORIES_STORAGE_KEY); // 🔄 NUEVO
        return defaultCategories;
      }

      const categories = rows.map((row, index) => ({
        id: row.get("id") || `category-${Date.now()}-${index}`,
        name: row.get("name") || "",
        icon: this.convertDriveImageUrl(row.get("icon")) || "🍽️",
        color: row.get("color") || "#f97316",
        description: row.get("description") || "",
      }));

      // Guardar en cache
      this.categoriesCache = {
        data: categories,
        timestamp: Date.now()
      };
       this.saveToOfflineCache(categories, this.CATEGORIES_STORAGE_KEY); // 🔄 NUEVO

      return categories;
    } catch (error) {
           // 🔄 NUEVO: Fallback a cache offline
      const offlineData = this.loadFromOfflineCache<Category>(this.CATEGORIES_STORAGE_KEY);
      if (offlineData) {
        console.log("🔄 Usando cache offline como fallback");
        return offlineData;
      }
      return this.getDefaultCategories();

    }
  }

  private getDefaultCategories(): Category[] {
    return [
      {
        id: "all",
        name: "Todos",
        icon: "🍽️",
        color: "#f97316",
        description: "Todos los productos",
      },
    ];
  }

  //PRODUCT
  async loadProducts(): Promise<Product[]> {
    try {
      // Verificar cache primero
      if (this.isCacheValid(this.productsCache)) {
        console.log("📋 Usando productos desde cache");
        return this.productsCache!.data;
      }

       const online = await this.isOnline();
      
      if (!online) {
        console.log("🔌 Sin internet - intentando cache offline...");
        const offlineData = this.loadFromOfflineCache<Product>(this.PRODUCTS_STORAGE_KEY);
        if (offlineData) {
          this.productsCache = { data: offlineData, timestamp: Date.now() };
          return offlineData;
        } else {
          console.log("⚠️ No hay cache offline de productos");
          return [];
        }
      }

      // Autenticación simple usando API key pública
      await this.doc.loadInfo();
      console.log("📊 Google Sheet conectado:", this.doc.title);

      const sheet = this.doc.sheetsByTitle["Productos"] || this.doc.sheetsByIndex[0]; // Primera hoja
      await sheet.loadHeaderRow();
      const rows = await sheet.getRows();

      const products = rows.map((row, index) => ({
        id: row.get("id") || `product-${Date.now()}-${index}`,
        name: row.get("name") || "",
        description: row.get("description") || "",
        price: this.parsePrice(row.get("price")) || 0,
        image: this.convertDriveImageUrl(row.get("image")),
        category: (row.get("category") as any) || "bread",
        weight: row.get("weight") || "100g",
        nutritionalInfo: {
          kcal: parseInt(row.get("kcal")) || 0,
          carbs: parseInt(row.get("carbs")) || 0,
          protein: parseInt(row.get("protein")) || 0,
          sugar: parseInt(row.get("sugar")) || 0,
        },
        sizes:{
            small: row.get("sizeSmall") ,
            medium: row.get("sizeMedium") ,
            large: row.get("sizeLarge") ,
        },
        ingredients: this.parseIngredients(row.get("ingredients")),
        isAvailable: this.parseAvailability(row.get("isAvailable")),
        isFeatured: row.get("isFeatured") === "true",
        originalPrice: parseFloat(row.get("originalPrice")) || undefined,
        discount: parseInt(row.get("discount")) || undefined,
      }));

      // Guardar en cache
      this.productsCache = {
        data: products,
        timestamp: Date.now()
      };
       this.saveToOfflineCache(products, this.PRODUCTS_STORAGE_KEY); // 🔄 NUEVO

      return products;
    } catch (error) {
       // 🔄 NUEVO: Fallback a cache offline
      const offlineData = this.loadFromOfflineCache<Product>(this.PRODUCTS_STORAGE_KEY);
      if (offlineData) {
        console.log("🔄 Usando cache offline como fallback");
        return offlineData;
      }
      return [];
    }
  }


   private parseIngredients(ingredientsStr: string) {
    if (!ingredientsStr) return [];
    try {
      return ingredientsStr.split(",").map((ing) => ({ name: ing.trim() }));
    } catch {
      return [];
    }
  }

  private parseAvailability(availabilityStr: string): boolean {
    if (!availabilityStr) return true; // Por defecto disponible si está vacío
    
    const cleaned = availabilityStr.toString().toLowerCase().trim();
    
    console.log('🔍 parseAvailability - Valor original:', availabilityStr);
    console.log('🔍 parseAvailability - Valor limpio:', cleaned);
    
    // Valores que significan NO disponible
    const falseValues = ['false', 'no', '0', 'off', 'disabled', 'unavailable'];
    
    const isNotAvailable = falseValues.some(falseVal => cleaned === falseVal);
    
    return !isNotAvailable;
  }

   clearAllCaches(): void {
    this.productsCache = null;
    this.categoriesCache = null;
    localStorage.removeItem(this.PRODUCTS_STORAGE_KEY);
    localStorage.removeItem(this.CATEGORIES_STORAGE_KEY);
    console.log("🗑️ Todos los caches limpiados");
  }

  getCacheStatus() {
    return {
      memory: {
        products: this.productsCache ? this.isCacheValid(this.productsCache) : false,
        categories: this.categoriesCache ? this.isCacheValid(this.categoriesCache) : false
      },
      offline: {
        products: !!this.loadFromOfflineCache<Product>(this.PRODUCTS_STORAGE_KEY),
        categories: !!this.loadFromOfflineCache<Category>(this.CATEGORIES_STORAGE_KEY)
      },
      online: navigator.onLine
    };
  }

 
}



export const sheetsService = new SheetsService();
