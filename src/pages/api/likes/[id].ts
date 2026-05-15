import type { APIRoute } from 'astro';

const NAMESPACE = "anime-migi-quotes";
const BASE_URL = "https://api.counterapi.dev/v1";

export const GET: APIRoute = async ({ params }) => {
  const { id } = params;
  if (!id) {
    return new Response(JSON.stringify({ error: 'Missing ID' }), { status: 400 });
  }

  try {
    const response = await fetch(`${BASE_URL}/${NAMESPACE}/${id}`);
    
    // Jika CounterAPI mengembalikan 400 atau 404, artinya record belum ada (0 likes)
    if (response.status === 400 || response.status === 404) {
      return new Response(JSON.stringify({ count: 0 }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const data = await response.json();
    return new Response(JSON.stringify(data), {
      status: 200, // Selalu kembalikan 200 jika kita berhasil memprosesnya
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch from CounterAPI' }), { status: 500 });
  }
};

export const POST: APIRoute = async ({ params }) => {
  const { id } = params;
  if (!id) {
    return new Response(JSON.stringify({ error: 'Missing ID' }), { status: 400 });
  }

  try {
    const response = await fetch(`${BASE_URL}/${NAMESPACE}/${id}/up`);
    const data = await response.json();
    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to increment via CounterAPI' }), { status: 500 });
  }
};
