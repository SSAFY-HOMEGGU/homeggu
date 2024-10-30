import React from 'react'
import Image from 'next/image';
import { BlueButton,WhiteButton } from '@/app/components/Button';
import LikeStore from '@/app/store/likeStore';

function BuyerActions({product}) {
  const { likedProducts, setlikedProducts } = LikeStore();

  const isLiked = likedProducts.includes(product.id);

  const handleLikeClick = (e) => {
    e.preventDefault();
    setlikedProducts(product.id); // 좋아요 상태 변경
  };

  return (
    <div className="flex flex-row items-center gap-4 mt-4">
      <div onClick={handleLikeClick} className="cursor-pointer">
        <Image
          src={isLiked ? '/icons/activeHeart.svg' : '/icons/unactiveHeart.svg'}
          alt="Heart Icon"
          width={24} // 아이콘 크기 설정
          height={24}
        />
      </div>
      <WhiteButton>채팅하기</WhiteButton>
      <BlueButton>구매하기</BlueButton>
    </div>
  )
}

export default BuyerActions