// Builds a ready-made copy of the site into site-pronto/ (plain HTML files, no
// Node needed to open them). Used for machines where Node can't be installed:
// open the repo in VS Code and click "Go Live" (Live Server serves site-pronto/).
// Rebuild with: npx vite build --config vite.static.config.ts
import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    tsConfigPaths(),
    tailwindcss(),
    tanstackStart({
      server: { entry: "server" },
      prerender: { enabled: true, crawlLinks: true, failOnError: true },
      // Used-car pages sit behind a tab, so the crawler can't find them alone.
      pages: ["/", "/anuncio/onix-premier-2023", "/anuncio/s10-high-country-2022", "/anuncio/tracker-rs-2024"].map(
        (path) => ({ path }),
      ),
    }),
    viteReact(),
  ],
  build: { outDir: "dist-static" },
});
