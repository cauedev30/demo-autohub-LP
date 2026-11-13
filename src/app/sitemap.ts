import type { MetadataRoute } from 'next';
import { indexavel, urlSite } from '@/lib/ambiente';

// Exportação estática: o arquivo sai como out/sitemap.xml no build.
export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  // Fora do modo indexável o sitemap fica vazio: não lista uma página que pede para não aparecer na busca.
  if (!indexavel()) return [];
  return [{ url: `${urlSite()}/`, changeFrequency: 'monthly', priority: 1 }];
}
