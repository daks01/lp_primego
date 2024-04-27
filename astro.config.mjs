import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import vue from "@astrojs/vue";
import env from '/src/utils/client'

const { MODE } = env;
const siteUrlMap = {
  production: 'https://primego.online',
  staging: 'https://daks01.github.io/lp_primego/',
  development: 'http://localhost:4321/',
};

// https://astro.build/config
export default defineConfig({
  site: siteUrlMap[MODE],
  integrations: [sitemap(), vue()]
});