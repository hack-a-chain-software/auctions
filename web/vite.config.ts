import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import reactRefresh from "@vitejs/plugin-react-refresh";
import NodeGlobalsPolyfillPlugin from "@esbuild-plugins/node-globals-polyfill";
import VitePluginHtmlEnv from 'vite-plugin-html-env';

export default defineConfig({
  plugins: [
    VitePluginHtmlEnv({
      envPrefixes: 'AUCTION_'
    }),
    react(),
    reactRefresh(),
    NodeGlobalsPolyfillPlugin({
      buffer: true,
      process: true,
    }),
  ],
  esbuild: {},
  define: {
    global: "window"
  },
  envPrefix: 'AUCTION_',
  resolve: {
    alias: {
      util: "util",
      process: "process/browser",
    },
  },
});
