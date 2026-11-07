import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteSingleFile } from "vite-plugin-singlefile";

export default defineConfig({
  // The build is ONE self-contained dist/index.html (JS, CSS and fonts inlined):
  // upload it anywhere, or open it straight from disk with no internet.
  plugins: [react(), viteSingleFile()],
  base: "./"
});
