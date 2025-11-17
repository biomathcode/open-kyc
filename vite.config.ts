import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import { defineConfig } from 'vite'
import tsConfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'
import viteReact from '@vitejs/plugin-react'
import netlify from '@netlify/vite-plugin-tanstack-start'
// import { cloudflare } from '@cloudflare/vite-plugin'



export default defineConfig({
  server: {
    port: 3000,
  },
  plugins: [
    tailwindcss(),
    tsConfigPaths({
      projects: ['./tsconfig.json'],
    }),
    tanstackStart(),
    netlify(),
    // cloudflare({ viteEnvironment: { name: 'ssr' } }),

    viteReact(),
  ],
})
