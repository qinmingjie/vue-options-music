import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import esbuild from "rollup-plugin-esbuild";

// element按需加载
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
// element 图标按需加载
import Icons from "unplugin-icons/vite";
import IconsResolver from "unplugin-icons/resolver";
// https://vitejs.dev/config/

export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@/theme/default.scss" as *;`
      }
    }
  },
  plugins: [
    vue(),
    AutoImport({
      resolvers: [IconsResolver({ prefix: "Icon" }), ElementPlusResolver()]
    }),
    Components({
      resolvers: [IconsResolver({ enabledCollections: ["ep"] }), ElementPlusResolver({ importStyle: "sass" })]
    }),
    Icons({ autoInstall: true }),
    {
      ...esbuild({
        target: "chrome70",
        // 如有需要可以在这里加 js ts 之类的其他后缀
        include: [/\.vue$/, /\.js$/],
        loaders: {
          ".vue": "js"
        }
      }),
      enforce: "post"
    }
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url))
    }
  },
  server: {
    host: "0.0.0.0"
  }
});
