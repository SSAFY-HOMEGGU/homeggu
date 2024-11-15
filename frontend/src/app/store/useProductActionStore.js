// /*
// 주요 기능:
// 1. 좋아요 관련 작업:
//    - toggleLike: 좋아요 상태 토글 및 API 호출
//    - Optimistic Updates 처리
//    - 실패 시 롤백 로직

// 2. 상품 상태 관리:
//    - updateStatus: 상품 상태 변경 (예약중, 판매중, 판매완료)
//    - API 호출 및 상태 업데이트

// 3. 상품 삭제:
//    - deleteProduct: 상품 삭제 및 API 호출
//    - 목록에서 제거
// */

// import { create } from 'zustand'
// import { devtools } from 'zustand/middleware'
// import { goodsLike, goodsUnlike, preferenceUpdate } from '../api/userApi'
// import { updateSalesBoard, deleteSalesBoard } from '../api/productApi'
// import useProductListStore from './useProductListStore'


// const useProductActionStore = create(
//   devtools((set, get) => ({
//     loading: false,
//     error: null,

//     // 좋아요 토글
//     toggleLike: async (productId) => {
//       const productStore = useProductListStore.getState();
//       // 상세 페이지에서는 selectedProduct 사용
//       const product = productStore.selectedProduct;
//       const prevIsLiked = product?.isLiked;

//       try {
//         // UI 즉시 업데이트
//         productStore.updateProduct(productId, { 
//           isLiked: !prevIsLiked,
//           likeCnt: product.likeCnt + (!prevIsLiked ? 1 : -1)
//         });
        
//         // API 호출로 백엔드 업데이트
//         if (!prevIsLiked) {
//           await goodsLike(productId);
//           await preferenceUpdate({
//             category: product.category,
//             mood: product.mood,
//             action: "like",
//             clickedSalesBoardId: ""
//           });
//         } else {
//           await goodsUnlike(productId);
//         }
        
//         // 실제 데이터 리프레시
//         await productStore.fetchProductDetail(productId);
//       } catch (error) {
//         // 실패시 롤백
//         productStore.updateProduct(productId, { 
//           isLiked: prevIsLiked,
//           likeCnt: product.likeCnt
//         });
//         console.error('좋아요 처리 실패:', error);
//       }
//     },

//      // 채팅방 생성 시 카운트 증가
//      updateChatCount: async (productId) => {
//       const productStore = useProductListStore.getState();
//       const product = productStore.selectedProduct;

//       if (!product) return;

//       try {
//         // UI 즉시 업데이트
//         productStore.updateSelectedProduct({ 
//           chatCnt: product.chatCnt + 1 
//         });
        
//         // 실제 데이터 리프레시
//         await productStore.fetchProductDetail(productId);
//       } catch (error) {
//         // 실패시 롤백
//         productStore.updateSelectedProduct({ 
//           chatCnt: product.chatCnt 
//         });
//         console.error('채팅 카운트 업데이트 실패:', error);
//       }
//     },


//     // 상품 상태 변경 (예약중, 판매중, 판매완료 등)
//     updateStatus: async (product, newStatus) => {
//       const productStore = useProductListStore.getState();
//       const productId = product.salesBoardId
//       // const product = productStore.products.find(p => p.sales_board_id === productId);
//       const prevStatus = product?.isSell;
//       console.log(product)
//       try {
//         productStore.updateProduct(productId, { isSell: newStatus });
//         productStore.updateSelectedProduct({ isSell: newStatus });
//         const updatedData = {
//           salesBoardDTO: {
//             ...product,
//             isSell: newStatus,
//           },
//           goodsImagePaths: product.goodsImagePaths,
//           threeDimensionsGoodsImagePaths: product.threeDimensionsGoodsImagePaths
//         };
 
//         // API 호출
//         await updateSalesBoard(productId, updatedData);
//         // const response = await updateSalesBoard(productId, updatedData);
    
//         // // API 응답 확인
//         // if (!response || response.error) {
//         //   throw new Error('상태 업데이트 실패');
//         // }
    
//         console.log('상품 상태가 변경되었습니다');
//       } catch (error) {
//         // 실패시 롤백
//         productStore.updateProduct(productId, { isSell: prevStatus });
//         productStore.updateSelectedProduct({ isSell: prevStatus });
//         // set({ product });
//         console.error('업데이트 실패:', error);
//       }
//     },

//     // 상품 삭제
//     // deleteProduct: async (product) => {
//     //   const productStore = useProductListStore.getState();
//     //   const products = productStore.products;
//     //   const productId = product.salesBoardId;

//     //   try {
//     //     // Optimistic Update
//     //     productStore.removeProduct(productId);

//     //     // API 호출
//     //     await deleteSalesBoard(productId);
        
//     //     console.log('삭제 성공')
//     //   } catch (error) {
//     //     // 실패시 롤백
//     //     set({ products });
//     //     console.error('삭제 실패',error)
//     //   }
//     // }
//     deleteProduct: async (product) => {
//       try {
//         // API 호출
//         await deleteSalesBoard(product.salesBoardId);
        
//         // Store 업데이트
//         set(state => ({
//           products: state.products.filter(p => p.salesBoardId !== product.salesBoardId)
//         }));
        
//         return true;
//       } catch (error) {
//         console.error('삭제 실패:', error);
//         return false;
//       }
//     },
//   }), 
//   {
//     name: 'product-action-store'
//   }
// ))

// export default useProductActionStore;