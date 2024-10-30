import { create } from 'zustand';

const useProductStore = create((set) => ({
  selectedProduct: null, // 선택된 상품의 정보
  setSelectedProduct: (product) => set({ selectedProduct: product }), // 상품 정보 설정 함수
}));

export default useProductStore;