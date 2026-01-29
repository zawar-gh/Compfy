import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
  base: './', // fixes 404 / white page
  plugins: [react()],
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    alias: {
      '@': path.resolve(__dirname, './src'), // your src alias only
    },
  },
  build: {
    target: 'esnext',
    outDir: 'build', // must match vercel.json
  },
  server: {
    port: 3000,
    open: true,
  },
});
