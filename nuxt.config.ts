export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss', 'shadcn-nuxt', '@prisma/nuxt'],
  devtools: { enabled: true },
  shadcn: {
    /**
     * Prefix for all the imported component
     */
    prefix: '',
    /**
     * Directory that the component lives in.
     * @default "./components/ui"
     */
    componentDir: './components/ui'
  },
  routeRules: {
    '/': { redirect: '/login-register/login' }
  },
  compatibilityDate: '2024-09-23',

});
