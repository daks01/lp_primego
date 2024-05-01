import type { APIRoute } from 'astro';
import env from './../utils/client'

const isProduction = env.PROD;

const robotsTxt = `
User-agent: *
${isProduction ? 'Allow: /' : 'Disallow: /'}

Sitemap: ${new URL('sitemap-index.xml', import.meta.env.SITE).href}
`.trim();

export const GET: APIRoute = () => {
  return new Response(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
};