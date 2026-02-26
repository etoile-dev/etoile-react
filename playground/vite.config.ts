import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    // Point package imports straight at the library source so edits are
    // reflected instantly — no rebuild step needed while developing.
    alias: [
      {
        find: "@etoile-dev/react/styles.css",
        replacement: path.resolve(__dirname, "../src/styles.css"),
      },
      {
        find: "@etoile-dev/react",
        replacement: path.resolve(__dirname, "../src/index.ts"),
      },
    ],
  },
});
