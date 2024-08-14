import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
   base: "https://mahan-dev.github.io/mini_movie_site", 
   
})
