"use client";

import { useState, useEffect } from "react";
import Product from "@/app/components/Product";
import InputBox from "@/app/components/InputBox";
import Image from "next/image";
import useProductListStore from '@/app/store/useProductListStore';

export default function CategoryProducts({ categoryName }) {
  const { products, fetchProducts } = useProductListStore();
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);

  const [options, setOptions] = useState({
    판매중: false,
    예약중: false,
    판매완료: false,
  });

  // 초기 데이터 로딩
  useEffect(() => {
    fetchProducts({
      category: categoryName === "전체" ? undefined : categoryName.toLowerCase()
    });
  }, [categoryName,fetchProducts]);

  // 필터링 로직
  useEffect(() => {
    let result = [...products];

    // 가격 필터링
    if (minPrice) {
      result = result.filter(product => product.price >= parseInt(minPrice, 10));
    }
    if (maxPrice) {
      result = result.filter(product => product.price <= parseInt(maxPrice, 10));
    }

    // 상태 필터링
    const selectedStatuses = Object.entries(options)
      .filter(([_, isSelected]) => isSelected)
      .map(([status]) => status);

    if (selectedStatuses.length > 0) {
      result = result.filter(product => selectedStatuses.includes(product.status));
    }

    setFilteredProducts(result);
  }, [products, minPrice, maxPrice, options]);

  const handleOptionClick = (option) => {
    setOptions(prevOptions => ({
      ...prevOptions,
      [option]: !prevOptions[option],
    }));
  };

  const handlePriceKeyPress = (e) => {
    if (e.key === 'Enter') {
      // 엔터 키 입력 시 필터링이 자동으로 적용됨 (useEffect를 통해)
      e.target.blur(); // 포커스 제거
    }
  };

  return (
    <div className="mt-[1rem]">
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
              onKeyPress={handlePriceKeyPress}
              width="w-[10rem]"
              height="h-[1.8rem]"
            />
            <span className="mx-[0.8rem]">~</span>
            <InputBox
              type="text"
              placeholder="최고 금액"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              onKeyPress={handlePriceKeyPress}
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
              <div 
                key={option} 
                className="flex items-center cursor-pointer" 
                onClick={() => handleOptionClick(option)}
              >
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
          <Product 
            key={product.sales_board_id} 
            product={product}
          />
        ))}
      </div>
    </div>   
  );
}