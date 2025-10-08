
/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.worldofrarebooks.co.uk',
      },
      
      {
        protocol: 'https',
        hostname: 'imageserver.worldofbooks.com',
      },
      {
        protocol: 'https',
        hostname: 'image-server.worldofbooks.com', 
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
    ],
    
  },
}

module.exports = nextConfig