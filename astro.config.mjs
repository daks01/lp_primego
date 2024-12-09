import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import vue from "@astrojs/vue";
import react from '@astrojs/react';

const siteUrlMap = {
  production: 'https://primego.online',
  staging: 'https://daks01.github.io/lp_primego',
  development: 'http://localhost:4321',
};
const siteUrl = siteUrlMap[process?.env?.NODE_ENV];

// https://astro.build/config
export default defineConfig({
  site: siteUrl,
  integrations: [
    sitemap({
        filter: (page) =>
          !page.includes('/shopcart/')
          && !page.includes('/profile/')
    }),
    vue({ include: ['**/CustomizatorApp.vue', '**/LoginForm.vue', '**/ShopCart.vue'] }),
    react({ include: ['**/react/**'] }),
  ]
});
