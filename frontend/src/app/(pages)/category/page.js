'use client'

import { useEffect } from "react";
import CategoryProducts from "./components/CategoryProducts";
import useProductStore from "@/app/store/useProductStore";

export default function CategoryPage() {
  const { fetchProducts, setLoading, setError } = useProductStore();

  useEffect(() => {
    // 상품 목록 초기 로딩
    const loadProducts = async () => {
      try {

        await fetchProducts({
          page: 0,
          size: 8
        });
      } catch (error) {
        setError(error.message);
        console.error('상품 목록 로딩 실패:', error);
    };

    loadProducts();
  }}, []); // 스토어 함수들은 안정적이므로 의존성 배열에서 제외

  return <CategoryProducts categoryName="전체" />;
}