import { defineConfig } from 'vite'
import { i18nHtmlPlugin } from './vite-plugin-i18n-html.js'

const LOCALE_PREFIXES = ['en', 'ja', 'ko', 'zh-TW']

export default defineConfig({
  root: '.',
  publicDir: 'public',
  plugins: [
    {
      name: 'petos-locale-dev-fallback',
      configureServer(server) {
        server.middlewares.use((req, _res, next) => {
          const url = req.url || ''
          const pathOnly = url.split('?')[0]
          const matched = LOCALE_PREFIXES.find(
            (locale) => pathOnly === `/${locale}` || pathOnly === `/${locale}/` || pathOnly === `/${locale}/index.html`
          )
          if (matched) {
            req.url = '/index.html'
          }
          next()
        })
      },
    },
    i18nHtmlPlugin(),
  ],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    assetsInlineLimit: 4096,
  },
})
