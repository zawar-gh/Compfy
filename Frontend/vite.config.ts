import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    alias: {
      // Keep all your existing aliases
      '@': path.resolve(__dirname, './src'),
    },
  },
  base: './', // ⚡ Important: ensures assets load relative to index.html
  build: {
    target: 'esnext',
    outDir: 'build', // must match vercel.json
  },
  server: {
    port: 3000,
    open: true,
  },
});
