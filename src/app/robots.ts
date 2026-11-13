import type { MetadataRoute } from 'next';
import { indexavel, urlSite } from '@/lib/ambiente';

// Exportação estática: o arquivo sai como out/robots.txt no build.
export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  if (!indexavel()) {
    return { rules: { userAgent: '*', disallow: '/' } };
  }
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${urlSite()}/sitemap.xml`,
  };
}
