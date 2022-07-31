/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,

    async rewrites() {
        return [
            {
                source: "/api/kiting-live/:path*",
                destination: "https://kiting.live/api/:path*",
            },
        ];
    },
};

module.exports = nextConfig;
