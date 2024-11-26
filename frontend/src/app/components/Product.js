'use client';

import Image from 'next/image';
import Link from 'next/link';
import useProductStore from '../store/useProductManageStore';
import { preferenceUpdate } from '../api/userApi';

export default function Product({ product, size = 'normal' }) {  // size prop 추가
  const { toggleLike, fetchProduct } = useProductStore();

  // 사이즈별 스타일 설정
  const sizeStyles = {
    small: {
      container: "w-[12rem] h-[12rem]",
      rounded: "rounded-[0.6rem]",
      heart: { width: 20, height: 20 },
      title: "text-[0.95rem]",
      date: "text-[0.7rem]",
      spacing: "mt-3"
    },
    normal: {
      container: "w-[14rem] h-[14rem]",
      rounded: "rounded-[0.8rem]",
      heart: { width: 24, height: 24 },
      title: "text-[1.1rem]",
      date: "text-[0.8rem]",
      spacing: "mt-4"
    }
  };

  const styles = sizeStyles[size];
  
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
      await fetchProduct(product.salesBoardId);
      console.log('선호도 업데이트')
      await preferenceUpdate({
        category: product.category,
        mood: product.mood,
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
      <div className={`relative flex-shrink-0 border ${styles.container} ${styles.rounded} bg-lightgray bg-cover bg-center`}>
        <Image
          src={imageUrl || defaultImage}
          alt={product.title || '상품 이미지'}
          fill
          sizes={styles.container.split(' ')[0].replace('w-[', '').replace(']', '')}
          className={`${styles.rounded} object-cover`}
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
            width={styles.heart.width}
            height={styles.heart.height}
          />
        </div>
      </div>
      <div className={styles.spacing}>
        <p className={`text-normalText ${styles.title} font-normal`}> 
          {product.title}
        </p>
        <p className={`text-normalText ${styles.title} font-bold mt-1`}>
          {product.price}원
        </p>
        <p className={`text-inputText ${styles.date} font-normal`}>
          {product.createdAt}
        </p>
      </div>
    </Link>
  );
}