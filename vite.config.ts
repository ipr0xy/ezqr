import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { execSync } from 'node:child_process'

// Try to capture the current commit SHA for display in the app
let commitSha = process.env.VITE_COMMIT_SHA || ''
try {
  if (!commitSha) {
    commitSha = execSync('git rev-parse HEAD').toString().trim()
  }
} catch {}

export default defineConfig({
  plugins: [
    react()
  ],
  define: {
    'import.meta.env.VITE_COMMIT_SHA': JSON.stringify(commitSha)
  },
  server: {
    host: true,
    port: 5173
  },
  build: {
    target: 'esnext',
    minify: 'esbuild',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['lucide-react', '@radix-ui/react-slot'],
          qr: ['qrcode', 'react-qr-code'],
          store: ['zustand']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  }
})