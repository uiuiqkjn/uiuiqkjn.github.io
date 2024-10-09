import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";
import remarkToc from "remark-toc";
import remarkCollapse from "remark-collapse";
import sitemap from "@astrojs/sitemap";
import { SITE } from "./src/config";
import compress from "astro-compress";
import vercel from "@astrojs/vercel/serverless";

export default defineConfig({
  site: SITE.website,
  integrations: [
    tailwind({
      config: {
        applyBaseStyles: false,
      },
    }),
    react(),
    sitemap(),
    // compress({
    //   exclude: [
    //     '_astro/404.efe3fc71.css',
    //     '_astro/_slug_.3b14054e.css',
    //     '_astro/_slug_.40cf44c5.css',
    //     '_astro/_slug_.41a32359.css',
    //     '_astro/_slug_.906d67ca.css',
    //     '_astro/about.22a3dfca.css',
    //     '_astro/about.6e6daff0.css',
    //     '_astro/index.4cf1643e.css',
    //     'Scheme初探.svg'
    //   ],
    // }),
  ],
  markdown: {
    remarkPlugins: [
      remarkToc,
      [
        remarkCollapse,
        {
          test: "Table of contents",
        },
      ],
    ],
    shikiConfig: {
      theme: "one-dark-pro",
      wrap: true,
    },
    extendDefaultPlugins: true,
  },
  vite: {
    optimizeDeps: {
      exclude: ["@resvg/resvg-js"],
    },
  },
  output: "hybrid",
  adapter: vercel({
    analytics: true,
  }),
});
