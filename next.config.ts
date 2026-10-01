import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Um único CSS pequeno (~7 KiB): inline no HTML evita uma requisição que bloqueia a renderização.
    inlineCss: true,
  },
  images: {
    remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }],
  },
};

export default nextConfig;
