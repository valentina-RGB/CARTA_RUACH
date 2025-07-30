export const appConfig = {
  colors: {
    categories: import.meta.env.VITE_COLOR_CATEGORIES ||'#ffedd5',
    price: import.meta.env.VITE_PRICE_COLOR || '#000',
    buttonClose: import.meta.env.VITE_BUTTON_CLOSE || '#f97316',
    buttonCloseHover: import.meta.env.VITE_BUTTON_CLOSE_HOVER || '#f97316',
    theme: import.meta.env.VITE_THEME_COLOR || '#f97316'
  }
} as const;

// Hook súper simple
export const useAppConfig = () => appConfig;