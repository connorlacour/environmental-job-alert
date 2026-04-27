import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  // Set base to your GitHub repo name for GitHub Pages deployment.
  // e.g. if repo is github.com/you/environmental-job-alert → base: '/environmental-job-alert/'
  // If using a custom domain or user/org page (username.github.io) → base: '/'
  base: '/environmental-job-alert/',
})
