export function isExternalLink(url: string | null | undefined): boolean {
  if (!url) return false;
  return url.startsWith("http://") || 
         url.startsWith("https://") || 
         url.startsWith("mailto:") || 
         url.startsWith("tel:");
}
