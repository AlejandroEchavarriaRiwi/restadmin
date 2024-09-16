/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      domains: ['res.cloudinary.com'],
    },
    env: {
      NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    },
    compiler: {
      styledComponents: true,
    },
    // Removemos la configuración experimental y de webpack personalizada
    async rewrites() {
      return [
        {
          source: '/api/:path*', // Proxy para todas las rutas que comienzan con /api
          destination: 'https://restadmin.azurewebsites.net/api/:path*', // Redirige al backend
        },
      ]
    },
  }
  
  export default nextConfig;