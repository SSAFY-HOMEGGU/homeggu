/*
상품 관련 전역 상태 관리 스토어
--------------------------------

1. 상품 목록 관리
- fetchProducts: 무한 스크롤 방식의 상품 목록 조회
- resetProducts: 상품 목록 초기화 (필터링 등에 사용)
- size: 한 번에 가져올 상품 수 (8개)
- hasMore: 추가 데이터 존재 여부
- page: 현재 페이지 번호

2. 상품 상세 정보
- fetchProduct: 단일 상품 상세 정보 조회
- setSelectedProduct: 선택된 상품 설정
- updateSelectedProduct: 선택된 상품 정보 부분 업데이트
- selectedProduct: 현재 선택된 상품 정보

3. 좋아요 관련 기능
- toggleLike: 좋아요 상태 토글 (낙관적 업데이트)
- goodsIsLike: 각 상품의 좋아요 상태 확인
- preferenceUpdate: 선호도 정보 업데이트

4. 채팅 기능
- updateChatCount: 채팅방 생성 시 카운트 증가
- chatCnt: 채팅 수 관리

5. 상품 상태 관리
- updateProductStatus: 상품 상태 변경 (예약중, 판매중, 판매완료)
- 상태 변경 시 API 호출 및 전역 상태 동기화

6. 데이터 동기화
- updateProduct: 개별 상품 정보 업데이트 (목록 + 상세)
- removeProduct: 상품 제거
- 모든 상태 변경 시 낙관적 업데이트 적용
- 실패 시 자동 롤백 처리

7. 에러 처리
- 각 작업별 에러 상태 관리
- 타임아웃 보호 (좋아요 상태 조회 등)
- 상세한 에러 로깅
*/

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { 
  salesBoardList, 
  detailSalesBoard, 
  updateSalesBoard, 
  deleteSalesBoard 
} from '../api/productApi';
import { 
  goodsLike, 
  goodsUnlike, 
  goodsIsLike, 
  preferenceUpdate 
} from '../api/userApi';

const useProductStore = create(
  devtools((set, get) => ({
    // 기본 상태
    products: [],           // 상품 목록
    selectedProduct: null,  // 선택된 상품 정보
    loading: false,         // 로딩 상태
    error: null,           // 에러 상태
    page: 0,               // 현재 페이지
    hasMore: true,         // 추가 데이터 존재 여부
    size: 8,               // 한 번에 가져올 상품 수

    // 기본 상태 관리 함수
    setLoading: (loading) => set({ loading }),
    setError: (error) => set({ error }),
    
    // 스토어 초기화
    resetStore: () => {
      set({
        products: [],
        selectedProduct: null,
        page: 0,
        hasMore: true,
        loading: false,
        error: null
      });
    },

    // 상품 목록 조회 (무한 스크롤)
    fetchProducts: async (params = {}) => {
      const { page, size, loading, hasMore } = get();
      
      if (loading || !hasMore) {
        console.log('[Store] 로딩 중이거나 더 이상 데이터 없음', { loading, hasMore });
        return;
      }

      console.log('[Store] API 요청 시작 시간:', new Date().toISOString());
      console.log('[Store] fetchProducts 시작', { ...params, page, size });

      try {
        set({ loading: true, error: null });
        const response = await salesBoardList({ 
          ...params, 
          page, 
          size 
        });
        console.log('[Store] API 응답 수신 시간:', new Date().toISOString());

        if (!response) {
          console.error('[Store] 응답이 비어있음');
          throw new Error('Empty response');
        }

        const productsData = response.content || response;
        console.log('[Store] 처리할 상품 데이터:', productsData);
        
        if (!Array.isArray(productsData)) {
          console.error('[Store] 상품 데이터가 배열이 아님:', productsData);
          throw new Error('Invalid products data format');
        }

        // 데이터를 생성일 기준으로 정렬
        // const sortedProductsData = productsData.sort((a, b) => 
        //   new Date(b.createdAt) - new Date(a.createdAt)
        // );

        console.log('[Store] ' + productsData.length + '개 상품에 대한 좋아요 상태 확인 시작');
        
        const productsWithLikes = await Promise.all(
          productsData.map(async (product) => {
            console.log('[Store] 상품 ID ' + product.salesBoardId + '의 좋아요 상태 확인 중');
            try {
              const isLikedPromise = Promise.race([
                goodsIsLike(product.salesBoardId),
                new Promise((_, reject) => 
                  setTimeout(() => reject(new Error('Timeout')), 5000)
                )
              ]);
              
              const isLiked = await isLikedPromise;
              console.log('[Store] 상품 ID ' + product.salesBoardId + ' 좋아요 상태:', isLiked);
              return { 
                ...product,
                isLiked,
              };
            } catch (error) {
              console.warn('[Store] 상품 ID ' + product.salesBoardId + ' 좋아요 상태 확인 실패:', error);
              return { 
                ...product,
                isLiked: false,
              };
            }
          })
        );

    //     set(state => {
    //       // 기존 상품과 새로운 상품을 합친 후 다시 정렬
    //       const allProducts = page === 0 
    //         ? productsWithLikes 
    //         : [...state.products, ...productsWithLikes];

    //       // 전체 배열을 다시 한 번 정렬
    //       const sortedProducts = allProducts.sort((a, b) => 
    //         new Date(b.createdAt) - new Date(a.createdAt)
    //       );

    //       return {
    //         products: sortedProducts,
    //         loading: false,
    //         error: null,
    //         page: page + 1,
    //         hasMore: productsWithLikes.length === size
    //       };
    //     });
        
    //     console.log('[Store] 상태 업데이트 완료', {
    //       productsCount: productsWithLikes.length,
    //       nextPage: page + 1,
    //       hasMore: productsWithLikes.length === size
    //     });
        
    //   } catch (error) {
    //     console.error('[Store] 상품 목록 조회 실패:', error);
    //     console.error('에러 상세:', {
    //       message: error.message,
    //       stack: error.stack,
    //       response: error.response?.data
    //     });
        
    //     set({ 
    //       error: error.message, 
    //       loading: false,
    //       hasMore: false
    //     });
    //   }
    // },
    set(state => ({
      products: page === 0 
        ? productsWithLikes 
        : [...state.products, ...productsWithLikes],
      loading: false,
      error: null,
      page: page + 1,
      hasMore: productsWithLikes.length === size
    }));
    
  } catch (error) {
    console.error('[Store] 상품 목록 조회 실패:', error);
    set({ 
      error: error.message, 
      loading: false,
      hasMore: false
    });
  }
},

    // 상품 상세 정보 조회
    fetchProduct: async (productId) => {
      const state = get();
      
      // 이미 동일한 상품을 로딩 중이면 중복 요청 방지
      if (state.loading && state.selectedProduct?.salesBoardId === productId) {
        return;
      }

      set({ loading: true, error: null });
      
      try {
        // 상품 정보 먼저 가져오기
        console.log('Fetching product data...');
        const productData = await detailSalesBoard(productId);
        console.log('Product data received:', productData);

        // 좋아요 상태는 별도로 처리하고 실패해도 무시
        let isLiked = false;
        try {
          console.log('Checking like status...');
          isLiked = await goodsIsLike(productId);
          console.log('Like status received:', isLiked);
        } catch (error) {
          console.warn('Failed to fetch like status:', error);
          // 좋아요 상태 조회 실패는 무시하고 계속 진행
        }

        const productWithLike = { 
          ...productData, 
          isLiked 
        };

        set({ 
          selectedProduct: productWithLike,
          loading: false,
          error: null
        });

        return productWithLike;
      } catch (error) {
        console.error('Failed to fetch product:', error);
        set({ 
          error: error.message, 
          loading: false,
          selectedProduct: null
        });
        throw error;
      }
    },

    // 좋아요 토글
    toggleLike: async (productId) => {
      const state = get();
      const product = state.products.find(p => p.salesBoardId === productId) 
        || state.selectedProduct;
      
      if (!product) return;

      const prevIsLiked = product.isLiked;
      const prevLikeCnt = product.likeCnt;

      try {
        // 낙관적 업데이트
        const updateLikeStatus = (p) => ({
          ...p,
          isLiked: !prevIsLiked,
          likeCnt: prevLikeCnt + (!prevIsLiked ? 1 : -1)
        });

        set(state => ({
          selectedProduct: state.selectedProduct?.salesBoardId === productId 
            ? updateLikeStatus(state.selectedProduct)
            : state.selectedProduct,
          products: state.products.map(p =>
            p.salesBoardId === productId ? updateLikeStatus(p) : p
          )
        }));

        // API 호출
        if (!prevIsLiked) {
          await goodsLike(productId);
          await preferenceUpdate({
            category: product.category,
            mood: product.mood,
            action: "like",
            clickedSalesBoardId: ""
          });
        } else {
          await goodsUnlike(productId);
        }

        // 실제 데이터로 갱신
        await get().fetchProduct(productId);
      } catch (error) {
        // 실패시 롤백
        const rollbackLikeStatus = (p) => ({
          ...p,
          isLiked: prevIsLiked,
          likeCnt: prevLikeCnt
        });

        set(state => ({
          selectedProduct: state.selectedProduct?.salesBoardId === productId 
            ? rollbackLikeStatus(state.selectedProduct)
            : state.selectedProduct,
          products: state.products.map(p =>
            p.salesBoardId === productId ? rollbackLikeStatus(p) : p
          ),
          error: error.message
        }));

        console.error('좋아요 처리 실패:', error);
      }
    },

    // 채팅 카운트 증가
    updateChatCount: async (productId) => {
      const state = get();
      const product = state.selectedProduct;

      if (!product) return;

      const prevChatCnt = product.chatCnt;

      try {
        // 낙관적 업데이트
        set(state => ({
          selectedProduct: { 
            ...state.selectedProduct, 
            chatCnt: prevChatCnt + 1 
          }
        }));
        
        // 실제 데이터로 갱신
        await get().fetchProduct(productId);
      } catch (error) {
        // 실패시 롤백
        set(state => ({
          selectedProduct: { 
            ...state.selectedProduct, 
            chatCnt: prevChatCnt 
          }
        }));
        console.error('채팅 카운트 업데이트 실패:', error);
      }
    },

    // 상품 상태 변경
    // updateProductStatus: async (product, newStatus) => {
    //   const prevStatus = product.isSell;
      
    //   try {
    //     // 낙관적 업데이트
    //     set(state => ({
    //       selectedProduct: {
    //         ...state.selectedProduct,
    //         isSell: newStatus
    //       },
    //       loading: true
    //     }));
    
    //     // API 요청 데이터 구조
    //     const updatedData = {
    //       salesBoardDTO: {
    //         ...product,
    //         isSell: newStatus,
    //       },
    //       goodsImagePaths: product.goodsImagePaths,
    //       threeDimensionsGoodsImagePaths: product.threeDimensionsGoodsImagePaths
    //     };
        
    //     console.log('Updating product status with data:', updatedData);
    //     const response = await updateSalesBoard(product.salesBoardId, updatedData);
    //     console.log('Update response:', response);
    
    //     if (response.message && response.message.includes('성공')) {
    //       // 성공 후 상품 상세 정보 새로 조회
    //       const refreshedProduct = await get().fetchProduct(product.salesBoardId);
          
    //       // 상품 목록도 새로 조회
    //       await get().fetchProducts();
          
    //       set(state => ({
    //         selectedProduct: refreshedProduct,
    //         loading: false,
    //         error: null
    //       }));
          
    //       return;
    //     }
    
    //     throw new Error('Unexpected server response');
    
    //   } catch (error) {
    //     console.error('상태 업데이트 실패:', error);
    //     // 실패시 이전 상태로 롤백
    //     set(state => ({
    //       selectedProduct: {
    //         ...state.selectedProduct,
    //         isSell: prevStatus
    //       },
    //       loading: false,
    //       error: error.message
    //     }));
        
    //     throw error;
    //   }
    // },

    // try {
    //   // 낙관적 업데이트
    //   set(state => ({
    //     selectedProduct: {
    //       ...state.selectedProduct,
    //       isSell: newStatus
    //     },
    //     loading: true
    //   }));
  
    //   // API 요청 데이터 구조
    updateProductStatus: async (product, newStatus) => {
      console.log('상태 변경:', product.isSell, '->', newStatus);
      const prevStatus = product.isSell;
      
      try {
        const updatedData = {
          salesBoardDTO: {
            ...product,
            isSell: newStatus,
          },
          goodsImagePaths: product.goodsImagePaths || [],
          threeDimensionsGoodsImagePaths: product.threeDimensionsGoodsImagePaths || []
        };
    
        // 요청 데이터 구조 로깅
        console.log('요청 데이터 전체:', JSON.stringify(updatedData, null, 2));
        console.log('salesBoardDTO 내부:', JSON.stringify(updatedData.salesBoardDTO, null, 2));
    
        // 낙관적 업데이트
        set(state => ({
          selectedProduct: {
            ...state.selectedProduct,
            isSell: newStatus
          },
          products: state.products.map(p => 
            p.salesBoardId === product.salesBoardId 
              ? { ...p, isSell: newStatus }
              : p
          ),
          loading: true
        }));
    
        const response = await updateSalesBoard(product.salesBoardId, updatedData);
        console.log('서버 응답:', response);
    
        // 업데이트 결과 확인
        const verifyProduct = await detailSalesBoard(product.salesBoardId);
        console.log('DB 반영 결과:', {
          id: product.salesBoardId,
          oldStatus: product.isSell,
          requestedStatus: newStatus,
          actualStatus: verifyProduct.isSell
        });
    
        // 최종 상태 업데이트
        const refreshedList = await salesBoardList({ page: 0, size: get().size });
        
        set({
          selectedProduct: verifyProduct,
          products: refreshedList.content || refreshedList,
          loading: false,
          error: null,
          page: 0
        });
    
        return verifyProduct;
    
      } catch (error) {
        console.error('상태 업데이트 실패:', error);
        // 롤백
        set(state => ({
          selectedProduct: {
            ...state.selectedProduct,
            isSell: prevStatus
          },
          products: state.products.map(p => 
            p.salesBoardId === product.salesBoardId 
              ? { ...p, isSell: prevStatus }
              : p
          ),
          loading: false,
          error: error.message
        }));
        
        throw error;
      }
    },
    
    deleteProduct: async (product) => {
      if (!product?.salesBoardId) {
        console.error('유효하지 않은 상품 또는 salesBoardId 누락:', product);
        throw new Error('유효하지 않은 상품 데이터');
      }

      try {
        set({ loading: true, error: null });

        // API 호출
        await deleteSalesBoard(product.salesBoardId);
        
        // 낙관적 업데이트: UI에서 즉시 제거
        set(state => ({
          products: state.products.filter(p => p.salesBoardId !== product.salesBoardId),
          selectedProduct: state.selectedProduct?.salesBoardId === product.salesBoardId 
            ? null 
            : state.selectedProduct,
          loading: false
        }));

        // 전체 목록 새로고침
        try {
          const refreshedList = await salesBoardList({ 
            page: 0, 
            size: get().size 
          });
          
          set({
            products: refreshedList.content || refreshedList,
            page: 0,
            hasMore: (refreshedList.content || refreshedList).length === get().size
          });
        } catch (refreshError) {
          console.warn('목록 새로고침 실패:', refreshError);
          // 목록 새로고침 실패는 치명적이지 않으므로 무시
        }

        return true;
      } catch (error) {
        console.error('상품 삭제 실패:', error);
        // 에러 발생 시 상태 롤백
        set(state => ({ 
          error: `상품 삭제 실패: ${error.message}`,
          loading: false
        }));
        throw error;
      }
    }
  })), 
  {
    name: 'product-store'
  }
);

export default useProductStore;