import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, ".", "VITE_");
  const apiUrl = env.VITE_API_URL?.trim();
  const normalizedApiUrl =
    apiUrl && !/^https?:\/\//i.test(apiUrl) ? `https://${apiUrl}` : apiUrl;

  return {
    plugins: [react()],
    define: normalizedApiUrl
      ? {
          "import.meta.env.VITE_API_URL": JSON.stringify(normalizedApiUrl),
        }
      : {},
  };
});
