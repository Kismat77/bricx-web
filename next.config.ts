import type { NextConfig } from "next";

/**
 * Default: a normal Next.js build (Vercel or `next start`), with image optimisation.
 * `npm run build:static` sets STATIC_EXPORT=1 and writes plain files to /out for any static host
 * (Netlify, S3, cPanel…); images are then served as-is.
 * DOCKER_BUILD=1 emits a standalone server bundle for the Docker image.
 */
const staticExport = process.env.STATIC_EXPORT === "1";
const dockerBuild = process.env.DOCKER_BUILD === "1";

const nextConfig: NextConfig = {
  ...(staticExport ? { output: "export", images: { unoptimized: true } } : {}),
  ...(dockerBuild ? { output: "standalone" } : {}),
  reactStrictMode: true,
};

export default nextConfig;
