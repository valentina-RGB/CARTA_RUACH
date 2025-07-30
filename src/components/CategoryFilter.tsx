import { motion } from "framer-motion";

import "simplebar-react/dist/simplebar.min.css";

import type { Category, ProductCategory } from "@/types/category";
import { useAppConfig } from "@/hooks/useAppConfig";
interface CategoryFilterProps {
  selectedCategory: ProductCategory;
  onCategoryChange: (category: ProductCategory) => void;
  categories: Category[];
}

export const CategoryFilter = ({
  selectedCategory,
  onCategoryChange,
  categories,
}: CategoryFilterProps) => {
  const config = useAppConfig();
  if (categories.length === 0) {
    return null; // No mostrar nada si no hay categorías
  }

  return (
    <div className="flex gap-3 overflow-x-auto pb-2 px-2 scrollbar-hide">
      {categories.map((category, index) => {
        const isSelected = selectedCategory === category.id;

        return (
         <motion.button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={`flex flex-col items-center min-w-[90px] p-3 rounded-full transition-all duration-200 border ${
              isSelected
                ? "text-gray-800 border-amber-50"
                : "bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-700"
            }`}
            style={{
              backgroundColor: isSelected ? config.colors.categories : undefined,
            }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            aria-label={`Filtrar por categoría ${category.name}`} // 👈 Accesibilidad mejorada
          >
            {/* Icon */}
            <div className="w-8 h-8 flex items-center justify-center mb-1">
              <span>
                {category.icon &&
                  (typeof category.icon === "string" ? (
                    category.icon.includes("<svg") ? (
                      <div 
                        dangerouslySetInnerHTML={{ __html: category.icon }}
                        aria-hidden="true" // 👈 Ocultar del lector de pantalla
                      />
                    ) : category.icon.match(/\.(png|jpg|jpeg|gif|webp)$/i) ||
                      category.icon.includes("drive.google.com") ? (
                      <img
                        src={category.icon}
                        alt="" // 👈 ALT VACÍO - la imagen es decorativa
                        className="w-full h-full object-contain"
                        aria-hidden="true" // 👈 Ocultar del lector de pantalla
                      />
                    ) : (
                      <span aria-hidden="true">{category.icon}</span> // 👈 Para emojis
                    )
                  ) : (
                    <span aria-hidden="true">{category.icon}</span>
                  ))}
              </span>
            </div>

            {/* Category Name */}
            <span className="text-xs font-medium">{category.name}</span>

            {/* Active Indicator */}
            {isSelected && (
              <motion.div
                className="mt-1 w-1 h-1 rounded-full bg-amber-500"
                layoutId="activeCategory"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                aria-hidden="true" // 👈 Indicador visual, no necesario para lectores
              />
            )}
          </motion.button>
        );
      })}
    </div>
  );
};
