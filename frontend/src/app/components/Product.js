

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
  const imagePaths = typeof product.goodsImagePaths === 'string' 
    ? JSON.parse(product.goodsImagePaths)
    : product.goodsImagePaths;

    console.log('타입:', typeof product.goodsImagePaths);
    console.log('값:', product.goodsImagePaths);
    console.log('배열 맞나?:', Array.isArray(product.goodsImagePaths));

  console.log('파싱된 이미지 경로:', imagePaths); 
  console.log('첫 번째 이미지:', imagePaths?.[0]);

  const { toggleLike } = useProductActionStore();
  const updateProduct = useProductListStore(state => state.updateProduct);

  const handleLikeClick = async (e) => {
    e.preventDefault();
    console.log('좋아요 클릭:', product.salesBoardId);
    await toggleLike(product.salesBoardId);
  };

  const handleProductClick = () => {
    // 조회수 증가 및 상품 정보 업데이트
    updateProduct(product.salesBoardId, {
      ...product,
      viewCnt: (product.viewCnt || 0) + 1
    });
  };
  
  // 이미지 URL이 없는 경우 기본 이미지 사용
  const defaultImage = '/images/bed2.png'; // 기본 이미지 경로를 지정하세요
  const imageUrl = product.goodsImagePaths?.[0] || defaultImage;
  // const imageUrl = product.goodsImagePaths[0];
  
  return (
    <Link 
      href={`/product/${product.salesBoardId}`} 
      onClick={handleProductClick}
    >
      <div 
        className="relative w-[14rem] h-[14rem] flex-shrink-0 border rounded-[0.8rem] bg-lightgray bg-cover bg-center" 
        style={{ backgroundImage: `url(${imageUrl})` }}
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
          {product.createdAt}
        </p>
      </div>
    </Link>
  );
}