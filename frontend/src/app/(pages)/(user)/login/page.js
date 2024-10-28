
// "use client";
// import { useEffect } from 'react';
// import Script from 'next/script';
// import Image from 'next/image';
// import { useRouter, useSearchParams } from 'next/navigation';
// // import axios from 'axios';

// export default function KakaoLogin() {
//   const KAKAO_APP_KEY = '51fc12f90d265c8108d66e76fee0151f';
//   const redirect_URL = 'http://localhost:3000';
//   const router = useRouter();
//   const searchParams = useSearchParams();

//   useEffect(() => {
//     // Kakao 초기화
//     if (typeof window !== 'undefined' && window.Kakao) {
//       const kakao = window.Kakao;
//       if (!kakao.isInitialized()) {
//         kakao.init(KAKAO_APP_KEY); 
//       }
//     }

//     // URL에서 인가 코드 가져오기
//     const code = searchParams.get('code');
//     if (code) {
//       // 인가 코드로 액세스 토큰 요청
//       getAccessToken(code);
//     }
//   }, [searchParams]);

//   const handleLogin = () => {
//     if (typeof window !== 'undefined' && window.Kakao) {
//       window.Kakao.Auth.authorize({
//         redirectUri: redirect_URL,
//       });
//     }
//   };

//   // 액세스 토큰 요청 함수
//   const getAccessToken = async (code) => {
//     try {
//       const response = await axios.post('/api/getAccessToken', { code });
//       const { access_token } = response.data;
//       if (access_token) {
//         window.Kakao.Auth.setAccessToken(access_token);
//         localStorage.setItem('kakao_access_token', access_token);
//         console.log('Access token saved to local storage:', access_token);
//       }
//     } catch (error) {
//       console.error('Failed to get access token', error);
//     }
//   };

//   return (
//     <div>
//       <Script
//         src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js"
//         integrity="sha384-TiCUE00h649CAMonG018J2ujOgDKW/kVWlChEuu4jK2vxfAAD0eZxzCKakxg55G4"
//         crossOrigin="anonymous"
//         strategy="beforeInteractive"
//       />
//       <button id="kakao-login-btn" onClick={handleLogin}>
//         <Image
//           src="/images/kakao_login_large_narrow.png"
//           alt="카카오 로그인 버튼"
//           width={222}
//           height={45}
//         />
//       </button>
//       <p id="token-result"></p>
//     </div>
//   );
// }
// pages/index.js
"use client";
import { useEffect } from 'react';
import Head from 'next/head';

export default function Home() {
  const KAKAO_APP_KEY = '51fc12f90d265c8108d66e76fee0151f';
  const redirect_URL = 'http://localhost:3000/kakaoCallback';

  useEffect(() => {
    // Kakao JavaScript SDK 로드
    const script = document.createElement('script');
    script.src = 'https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js';
    script.integrity = 'sha384-TiCUE00h649CAMonG018J2ujOgDKW/kVWlChEuu4jK2vxfAAD0eZxzCKakxg55G4';
    script.crossOrigin = 'anonymous';
    script.onload = () => {
      window.Kakao.init(KAKAO_APP_KEY); 
    };
    document.head.appendChild(script);
  }, []);

  const handleLogin = () => {
    if (window.Kakao) {
      window.Kakao.Auth.authorize({
        redirectUri: redirect_URL,
      });
    }
  };

  return (
    <div>
      <Head>
        <title>Next.js Kakao Login</title>
      </Head>
      <button onClick={handleLogin}>
        <img
          src="/images/kakao_login_large_narrow.png"
          alt="카카오 로그인 버튼"
          width="222"
        />
      </button>
    </div>
  );
}

