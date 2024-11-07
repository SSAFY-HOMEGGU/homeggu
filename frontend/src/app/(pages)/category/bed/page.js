'use client'

import { useEffect } from "react";
import CategoryProducts from "../components/CategoryProducts";
import useProductListStore from '@/app/store/useProductListStore';

export default function BedPage() {
  const { products, fetchProducts } = useProductListStore();

  useEffect(() => {
    // 초기 데이터 로딩 시 필터 적용
    fetchProducts({
      category: 'bed',
      min_price: 0,
      max_price: Infinity,
      isSell: 'N',
      page: 0,
      size: 10
    });
  },[fetchProducts]);

  // bed 카테고리 상품만 필터링
  const bedProducts = products.filter(product => product.category === 'bed');

  return (
    <CategoryProducts 
      categoryName="침대" 
      products={bedProducts}
    />
  );
}