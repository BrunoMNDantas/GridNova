import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'

export default defineConfig({
    plugins: [react()],
    resolve: {
        // Use the library source directly so edits hot-reload without a build step.
        // Components import their own CSS, so styles come along with the source.
        alias: { gridnova: fileURLToPath(new URL('../src/index.ts', import.meta.url)) },
        dedupe: ['react', 'react-dom'],
    },
})
