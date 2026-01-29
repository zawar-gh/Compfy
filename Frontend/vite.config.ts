import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
  // Required for proper relative paths in production
  base: './',

  plugins: [react()],

  resolve: {
    // File extensions to resolve automatically
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],

    // Aliases for local imports
    alias: {
      '@': path.resolve(__dirname, './src'), // for src imports
    },
  },

  build: {
    target: 'esnext',
    outDir: 'build', // must match "outputDirectory" in vercel.json
    rollupOptions: {
      // Externalize node_modules packages automatically
      external: [], // leave empty unless you want to exclude some packages
    },
  },

  server: {
    port: 3000,
    open: true,
  },
});
