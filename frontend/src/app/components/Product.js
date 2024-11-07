// 'use client'
// {/*  
//   사용법
//   <div className="grid grid-cols-4 gap-3">
//       {products.map((product) => (
//         <Product key={product.id} product={product} />
//       ))}
//   </div> 
// */}

// import Image from 'next/image';
// import Link from 'next/link';
// import { useState } from 'react';
// import LikeStore from '../store/likeStore';
// import useProductStore from '@/app/store/productStore';

// export default function Product({ product }) {
//   const { likedProducts, setlikedProducts } = LikeStore();
//   const { setSelectedProduct } = useProductStore();

//   const isLiked = likedProducts.includes(product.id);

//   const handleLikeClick = (e) => {
//     e.preventDefault();
//     setlikedProducts(product.id); // 좋아요 상태 변경
//   };

//   const handleProductClick = () => {
//     setSelectedProduct(product); // 상품을 선택하면 Zustand에 상품 정보를 저장
//   };
  
//   return (
//     <Link href={`/product/${product.id}`} onClick={handleProductClick}>
//       <div 
//         className="relative w-[14rem] h-[14rem] flex-shrink-0 border rounded-[0.8rem] bg-lightgray bg-cover bg-center" 
//         style={{ backgroundImage: `url(${product.imageUrl[0]})` }}
//       >
//          <div onClick={handleLikeClick} className="absolute bottom-2 right-2 cursor-pointer">
//             <Image
//               src={isLiked ? '/icons/activeHeart.svg' : '/icons/unactiveHeart.svg'}
//               alt="Heart Icon"
//               width={24} // 아이콘 크기 설정
//               height={24}
//             />
//           </div>
//       </div>
//       <div className="mt-4">
//         <p className="text-normalText text-[1.1rem] font-normal"> 
//           {product.name}
//         </p>
//         <p className="text-normalText text-[1.1rem] font-bold mt-1">
//           {product.price}
//         </p>
//         <p className="text-inputText text-[0.8rem] font-normal">
//           {product.date}
//         </p>
//       </div>
//     </Link>
//   );
// }

'use client'
{/*  
  사용법
  <div className="grid grid-cols-4 gap-3">
      {products.map((product) => (
        <Product key={product.sales_board_id} product={product} />
      ))}
  </div> 
*/}

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import useProductActionStore from '@/app/store/useProductActionStore';
import useProductListStore from '@/app/store/useProductListStore';

export default function Product({ product }) {
  const { toggleLike } = useProductActionStore();
  const updateProduct = useProductListStore(state => state.updateProduct);

  const handleLikeClick = async (e) => {
    e.preventDefault();
    console.log('좋아요 클릭:', product.sales_board_id);
    await toggleLike(product.sales_board_id);
  };

  const handleProductClick = () => {
    // 조회수 증가 및 상품 정보 업데이트
    updateProduct(product.sales_board_id, {
      ...product,
      view_cnt: product.view_cnt + 1
    });
  };
  
  return (
    <Link 
      href={`/product/${product.sales_board_id}`} 
      onClick={handleProductClick}
    >
      <div 
        className="relative w-[14rem] h-[14rem] flex-shrink-0 border rounded-[0.8rem] bg-lightgray bg-cover bg-center" 
        style={{ backgroundImage: `url(${product.imageUrl[0]})` }}
      >
        <div onClick={handleLikeClick} className="absolute bottom-2 right-2 cursor-pointer">
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
          {product.created_at}
        </p>
      </div>
    </Link>
  );
}