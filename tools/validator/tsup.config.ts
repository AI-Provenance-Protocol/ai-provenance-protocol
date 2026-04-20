import { defineConfig } from 'tsup'

export default defineConfig({
  entry: { cli: 'src/cli.ts' },
  format: ['cjs'],
  banner: { js: '#!/usr/bin/env node' },
  clean: true,
  minify: false,
  treeshake: true,
})
