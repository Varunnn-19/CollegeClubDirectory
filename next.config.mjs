const API_SERVER_URL = process.env.API_SERVER_URL

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async rewrites() {
    if (!API_SERVER_URL) return []

    return [
      {
        source: "/api/:path*",
        destination: `${API_SERVER_URL}/api/:path*`,
      },
    ]
  },
}

export default nextConfig