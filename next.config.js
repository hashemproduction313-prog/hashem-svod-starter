/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Désactive le optimizer Next. Les <Image> liront directement /public/...
    unoptimized: true,
  },
};

module.exports = nextConfig;
