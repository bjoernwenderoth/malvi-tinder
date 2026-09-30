import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Relative Pfade: läuft lokal, im WLAN und auf GitHub Pages (Unterordner /malvi-tinder/)
  base: './',
})
