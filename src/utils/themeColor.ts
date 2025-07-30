export const setThemeColor = () => {
  const themeColor = import.meta.env.VITE_THEME_COLOR || '#f97316';
  const storeName = import.meta.env.VITE_NAME_STORE || 'Restaurante Ruach';
  
  console.log('🎨 Theme color from env:', themeColor);
  console.log('🏪 Store name from env:', storeName);
  
  // Establecer el color del tema
  const metaThemeColor = document.getElementById('theme-color-meta') as HTMLMetaElement;
  if (metaThemeColor) {
    metaThemeColor.setAttribute('content', themeColor);
    console.log('✅ Theme color set to:', themeColor);
  } else {
    console.warn('⚠️ Meta theme color element not found');
  }

  // Establecer el título de la página
  const titleElement = document.getElementById('text-stores') as HTMLTitleElement;
  if (titleElement && titleElement.tagName === 'TITLE') {
    titleElement.textContent = `${storeName} - Carta Digital`;
    console.log('✅ Page title set to:', `${storeName} - Carta Digital`);
  } else {
    console.warn('⚠️ Title element not found');
  }

  // Establecer Open Graph title
  const ogTitleElement = document.querySelector('meta[property="og:title"]') as HTMLMetaElement;
  if (ogTitleElement) {
    ogTitleElement.setAttribute('content', `${storeName} - Carta Digital`);
    console.log('✅ OG title set to:', `${storeName} - Carta Digital`);
  } else {
    console.warn('⚠️ OG title meta element not found');
  }

  // Establecer Open Graph description
  const ogDescElement = document.querySelector('meta[property="og:description"]') as HTMLMetaElement;
  if (ogDescElement) {
    ogDescElement.setAttribute('content', `Descubre el delicioso menú de ${storeName}. Carta digital interactiva con productos frescos y especialidades culinarias.`);
    console.log('✅ OG description updated');
  }

  // Establecer meta description
  const metaDescElement = document.querySelector('meta[name="description"]') as HTMLMetaElement;
  if (metaDescElement) {
    metaDescElement.setAttribute('content', `Descubre el delicioso menú de ${storeName}. Carta digital interactiva con productos frescos y especialidades culinarias.`);
    console.log('✅ Meta description updated');
  }
};