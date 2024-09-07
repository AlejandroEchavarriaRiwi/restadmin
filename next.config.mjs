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
  }
  
  export default nextConfig;