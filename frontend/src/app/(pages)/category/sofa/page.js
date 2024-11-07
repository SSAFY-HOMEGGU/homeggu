'use client'

import { useEffect } from "react";
import CategoryProducts from "../components/CategoryProducts";
import useProductListStore from '@/app/store/useProductListStore';

export default function Sofa() {
  const { products, fetchProducts } = useProductListStore();

  useEffect(() => {
    // 초기 데이터 로딩 시 필터 적용
    fetchProducts({
      category: 'sofa',
      min_price: 0,
      max_price: Infinity,
      isSell: 'N',
      page: 0,
      size: 10
    });
  },[fetchProducts]); // 의존성 배열 추가

  // desk 카테고리 상품만 필터링
  const sofaProducts = products.filter(product => product.category === 'sofa');

  return (
    <CategoryProducts 
      categoryName="의자·소파" 
      products={sofaProducts} // 필터링된 상품 목록 전달
    />
  );
}