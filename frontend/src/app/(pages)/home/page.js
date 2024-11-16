// 'use client';

// import { useState, useEffect, Suspense, useRef } from "react";
// import { useSearchParams } from 'next/navigation';
// import ImageSwiper from "@/app/components/ImageSwiper";
// import Product from "@/app/components/Product";
// import useProductListStore from '@/app/store/useProductListStore';
// import JoinModal from "./components/JoinModal";

// function HomeContent() {
//   const { 
//     products, 
//     fetchProducts, 
//     resetProducts,
//     loading, 
//     hasMore,
//     page 
//    } = useProductListStore();
//   const [showSurvey, setShowSurvey] = useState(false);
//   const searchParams = useSearchParams();
//   const observerTarget = useRef(null); 

//   const images = [
//     { src: "/images/home_banner1.png", alt: "Slide 1" },
//     { src: "/images/home_banner2.png", alt: "Slide 2" },
//     { src: "/images/home_banner3.png", alt: "Slide 3" },
//     { src: "/images/home_banner4.png", alt: "Slide 4" },
//   ];

//   useEffect(() => {
//     console.log('[Home] 초기 데이터 로딩 시작');
//     resetProducts();
//     fetchProducts();
//   }, []); 

//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       (entries) => {
//         const entry = entries[0];
//         console.log('[Home] Intersection 상태:', {
//           isIntersecting: entry.isIntersecting,
//           hasMore,
//           loading,
//           target: observerTarget.current
//         });

//         if (entry.isIntersecting && hasMore && !loading) {
//           console.log('[Home] 추가 데이터 로딩 시작', { page });
//           fetchProducts();
//         }
//       },
//       { 
//         root: null,
//         rootMargin: '50px',
//         threshold: 0.1 
//       }
//     );

//     const currentTarget = observerTarget.current;
//     if (currentTarget) {
//       console.log('[Home] Observer 연결됨');
//       observer.observe(currentTarget);
//     }

//     return () => {
//       if (currentTarget) {
//         console.log('[Home] Observer 해제됨');
//         observer.unobserve(currentTarget);
//       }
//     };
//   }, [hasMore, loading, fetchProducts, page]);

//   useEffect(() => {
//     const isFirstLogin = searchParams.get('firstLogin') === 'true';
//     setShowSurvey(isFirstLogin);
//   }, [searchParams]);

//   const handleCloseModal = () => {
//     setShowSurvey(false);
//   };

// return (
//   <div className="py-0">
//     <div className="h-[10rem]">
//       <ImageSwiper images={images} imageWidth={1920} imageHeight={400} />
//     </div>

//     <div className="mt-[1rem]">
//       <h2 className="font-bold font-tmoney mb-[0.5rem]">인기 상품</h2>
      
//       {/* 상품 목록 */}
//       <div className="grid grid-cols-4 gap-4 md:grid-cols-4 sm:grid-cols-2 grid-cols-1">
//         {products.map((product) => (
//           <Product key={product.salesBoardId} product={product} />
//         ))}
//       </div>


//       {/* Observer Target - 항상 존재하도록 수정 */}
//       <div 
//         ref={observerTarget}
//         style={{ height: '20px', margin: '20px 0' }}
//         className="w-full"
//       />

//     </div>

//     <JoinModal isOpen={showSurvey} onClose={handleCloseModal} />
//   </div>
// );
// }

// export default function Page() {
// return (
//   <Suspense fallback={<div>Loading...</div>}>
//     <HomeContent />
//   </Suspense>
// );
// }
'use client';

import { useState, useEffect, Suspense, useRef } from "react";
import { useSearchParams } from 'next/navigation';
import ImageSwiper from "@/app/components/ImageSwiper";
import Product from "@/app/components/Product";
import useProductManageStore from '@/app/store/useProductManageStore';
import JoinModal from "./components/JoinModal";
import { useRouter } from "next/navigation";
import ModelReadyModal from "../sell/services/ModelReadyModal";
import { backgroundConversionService } from "../sell/services/backgroundConversionService";
import { preferenceList } from "@/app/api/userApi";

function HomeContent() {
  const router = useRouter()
  // useProductListStore 대신 useProductManageStore 사용
  const { 
    products, 
    fetchProducts, 
    resetStore,  // resetProducts -> resetStore로 변경
    loading, 
    hasMore,
    page 
   } = useProductManageStore();
  const [showSurvey, setShowSurvey] = useState(false);
  const searchParams = useSearchParams();
  const observerTarget = useRef(null); 

  const images = [
    { src: "/images/home_banner1.png", alt: "Slide 1" },
    { src: "/images/home_banner2.png", alt: "Slide 2" },
    { src: "/images/home_banner3.png", alt: "Slide 3" },
    { src: "/images/home_banner4.png", alt: "Slide 4" },
  ];

  const [modalData, setModalData] = useState(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await preferenceList();
        setRecommendations(response); // API 응답 데이터로 상태 업데이트
      } catch (error) {
        console.error('추천 상품 조회 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);



  useEffect(() => {
    // backgroundConversionService 콜백 설정
    backgroundConversionService.setModelReadyCallback((data) => {
      setModalData(data);
    });

    return () => {
      backgroundConversionService.setModelReadyCallback(null);
    };
  }, []);


  useEffect(() => {
    console.log('[Home] 초기 데이터 로딩 시작');
    resetStore();  // resetProducts -> resetStore로 변경
    fetchProducts();
  }, [router.asPath]); 

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        console.log('[Home] Intersection 상태:', {
          isIntersecting: entry.isIntersecting,
          hasMore,
          loading,
          target: observerTarget.current
        });

        if (entry.isIntersecting && hasMore && !loading) {
          console.log('[Home] 추가 데이터 로딩 시작', { page });
          fetchProducts();
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
      console.log('[Home] Observer 연결됨');
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        console.log('[Home] Observer 해제됨');
        observer.unobserve(currentTarget);
      }
    };
  }, [hasMore, loading, fetchProducts, page]);

  useEffect(() => {
    const isFirstLogin = searchParams.get('firstLogin') === 'true';
    setShowSurvey(isFirstLogin);
  }, [searchParams]);

  const handleCloseModal = () => {
    setShowSurvey(false);
  };

  return (
    <div className="py-0">
      <div className="h-[10rem]">
        <ImageSwiper images={images} imageWidth={1920} imageHeight={400} />
      </div>

      <div className="mt-[1rem]">
        <h2 className="font-bold font-tmoney mb-[0.5rem]">인기 상품</h2>
        
        <div className="grid grid-cols-4 gap-4 md:grid-cols-4 sm:grid-cols-2 grid-cols-1">
          {products.map((product) => (
            <Product key={product.salesBoardId} product={product} />
          ))}
        </div>

        <div 
          ref={observerTarget}
          style={{ height: '20px', margin: '20px 0' }}
          className="w-full"
        />
      </div>

      <JoinModal isOpen={showSurvey} onClose={handleCloseModal} />

      <ModelReadyModal
        isOpen={!!modalData}
        onClose={() => setModalData(null)}
        objUrl={modalData?.objUrl}
        onUploadComplete={modalData?.onUploadComplete}
      />

    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomeContent />
    </Suspense>
  );
}