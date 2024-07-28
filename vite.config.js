import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  pwa: {
    name: 'My Awesome App', // Change this to your desired app name
  },
})
