import { IoIosSearch } from "react-icons/io";
// import ChatIcon from '@/icons/chat.svg';

export default function Header() {
  return (
    <header className="w-full h-[5rem] flex items-center justify-between  bg-white px-4">
      <div className="flex items-center space-x-4">
        <h1 className="font-tmoney text-[2rem] text-black">홈꾸</h1>
        <a href="#" className="text-[#35C5F0] font-tmoney text-[1rem] font-extrabold">카테고리</a>
        <a href="#" className="text-black font-tmoney text-[1rem] font-normal">3D 인테리어</a>
      </div>
      <div className="flex items-center space-x-4">
        
      <div className="flex items-center border p-2 rounded">
        <IoIosSearch className="text-gray-400 mr-2" />
        <input
          type="text"
          placeholder="중고 거래 상품 검색"
          className="flex-1 outline-none"
        />
      </div>


        <img src="/icons/sell.svg" alt="Chat Icon" className="w-6 h-6 mr-2" />
        <button>판매하기</button>
        <img src="/icons/chat.svg" alt="Chat Icon" className="w-6 h-6 mr-2" />
        <button>채팅하기</button>
        <img src="/icons/profile.svg" alt="Chat Icon" className="w-6 h-6 mr-2" />
        <button>마이</button>
      </div>
    </header>
  );
}
