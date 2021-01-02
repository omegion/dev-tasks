import { Configuration } from "@nuxt/types";

const config: Configuration = {
  ssr: false,
  target: "static",
  head: {
    title: "Dev Tasks",
    meta: [{ charset: "utf-8" }]
  },
  loadingIndicator: {
    name: "~/assets/loading.html",
    color: "#3755BE",
    background: "white"
  },
  buildDir: "dist/.nuxt",
  generate: { dir: "dist/renderer" },
  srcDir: "src/renderer",
  router: {
    routeNameSplitter: ".",
    linkActiveClass: "is-nuxt-link-active",
    linkExactActiveClass: "is-nuxt-link-exact-active"
  },
  css: ["~assets/scss/app.scss", "@mdi/font/css/materialdesignicons.min.css"],
  plugins: [
    { ssr: true, src: "@/plugins/event-bus.ts" },
    { ssr: true, src: "@/plugins/directives.js" },
    { ssr: true, src: "@/plugins/buefy.js" },
    { ssr: true, src: "@/plugins/filters.js" },
    { ssr: true, src: "@/plugins/jobs.ts" },
    { ssr: true, src: "@/plugins/ips-events.ts" },
    { ssr: true, src: "@/plugins/sentry.js" }
  ],
  build: {
    extend(config, { isClient }) {
      if (isClient) {
        config.target = "electron-renderer";
      }
    }
  },
  buildModules: ["@nuxtjs/composition-api", "@nuxt/typescript-build"],
  modules: ["@nuxtjs/sentry", "portal-vue/nuxt"],
  sentry: {
    dsn:
      "https://b9c8de3a859e46fbb8c2f7728c228556@o317749.ingest.sentry.io/5570497",
    config: {}
  }
};

export default config;
