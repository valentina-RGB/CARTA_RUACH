import { motion } from "framer-motion";

import "simplebar-react/dist/simplebar.min.css";

import type { Category, ProductCategory } from "@/types/category";
interface CategoryFilterProps {
  selectedCategory: ProductCategory;
  onCategoryChange: (category: ProductCategory) => void;
  categories: Category[];
}



export const CategoryFilter = ({
  selectedCategory,
  onCategoryChange,
  categories
}: CategoryFilterProps) => {

    if (categories.length === 0) {
    return null // No mostrar nada si no hay categorías
  }
  return (
      <div className="flex gap-3 overflow-x-auto pb-2 px-2 scrollbar-hide">
        {categories.map((category, index) => (
            <motion.button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={`flex flex-col items-center min-w-[90px] p-3 rounded-full transition-all duration-200 border  ${
                selectedCategory === category.id
                ? "bg-amber-100 text-gray-800 border-amber-50"
                : "bg-white text-gray-500  hover:bg-gray-50 hover:text-gray-700"
              }`}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              {/* Icon */}
              <div className="w-8 h-8 flex items-center justify-center mb-1">
                <span className="text-lg">{category.icon}</span>
              </div>

              {/* Category Name */}
              <span className="text-xs font-medium">
                {category.name}
              </span>

              {/* Active Indicator */}
              {selectedCategory === category.id && (
                <motion.div
                  className="mt-1 w-1 h-1 bg-orange-400 rounded-full"
                  layoutId="activeCategory"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                />
              )}
            </motion.button>
        ))}
      </div>
  );
};
