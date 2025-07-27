import { GoogleSpreadsheet } from "google-spreadsheet";
import type { Product } from "@/types/product";
import type { Category } from "@/types/category";

// REEMPLAZA CON TU ID REAL DE GOOGLE SHEETS
const SPREADSHEET_ID = "1LyOCdes0cdgrYZIGPTeeSSWiKciJfPgLYaS7Mtxda5o"; // 👈 Cambia esto por tu ID real

class SheetsService {
  private doc: GoogleSpreadsheet;
  private productsCache: { data: Product[], timestamp: number } | null = null;
  private categoriesCache: { data: Category[], timestamp: number } | null = null;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

  constructor() {
    this.doc = new GoogleSpreadsheet(SPREADSHEET_ID, {
      apiKey: import.meta.env.VITE_GOOGLE_SHEETS_API_KEY,
    });
  }

  private isCacheValid(cache: { timestamp: number } | null): boolean {
    if (!cache) return false;
    return Date.now() - cache.timestamp < this.CACHE_DURATION;
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
      // Verificar cache primero
      if (this.isCacheValid(this.categoriesCache)) {
        console.log("📋 Usando categorías desde cache");
        return this.categoriesCache!.data;
      }

      await this.doc.loadInfo();

      console.log("📊 Google Sheet conectado:", this.doc.title);

      // Buscar la hoja de categorías (puede ser por nombre o índice)
      const categorySheet =
        this.doc.sheetsByTitle["Categorías"] || this.doc.sheetsByIndex[1];

      if (!categorySheet) {
        console.log(
          "⚠️ No se encontró hoja de categorías, usando categorías por defecto"
        );
        return this.getDefaultCategories();
      }

      await categorySheet.loadHeaderRow();
      const rows = await categorySheet.getRows();

      console.log("📂 Categorías encontradas:", rows.length);

      if (rows.length === 0) {
        return this.getDefaultCategories();
      }

      const categories = rows.map((row) => ({
        id: row.get("id") || "",
        name: row.get("name") || "",
        icon: row.get("icon") || "🍽️",
        color: row.get("color") || "#f97316",
        description: row.get("description") || "",
      }));

      // Guardar en cache
      this.categoriesCache = {
        data: categories,
        timestamp: Date.now()
      };

      return categories;
    } catch (error) {
      console.error("❌ Error loading categories from Google Sheets:", error);
      return this.getDefaultCategories();
    }
  }

  private getDefaultCategories(): Category[] {
    return [
      {
        id: "all",
        name: "Todo",
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

      // Autenticación simple usando API key pública
      await this.doc.loadInfo();
      console.log("📊 Google Sheet conectado:", this.doc.title);

      const sheet = this.doc.sheetsByTitle["Productos"] || this.doc.sheetsByIndex[0]; // Primera hoja
      await sheet.loadHeaderRow();
      const rows = await sheet.getRows();

      const products = rows.map((row) => ({
        id: row.get("id") || Date.now().toString(),
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
        isAvailable: row.get("isAvailable") !== "false",
        isFeatured: row.get("isFeatured") === "true",
        originalPrice: parseFloat(row.get("originalPrice")) || undefined,
        discount: parseInt(row.get("discount")) || undefined,
      }));

      // Guardar en cache
      this.productsCache = {
        data: products,
        timestamp: Date.now()
      };

      return products;
    } catch (error) {
      console.error("Error loading from Google Sheets:", error);
      // Fallback a datos mock si falla
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
}

export const sheetsService = new SheetsService();
