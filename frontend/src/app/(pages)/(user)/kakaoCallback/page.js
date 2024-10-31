"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function KakaoCallback() {
  const router = useRouter();

  useEffect(() => {
    const getKakaoToken = async () => {
      try {
        const code = new URLSearchParams(window.location.search).get('code');
        console.log('인가 코드:', code); // 코드 확인

        if (!code) {
          console.error('인가 코드가 없습니다');
          router.push('/login');
          return;
        }

        // axios 요청 전 설정 로그
        console.log('요청 전송 준비:', {
          url: 'http://localhost:8084/oauth/kakao/login',
          data: { code },
          headers: {
            'Content-Type': 'application/json'
          }
        });

        const response = await axios.post(
          'http://localhost:8084/oauth/kakao/login',
          { "code": code },
        );

        console.log('서버 응답:', response.data);
        
        if (response.data) {
          localStorage.setItem('userInfo', response.data);
          router.push('/');
        }
      } catch (error) {
        console.error('상세 에러 정보:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
          headers: error.response?.headers
        });
        router.push('/login');
      }
    };

    getKakaoToken();
  }, [router]);

  return (
    <div className="flex justify-center items-center h-screen">
      <h1 className="text-xl font-bold">카카오 로그인 처리 중...</h1>
    </div>
  );
}