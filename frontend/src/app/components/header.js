"use client";

import Image from 'next/image';
import { IoIosSearch } from "react-icons/io";
import { useRouter } from 'next/navigation';
import { usePathname} from 'next/navigation'
import Link from 'next/link';
import { useState } from 'react';
import useUserStore from '../store/userStore';
import CategoryModal from './CategoryModal';
import axios from 'axios';

export default function Header() {
  const router = useRouter();
  const currentPath = usePathname();
  const { user, setLoginStatus } = useUserStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // const handleLogout = () => {
  //   localStorage.removeItem('userInfo');
  //   setLoginStatus(false); // Zustand 상태에서 로그아웃 처리
  //   setIsDropdownOpen(false);
  //   router.push("/"); // 로그아웃 후 홈으로 이동
  // };
  const handleLogout = async () => {
    try {
      const userInfoStr = localStorage.getItem('userInfo');
      if (userInfoStr) {
        const userInfo = userInfoStr;
        console.log(userInfo);
  
        await axios.post(
          'http://localhost:8084/oauth/kakao/logout',
          { "accessToken": userInfo},
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${userInfo}`
            },
            withCredentials: true,
          }
        );
  
        localStorage.removeItem('userInfo');
        setLoginStatus(false);
        setIsDropdownOpen(false);
        router.push("/");
      }
    } catch (error) {
      console.error('로그아웃 처리 중 에러:', error);
    }
  };


  const handleMyPageClick = (e) => {
    e.preventDefault();
    if (localStorage.getItem('userInfo')) {
      // 로그인 상태일 때만 드롭다운 메뉴 열기
      setIsDropdownOpen(!isDropdownOpen);
    } else {
      router.push("/login"); // 비로그인 상태면 로그인 페이지로 이동
    }
  };
  
  return (
    <header className="content-area h-[4rem] flex items-center justify-between bg-white">
      <div className="flex items-center space-x-4">
        <Link href='/'>
          <h1 className="font-tmoney text-[2rem] font-bold">홈꾸</h1>
        </Link>
        <div
          onMouseEnter={() => setIsModalOpen(true)}
          // onMouseLeave={() => setIsModalOpen(false)}
          className="relative"
        >
          <Link href="/category" className={`font-tmoney text-[1rem] ${currentPath.includes("/category") ? "text-point1 font-extrabold" : "text-normalText  font-normal" }`}>
            카테고리
          </Link>
          {isModalOpen && <CategoryModal onClose={() => setIsModalOpen(false)} />}
        </div>
        <Link href="/interior" className={`font-tmoney text-[1rem] ${currentPath === "/interior" ? "text-point1 font-extrabold" : "text-normalText  font-normal" }`}>
          3D 인테리어
        </Link>
      </div>
      <div className="flex items-center">
        <div className="flex items-center border p-2 rounded mr-4 h-[1.8rem]">
          <IoIosSearch className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="중고 거래 상품 검색"
            className="flex-1 outline-none text-[0.65rem]  w-[11rem]"
          />
        </div>

        <div className="relative w-[1rem] h-[1rem] mr-1 ml-1">
          <Image
            src="/icons/sell.svg"
            alt="Chat Icon"
            fill
            style={{ objectFit: "contain" }}
            priority
          />
        </div>
        <Link href="/sell" className="text-[0.65rem] ml-1">판매하기</Link>
        <h4 className="text-gray-200 ml-1 font-light">|</h4>
        <div className="relative w-[1rem] h-[1rem] mr-1 ml-1">
          <Image
            src="/icons/chat.svg"
            alt="Chat Icon"
            fill
            style={{ objectFit: "contain" }}
            priority
          />
        </div>
        <Link href="/chat" className="text-[0.65rem] ml-1">채팅하기</Link>
        <h4 className="text-gray-200 ml-1 font-light">|</h4>
        <div className="relative w-[1rem] h-[1rem] mr-1 ml-1">
          <Image
            src="/icons/profile.svg"
            alt="Chat Icon"
            fill
            style={{ objectFit: "contain" }}
            priority
          />
        </div>
        <div className="relative">
          <button onClick={handleMyPageClick} className="text-[0.65rem] ml-1">
            마이
          </button>

          {/* 드롭다운 메뉴 */}
          {isDropdownOpen && localStorage.getItem('userInfo') && (
            <div className="absolute left-1/2 transform -translate-x-1/2 top-[2rem] mt-1 w-[6rem] bg-white border border-gray-300 rounded shadow-lg z-50">
              <Link href="/mypage" className="block px-4 py-2 text-[0.8rem] hover:bg-gray-200">마이페이지</Link>
              <button 
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-[0.8rem] hover:bg-gray-200"
              >
                로그아웃
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
