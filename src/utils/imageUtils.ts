// Utilidad para validar y limpiar URLs de imágenes
export function validateImageUrl(url: string): string {
  try {
    // Verificar que es una URL válida
    const urlObj = new URL(url);
    
    // Si es de Unsplash, limpiar parámetros conflictivos
    if (urlObj.hostname.includes('unsplash.com')) {
      // Mantener solo parámetros esenciales
      const allowedParams = ['w', 'h', 'fit', 'crop', 'fm', 'q'];
      const cleanParams = new URLSearchParams();
      
      for (const [key, value] of urlObj.searchParams) {
        if (allowedParams.includes(key)) {
          cleanParams.set(key, value);
        }
      }
      
      // Reconstruir URL limpia
      return `${urlObj.protocol}//${urlObj.hostname}${urlObj.pathname}?${cleanParams.toString()}`;
    }
    
    return url;
  } catch (error) {
    console.warn('URL de imagen inválida:', url, error);
    // Fallback a placeholder si la URL es inválida
    return 'https://via.placeholder.com/400x400/f3f4f6/9ca3af?text=Imagen+no+disponible';
  }
}

// Función para obtener una URL optimizada para WebP
export function getOptimizedImageUrl(url: string, options: { 
  width?: number; 
  height?: number; 
  quality?: number; 
  format?: 'webp' | 'jpg' | 'png';
} = {}): string {
  const { width = 400, height = 400, quality = 80, format = 'webp' } = options;
  
  try {
    const validUrl = validateImageUrl(url);
    const urlObj = new URL(validUrl);
    
    if (urlObj.hostname.includes('unsplash.com')) {
      urlObj.searchParams.set('w', width.toString());
      urlObj.searchParams.set('h', height.toString());
      urlObj.searchParams.set('fit', 'crop');
      urlObj.searchParams.set('crop', 'center');
      urlObj.searchParams.set('fm', format);
      urlObj.searchParams.set('q', quality.toString());
      
      return urlObj.toString();
    }
    
    return validUrl;
  } catch (error) {
    console.warn('Error optimizando URL de imagen:', error);
    return validateImageUrl(url);
  }
}
