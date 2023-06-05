import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue({
            template: {
                compilerOptions: {
                    isCustomElement: (tag) => tag.startsWith("lr-"),
                },
            },
        }),
    ],
    server: {
        host: "0.0.0.0",
        port: process.env.PORT, // Please comment this line for development purpose only
    },
});
