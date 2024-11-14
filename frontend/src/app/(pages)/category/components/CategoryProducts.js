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

  const STATUS_MAPPING = {
    '판매중': 'AVAILABLE',
    '예약중': 'RESERVING',
    '판매완료': 'SOLD'
  };

  const [options, setOptions] = useState({
    판매중: false,
    예약중: false,
    판매완료: false,
  });

  const CATEGORY_MAPPING = {
    "전체":'',
    "침대": "BED",
    "식탁": "DINING_TABLE", 
    "책상": "DESK",
    "소파": "SOFA",
    "의자": "CHAIR",
    "서랍": "DRESSER",
    "수납": "BOOKSHELF",
    "조명": "LIGHTING",
    "전등": "LIGHTING",   /// 수정하기
    "가전": "WARDROBE"
  };

  // 선택된 상태에 따른 API 호출 함수
  const fetchFilteredProducts = async (selectedOptions) => {
    // 선택된 상태들을 배열로 변환
    const selectedStatuses = Object.entries(selectedOptions)
      .filter(([_, isSelected]) => isSelected)
      .map(([status]) => STATUS_MAPPING[status]);

    // API 호출을 위한 기본 파라미터
    let baseParams = {
      category: CATEGORY_MAPPING[categoryName] || '',
      min_price: minPrice ? parseInt(minPrice, 10) : undefined,
      max_price: maxPrice ? parseInt(maxPrice, 10) : undefined,
      page: 0,
      size: 10
    };

  // undefined 값을 가진 속성 제거
  baseParams = Object.fromEntries(
    Object.entries(baseParams).filter(([_, value]) => value !== undefined && value !== '')
  );

    // 선택된 상태가 있는 경우, 각 상태별로 API 호출
    if (selectedStatuses.length > 0) {
      // 각 상태별로 API 호출하고 결과 합치기
      const allProducts = await Promise.all(
        selectedStatuses.map(status =>
          fetchProducts({
            ...baseParams,
            isSell: status
          })
        )
      );

      // products는 store에서 자동으로 업데이트됨
    } else {
      // 선택된 상태가 없으면 기본 파라미터로만 호출
      await fetchProducts(baseParams);
    }
  };

  // 초기 데이터 로딩 및 필터 적용
  useEffect(() => {
    fetchFilteredProducts(options);
  }, [categoryName, minPrice, maxPrice, options]);

  // 상품 목록 업데이트
  useEffect(() => {
    setFilteredProducts(products);
  }, [products]);

  const handleOptionClick = (option) => {
    setOptions(prevOptions => ({
      ...prevOptions,
      [option]: !prevOptions[option],
    }));
  };

  const handlePriceKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.target.blur();
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

      {/* <h2 className="font-bold text-[1.25rem] text-subText font-tmoney mb-[0.5rem]">
        {categoryName}
      </h2> */}
      <div className="grid grid-cols-4 gap-4 md:grid-cols-4 sm:grid-cols-2 grid-cols-1">
        {filteredProducts.map((product) => (
          <Product 
            key={product.salesBoardId} 
            product={product}
          />
        ))}
      </div>
    </div>   
  );
}