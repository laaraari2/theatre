import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'مسرحي — دفتر أستاذ المسرح',
        short_name: 'مسرحي',
        description: 'تطبيق لتدبير ورشة المسرح في التعليم الابتدائي',
        theme_color: '#8B1A1A',
        background_color: '#FDF6EC',
        display: 'standalone',
        dir: 'rtl',
        lang: 'ar',
      },
    }),
  ],
});
