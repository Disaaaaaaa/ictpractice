import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // A package-lock.json in the home directory would otherwise be taken as the workspace root.
  turbopack: { root: __dirname },
  // Figures are uploaded through a server action (images up to 5 MB).
  experimental: { serverActions: { bodySizeLimit: "6mb" } },
  // The SQL practice sandbox (src/lib/sql/sandbox.ts) loads PGlite's WASM files at run time.
  serverExternalPackages: ["@electric-sql/pglite"],
  outputFileTracingIncludes: { "/**": ["./node_modules/@electric-sql/pglite/dist/**/*.{wasm,data}"] },
};

export default nextConfig;
