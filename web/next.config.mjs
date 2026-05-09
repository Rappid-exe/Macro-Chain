/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/api/py/:path*",
        destination: `${process.env.PY_API_URL ?? "http://localhost:8000"}/:path*`,
      },
    ];
  },
};

export default nextConfig;
