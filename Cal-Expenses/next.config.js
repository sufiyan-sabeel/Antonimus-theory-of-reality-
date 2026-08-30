/** @type {import('next').NextConfig} */
const isExport = process.env.NEXT_EXPORT === 'true';
// Repo name includes trailing dash: Antonimus-theory-of-reality-
const repoBase = '/Antonimus-theory-of-reality-';
const nextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**" }],
    unoptimized: true,
  },
  ...(isExport
    ? {
        output: 'export',
        basePath: `${repoBase}cal-expenses`,
        assetPrefix: `${repoBase}cal-expenses/`,
      }
    : {}),
  trailingSlash: true,
};

module.exports = nextConfig;
