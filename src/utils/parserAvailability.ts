
 export const parseAvailability = (availabilityStr: string): boolean => {
    if (!availabilityStr) return true; // Por defecto disponible si está vacío
    
    const cleaned = availabilityStr.toString().toLowerCase().trim();
    
    console.log('🔍 parseAvailability - Valor original:', availabilityStr);
    console.log('🔍 parseAvailability - Valor limpio:', cleaned);
    
    // Valores que significan NO disponible
    const falseValues = ['false', 'no', '0', 'off', 'disabled', 'unavailable'];
    
    const isNotAvailable = falseValues.some(falseVal => cleaned === falseVal);
    
    return !isNotAvailable;
  }
  