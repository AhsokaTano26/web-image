export default defineNuxtConfig({
  devtools: { enabled: false },
  modules: ['@nuxt/image', '@nuxtjs/tailwindcss'],
  image: {
    provider: 'ipx',
    dir: 'public'
  }
})