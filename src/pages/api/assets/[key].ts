import type { APIRoute } from 'astro';

const IMAGE_MAP: Record<string, string> = {
  'focal-character': 'https://raw.githubusercontent.com/abqoryme/astro-cv/refs/heads/main/d9538cab-db0f-491a-8c37-e422cf4fa1c6_20260513_135617_0000.png',
  'background-main': 'https://raw.githubusercontent.com/abqoryme/astro-cv/refs/heads/main/20260513_140801_0000.png'
};

// Cache untuk production (Vercel CDN akan handle sisanya)
const CACHE_CONTROL = import.meta.env.PROD
  ? 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=31536000'
  : 'no-cache';

export const GET: APIRoute = async ({ params, request }) => {
  const { key } = params;
  
  // 1. Validasi key
  if (!key || !IMAGE_MAP[key]) {
    return new Response('Image not found', { status: 404 });
  }

  // 2. Optional: Cek hanya di production, lebih flexible
  const isProduction = import.meta.env.PROD;
  if (isProduction) {
    const referer = request.headers.get('referer');
    const host = request.headers.get('host');
    const allowedDomains = [
      host,
      import.meta.env.VERCEL_URL,
      import.meta.env.PUBLIC_VERCEL_URL,
      'abqory-sky-01.vercel.app' // Tambahkan custom domain Anda
    ].filter(Boolean);
    
    if (referer && host && !allowedDomains.some(domain => referer.includes(domain || ''))) {
      // Log tapi tetap lanjut (lebih baik daripada 403)
      console.warn(`Potential hotlinking from: ${referer}`);
    }
  }

  try {
    const imageUrl = IMAGE_MAP[key];
    
    // Fetch dengan timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout
    
    const response = await fetch(imageUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Vercel-Image-Proxy/1.0'
      }
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`);
    }

    const contentType = response.headers.get('Content-Type') || 'image/png';
    const imageData = await response.arrayBuffer();

    // 3. Return dengan header yang lebih aman
    return new Response(imageData, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': CACHE_CONTROL,
        'X-Content-Type-Options': 'nosniff',
        // Lebih permisif untuk gambar
        'Content-Security-Policy': "default-src 'none'; img-src 'self' data: https:",
        'Access-Control-Allow-Origin': '*', // Izinkan cross-origin untuk gambar
        'Timing-Allow-Origin': '*'
      }
    });
  } catch (error) {
    console.error('Image Proxy Error:', error);
    
    // Return placeholder image di production
    if (import.meta.env.PROD) {
      return new Response('Image temporarily unavailable', { status: 503 });
    }
    
    return new Response(`Error loading image: ${error instanceof Error ? error.message : 'Unknown error'}`, 
      { status: 500 });
  }
};

// Optional: ISR (Incremental Static Regeneration) style caching
export const prerender = false;
