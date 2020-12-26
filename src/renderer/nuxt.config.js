/**
 * By default, Nuxt.js is configured to cover most use cases.
 * This default configuration can be overwritten in this file
 * @link {https://nuxtjs.org/guide/configuration/}
 */

module.exports = {
  ssr: false,
  head: {
    title: 'Dev Tasks',
    meta: [{ charset: 'utf-8' }]
  },
  loading: false,
  router: {
    routeNameSplitter: '.',
    linkActiveClass: 'is-nuxt-link-active',
    linkExactActiveClass: 'is-nuxt-link-exact-active'
  },
  css: ['~assets/scss/app.scss', '@mdi/font/css/materialdesignicons.min.css'],
  plugins: [
    { ssr: true, src: '@/plugins/directives.js' },
    { ssr: true, src: '@/plugins/buefy.js' },
    { ssr: true, src: '@/plugins/filters.js' },
    { ssr: true, src: '@/plugins/jobs.js' },
    { ssr: true, src: '@/plugins/ips-renderer.js' },
    { ssr: true, src: '@/plugins/sentry.js' }
  ],
  buildModules: ['@nuxtjs/composition-api', '@nuxt/typescript-build'],
  modules: ['@nuxtjs/sentry'],
  sentry: {
    dsn:
      'https://b9c8de3a859e46fbb8c2f7728c228556@o317749.ingest.sentry.io/5570497',
    config: {}
  }
}
