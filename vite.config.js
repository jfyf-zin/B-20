// vite.config.js
import { defineConfig } from "vite";
import { ViteEjsPlugin } from "vite-plugin-ejs";
import { glob } from "glob";

// 打包後把 pages/ 前綴拿掉，確保 dist/index.html 在根目錄
function moveOutputPlugin() {
  return {
    name: "move-output",
    enforce: "post",
    apply: "build",
    generateBundle(_options, bundle) {
      for (const name of Object.keys(bundle)) {
        const item = bundle[name];
        if (item.fileName && item.fileName.startsWith("pages/")) {
          item.fileName = item.fileName.replace(/^pages\//, "");
        }
      }
    },
  };
}

export default defineConfig({
  base: "/B-20/", // ★ repo 名字要完全一致（含大小寫與連字號）
  plugins: [ViteEjsPlugin(), moveOutputPlugin()],
  server: { open: "pages/index.html" },
  build: {
    outDir: "dist",
    rollupOptions: {
      // 多頁面入口：把 pages 下的所有 html 都編進來
      input: Object.fromEntries(
        glob.sync("pages/**/*.html").map((file) => [file, file])
      ),
    },
  },
});
