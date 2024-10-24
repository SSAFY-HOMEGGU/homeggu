'use client'
{/*  
  사용법
  <div className="grid grid-cols-4 gap-3">
      {products.map((product) => (
        <Product key={product.id} product={product} />
      ))}
  </div> 
*/}

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import LikeStore from '../store/likeStore';

export default function Product({ product }) {
  const { likedProducts, setlikedProducts } = LikeStore();
  const isLiked = likedProducts.includes(product.id);

  const handleLikeClick = (e) => {
    e.preventDefault();
    setlikedProducts(product.id); // 좋아요 상태 변경
  };
  
  return (
    <Link href={`/product/${product.id}`}>
      <div 
        className="relative w-[17rem] h-[17rem] flex-shrink-0 border rounded-[0.8rem] bg-lightgray bg-cover bg-center" 
        style={{ backgroundImage: `url(${product.imageUrl})` }}
      >
         <div onClick={handleLikeClick} className="absolute bottom-2 right-2 cursor-pointer">
            <Image
              src={isLiked ? '/icons/activeHeart.svg' : '/icons/unactiveHeart.svg'}
              alt="Heart Icon"
              width={24} // 아이콘 크기 설정
              height={24}
            />
          </div>
      </div>
      <div className="mt-4">
        <p className="text-normalText text-[1.1rem] font-normal"> 
          {product.name}
        </p>
        <p className="text-normalText text-[1.1rem] font-bold mt-1">
          {product.price}
        </p>
        <p className="text-inputText text-[0.8rem] font-normal">
          {product.date}
        </p>
      </div>
    </Link>
  );
}
