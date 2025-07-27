import { GoogleSpreadsheet } from "google-spreadsheet";
import type { Product } from "@/types/product";
import type { Category } from "@/types/category";

// REEMPLAZA CON TU ID REAL DE GOOGLE SHEETS
const SPREADSHEET_ID = "1LyOCdes0cdgrYZIGPTeeSSWiKciJfPgLYaS7Mtxda5o"; // 👈 Cambia esto por tu ID real

class SheetsService {
  private doc: GoogleSpreadsheet;

  constructor() {
    this.doc = new GoogleSpreadsheet(SPREADSHEET_ID, {
      apiKey: import.meta.env.VITE_GOOGLE_SHEETS_API_KEY,
    });
  }

  private convertDriveImageUrl(url: string): string {
    if (!url) return "/api/placeholder/300/300";

    // Si ya es un enlace directo de Drive, usar proxy
    if (url.includes("drive.google.com/uc?")) {
      const proxyUrl = `https://images.weserv.nl/?url=${encodeURIComponent(
        url
      )}&w=400&h=400&fit=cover`;
      return proxyUrl;
    }

    // Convertir enlace normal de Drive a enlace con proxy
    const match = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
    if (match) {
      const directUrl = `https://drive.google.com/uc?export=view&id=${match[1]}`;
      const proxyUrl = `https://images.weserv.nl/?url=${encodeURIComponent(
        directUrl
      )}&w=400&h=400&fit=cover`;
      return proxyUrl;
    }

    // Si es una URL completa de otra fuente, devolverla tal como está
    if (url.startsWith("http")) return url;

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

      return rows.map((row) => ({
        id: row.get("id") || "",
        name: row.get("name") || "",
        icon: row.get("icon") || "🍽️",
        color: row.get("color") || "#f97316",
        description: row.get("description") || "",
      }));
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
      // Autenticación simple usando API key pública
      await this.doc.loadInfo();
      console.log("📊 Google Sheet conectado:", this.doc.title);

      const sheet = this.doc.sheetsByTitle["Productos"] || this.doc.sheetsByIndex[0]; // Primera hoja
      await sheet.loadHeaderRow();
      const rows = await sheet.getRows();

      return rows.map((row) => ({
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
