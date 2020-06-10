const path = require('path')

module.exports = {
  mode: 'spa',
  head: {
    title: 'Cue Sync Pro'
  },
  loading: false,
  plugins: [
    '@/plugins/icons',
  ],
  buildModules: [
    '@nuxt/typescript-build',
    ['@nuxtjs/google-analytics', {
      id: 'UA-168996710-2',
    }],
  ],
  modules: [
  ],
  css: [
    '@/assets/tailwind.css',
    '@/assets/app.scss',
  ],
  build: {
    // optimize tailwind
    postcss: {
      plugins: {
        tailwindcss: {},
        autoprefixer: {},
        ...(process.env.NODE_ENV === 'production'
          ? {
              '@fullhuman/postcss-purgecss': {
                content: [
                  path.join(__dirname, './pages/**/*.vue'),
                  path.join(__dirname, './layouts/**/*.vue'),
                  path.join(__dirname, './components/**/*.vue')
                ],
                defaultExtractor: content =>
                  content.match(/[\w-/:]+(?<!:)/g) || [],
                whitelist: ['html', 'body', 'nuxt-progress']
              }
            }
          : {})
      }
    },
    // load native modules
    extend(config) {
      config.module.rules.push({
        test: /\.node$/,
        use: 'node-loader',
      })
    },
  },
};
