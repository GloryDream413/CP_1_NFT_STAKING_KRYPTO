/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['ipfs.io.'],
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ik.imagekit.io",
        port: "",
        pathname: "/ipfs/QmVCCUCoWtK5EPQhF3xzm26k8qzS7ZVParsxCcDj7L6zrS/**",
      },
    ],
  },
}

module.exports = nextConfig
