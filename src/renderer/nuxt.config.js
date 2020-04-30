module.exports = {
  mode: 'spa', // or 'universal'
  head: {
    title: 'vue'
  },
  loading: false,
  plugins: [
    '@/plugins/icons',
    // '@/plugins/carbon',
  ],
  buildModules: [
    '@nuxt/typescript-build',
  ],
  modules: [
  ],
  css: [
    '@/assets/tailwind.css',
    '@/assets/app.scss',
  ],
  build: {
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
  },
};
