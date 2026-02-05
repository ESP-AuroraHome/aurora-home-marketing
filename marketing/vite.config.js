import { defineConfig } from 'vite';
import { resolve } from 'path';
import basicSsl from '@vitejs/plugin-basic-ssl';
import vue from '@vitejs/plugin-vue';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
    plugins: [
        basicSsl(),
        vue({
            template: {
                compilerOptions: {
                    isCustomElement: (tag) => tag === 'model-viewer'
                }
            }
        }),
        VitePWA({
            registerType: 'autoUpdate',
            devOptions: {
                enabled: false // Disable PWA in dev to avoid caching/network loops
            },
            includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
            manifest: {
                name: 'AuroraHome',
                short_name: 'AuroraHome',
                description: 'Site vitrine pour le projet AuroraHome',
                theme_color: '#ffffff',
                icons: [
                    {
                        src: 'pwa-192x192.png',
                        sizes: '192x192',
                        type: 'image/png'
                    },
                    {
                        src: 'pwa-512x512.png',
                        sizes: '512x512',
                        type: 'image/png'
                    }
                ]
            }
        })
    ],
    resolve: {
        alias: {
            'vue': 'vue/dist/vue.esm-bundler.js',
            '@': resolve(__dirname, './src')
        }
    },
    build: {
        // Multi-page inputs removed for SPA
    }
});
