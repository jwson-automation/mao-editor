// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],

  modules: ['@nuxt/eslint'],

  app: {
    head: {
      title: 'MAO - Hide & Reveal Text Editor',
      meta: [
        { name: 'description', content: 'MAO is a minimalist text editor with hide and reveal functionality. Create, edit, and manage your documents with selective text visibility.' },
        { name: 'keywords', content: 'text editor, hide text, reveal text, minimalist editor, MAO' },

        // Open Graph
        { property: 'og:type', content: 'website' },
        { property: 'og:title', content: 'MAO - Hide & Reveal Text Editor' },
        { property: 'og:description', content: 'MAO is a minimalist text editor with hide and reveal functionality. Create, edit, and manage your documents with selective text visibility.' },
        { property: 'og:image', content: '/og-image.png' },
        { property: 'og:site_name', content: 'MAO' },

        // Twitter Card
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'MAO - Hide & Reveal Text Editor' },
        { name: 'twitter:description', content: 'MAO is a minimalist text editor with hide and reveal functionality. Create, edit, and manage your documents with selective text visibility.' },
        { name: 'twitter:image', content: '/og-image.png' },

        // Viewport
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'theme-color', content: '#000000' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }
      ]
    }
  },

  runtimeConfig: {
    openaiApiKey: process.env.OPENAI_API_KEY,
    public: {
      firebase: {
        apiKey: process.env.NUXT_PUBLIC_FIREBASE_API_KEY,
        authDomain: process.env.NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.NUXT_PUBLIC_FIREBASE_PROJECT_ID,
        storageBucket: process.env.NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.NUXT_PUBLIC_FIREBASE_APP_ID,
        measurementId: process.env.NUXT_PUBLIC_FIREBASE_MEASUREMENT_ID
      }
    }
  }
})
