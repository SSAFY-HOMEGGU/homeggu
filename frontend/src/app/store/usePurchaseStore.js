import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import useProductStore from './useProductStore'

const usePurchaseStore = create(
  devtools(
    persist(
      (set, get) => ({
        loading: false,
        error: null,
        selectedProduct: null,
        orderInfo: null,
        userData: null,
        
        // 구매할 상품 정보 설정
        setSelectedProduct: (product) => {
          console.log('Setting selected product:', product); // 디버깅용
          set({ selectedProduct: product });
        },

        // 주문자 정보 설정 
        setUserData: (response) => {
          console.log('Setting user data:', response); // 디버깅용
          set({ 
            userData: response,
            orderInfo: {
              name: response.user.username,
              phone: response.phoneNumber,
              address: response.address,
              detailAddress: response.addressDetail,
            }
          });
        },

        // 주소 정보 업데이트
        updateAddress: (address) => {
          set(state => ({
            userData: {
              ...state.userData,
              address: address
            },
            orderInfo: {
              ...state.orderInfo,
              address: address
            }
          }));
        },

        // 상세 주소 업데이트
        updateAddressDetail: (addressDetail) => {
          set(state => ({
            userData: {
              ...state.userData,
              addressDetail: addressDetail
            },
            orderInfo: {
              ...state.orderInfo,
              detailAddress: addressDetail
            }
          }));
        },

        // 주문 정보 필드 업데이트
        updateOrderInfo: (field, value) => {
          set(state => ({
            orderInfo: {
              ...state.orderInfo,
              [field]: value
            }
          }));
        },

        // 구매할 상품 정보 초기화
        clearSelectedProduct: () => {
          set({ 
            selectedProduct: null,
            loading: false,
            error: null 
          });
        },

        // 모든 정보 초기화
        clearAll: () => {
          set({
            selectedProduct: null,
            orderInfo: null,
            userData: null,
            loading: false,
            error: null
          });
        },

        // 구매 처리 로직
        processPurchase: async () => {
          const { selectedProduct } = get();
          const productStore = useProductStore.getState();

          if (!selectedProduct) {
            console.error('구매할 상품 정보가 없습니다');
            set({ error: '구매할 상품 정보가 없습니다' });
            return;
          }

          try {
            set({ loading: true });
            // TODO: 결제 API 호출
            
            // 결제 성공 시 상품 상태 업데이트
            await productStore.updateProduct(selectedProduct.sales_board_id, {
              isSell: 'SOLD'
            });

            set({ 
              selectedProduct: null,
              loading: false 
            });

          } catch (error) {
            console.error('구매 처리 실패:', error);
            set({ 
              error: error.message, 
              loading: false 
            });
            throw error;
          }
        }
      }),
      {
        name: 'purchase-storage', // localStorage key
        version: 1, // 스토어 버전
        partialize: (state) => ({ 
          // 필요한 상태만 저장
          selectedProduct: state.selectedProduct,
          orderInfo: state.orderInfo,
          userData: state.userData
        })
      }
    ),
    {
      name: 'product-purchase-store'
    }
  )
)

export default usePurchaseStore;
// import { create } from 'zustand'
// import { devtools } from 'zustand/middleware'
// import useProductStore from './useProductStore'

// const usePurchaseStore = create(
//   devtools((set, get) => ({
//     loading: false,
//     error: null,
//     selectedProduct: null,
//     orderInfo: null,
//     userData: null,
    
//     // 구매할 상품 정보 설정
//     setSelectedProduct: (product) => {
//       set({ selectedProduct: product });
//     },

//     // 주문자 정보 설정 
//     setUserData: (response) => {
//       set({ 
//         userData: response,
//         orderInfo: {
//           name: response.user.username,
//           phone: response.phoneNumber,
//           address: response.address,
//           detailAddress: response.addressDetail,
//         }
//       });
//     },

//     // 주소 정보 업데이트
//     updateAddress: (address) => {
//       set(state => ({
//         userData: {
//           ...state.userData,
//           address: address
//         },
//         orderInfo: {
//           ...state.orderInfo,
//           address: address
//         }
//       }));
//     },

//     // 상세 주소 업데이트
//     updateAddressDetail: (addressDetail) => {
//       set(state => ({
//         userData: {
//           ...state.userData,
//           addressDetail: addressDetail
//         },
//         orderInfo: {
//           ...state.orderInfo,
//           detailAddress: addressDetail
//         }
//       }));
//     },

//     // 주문 정보 필드 업데이트
//     updateOrderInfo: (field, value) => {
//       set(state => ({
//         orderInfo: {
//           ...state.orderInfo,
//           [field]: value
//         }
//       }));
//     },

//     // 구매할 상품 정보 초기화
//     clearSelectedProduct: () => {
//       set({ 
//         selectedProduct: null,
//         loading: false,
//         error: null 
//       });
//     },

//     // 모든 정보 초기화
//     clearAll: () => {
//       set({
//         selectedProduct: null,
//         orderInfo: null,
//         userData: null,
//         loading: false,
//         error: null
//       });
//     },

//     // 구매 처리 로직
//     processPurchase: async () => {
//       const { selectedProduct } = get();
//       const productStore = useProductStore.getState();

//       if (!selectedProduct) {
//         set({ error: '구매할 상품 정보가 없습니다' });
//         return;
//       }

//       try {
//         set({ loading: true });
//         // TODO: 결제 API 호출
        
//         // 결제 성공 시 상품 상태 업데이트
//         productStore.updateProduct(selectedProduct.sales_board_id, {
//           isSell: 'SOLD'
//         });

//         set({ 
//           selectedProduct: null,
//           loading: false 
//         });

//       } catch (error) {
//         set({ 
//           error: error.message, 
//           loading: false 
//         });
//         throw error;
//       }
//     }
//   }), 
//   {
//     name: 'product-purchase-store'
//   }
// ))

// export default usePurchaseStore;