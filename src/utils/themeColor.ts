export const setThemeColor = () => {
  const themeColor = import.meta.env.VITE_THEME_COLOR || '#f97316';
  console.log(themeColor, 'theme from env');
  
  const metaThemeColor = document.getElementById('theme-color-meta') as HTMLMetaElement;
  if (metaThemeColor) {
    metaThemeColor.setAttribute('content', themeColor);
    console.log('Theme color set to:', themeColor);
  } else {
    console.warn('Meta theme color element not found');
  }
};