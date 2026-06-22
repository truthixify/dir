import { defineConfig } from "astro/config";

// The catalog lives in ../ideas (read at build time by src/lib/ideas.js).
// `site` is used for absolute URLs / canonical links — change to your deploy URL.
export default defineConfig({
  site: "https://example.com",
  vite: {
    // Allow Vite's dev server to read the sibling ideas/ directory.
    server: { fs: { allow: [".."] } },
  },
});
