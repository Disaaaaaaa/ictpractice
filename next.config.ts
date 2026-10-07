import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // A package-lock.json in the home directory would otherwise be taken as the workspace root.
  turbopack: { root: __dirname },
  // Figures are uploaded through a server action (images up to 5 MB).
  experimental: { serverActions: { bodySizeLimit: "6mb" } },
};

export default nextConfig;
