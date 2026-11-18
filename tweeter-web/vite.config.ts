import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import viteTsconfigPaths from "vite-tsconfig-paths";
import svgrPlugin from "vite-plugin-svgr";
import viteCommonJs from "vite-plugin-commonjs";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, __dirname, "");

  return {
    plugins: [react(), viteTsconfigPaths(), svgrPlugin(), viteCommonJs()],
    define: {
      "process.env.VITE_SERVER_BASE_URL": JSON.stringify(env.VITE_SERVER_BASE_URL)
    },
    server: {
      open: true
    }
  };
});
