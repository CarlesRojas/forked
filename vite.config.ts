import tailwindcss from "@tailwindcss/vite";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
    server: { port: 3000 },
    plugins: [tailwindcss(), TanStackRouterVite({}), react()],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src/"),
        },
    },
    base: "./",
});
