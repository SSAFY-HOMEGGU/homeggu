"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function KakaoCallback() {
  const router = useRouter();

  useEffect(() => {
    router.push('/');
  //   const code = router.query.code;
  //   if (code) {
  //     // 인가 코드를 로컬 스토리지에 저장
  //     localStorage.setItem("code",code)
  //     // 로그인 후 원하는 페이지로 리다이렉트tItem('kakaoAuthCode', code);
  //     console.log('Kakao authorization code:', code);
  //     router.push('/');
  //   }
  // }, [router.query]);
  });

  return (
    <div>
      <h1>카카오 로그인 중...</h1>
    </div>
  );
}
