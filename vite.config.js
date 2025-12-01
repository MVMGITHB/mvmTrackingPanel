// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// import tailwindcss from '@tailwindcss/vite'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react(),
    
//     tailwindcss(),
  
//   ],
// })


import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Core libraries
          react: ['react', 'react-dom'],

          // Large UI libraries
          antd: ['antd'],

          // Charts
          recharts: ['recharts'],

          // Animation
          motion: ['framer-motion'],

          // Icons (big bundle)
          icons: ['react-icons'],

          // Router
          router: ['react-router-dom'],
        }
      }
    },
    // Optional: raise warning limit
    chunkSizeWarningLimit: 1000
  }
})
