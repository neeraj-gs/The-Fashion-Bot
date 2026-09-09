import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return

          // Only the two libraries that are large, stable and always needed
          // get their own chunk. Everything else is deliberately left for
          // Rollup to place: a catch-all "vendor" chunk drags drei's
          // transitive dependencies out of the lazy gate-scene chunk and back
          // into the initial download, which is the opposite of the point.
          if (/[\/]node_modules[\/](react|react-dom|scheduler)[\/]/.test(id)) {
            return "react"
          }
          if (
            /[\/]node_modules[\/](motion|framer-motion|motion-dom|motion-utils)[\/]/.test(
              id
            )
          ) {
            return "motion"
          }
        },
      },
    },
    // The gate scene chunk is deliberately large and deliberately lazy.
    chunkSizeWarningLimit: 900,
  },
})
