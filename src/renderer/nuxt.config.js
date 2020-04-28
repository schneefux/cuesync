module.exports = {
  mode: 'spa', // or 'universal'
  head: {
    title: 'vue'
  },
  loading: false,
  plugins: [
    '@/plugins/icons',
    '@/plugins/carbon',
  ],
  buildModules: [
    '@nuxt/typescript-build',
  ],
  modules: [
  ],
};
