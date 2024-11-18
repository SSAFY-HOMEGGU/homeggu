// 'use client';

// import { useSearchParams } from 'next/navigation';
// import { useEffect, Suspense } from 'react';
// import useProductListStore from '@/app/store/useProductListStore';
// import CategoryProducts from '../category/components/CategoryProducts';
// import { preferenceUpdate } from '@/app/api/userApi';

// function SearchContent() {
//   const searchParams = useSearchParams();
//   const query = searchParams.get('query');
//   const { products, fetchProducts } = useProductListStore();

//   useEffect(() => {
//     const handleSearch = async () => {
//       if (query) {
//         // 상품 검색
//         await fetchProducts({
//           title: query,
//           page: 0,
//           size: 10,
//         });

//         try {
//           await preferenceUpdate({
//             category: "",
//             mood: "",
//             action: "search",
//             clickedSalesBoardId: ""
//           });
//         } catch (error) {
//           console.error('선호도 업데이트 실패:', error);
//         }
//       }
//     };

//     handleSearch();
//   }, [query, fetchProducts]);

//   return (
//     <div className="content-area py-8">
//       <h1 className="text-xl font-bold mb-6">
//         &apos;{query}&apos; 검색 결과
//       </h1>
//       <CategoryProducts categoryName="검색 결과" products={products} />
//     </div>
//   );
// }

// export default function SearchPage() {
//   return (
//     <Suspense fallback={<div>Loading...</div>}>
//       <SearchContent />
//     </Suspense>
//   );
// }

'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useEffect, useRef, Suspense} from 'react';
import useProductStore from '@/app/store/useProductManageStore';
import { preferenceUpdate } from '@/app/api/userApi';
import InputBox from "@/app/components/InputBox";
import Image from "next/image";
import Product from "@/app/components/Product";

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('query');
  const { products, fetchProducts, resetStore, loading, hasMore } = useProductStore();
  const observerTarget = useRef(null);
  
  // 필터 상태 관리
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [options, setOptions] = useState({
    AVAILABLE: false,
    RESERVING: false,
    SOLD: false
  });

  // 검색과 필터를 결합하여 상품 조회
  const fetchFilteredProducts = async (loadMore = false) => {
    if (!loadMore) {
      resetStore();
    }

    // 검색어와 필터 조건을 결합
    const baseParams = {
      title: query,
      ...(minPrice && { min_price: parseInt(minPrice, 10) }),
      ...(maxPrice && { max_price: parseInt(maxPrice, 10) })
    };

    // 선택된 상태 필터 처리
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

  // 초기 검색 실행 및 선호도 업데이트
  useEffect(() => {
    const handleSearch = async () => {
      if (query) {
        await fetchFilteredProducts();
        try {
          // 검색 선호도 업데이트
          await preferenceUpdate({
            category: '',
            mood: '',
            action: 'search',
            clickedSalesBoardId: '',
          });
        } catch (error) {
          console.error('선호도 업데이트 실패:', error);
        }
      }
    };

    handleSearch();
  }, [query]);

  // 필터 변경시 검색 결과 업데이트
  useEffect(() => {
    fetchFilteredProducts();
  }, [minPrice, maxPrice, options]);

  // 무한 스크롤 구현
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
  }, [hasMore, loading]);

  // 상태 필터 토글 핸들러
  const handleOptionClick = (status) => {
    setOptions(prev => ({
      ...prev,
      [status]: !prev[status]
    }));
  };

  // 가격 입력 엔터키 처리
  const handlePriceKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.target.blur();
    }
  };

  return (
    <div className="content-area py-8">
      <h1 className="text-xl font-bold mb-6">
        &apos;{query}&apos; 검색 결과
      </h1>

      {/* 필터 영역 */}
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

      {/* 무한 스크롤 타겟 */}
      <div 
        ref={observerTarget}
        style={{ height: '20px', margin: '20px 0' }}
        className="w-full"
      />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchContent />
    </Suspense>
  );
}