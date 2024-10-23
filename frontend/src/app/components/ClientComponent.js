"use client";

import { useState } from "react";
import { IoIosClose } from "react-icons/io";

export default function ClientComponent({ children }) {
  const [isVisible, setIsVisible] = useState(true);

  return (
    <>
      {isVisible && (
        <div className="relative">
          <img src="/images/banner.png" alt="최상단 배너" />
          <button
            className="absolute top-0 right-0 m-1"
            onClick={() => setIsVisible(false)}
          > 
            <IoIosClose className="text-white text-[1.2rem]" />
          </button>
        </div>
      )}
      {children}
    </>
  );
}
