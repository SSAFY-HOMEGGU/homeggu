

// 'use client'
// {/*  
//   사용법
//   <div className="grid grid-cols-4 gap-3">
//       {products.map((product) => (
//         <Product key={product.sales_board_id} product={product} />
//       ))}
//   </div> 
// */}

// import Image from 'next/image';
// import Link from 'next/link';
// import { useState } from 'react';
// import useProductActionStore from '@/app/store/useProductActionStore';
// import useProductListStore from '@/app/store/useProductListStore';
// import { preferenceUpdate } from '../api/userApi';

// export default function Product({ product }) {

//   const { toggleLike } = useProductActionStore();
//   const { updateProduct, updateSelectedProduct } = useProductListStore();

//   const MOOD_KOREAN = {
//     'WOOD_VINTAGE': '우드 & 빈티지',
//     'BLACK_METALLIC': '블랙 & 메탈릭',
//     'WHITE_MINIMAL': '화이트 & 미니멀',
//     'MODERN_CLASSIC': '모던 & 클래식'
//   };


//   const handleLikeClick = async (e) => {
//     e.preventDefault(); // 링크 이동 방지
//     e.stopPropagation(); // 이벤트 버블링 방지
    
//     try {
//       await toggleLike(product.salesBoardId);
//     } catch (error) {
//       console.error('좋아요 처리 실패:', error);
//     }
//   };

//   const handleProductClick = () => {
//     // 조회수 증가 및 상품 정보 업데이트
//     updateProduct(product.salesBoardId, {
//       ...product,
//       viewCnt: (product.viewCnt || 0) + 1
//     });
//     updateSelectedProduct(product);

//     // 선호도 업데이트
//     preferenceUpdate({
//       category: product.category,
//       mood: MOOD_KOREAN[product.mood],
//       action: "click",
//       clickedSalesBoardId: product.salesBoardId
//     });

//   };
  
//   // 이미지 URL이 없는 경우 기본 이미지 사용\
//   const defaultImage = '/images/bed2.png'; // 기본 이미지 경로를 지정하세요
//   const imageUrl = product.goodsImagePaths?.[0];
//   // const imageUrl = product.goodsImagePaths?.[0] ? 
//   //   encodeURI(product.goodsImagePaths[0]) : 
//   //   defaultImage;
//   console.log('imageUrl',imageUrl)
//   // const imageUrl = product.goodsImagePaths[0];
  
//   return (
//     <Link 
//       href={`/product/${product.salesBoardId}`} 
//       onClick={handleProductClick}
//     >
//       {/* <div 
//         className="relative w-[14rem] h-[14rem] flex-shrink-0 border rounded-[0.8rem] bg-lightgray bg-cover bg-center" 
//         style={{ backgroundImage: `url(${imageUrl})` }}
//       > */}
//       <div className="relative w-[14rem] h-[14rem] flex-shrink-0 border rounded-[0.8rem] bg-lightgray bg-cover bg-center">
//         <Image
//           src={imageUrl || defaultImage}
//           alt={product.title || '상품 이미지'}
//           fill
//           sizes="14rem"
//           className="rounded-[0.8rem] object-cover"
//           priority={false}
//           quality={75}
//           // onError={(e) => {
//           //   console.error('이미지 로드 실패:', imageUrl);
//           //   e.currentTarget.src = defaultImage;
//           // }}
//         />
//         <div onClick={handleLikeClick} className="absolute bottom-2 right-2 cursor-pointer">
//           <Image
//             src={product.isLiked ? '/icons/activeHeart.svg' : '/icons/unactiveHeart.svg'}
//             alt="Heart Icon"
//             width={24}
//             height={24}
//           />
//         </div>
//       </div>
//       <div className="mt-4">
//         <p className="text-normalText text-[1.1rem] font-normal"> 
//           {product.title}
//         </p>
//         <p className="text-normalText text-[1.1rem] font-bold mt-1">
//           {product.price}원
//         </p>
//         <p className="text-inputText text-[0.8rem] font-normal">
//           {product.createdAt}
//         </p>
//       </div>
//     </Link>
//   );
// }

'use client';

import Image from 'next/image';
import Link from 'next/link';
import useProductStore from '@/app/store/useProductStore';

export default function Product({ product }) {
  const { toggleLike, fetchProduct } = useProductStore();

  const MOOD_KOREAN = {
    'WOOD_VINTAGE': '우드 & 빈티지',
    'BLACK_METALLIC': '블랙 & 메탈릭',
    'WHITE_MINIMAL': '화이트 & 미니멀',
    'MODERN_CLASSIC': '모던 & 클래식'
  };

  const handleLikeClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      await toggleLike(product.salesBoardId);
    } catch (error) {
      console.error('좋아요 처리 실패:', error);
    }
  };

  const handleProductClick = async () => {
    try {
      // 상세 정보 조회 (조회수도 함께 증가)
      await fetchProduct(product.salesBoardId);
      
      // 선호도 업데이트
      await preferenceUpdate({
        category: product.category,
        mood: MOOD_KOREAN[product.mood],
        action: "click",
        clickedSalesBoardId: product.salesBoardId
      });
    } catch (error) {
      console.error('상품 상세 정보 조회 실패:', error);
    }
  };
  
  const defaultImage = '/images/bed2.png';
  const imageUrl = product.goodsImagePaths?.[0];
  
  return (
    <Link 
      href={`/product/${product.salesBoardId}`} 
      onClick={handleProductClick}
    >
      <div className="relative w-[14rem] h-[14rem] flex-shrink-0 border rounded-[0.8rem] bg-lightgray bg-cover bg-center">
        <Image
          src={imageUrl || defaultImage}
          alt={product.title || '상품 이미지'}
          fill
          sizes="14rem"
          className="rounded-[0.8rem] object-cover"
          priority={false}
          quality={75}
        />
        <div 
          onClick={handleLikeClick} 
          className="absolute bottom-2 right-2 cursor-pointer"
        >
          <Image
            src={product.isLiked ? '/icons/activeHeart.svg' : '/icons/unactiveHeart.svg'}
            alt="Heart Icon"
            width={24}
            height={24}
          />
        </div>
      </div>
      <div className="mt-4">
        <p className="text-normalText text-[1.1rem] font-normal"> 
          {product.title}
        </p>
        <p className="text-normalText text-[1.1rem] font-bold mt-1">
          {product.price}원
        </p>
        <p className="text-inputText text-[0.8rem] font-normal">
          {product.createdAt}
        </p>
      </div>
    </Link>
  );
}