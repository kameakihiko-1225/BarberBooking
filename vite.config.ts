import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
// Replit-only dev plugin (loaded dynamically if available)
let runtimeErrorOverlay: (()=>any)|undefined;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  // Dynamically resolve to avoid missing module in production
  // eslint-disable-next-line import/no-extraneous-dependencies
  runtimeErrorOverlay = require('@replit/vite-plugin-runtime-error-modal');
} catch {
  // noop – plugin unavailable in production builds
}

export default defineConfig({
  plugins: [
    react(),
    ...(runtimeErrorOverlay ? [runtimeErrorOverlay()] : []),
    ...(process.env.NODE_ENV !== "production" &&
    process.env.REPL_ID !== undefined
      ? [
          await import("@replit/vite-plugin-cartographer").then((m) =>
            m.cartographer(),
          ),
        ]
      : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
  assetsInclude: [
    "**/*.JPG",
    "**/*.JPEG",
    "**/*.PNG",
    "**/*.HEIC",
    "**/*.MOV",
    "**/*.MP4",
    "**/*.heic",
    "**/*.mov",
    "**/*.mp4",
  ],
});
