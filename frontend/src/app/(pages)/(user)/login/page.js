"use client";
import { useEffect } from 'react';
import Image from 'next/image';

export default function Login() {
  const KAKAO_APP_KEY = '5bf7a75e57aaf59c9780c6373a06ff4d';
  // const REDIRECT_URI = 'http://localhost:3000/kakaoCallback';
  const REDIRECT_URI = 'https://k11b206.p.ssafy.io/kakaoCallback';

  
// eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    // Kakao SDK 초기화
    const loadKakaoSDK = () => {
      const script = document.createElement('script');
      script.src = 'https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js';
      script.integrity = 'sha384-TiCUE00h649CAMonG018J2ujOgDKW/kVWlChEuu4jK2vxfAAD0eZxzCKakxg55G4';
      script.crossOrigin = 'anonymous';
      script.async = true;
      
      script.onload = () => {
        if (!window.Kakao.isInitialized()) {
          window.Kakao.init(KAKAO_APP_KEY);
        }
      };
      
      document.head.appendChild(script);
    };

    loadKakaoSDK();
    
  }, []);

  const handleLogin = () => {
    if (!window.Kakao?.Auth) {
      console.error('Kakao SDK not loaded');
      return;
    }

    window.Kakao.Auth.authorize({
      redirectUri: REDIRECT_URI,
    });
  };

  return (
    <div className="flex items-center justify-center">
      <div className='flex flex-col items-center justify-center h-[30rem]'>
        <Image
          src="/images/logo.png"
          alt="로고"
          width={150}
          height={150}
        />
        {/* <h1 className='font-tmoney text-[2rem] mb-4'>홈꾸</h1> */}
        <p className='mb-4'>SNS 계정으로 간편 로그인/회원가입</p>
        <button onClick={handleLogin}>
          <Image
            src="/images/kakao_login_large_narrow.png"
            alt="카카오 로그인 버튼"
            width={220}
            height={220}
          />
        </button>
      </div>
    </div>
  );
}