"use client";
import Image from 'next/image';

import { useState } from "react";
import { IoIosClose } from "react-icons/io";
import Header from "./header";

export default function ClientComponent({ children }) {
  const [isVisible, setIsVisible] = useState(true);

  return (
    <>
      {isVisible && (
        <div className="relative">
          {/* <img src="/images/banner.png" alt="최상단 배너" /> */}
          <div className="relative w-full h-[2.5rem]">
            <Image 
              src="/images/banner.png" 
              alt="최상단 배너" 
              fill
              style={{ objectFit: "cover" }}
              priority 
            />
          </div>
          <button
            className="absolute top-0 right-0 m-1"
            onClick={() => setIsVisible(false)}
          >
            <IoIosClose className="text-white text-[1.2rem]" />
          </button>
        </div>
      )}
      <div className="grid-container">
        <Header />
        {children}
      </div>
    </>
  );
}
