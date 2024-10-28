'use client'

import HomePage from '@/app/(pages)/home/page'
import { useState, useEffect } from 'react';
import {BlueButton, WhiteButton} from './components/Button';
import { ActiveButton,UnactiveButton } from './components/OptionButton';
import InputBox from './components/InputBox';
import Dropdown from './components/Dropdown';
import Product from './components/Product';
import useUserStore from './store/userStore';
import { useRouter } from 'next/navigation'

export default function Home() {
  const [inputValue, setInputValue] = useState(''); 

  const router = useRouter()
  const user = useUserStore((state) => state.user);
  const updateToken = useUserStore((state) => state.updateToken);
  const setLoginStatus = useUserStore((state) => state.setLoginStatus);

  useEffect(() => {
    // 로컬 스토리지에서 토큰 불러와서 상태 업데이트
    const token = localStorage.getItem('kakao_access_token');
    if (token && !user.isLoggedIn) {
      updateToken(token);
      setLoginStatus(true);
      console.log('토큰:', token);
    }
  }, [updateToken, setLoginStatus, user.isLoggedIn]);




  return <div>
    <HomePage />

  </div>;
}
