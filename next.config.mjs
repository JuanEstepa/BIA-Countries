/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'flagcdn.com',
        port: '',
        pathname: '**', // Esto permite cualquier ruta de flagcdn.com
      },
    ],
  },
};

export default nextConfig;
