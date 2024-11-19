/// <reference types="vitest" />
/// <reference types="vite/client" />

import { esbuildCommonjs } from '@originjs/vite-plugin-commonjs'
import react from "@vitejs/plugin-react"
import path from "path"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react(),],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    commonjsOptions: { transformMixedEsModules: true } // Change
  },
  optimizeDeps:{
    esbuildOptions:{
      plugins:[
        esbuildCommonjs()
      ]
    }
  }
})