"use client";

import Image from 'next/image';
import { IoIosSearch } from "react-icons/io";
import { useRouter } from 'next/navigation';
import { usePathname} from 'next/navigation'
import Link from 'next/link';
import { useState } from 'react';
import useUserStore from '../store/userStore';
import CategoryModal from './CategoryModal';

export default function Header() {
  const router = useRouter();
  const currentPath = usePathname();
  const { user, setLoginStatus } = useUserStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLogout = () => {
    setLoginStatus(false); // Zustand 상태에서 로그아웃 처리
    router.push("/"); // 로그아웃 후 홈으로 이동
  };

  const handleMyPageClick = (e) => {
    e.preventDefault();
    if (user.isLoggedIn) {
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
          <Link href="/category" className={`font-tmoney text-[1rem] ${currentPath === "/category" ? "text-point1 font-extrabold" : "text-normalText  font-normal" }`}>
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
        {/* <Link href="/myPage" className="text-[0.65rem] ml-1">마이</Link> */}
        <button onClick={handleMyPageClick} className="text-[0.65rem] ml-1">
          마이
        </button>

        {/* 드롭다운 메뉴 */}
        {user.isLoggedIn && isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded shadow-lg">
            <Link href="/myPage" className="block px-4 py-2 hover:bg-gray-200">마이페이지</Link>
            <button onClick={handleLogout} className="block w-full text-left px-4 py-2 hover:bg-gray-200">로그아웃</button>
          </div>
        )}
      </div>
    </header>
  );
}
