// /*
// 주요 기능:
// 1. 상품 목록 관리:
//    - fetchProducts: 전체 상품 목록 조회
//    - products 배열 상태 관리
//    - 각 상품의 좋아요 상태 관리

// 2. 선택된 상품 관리:
//    - fetchProductDetail: 상품 상세 정보 조회
//    - selectedProduct 상태 관리
//    - setSelectedProduct: 선택된 상품 설정
//    - updateSelectedProduct: 선택된 상품 부분 업데이트

// 3. 상품 데이터 업데이트:
//    - updateProduct: 개별 상품 정보 업데이트
//    - removeProduct: 상품 제거
// */


// import { create } from 'zustand';
// import { devtools } from 'zustand/middleware';
// import { salesBoardList, detailSalesBoard } from '../api/productApi';
// import { goodsIsLike } from '../api/userApi';

// const useProductListStore = create(
//   devtools((set, get) => ({
//     products: [],
//     selectedProduct: null,
//     loading: false,
//     error: null,
//     page: 0,         // 현재 페이지
//     hasMore: true,   // 추가 데이터 존재 여부
//     size: 8,         // 한 번에 가져올 상품 수

//     resetProducts: () => {
//       set({
//         products: [],
//         selectedProduct: null,
//         page: 0,
//         hasMore: true,
//         loading: false,
//         error: null
//       });
//     },

//     fetchProducts: async (params = {}) => {
//       const { page, size, loading, hasMore } = get();
      
//       if (loading || !hasMore) {
//         console.log('[Store] 로딩 중이거나 더 이상 데이터 없음', { loading, hasMore });
//         return;
//       }

//       console.log('[Store] API 요청 시작 시간:', new Date().toISOString());
//       console.log('[Store] fetchProducts 시작', { ...params, page, size });

//       try {
//         set({ loading: true, error: null });
//         const response = await salesBoardList({ 
//           ...params, 
//           page, 
//           size 
//         });
//         console.log('[Store] API 응답 수신 시간:', new Date().toISOString());

//         if (!response) {
//           console.error('[Store] 응답이 비어있음');
//           throw new Error('Empty response');
//         }

//         const productsData = response.content || response;
//         console.log('[Store] 처리할 상품 데이터:', productsData);
        
//         if (!Array.isArray(productsData)) {
//           console.error('[Store] 상품 데이터가 배열이 아님:', productsData);
//           throw new Error('Invalid products data format');
//         }

//         // 데이터를 생성일 기준으로 정렬
//         const sortedProductsData = [...productsData].sort((a, b) => {
//           return new Date(b.createdAt) - new Date(a.createdAt);
//         });

//         console.log('[Store] ' + sortedProductsData.length + '개 상품에 대한 좋아요 상태 확인 시작');
        
//         const productsWithLikes = await Promise.all(
//           sortedProductsData.map(async (product) => {
//             console.log('[Store] 상품 ID ' + product.salesBoardId + '의 좋아요 상태 확인 중');
//             try {
//               const isLikedPromise = Promise.race([
//                 goodsIsLike(product.salesBoardId),
//                 new Promise((_, reject) => 
//                   setTimeout(() => reject(new Error('Timeout')), 5000)
//                 )
//               ]);
              
//               const isLiked = await isLikedPromise;
//               console.log('[Store] 상품 ID ' + product.salesBoardId + ' 좋아요 상태:', isLiked);
//               return { 
//                 ...product,
//                 isLiked,
//               };
//             } catch (error) {
//               console.warn('[Store] 상품 ID ' + product.salesBoardId + ' 좋아요 상태 확인 실패:', error);
//               return { 
//                 ...product,
//                 isLiked: false,
//               };
//             }
//           })
//         );

//         set(state => {
//           // 기존 상품과 새로운 상품을 합친 후 다시 정렬
//           const allProducts = page === 0 
//             ? productsWithLikes 
//             : [...state.products, ...productsWithLikes];

//           // 전체 배열을 다시 한 번 정렬
//           const sortedProducts = allProducts.sort((a, b) => 
//             new Date(b.createdAt) - new Date(a.createdAt)
//           );

//           return {
//             products: sortedProducts,
//             loading: false,
//             error: null,
//             page: page + 1,
//             hasMore: productsWithLikes.length === size
//           };
//         });
        
//         console.log('[Store] 상태 업데이트 완료', {
//           productsCount: productsWithLikes.length,
//           nextPage: page + 1,
//           hasMore: productsWithLikes.length === size
//         });
        
//       } catch (error) {
//         console.error('[Store] 상품 목록 조회 실패:', error);
//         console.error('에러 상세:', {
//           message: error.message,
//           stack: error.stack,
//           response: error.response?.data
//         });
        
//         set({ 
//           error: error.message, 
//           loading: false,
//           hasMore: false
//         });
//       }
//     },
//     // 상품 목록 초기화 (필터 변경 등에 사용)
//     resetProducts: () => {
//       set({
//         products: [],
//         page: 0,
//         hasMore: true,
//         loading: false,
//         error: null
//       });
//     },

//     // 상품 상세 조회
//     fetchProductDetail: async (productId) => {
//       console.time(`상품 상세 처리 시간 (ID: ${productId})`);
//       try {
//         set({ loading: true });
//         const data = await detailSalesBoard(productId);
        
//         set({ 
//           selectedProduct: data,
//           loading: false 
//         });
//         console.timeEnd(`상품 상세 처리 시간 (ID: ${productId})`);
//         return data;
//       } catch (error) {
//         set({ error: error.message, loading: false });
//         console.error('상품 상세 조회 실패:', error);
//       }
//     },

//     // 선택된 상품 설정
//     setSelectedProduct: (product) => {
//       set({ selectedProduct: product });
//     },

//     // 선택된 상품 부분 업데이트
//     updateSelectedProduct: (updates) => {
//       set(state => ({
//         selectedProduct: state.selectedProduct 
//           ? { ...state.selectedProduct, ...updates } 
//           : null
//       }));
//     },

//     // 상품 정보 업데이트
//     updateProduct: (productId, updates) => {
//       set(state => ({
//         products: state.products.map(product => 
//           product.salesBoardId === productId
//             ? { ...product, ...updates }
//             : product
//         ),
//         selectedProduct: state.selectedProduct?.salesBoardId === productId
//           ? { ...state.selectedProduct, ...updates }
//           : state.selectedProduct
//       }));
//     },

//     // 상품 제거
//     removeProduct: (productId) => {
//       set(state => ({
//         products: state.products.filter(product => 
//           product.salesBoardId !== productId
//         )
//       }));
//     }
//   }), 
//   {
//     name: 'product-list-store'
//   }
// ));

// export default useProductListStore;