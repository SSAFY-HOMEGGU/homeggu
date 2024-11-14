'use client';

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from 'next/navigation';
import ImageSwiper from "@/app/components/ImageSwiper";
import Product from "@/app/components/Product";
import useProductListStore from '@/app/store/useProductListStore';
import JoinModal from "./components/JoinModal";

function HomeContent() {
  const { products, fetchProducts } = useProductListStore();
  const [showSurvey, setShowSurvey] = useState(false);
  const searchParams = useSearchParams();

  const images = [
    { src: "/images/home_banner1.png", alt: "Slide 1" },
    { src: "/images/home_banner2.png", alt: "Slide 2" },
    { src: "/images/home_banner3.png", alt: "Slide 3" },
    { src: "/images/home_banner4.png", alt: "Slide 4" },
  ];

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    const isFirstLogin = searchParams.get('firstLogin') === 'true';
    setShowSurvey(isFirstLogin);
  }, [searchParams]);

  const handleCloseModal = () => {
    setShowSurvey(false);
  };

  return (
    <div className="py-0">
      <div className="h-[10rem]">
        <ImageSwiper images={images} imageWidth={1920} imageHeight={400} />
      </div>

      <div className="mt-[1rem]">
        <h2 className="font-bold font-tmoney mb-[0.5rem]">인기 상품</h2>
        <div className="grid grid-cols-4 gap-4 md:grid-cols-4 sm:grid-cols-2 grid-cols-1">
          {products.map((product) => (
            <Product key={product.salesBoardId} product={product} />
          ))}
        </div>
      </div>

      <JoinModal isOpen={showSurvey} onClose={handleCloseModal} />
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomeContent />
    </Suspense>
  );
}
