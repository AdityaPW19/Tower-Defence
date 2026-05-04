import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// Static assets (fonts, sounds, sprites, etc.) live in the local `assets` folder.
// Vite serves files from `publicDir` at the site root (which honors `base`).
const publicAssets = path.resolve(__dirname, 'assets');

export default defineConfig({
  plugins: [react()],
  publicDir: publicAssets,
  base: '/Tower-Defence/',
  server: {
    port: 5173,
    fs: {
      allow: [publicAssets, process.cwd()]
    }
  },
  esbuild: {
    // Use this project's tsconfig, not the parent
    tsconfigRaw: {
      compilerOptions: {
        jsx: 'react-jsx'
      }
    }
  }
});
