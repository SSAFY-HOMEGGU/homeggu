// 'use client'

// // import ImageSwiper from "./components/ImageSwiper"
// import { useState, useEffect,Suspense  } from "react";
// import { useSearchParams } from 'next/navigation';
// import ImageSwiper from "@/app/components/ImageSwiper";
// import Product from "@/app/components/Product";
// import useProductListStore from '@/app/store/useProductListStore';
// import JoinModal from "./components/JoinModal";

// export default function Page() {
//   const { products, fetchProducts } = useProductListStore();
//   const [showSurvey, setShowSurvey] = useState(false);
//   const searchParams = useSearchParams();

//   const images = [
//     { src: "/images/home_banner1.png", alt: "Slide 1" },
//     { src: "/images/home_banner2.png", alt: "Slide 2" },
//     { src: "/images/home_banner3.png", alt: "Slide 3" },
//     { src: "/images/home_banner4.png", alt: "Slide 4" },
//   ];

//   // 컴포넌트 마운트 시 전체 상품 데이터 가져오기
//   useEffect(() => {
//     fetchProducts();
//   }, [fetchProducts]);

//   useEffect(() => {
//     // firstLogin 파라미터가 있고 값이 'true'일 때만 모달 표시
//     const isFirstLogin = searchParams.get('firstLogin') === 'true';
//     setShowSurvey(isFirstLogin);
//   }, [searchParams]);

//   const handleCloseModal = () => {
//     setShowSurvey(false);
//   };


//   const recommendedProducts = [
//     {
//       sales_board_id: 1,
//       title: "상품 이름 1",
//       price: 50000,
//       created_at: "2024-10-01",
//       imageUrl: ["/images/bed2.png","/images/bed3.png"],
//       seller_id: 1,
//       isLiked: false
//     },
//     {
//       sales_board_id: 2,
//       title: "상품 이름 2",
//       price: 30000,
//       created_at: "2024-10-02",
//       imageUrl: ["/images/bed2.png","/images/bed3.png"],
//       seller_id: 2,
//       isLiked: false
//     },
//     {
//       sales_board_id: 3,
//       title: "상품 이름 3",
//       price: 50000,
//       created_at: "2024-10-01",
//       imageUrl: ["/images/bed2.png","/images/bed3.png"],
//       seller_id: 1,
//       isLiked: false
//     },
//     {
//       sales_board_id: 4,
//       title: "상품 이름 4",
//       price: 30000,
//       created_at: "2024-10-02",
//       imageUrl: ["/images/bed2.png","/images/bed3.png"],
//       seller_id: 2,
//       isLiked: false
//     },
//   ];

//   return (
//     <div className="py-0">
//       <div className="h-[10rem]">
//         {/* <ImageSwiper images={images} /> */}
//         <ImageSwiper 
//           images={images} 
//           imageWidth={1920}
//           imageHeight={400}
//         />
//       </div>

//       {/* <div className="mt-[1rem]">
//         <h2 className="font-bold font-tmoney mb-[0.5rem]">추천 상품</h2>
//           <div className="grid grid-cols-4 gap-4 md:grid-cols-4 sm:grid-cols-2 grid-cols-1">
//             {recommendedProducts.map((product) => (
//               <Product key={product.sales_board_id} product={product} />
//             ))}
//           </div>
//       </div> */}

//       <div className="mt-[1rem]">
//         <h2 className="font-bold font-tmoney mb-[0.5rem]">인기 상품</h2>
//         <div className="grid grid-cols-4 gap-4 md:grid-cols-4 sm:grid-cols-2 grid-cols-1">
//             {products.map((product) => (
//               <Product key={product.sales_board_id} product={product} />
//             ))}
//           </div>
//       </div>

//       <JoinModal 
//         isOpen={showSurvey} 
//         onClose={handleCloseModal}
//       />
//     </div>
//   )
// }
'use client';

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from 'next/navigation';
import ImageSwiper from "@/app/components/ImageSwiper";
import Product from "@/app/components/Product";
import useProductListStore from '@/app/store/useProductListStore';
import JoinModal from "./components/JoinModal";

function HomeContent() {
  const { products, fetchProducts } = useProductListStore();
  const [showSurvey, setShowSurvey] = useState(false);
  const searchParams = useSearchParams();

  const images = [
    { src: "/images/home_banner1.png", alt: "Slide 1" },
    { src: "/images/home_banner2.png", alt: "Slide 2" },
    { src: "/images/home_banner3.png", alt: "Slide 3" },
    { src: "/images/home_banner4.png", alt: "Slide 4" },
  ];

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

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
            <Product key={product.sales_board_id} product={product} />
          ))}
        </div>
      </div>

      <JoinModal isOpen={showSurvey} onClose={handleCloseModal} />
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
