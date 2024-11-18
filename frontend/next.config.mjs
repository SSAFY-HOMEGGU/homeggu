// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactStrictMode: false,
//   images: {
//     remotePatterns: [
//       {
//         protocol: 'https',
//         hostname: '*', // 모든 hostname 허용
//         // 또는 실제 이미지 서버의 hostname 패턴을 지정
//         // hostname: '*.your-domain.com',
//         // pathname: '/images/**', // 특정 경로만 허용하고 싶다면
//       },
//     ],
//   },
// };

// export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // domains: ['homeggu-s3.s3.ap-northeast-2.amazonaws.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'k11b206.p.ssafy.io',
        pathname: '/**',  // 모든 경로 허용
      },
      {
        protocol: 'https',
        hostname: 'homeggu-s3.s3.ap-northeast-2.amazonaws.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
}

export default nextConfig;