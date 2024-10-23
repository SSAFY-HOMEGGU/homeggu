import { IoIosSearch } from "react-icons/io";
// import ChatIcon from '@/icons/chat.svg';

export default function Header() {
  return (
    <header className="content-area h-[4rem] flex items-center justify-between bg-white">
      <div className="flex items-center space-x-4">
        <h1 className="font-tmoney text-[2rem] font-bold">홈꾸</h1>
        <a
          href="#"
          className="text-[#35C5F0] font-tmoney text-[1rem] font-extrabold"
        >
          카테고리
        </a>
        <a href="#" className="text-black font-tmoney text-[1rem] font-normal">
          3D 인테리어
        </a>
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

        <img
          src="/icons/sell.svg"
          alt="Chat Icon"
          className="w-[1rem] mr-1 ml-1"
        />
        <button className="text-[0.65rem] ml-1">판매하기</button>
        <h4 className="text-gray-200 ml-1 font-light">|</h4>
        <img
          src="/icons/chat.svg"
          alt="Chat Icon"
          className="w-[1rem] mr-1 ml-1"
        />
        <button className="text-[0.65rem] ml-1">채팅하기</button>
        <h4 className="text-gray-200 ml-1 font-light">|</h4>
        <img
          src="/icons/profile.svg"
          alt="Chat Icon"
          className="w-[1rem] mr-1 ml-1"
        />
        <button className="text-[0.65rem] ml-1">마이</button>
      </div>
    </header>
  );
}
