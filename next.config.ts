/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: process.env.NODE_ENV === 'production' ? '/EthicsFrontEndDemo' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/EthicsFrontEndDemo/' : '',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  distDir: 'out',
}

export default nextConfig
