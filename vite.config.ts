import { copyFileSync } from "node:fs";
import { resolve } from "node:path";
import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";

const githubPagesSpa404 = (): Plugin => ({
  name: "github-pages-spa-404",
  closeBundle() {
    copyFileSync(resolve("dist/index.html"), resolve("dist/404.html"));
  },
});

export default defineConfig({
  base: "/LT-react/",
  plugins: [react(), githubPagesSpa404()],
});
