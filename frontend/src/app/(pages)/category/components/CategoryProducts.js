"use client";

import { useState, useEffect, useRef } from "react";
import Product from "@/app/components/Product";
import InputBox from "@/app/components/InputBox";
import Image from "next/image";
import useProductStore from "@/app/store/useProductManageStore";

export default function CategoryProducts({ categoryName }) {
  const { products, fetchProducts, resetStore, loading, hasMore } = useProductStore();
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const observerTarget = useRef(null);

  const CATEGORY_MAPPING = {
    "전체": '',
    "침대": "BED",
    "식탁": "DINING_TABLE", 
    "책상": "DESK",
    "소파": "SOFA",
    "의자": "CHAIR",
    "서랍": "DRAWER",
    "수납": "STORAGE",
    "조명": "LIGHTING",
    "전등": "LAMP",
    "가전": "APPLIANCES"
  };

  const [options, setOptions] = useState({
    AVAILABLE: false,
    RESERVING: false,
    SOLD: false
  });

  const fetchFilteredProducts = async (loadMore = false) => {
    if (!loadMore) {
      resetStore();
    }

    const baseParams = {
      category: CATEGORY_MAPPING[categoryName] || '',
      ...(minPrice && { min_price: parseInt(minPrice, 10) }),
      ...(maxPrice && { max_price: parseInt(maxPrice, 10) })
    };

    const selectedStatuses = Object.entries(options)
      .filter(([_, isSelected]) => isSelected)
      .map(([status]) => status);

    if (selectedStatuses.length > 0) {
      for (const status of selectedStatuses) {
        await fetchProducts({
          ...baseParams,
          isSell: status
        });
      }
    } else {
      await fetchProducts(baseParams);
    }
  };

  useEffect(() => {
    fetchFilteredProducts(false);
  }, [categoryName, minPrice, maxPrice, options]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && hasMore && !loading) {
          fetchFilteredProducts(true);
        }
      },
      { 
        root: null,
        rootMargin: '50px',
        threshold: 0.1 
      }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasMore, loading, fetchFilteredProducts]);

  const handleOptionClick = (status) => {
    setOptions(prev => ({
      ...prev,
      [status]: !prev[status]
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
        {/* 가격 필터 */}
        <div className="w-1/2 flex items-center">
          <span className="font-[Tmoney RoundWind] text-[1.15rem] text-normalText ml-[1rem]">
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

        {/* 상태 필터 */}
        <div className="w-1/2 flex items-center">
          <span className="font-[Tmoney RoundWind] text-[1.15rem] text-normalText ml-4">
            옵션
          </span>
          <div className="ml-[1rem] flex space-x-4 items-center">
            {[
              { status: 'AVAILABLE', label: '판매중' },
              { status: 'RESERVING', label: '예약중' },
              { status: 'SOLD', label: '판매완료' }
            ].map(({ status, label }) => (
              <div 
                key={status} 
                className="flex items-center cursor-pointer" 
                onClick={() => handleOptionClick(status)}
              >
                <Image
                  src={options[status] ? "/icons/activeCheck.svg" : "/icons/unactiveCheck.svg"}
                  alt={`${label} 체크`}
                  width={20}
                  height={20}
                />
                <span className="ml-2">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 상품 목록 */}
      <div className="grid grid-cols-4 gap-4 md:grid-cols-4 sm:grid-cols-2 grid-cols-1">
        {products.map((product) => (
          <Product 
            key={product.salesBoardId} 
            product={product}
          />
        ))}
      </div>

      {/* Intersection Observer 타겟 */}
      <div 
        ref={observerTarget}
        style={{ height: '20px', margin: '20px 0' }}
        className="w-full"
      />
    </div>   
  );
}