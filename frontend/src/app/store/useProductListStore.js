import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { salesBoardList,detailSalesBoard } from '../api/productApi';

const useProductListStore = create(
  devtools((set) => ({
    products: [],
    selectedProduct: null,
    loading: false,
    error: null,

    fetchProductDetail: async (productId) => {
      try {
        set({ loading: true });
        const data = await detailSalesBoard(productId);
        set({ 
          selectedProduct: data,
          loading: false 
        });
        return data;
      } catch (error) {
        set({ error: error.message, loading: false });
        console.error('상품 상세 조회 실패:', error);
      }
    },

    // 선택된 상품 업데이트 액션 추가
    updateSelectedProduct: (updates) => {
      set(state => ({
        selectedProduct: state.selectedProduct ? { ...state.selectedProduct, ...updates } : null
      }));
    },
    
    fetchProducts: async () => {
      try {
        set({ loading: true });
        const response = await salesBoardList({});
        console.log(response)
        set({ 
          products: response.content || response,
          loading: false 
        });
      } catch (error) {
        set({ error: error.message, loading: false });
        console.error('상품 목록 조회 실패:', error);
      }
    },


    updateProduct: (productId, updates) => {
      set(state => ({
        products: state.products.map(product => 
          product.sales_board_id === productId
            ? { ...product, ...updates }
            : product
        ),
        selectedProduct: state.selectedProduct?.salesBoardId === productId
        ? { ...state.selectedProduct, ...updates }
        : state.selectedProduct
        }));
      },

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