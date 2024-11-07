// import { create } from 'zustand'
// import { devtools } from 'zustand/middleware'
// import { salesBoardList } from '../api/productApi';

// const useProductListStore = create(
//   devtools((set) => ({
//     products: [], // 상품 목록
//     loading: false,
//     error: null,
    
//     // 전체 상품 목록 조회 (필터링 포함)
//     fetchProducts: async (params) => {
//       try {
//         set({ loading: true });
//         const response = await salesBoardList(params);
//         set({ 
//           products: response.content,  // API 응답 구조에 맞게 수정
//           loading: false 
//         });
//       } catch (error) {
//         set({ error: error.message, loading: false });
//         toast.error('상품 목록 조회 실패');
//       }
//     },

//     // 특정 상품 업데이트 (좋아요, 상태 변경 등에서 사용)
//     updateProduct: (productId, updates) => {
//       set(state => ({
//         products: state.products.map(product => 
//           product.sales_board_id === productId
//             ? { ...product, ...updates }
//             : product
//         )
//       }));
//     },

//     // 상품 삭제 시 목록에서 제거
//     removeProduct: (productId) => {
//       set(state => ({
//         products: state.products.filter(product => 
//           product.sales_board_id !== productId
//         )
//       }));
//     }
//   }), 
//   {
//     name: 'product-list-store'
//   }
// ))

// export default useProductListStore;

// src/app/store/useProductListStore.js

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { DUMMY_PRODUCTS } from '../dummyData';

const useProductListStore = create(
  devtools((set) => ({
    products: [],
    loading: false,
    error: null,
    
    // 전체 상품 목록 조회 (필터링 포함)
    fetchProducts: async (params = {}) => {
      try {
        set({ loading: true });
        
        // API 개발 전까지는 더미 데이터 사용하여 필터링
        let filteredProducts = [...DUMMY_PRODUCTS];
        
        // 카테고리 필터링
        if (params.category && params.category !== '전체') {
          filteredProducts = filteredProducts.filter(
            product => product.category === params.category.toLowerCase()
          );
        }

        // 가격 필터링
        if (params.min_price !== undefined) {
          filteredProducts = filteredProducts.filter(
            product => product.price >= params.min_price
          );
        }
        if (params.max_price !== undefined) {
          filteredProducts = filteredProducts.filter(
            product => product.price <= params.max_price
          );
        }

        // 판매 상태 필터링
        if (params.isSell) {
          filteredProducts = filteredProducts.filter(
            product => product.isSell === params.isSell
          );
        }

        // 제목 검색
        if (params.title) {
          filteredProducts = filteredProducts.filter(
            product => product.title.includes(params.title)
          );
        }

        // 페이지네이션
        const page = params.page || 0;
        const size = params.size || 10;
        const start = page * size;
        const paginatedProducts = filteredProducts.slice(start, start + size);

        await new Promise(resolve => setTimeout(resolve, 500)); // 로딩 시뮬레이션

        set({ 
          products: paginatedProducts,
          loading: false 
        });
      } catch (error) {
        set({ error: error.message, loading: false });
        console.error('상품 목록 조회 실패:', error);
      }
    },

    // 특정 상품 업데이트
    updateProduct: (productId, updates) => {
      set(state => ({
        products: state.products.map(product => 
          product.sales_board_id === productId
            ? { ...product, ...updates }
            : product
        )
      }));
    },

    // 상품 삭제
    removeProduct: (productId) => {
      set(state => ({
        products: state.products.filter(product => 
          product.sales_board_id !== productId
        )
      }));
    }
  }), 
  {
    name: 'product-list-store'
  }
));

export default useProductListStore;