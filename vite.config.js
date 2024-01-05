import { defineConfig } from 'vite';

export default defineConfig({
    build: {
        lib: {
            entry: 'src/main.js',
            fileName: format => `stats.js`,
            formats: ['iife'],
            name: 'tilemap',
        },
        minify: false,
        rollupOptions: {
            globals: {
                Scratch: 'Scratch',
            },
            external: ['Scratch'],
        },
    },
});