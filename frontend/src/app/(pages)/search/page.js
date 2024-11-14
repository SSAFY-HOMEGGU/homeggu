// 'use client'

// import { useSearchParams } from 'next/navigation';
// import { useEffect, Suspense } from 'react';
// import useProductListStore from '@/app/store/useProductListStore';
// import CategoryProducts from '../category/components/CategoryProducts';

// export default function SearchPage() {
//   const searchParams = useSearchParams();
//   const query = searchParams.get('query');
//   const { products, fetchProducts } = useProductListStore();

//   useEffect(() => {
//     if (query) {
//       fetchProducts({
//         title: query,
//         page: 0,
//         size: 10
//       });
//     }
//   }, [query,fetchProducts]);

//   return (
//     <div className="content-area py-8">
//       <h1 className="text-xl font-bold mb-6">
//         &apos;{query}&apos; 검색 결과
//       </h1>
//       <CategoryProducts 
//         categoryName="검색 결과" 
//         products={products}
//       />
//     </div>
//   );
// }

'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, Suspense } from 'react';
import useProductListStore from '@/app/store/useProductListStore';
import CategoryProducts from '../category/components/CategoryProducts';
import { preferenceUpdate } from '@/app/api/userApi';

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('query');
  const { products, fetchProducts } = useProductListStore();

  useEffect(() => {
    const handleSearch = async () => {
      if (query) {
        // 상품 검색
        await fetchProducts({
          title: query,
          page: 0,
          size: 10,
        });

        try {
          await preferenceUpdate({
            category: "",
            mood: "",
            action: "search",
            clickedSalesBoardId: ""
          });
        } catch (error) {
          console.error('선호도 업데이트 실패:', error);
        }
      }
    };

    handleSearch();
  }, [query, fetchProducts]);

  return (
    <div className="content-area py-8">
      <h1 className="text-xl font-bold mb-6">
        &apos;{query}&apos; 검색 결과
      </h1>
      <CategoryProducts categoryName="검색 결과" products={products} />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchContent />
    </Suspense>
  );
}
