import { useState } from "react";
import { motion } from "framer-motion";
import {  RefreshCw } from "lucide-react";
import type { Product } from "@/types/product";
import { ProductCard } from "@/components/ProductCard";
import { CategoryFilter } from "@/components/CategoryFilter";
import { ProductDetailModal } from "@/components/ProductDetailModal";
import { useProducts } from "@/hooks/useProducts";
import type { ProductCategory } from "@/types/category";

export default function ShopPage() {
  const [selectedCategory, setSelectedCategory] =
    useState<ProductCategory>("all");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const {
    products,
    categories,
    loading,
    validCategories,
    refreshProducts,
  } = useProducts(); // 👈 Usar Google Sheets
  // const [pay, setpay] = useState(false)
  // const { cartItems, addToCart } = useCart()

  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter((product) => product.category === selectedCategory);

  // const cartItemsCount = cartItems.reduce((total, item) => total + item.quantity, 0)

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
    console.log("Holaaa", selectedProduct);
  };

  const currentCategory = categories.some((cat) => cat.id === selectedCategory)
    ? selectedCategory
    : "all";

  if (loading && products.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-yellow-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando productos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Header */}
      <motion.div
        className="relative dark:bg-black mx-auto rounded-md"
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="relative px-6 py-2">
          <div className="flex items-center justify-between">
       

        <motion.div
          className="text-center flex-1"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
            {/* <h1 className="text-xl font-boldcuale text-white/80 mb-1 tracking-wide">
            RESTAURANTE RUACH
            </h1> */}
          <div className="flex items-center justify-center  gap-2">
            <div className="bg-green-400 flex items-center p-2  gap-2 rounded-2xl">
              <div className="w-2 h-2 bg-green-700 rounded-full animate-pulse"></div>
            <span className="text-green-950 text-xs font-medium">
          Menú en tiempo real
            </span>
            </div>
          </div>
        </motion.div>

        <button
          onClick={refreshProducts}
          className="p-2 rounded-lg hover:bg-gray-800 transition-colors duration-200"
          title="Actualizar menú"
        >
          <RefreshCw
            className={`w-4 h-4 text-gray-700 ${
          loading ? "animate-spin" : ""
            }`}
          />
        </button>
          </div>
        </div>
      </motion.div>

      {/* Categories Section */}
      <div className="relative bg-white border-b border-amber-100">
        <div className="absolute inset-0 bg-gradient-to-r" />
        <motion.div
          className="relative px-6 py-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          {validCategories.length > 0 && (
            <div className="max-w-7xl mx-auto">
              {/* <div className="text-center mb-4">
                <h3 className="text-lg font-semibold text-amber-900 mb-1">
                  Categorías
                </h3>
                <div className="w-16 h-px bg-amber-300 mx-auto" />
              </div> */}
              <CategoryFilter
                selectedCategory={currentCategory}
                onCategoryChange={setSelectedCategory}
                categories={validCategories}
              />
            </div>
          )}
        </motion.div>
      </div>

      {/* Products Section */}
      <div className="relative">
        {/* Section Background */}
        <div className="absolute inset-0" />

        <motion.div
          className="relative px-6 pb-20"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          {/* Section Header */}
          <div className="text-center mb-8 pt-6">
            <motion.h2
              className="text-2xl font-bold text-amber-900 mb-2"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Nuestra Carta
            </motion.h2>
            <div className="flex items-center justify-center gap-3">
              <div className="w-12 h-px bg-gradient-to-r from-transparent to-amber-300" />
              <span className="text-amber-600 text-sm">✨</span>
              <div className="w-12 h-px bg-gradient-to-l from-transparent to-amber-300" />
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3 max-w-7xl mx-auto">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="group"
              >
                <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 group-hover:border-amber-200">
                  <ProductCard
                    product={product}
                    onProductClick={handleProductSelect}
                    index={index}
                  />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Empty State */}
          {filteredProducts.length === 0 && (
            <motion.div
              className="text-center py-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="text-6xl mb-4">🍽️</div>
              <h3 className="text-xl font-semibold text-amber-900 mb-2">
                No hay platos disponibles
              </h3>
              <p className="text-amber-700 max-w-md mx-auto">
                Lo sentimos, no encontramos platos en esta categoría. Prueba con
                otra categoría o actualiza el menú.
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}
