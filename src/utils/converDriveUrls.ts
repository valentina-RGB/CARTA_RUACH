export function convertDriveImageUrl(url: string): string {
  if (!url) return "/api/placeholder/300/300";

  if (url.includes("drive.google.com/uc?")) {
    return createProxyUrl(url);
  }

  const match = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
  if (match) {
    const directUrl = `https://drive.google.com/uc?export=view&id=${match[1]}`;
    return createProxyUrl(directUrl);
  }

  if (url.startsWith("http")) {
    return createProxyUrl(url);
  }

  return url;
}

function createProxyUrl(url: string): string {
  return `https://images.weserv.nl/?url=${encodeURIComponent(
    url
  )}&w=400&h=400&fit=cover&q=80&output=webp`;
}