"use client";
import { fetchLogin } from '@/app/api/userApi';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';

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
          url: {fetchLogin},
          data: { code },
        });

        const response = await fetchLogin(code);
        console.log('서버 응답:', response);

        if (response) {
          localStorage.setItem('accessToken', response);
          try {
          
            const decodedToken = jwtDecode(response);
            const userId = decodedToken.userId; // 또는 decodedToken.sub 등 토큰에 담긴 키값
            
            console.log('userId:', userId);
            localStorage.setItem('userId', userId);
          } catch (error) {
            console.error('토큰 디코딩 에러:', error);
          }

          router.push('/');

        }
      } catch (error) {
        console.error('상세 에러 정보:', {error});
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