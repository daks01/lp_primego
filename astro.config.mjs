import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import vue from "@astrojs/vue";
import react from '@astrojs/react';

const siteMapUrlMap = {
  production: 'https://primego.online',
  staging: 'https://daks01.github.io/lp_primego',
  development: 'http://localhost:4321',
};
const siteUrl = siteMapUrlMap[process?.env?.NODE_ENV];
const baseUrl = process?.env?.NODE_ENV === 'staging' ? 'lp_primego' : '';

// https://astro.build/config
export default defineConfig({
  site: siteUrl,
  base: baseUrl,
  integrations: [
    sitemap({
        filter: (page) =>
          !page.includes('/shopcart/')
          && !page.includes('/profile/')
    }),
    vue({ include: ['**/CustomizatorApp.vue', '**/LoginForm.vue', '**/ShopCart.vue'] }),
    react({ include: ['**/react/**'] }),
  ],
  i18n: {
    defaultLocale: 'ru',
    locales: ['ru', 'en'],
  }
});
