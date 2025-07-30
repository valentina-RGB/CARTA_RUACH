export function parsePrice(priceStr: string): number {
  if (!priceStr) return 0;
  
  const cleaned = priceStr
    .toString()
    .replace(/[\s$COPcop]/g, "")
    .replace(/(?<=\d)\.(?=\d{3}(\D|$))/g, "")
    .replace(/,/g, ".");
    
  return parseFloat(cleaned) || 0;
}

export function formatPrice(price: number, currency: string = 'COP'): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: currency,
  }).format(price);
}