import {defineConfig} from 'tsup'

export default defineConfig({
    entry: ['src/index.js'],
    format: ['esm', 'cjs'],
    outExtension({ format }) {
        return { js: format === 'cjs' ? '.cjs' : '.js' }
    },
    dts: false,
    clean: true,
    external: ['react']
})