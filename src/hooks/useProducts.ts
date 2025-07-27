import { useState, useEffect, useMemo, useCallback } from "react";
import { sheetsService } from "@/data/Google_sheetService";
import { mockProducts } from "@/data/products"; // Fallback
import type { Product } from "@/types/product";
import type { Category } from "@/types/category";

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>(mockProducts); // Empezar con mock data
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [usingSheets, setUsingSheets] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [sheetsCategories, sheetsProducts] = await Promise.all([
        sheetsService.loadCategories(),
        sheetsService.loadProducts(),
      ]);

      setCategories(sheetsCategories);
      console.log("📂 Categorías cargadas:", sheetsCategories.length);

      if (sheetsProducts.length > 0) {
        setProducts(sheetsProducts);
        setUsingSheets(true);
        console.log(
          "✅ Productos cargados desde Google Sheets:",
          sheetsProducts.length
        );
      } else {
        setProducts(mockProducts);
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

  // Solo cargar una vez al montar el componente
  useEffect(() => {
    loadData();
  }, [loadData]); // 👈 loadData memoizado con useCallback

  return {
    products,
    categories,
    loading,
    error,
    usingSheets,
    validCategories: getValidCategories,
    refreshProducts: loadData, // 👈 Manual refresh cuando lo necesites
  };
};
