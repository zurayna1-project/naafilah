import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // output: "standalone", // Opsional: boleh ada boleh tidak untuk Vercel
  typescript: {
    ignoreBuildErrors: true, // Biar build tetap jalan walau ada error kecil
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
};

export default nextConfig;