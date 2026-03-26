import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  app: {
    head: {
      title: 'AuroraHome - Achetez Aurora One',
      link: [
        { rel: 'icon', type: 'image/png', href: '/logo.png' },
      ],
      script: [
        { src: 'https://unpkg.com/@phosphor-icons/web', defer: true },
      ],
    },
  },
  srcDir: '.',
  modules: ['@pinia/nuxt', '@nuxt/eslint'],
  css: ['~/assets/css/main.css'],
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      include: [
        'three',
        'three/examples/jsm/loaders/OBJLoader.js',
        'three/examples/jsm/controls/OrbitControls.js',
        'three/examples/jsm/exporters/GLTFExporter.js',
        '@vue/devtools-core',
        '@vue/devtools-kit',
      ],
    },
  },
  runtimeConfig: {
    stripeSecretKey: process.env.STRIPE_SECRET_KEY ?? '',
    public: {
      stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY ?? '',
    },
  },
  nitro: {
    externals: {
      external: ['better-sqlite3'],
    },
  },
  typescript: {
    strict: true,
  },
})
