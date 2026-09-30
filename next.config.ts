import type { NextConfig } from "next";

/**
 * Default: a normal Next.js build (Vercel or `next start`), with image optimisation.
 * `npm run build:static` sets STATIC_EXPORT=1 and writes plain files to /out for any static host
 * (Netlify, S3, cPanel…); images are then served as-is.
 */
const staticExport = process.env.STATIC_EXPORT === "1";

const nextConfig: NextConfig = {
  ...(staticExport ? { output: "export", images: { unoptimized: true } } : {}),
  reactStrictMode: true,
};

export default nextConfig;
