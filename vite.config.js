import { defineConfig } from "vite";
import fg from "fast-glob";

const htmlFiles = fg.sync(["index.html", "welcome.html", "goodbye.html", "puzzles/*.html"]);

export default defineConfig({
  build: {
    rollupOptions: {
      input: htmlFiles,
    },
    outDir: "dist",
    assetsDir: "assets",
  },
});
