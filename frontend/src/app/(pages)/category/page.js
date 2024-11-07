'use client'

import { useEffect } from "react";
import CategoryProducts from "./components/CategoryProducts";
import useProductListStore from '@/app/store/useProductListStore';

export default function CategoryPage() {
  const { fetchProducts } = useProductListStore();

  useEffect(() => {
    // 전체 상품 목록 조회
    fetchProducts({
      page: 0,
      size: 10
      // 전체 카테고리이므로 category 필터는 적용하지 않음
    });
  },[fetchProducts]);

  return <CategoryProducts categoryName="전체" />;
}