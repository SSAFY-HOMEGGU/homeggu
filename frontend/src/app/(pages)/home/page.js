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
import { detailSalesBoard } from "@/app/api/productApi";
import { goodsIsLike } from "@/app/api/userApi";

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
  const [recommendations, setRecommendations] = useState([]);
  const [recommendedProducts, setRecommendedProducts] = useState([]);

  useEffect(() => {
    console.log('Current token:', localStorage.getItem('accessToken'));
  }, []);
  

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await preferenceList();
        console.log('추천상품',response);
        setRecommendations(response); // API 응답 데이터로 상태 업데이트

        // recommendations 배열이 있는지 확인
        if (response && response.recommendations && Array.isArray(response.recommendations)) {
          // 상위 4개의 추천 상품만 선택
          const top4Recommendations = response.recommendations.slice(0, 4);
          setRecommendations(top4Recommendations);

          // 4개의 상품에 대해서만 상세 정보 조회
          const recommendationDetails = await Promise.all(
            top4Recommendations.map(async (item) => {
              try {
                const detail = await detailSalesBoard(item.sales_board_id);
                return detail;
              } catch (error) {
                console.error(`상품 ${item.sales_board_id} 상세 정보 조회 실패:`, error);
                return null;
              }
            })
          );
          // null 값을 필터링하고 상태 업데이트
          const validProducts = recommendationDetails.filter(product => product !== null);
          setRecommendedProducts(validProducts);
        } else {
          console.error('추천 상품 데이터 형식이 올바르지 않습니다:', response);
        }
      } catch (error) {
        console.error('추천 상품 조회 실패:', error);
      } 
    };

    fetchRecommendations();
  }, []);

  useEffect(() => {
    console.log('현재 recommendations:', recommendations);
  }, [recommendations]);


  // useEffect(()=> {
  //   const likeListApi =  async () => {
  //     try {
  //       const likeList = goodsIsLike()
  //     }
  //   }
  // })

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
        <h2 className="font-bold font-tmoney mb-[0.5rem]">추천 상품</h2>
        
        <div className="grid grid-cols-4 gap-4 md:grid-cols-4 sm:grid-cols-2 grid-cols-1">
          {recommendedProducts.map((product) => (
            <Product key={product.salesBoardId} product={product} />
          ))}
        </div>

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