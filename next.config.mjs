const API_SERVER_URL = process.env.API_SERVER_URL || "http://localhost:4000"

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${API_SERVER_URL}/api/:path*`,
      },
    ]
  },
}

export default nextConfig