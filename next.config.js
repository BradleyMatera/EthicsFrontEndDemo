const isStaticExport = process.env.NEXT_STATIC_EXPORT === "true";
const requestedBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const normalizedBasePath =
  requestedBasePath && requestedBasePath.startsWith("/")
    ? requestedBasePath
    : requestedBasePath
    ? `/${requestedBasePath}`
    : "";

/** @type {import('next').NextConfig} */
const nextConfig = {
  ...(isStaticExport
    ? {
        output: "export",
        trailingSlash: true,
      }
    : {}),
  basePath: normalizedBasePath || undefined,
  assetPrefix: normalizedBasePath || undefined,
  images: {
    unoptimized: true,
  },
  typedRoutes: true,
};

module.exports = nextConfig;
