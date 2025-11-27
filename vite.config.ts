import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  // 为 Tauri 开发定制的 Vite 选项，仅在 `tauri dev` 或 `tauri build` 时应用
  //
  // 1. 防止 vite 遮盖 rust 错误
  clearScreen: false,
  // 2. tauri 需要固定端口，如果端口不可用则失败
  server: {
    port: 1420,
    strictPort: true,
    host: "localhost",
    hmr: {
      protocol: "ws",
      host: "localhost",
      port: 1420,
    },
    watch: {
      // 3. 告诉 vite 忽略监听 `src-tauri` 目录
      ignored: ["**/src-tauri/**"],
    },
  },
});