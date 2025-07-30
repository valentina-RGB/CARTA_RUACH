import { useState, useEffect, useMemo, useCallback } from "react";
import { loadProducts, loadCategories } from "@/services/sheetsWrapper";
import { mockProducts } from "@/data/products"; // Fallback

import type { Product } from "@/types/product";
import type { Category } from "@/types/category";

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>(mockProducts); 
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [usingSheets, setUsingSheets] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // 🆕 Limpiar caché antes de recargar
      const { sheetsService } = await import("@/data/Google_sheetService");
      sheetsService.clearAllCaches();

      const [sheetsCategories, sheetsProducts] = await Promise.all([
        loadCategories(),
        loadProducts(),
      ]);

      setCategories(sheetsCategories);
      console.log("📂 Categorías cargadas:", sheetsCategories.length);

     
      if (sheetsProducts.length > 0) {
        setProducts(sheetsProducts); // 👈 SIN filtrar aquí
        setUsingSheets(true);

    } else {
      setProducts(mockProducts); // 👈 SIN filtrar aquí tampoco
      setUsingSheets(false);
      console.log("📋 Usando productos mock (fallback)");
      }
    } catch (err) {
      setError("Error conectando con Google Sheets");
      setProducts(mockProducts); // Fallback a mock data
      setUsingSheets(false);
      console.error("❌ Error:", err);
    } finally {
      setLoading(false);
    }
  },[]);

  const getValidCategories = useMemo(() => {
    if (categories.length === 0) return [];

    const productCategories = [...new Set(products.map((p) => p.category))];

    return categories.filter(
      (category) =>
        category.id === "all" || productCategories.includes(category.id)
    );
  }, [categories, products]);

  // 🆕 Función para obtener solo productos disponibles
  const availableProducts = useMemo(() => {
    return products.filter(product => product.isAvailable === true);
  }, [products]);

  useEffect(() => {
    loadData();
  }, [loadData]); // 👈 loadData memoizado con useCallback

  return {
    products: availableProducts, // 👈 Devolver solo disponibles
    allProducts: products, // 👈 Por si necesitas todos
    categories,
    loading,
    error,
    usingSheets,
    validCategories: getValidCategories,
    refreshProducts: loadData
  };
};
