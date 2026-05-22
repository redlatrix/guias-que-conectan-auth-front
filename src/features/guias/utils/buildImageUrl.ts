/**
 * Construye la URL absoluta de una imagen almacenada en el core-api.
 * Si la URL ya es absoluta (http/https) la devuelve tal cual.
 */
export const buildImageUrl = (url: string): string => {
  if (url.startsWith('http')) return url;
  const base = (import.meta.env.VITE_CORE_API_URL ?? 'http://localhost:3001/api').replace(/\/api$/, '');
  return `${base}${url}`;
};
