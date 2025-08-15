export function getPrimaryImageSrc(srcsets:{avif:string; webp:string; jpg:string}): string {
  const candidate = srcsets.jpg || srcsets.webp || srcsets.avif || '';
  if (!candidate) return '';
  const first = candidate.split(',')[0].trim().split(' ')[0];
  return first;
}
