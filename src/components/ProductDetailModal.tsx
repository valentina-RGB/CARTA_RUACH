import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import { X } from "@/common/ui/icons";
import { Badge } from "@/common/ui/badge";
import type { Product } from "@/types/product";
import { useAppConfig } from "@/hooks/useAppConfig";

interface ProductDetailModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart?: (product: Product, quantity: number) => void;
}

export const ProductDetailModal = ({
  product,
  isOpen,
  onClose,
}: ProductDetailModalProps) => {

    const config = useAppConfig();

    console.log(config, 'color obton')

  // 🔥 Hook para interceptar el botón "atrás" en móviles
  useEffect(() => {
    if (!isOpen) return;

    // Cuando se abre el modal, agregar una entrada al historial
    const handleBackButton = () => {
      onClose(); // Cerrar modal en lugar de salir de la página
    };

    // Agregar entrada ficticia al historial cuando se abre el modal
    window.history.pushState({ modalOpen: true }, "", window.location.href);

    // Escuchar el evento "popstate" (botón atrás)
    window.addEventListener("popstate", handleBackButton);

    // Cleanup: remover el listener cuando se cierre el modal
    return () => {
      window.removeEventListener("popstate", handleBackButton);
    };
  }, [isOpen, onClose]);

  // 🔥 Función para cerrar modal (limpia historial)
  const handleClose = () => {
    // Si hay una entrada de modal en el historial, ir atrás para limpiarla
    if (window.history.state?.modalOpen) {
      window.history.back();
    } else {
      onClose();
    }
  };
  
  // Función para formatear precios colombianos
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price)
  }

  // Función para obtener los tamaños disponibles dinámicamente
  const getAvailableSizes = () => {
    if (!product.sizes) return []
    
    const sizeArray = []
    
    if (product.sizes.small) {
      sizeArray.push({ 
        name: 'Pequeño', 
        value: product.sizes.small,
        key: 'small'
      })
    }
    
    if (product.sizes.medium) {
      sizeArray.push({ 
        name: 'Mediano', 
        value: product.sizes.medium,
        key: 'medium'
      })
    }
    
    if (product.sizes.large) {
      sizeArray.push({ 
        name: 'Grande', 
        value: product.sizes.large,
        key: 'large'
      })
    }
    
    return sizeArray
  }

  // Función para verificar si hay información nutricional válida
  const hasNutritionalInfo = () => {
    if (!product.nutritionalInfo) return false
    
    const { kcal, carbs, protein, sugar } = product.nutritionalInfo
    
    // Verificar que al menos uno de los valores sea mayor a 0
    return kcal > 0 || carbs > 0 || protein > 0 || sugar > 0
  }

  const availableSizes = getAvailableSizes()

  // Función para determinar las columnas del grid según cantidad de tamaños
  const getGridCols = (count: number) => {
    switch (count) {
      case 1: return 'grid-cols-1'
      case 2: return 'grid-cols-2'
      case 3: return 'grid-cols-3'
      default: return 'grid-cols-3'
    }
  }

  return (
    <AnimatePresence >
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 bg-black/50 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 h-full max-h-[90vh] overflow-hidden"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <div className="relative h-full flex flex-col">
              {/* Header */}
              <div className="flex justify-between items-center p-4 border-b">
                <motion.button
                  onClick={handleClose}
                  className="p-2 hover:bg-gray-100 rounded-full"
                  whileTap={{ scale: 0.95 }}
                >
                  <X className="h-5 w-5" />
                </motion.button>
                <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto" />
                <div className="w-8" />
              </div>

              {/* Content - Scrollable */}
              <div className="flex-1 overflow-y-auto">
                <div className="p-6">
                  {/* Product Image */}
                  <motion.div
                    className="relative mx-auto w-64 h-64 mb-6"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover rounded-3xl shadow-2xl"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = 'https://via.placeholder.com/400x400/f97316/ffffff?text=' + encodeURIComponent(product.name.slice(0, 10))
                      }}
                    />
                    {product.discount && product.discount > 0 && (
                      <Badge className="absolute top-4 right-4 bg-red-500 text-white">
                        {product.discount}% OFF
                      </Badge>
                    )}
                    {product.isFeatured && (
                      <Badge className="absolute top-4 left-4 bg-yellow-500 text-black">
                        ⭐ Destacado
                      </Badge>
                    )}
                  </motion.div>

                  {/* Product Info */}
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-6"
                  >
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        {product.name}
                      </h1>

                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-2xl font-bold text-orange-500">
                         {product.price === 0? "": formatPrice(product.price)}
                        </span>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <span className="text-lg text-gray-500 line-through">
                            {formatPrice(product.originalPrice)}
                          </span>
                        )}
                        {/* <span className="text-sm text-gray-500 ml-auto">
                          {product.weight}
                        </span> */}
                      </div>
                    </div>

                    {/* Description */}
                    {product.description && (
                      <div>
                        <p className="text-gray-700 leading-relaxed">
                          {product.description}
                        </p>
                      </div>
                    )}

                    {/* Sizes - Solo mostrar si existen */}
                    {availableSizes.length > 0 && (
                      <div>
                        <h3 className="text-lg font-bold text-gray-800 mb-3 text-center">
                          Tamaños Disponibles
                        </h3>
                        <div className={`grid ${getGridCols(availableSizes.length)} gap-3`}>
                          {availableSizes.map((size, index) => (
                            <motion.div
                              key={size.key}
                              className="text-center p-4 border-2 border-orange-200 rounded-xl bg-orange-50 hover:bg-orange-100 transition-colors"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.3 + (index * 0.1) }}
                              whileHover={{ scale: 1.05 }}
                            >
                              <div className="text-sm font-bold text-orange-600 mb-1">
                                {size.name}
                              </div>
                              <div className="text-lg font-semibold text-gray-900">
                                {formatPrice(Number(size.value))}
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Ingredientes - Solo mostrar si existen */}
                    {product.ingredients && product.ingredients.length > 0 && (
                      <div>
                        <h3 className="text-lg font-bold text-gray-800 mb-3 text-center">
                          Ingredientes
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                          {product.ingredients.map((ingredient, index) => (
                            <motion.div
                              key={ingredient.name || index}
                              className="text-center p-3 border border-gray-200 rounded-xl bg-gray-50"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.4 + (index * 0.05) }}
                              whileHover={{ scale: 1.02 }}
                            >
                              <div className="text-sm font-medium text-gray-900">
                                {ingredient.name}
                              </div>
                              {ingredient.quantity && (
                                <div className="text-xs text-gray-500 mt-1">
                                  {ingredient.quantity}
                                </div>
                              )}
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Nutritional Info - Solo mostrar si hay datos válidos */}
                    {hasNutritionalInfo() && (
                      <div>
                        <h3 className="text-lg font-bold text-gray-800 mb-3 text-center">
                          Información Nutricional
                        </h3>
                        <div className="grid grid-cols-4 gap-3">
                          {product.nutritionalInfo && product.nutritionalInfo.kcal > 0 && (
                            <div className="text-center p-3 bg-blue-50 w-fit rounded-xl">
                              <div className="text-xs text-blue-600 font-medium">Calorías</div>
                              <div className="text-lg font-bold text-blue-800">{product.nutritionalInfo.kcal}</div>
                            </div>
                          )}
                          {product.nutritionalInfo && product.nutritionalInfo.carbs > 0 && (
                            <div className="text-center p-3 bg-green-50  w-fit  rounded-xl">
                              <div className="text-xs text-green-600 font-medium">Carbos</div>
                              <div className="text-lg font-bold text-green-800">{product.nutritionalInfo.carbs}g</div>
                            </div>
                          )}
                          {product.nutritionalInfo && product.nutritionalInfo.protein > 0 && (
                            <div className="text-center p-3 bg-purple-50  w-fit  rounded-xl">
                              <div className="text-xs text-purple-600 font-medium">Proteína</div>
                              <div className="text-lg font-bold text-purple-800">{product.nutritionalInfo.protein}g</div>
                            </div>
                          )}
                          {product.nutritionalInfo && product.nutritionalInfo.sugar > 0 && (
                            <div className="text-center p-3 bg-pink-50  w-fit  rounded-xl">
                              <div className="text-xs text-pink-600 font-medium">Azúcar</div>
                              <div className="text-lg font-bold text-pink-800">{product.nutritionalInfo.sugar}g</div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </motion.div>
                </div>
              </div>

              {/* Footer - Fijo en la parte inferior */}
              <motion.div
                className="bg-white border-t p-4"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex items-center justify-center">
                  <motion.button
                    onClick={handleClose}
                    className={`hover:bg-purple-50 text-white px-8 py-3 rounded-full font-medium transition-colors`}
                    whileTap={{ scale: 0.98 }}
                    style={{
                      background:config.colors.buttonClose
                    }}
                  >
                    Cerrar
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};