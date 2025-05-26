import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
    images: {
        //Fix Soon
        remotePatterns: [
            {
                protocol: "https",
                hostname: "hips.hearstapps.com",
                port: "",
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: "lh3.googleusercontent.com",
                port: "",
                pathname: "/**",
            },
            {
                protocol: "http",
                hostname: "127.0.0.1",
                port: "8000",
                pathname: "/storage/**",
            },
            {
                protocol: "https",
                hostname: "preview.keenthemes.com",
                port: "",
                pathname: "/**",
            },
            {
                protocol: "http",
                hostname: "localhost",
                port: "8000", // this should match exactly
                pathname: "/storage/**",
            },
        ],
    },

    eslint: {
        ignoreDuringBuilds: true,
    },

    experimental: {
        serverActions: {
            bodySizeLimit: "10mb", // ✅ this is the fix
        },
    },
    typescript: {
        ignoreBuildErrors: true,
    },

    webpack(config) {
        // Add @ alias support
        config.resolve.alias = {
            ...(config.resolve.alias || {}),
            "@": path.resolve(__dirname, "src"),
        };

        // Add SVGR loader for SVG files
        config.module.rules.push({
            test: /\.svg$/,
            // issuer: {
            //   and: [/\.(js|ts)x?$/],
            // },
            use: ["@svgr/webpack"],
        });
        return config;
    },
};

export default nextConfig;
