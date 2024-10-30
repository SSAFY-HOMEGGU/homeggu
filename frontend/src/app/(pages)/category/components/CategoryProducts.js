// components/CategoryProducts.js
"use client";

import Product from "@/app/components/Product";
import InputBox from "@/app/components/InputBox";
import Image from "next/image";
import { useState } from "react";

export default function CategoryProducts({ categoryName, products }) {
  const [minPrice, setMinPrice] = useState(''); // 최소 금액
  const [maxPrice, setMaxPrice] = useState(''); // 최고 금액

  // 옵션 상태 관리
  const [options, setOptions] = useState({
    판매중: false,
    예약중: false,
    판매완료: false,
  });

  // 옵션 클릭 시 상태 변경 함수
  const handleOptionClick = (option) => {
    setOptions((prevOptions) => ({
      ...prevOptions,
      [option]: !prevOptions[option],
    }));
  };

  // 필터링된 상품 목록
  const filteredProducts = products.filter((product) => {
    const price = parseInt(product.price.replace(/,/g, '').replace('원', ''), 10);
    const min = minPrice ? parseInt(minPrice, 10) : 0;
    const max = maxPrice ? parseInt(maxPrice, 10) : Infinity;

    return price >= min && price <= max;
  });

  return (
    <div className="mt-[1rem]">
      {/* 가격과 옵션을 절반씩 차지하게 설정 */}
      <div className="w-full h-[3.5rem] flex items-center flex-shrink-0 border rounded-[1rem] mb-[1rem]">
        
        {/* 가격 영역 */}
        <div className="w-1/2 flex items-center">
          <span
            className="font-[Tmoney RoundWind] text-[1.15rem] text-normalText ml-[1rem]"
            style={{ color: "var(--kakao-logo, #000)" }}
          >
            가격
          </span>
          <div className="ml-[1rem] flex items-center">
            <InputBox
              type="text"
              placeholder="최소 금액"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              width="w-[10rem]"
              height="h-[1.8rem]"
            />
            <span className="mx-[0.8rem]">~</span>
            <InputBox
              type="text"
              placeholder="최고 금액"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              width="w-[10rem]"
              height="h-[1.8rem]"
            />
          </div>
        </div>

        {/* 옵션 영역 */}
        <div className="w-1/2 flex items-center">
          <span
            className="font-[Tmoney RoundWind] text-[1.15rem] text-normalText ml-4"
            style={{ color: "var(--kakao-logo, #000)" }}
          >
            옵션
          </span>
          <div className="ml-[1rem] flex space-x-4 items-center">
            {["판매중", "예약중", "판매완료"].map((option) => (
              <div key={option} className="flex items-center cursor-pointer" onClick={() => handleOptionClick(option)}>
                <Image
                  src={options[option] ? "/icons/activeCheck.svg" : "/icons/unactiveCheck.svg"}
                  alt={`${option} 체크`}
                  width={20}
                  height={20}
                />
                <span className="ml-2">{option}</span>
              </div>
            ))}
          </div>
        </div>
        
      </div>

      <h2 className="font-bold text-[1.25rem] text-subText font-tmoney mb-[0.5rem]">
        {categoryName}
      </h2>
      <div className="grid grid-cols-4 gap-4 md:grid-cols-4 sm:grid-cols-2 grid-cols-1">
        {filteredProducts.map((product) => (
          <Product key={product.id} product={product} seller={product.seller}/>
        ))}
      </div>
    </div>   
  );
}
