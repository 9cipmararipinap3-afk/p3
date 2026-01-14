import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY || ''),
    'process.env.VERCEL_PROJECT_ID': JSON.stringify('prj_WuAP7oZcfJeUH4qMnPmbur9bCps0'),
    'process.env.VERCEL_PROJECT_NAME': JSON.stringify('9-cipm-sgo')
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false
  },
  server: {
    historyApiFallback: true
  }
});