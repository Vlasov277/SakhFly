import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ command }) => {
  const buildVersion = command === 'build' ? new Date().toISOString() : 'development';

  return {
    base: '/SakhFly/',
    plugins: [
      react(),
      {
        name: 'sakhfly-build-version',
        transformIndexHtml() {
          return [{
            tag: 'meta',
            attrs: { name: 'sakhfly-build-version', content: buildVersion },
            injectTo: 'head',
          }];
        },
      },
    ],
  };
});
