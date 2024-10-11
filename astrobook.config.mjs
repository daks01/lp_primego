import { defineConfig } from 'astro/config';
import vue from "@astrojs/vue";
import astrobook from "astrobook";

export default defineConfig({
  integrations: [
    vue(),
    astrobook({
      directory: 'astrobook',
    }),
  ]
});