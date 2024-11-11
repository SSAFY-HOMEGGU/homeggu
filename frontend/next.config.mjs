/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*', // 모든 hostname 허용
        // 또는 실제 이미지 서버의 hostname 패턴을 지정
        // hostname: '*.your-domain.com',
        // pathname: '/images/**', // 특정 경로만 허용하고 싶다면
      },
    ],
  },
};

export default nextConfig;
