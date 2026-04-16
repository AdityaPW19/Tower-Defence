import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// Serve the repository `static` folder as the React app publicDir so we don't duplicate binaries.
const repoStatic = path.resolve(__dirname, '../static');

export default defineConfig({
  plugins: [react()],
  // Vite will serve files from `publicDir` at the site root (/)
  publicDir: repoStatic,
  base: '/Tower-Defence/',
  server: {
    port: 5173,
    fs: {
      // Allow serving files from the repo static folder (outside project root)
      allow: [repoStatic, process.cwd()]
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
