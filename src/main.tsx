import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles.css';
import { resolvePath } from './utils/paths';

// Dynamically load font with correct base URL
const fontFace = new FontFace(
  'Astro Space',
  `url(${resolvePath('/font/AstroSpace-0Wl3o.otf')}) format('opentype'), url(${resolvePath('/font/AstroSpace-eZ2Bg.ttf')}) format('truetype')`,
  { weight: '200', style: 'normal', display: 'swap' }
);

fontFace.load().then((loadedFace) => {
  document.fonts.add(loadedFace);
}).catch((err) => {
  console.warn('Failed to load Astro Space font:', err);
});

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
