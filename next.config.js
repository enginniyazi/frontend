// frontend/next.config.js

const nextConfig = {
  reactStrictMode: true,
  // YENİ BÖLÜM
  images: {
    // remotePatterns ile dış kaynaklardan (bizim backend'imizden) gelen resimlere izin veriyoruz.
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5001',
        pathname: '/uploads/**', // /uploads/ ile başlayan tüm yollara izin ver
      },
    ],
  },
}

module.exports = nextConfig