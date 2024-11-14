import { create } from 'zustand';

const useProductStore = create((set) => ({
  // 기존 상태
  selectedProduct: null,
  setSelectedProduct: (product) => set({ selectedProduct: product }),
  
  // 3D 변환 관련 상태와 함수들
  tempProduct: null,
  conversionStatus: {
    isConverting: false,
    progress: 0,
    error: null
  },

  // 이미지 관련 상태 추가
  productImages: {
    goodsImagePaths: [],
    threeDimensionsGoodsImagePaths: [],
    mainImageIndex: 0
  },

  // 액션들
  setTempProduct: (product) => set({ 
    tempProduct: product 
  }),

  setConversionStatus: (status) => set((state) => ({
    conversionStatus: {
      ...state.conversionStatus,
      ...status
    }
  })),

  // 이미지 관련 액션 추가
  setProductImages: (imageData) => set((state) => ({
    productImages: {
      ...state.productImages,
      goodsImagePaths: imageData.goodsImagePaths,
      mainImageIndex: imageData.mainImageIndex
    }
  })),

  set3DImages: (imageUrls) => set((state) => ({
    productImages: {
      ...state.productImages,
      threeDimensionsGoodsImagePaths: imageUrls
    }
  })),

  clearStore: () => set({
    tempProduct: null,
    conversionStatus: {
      isConverting: false,
      progress: 0,
      error: null
    },
    productImages: {
      goodsImagePaths: [],
      threeDimensionsGoodsImagePaths: [],
      mainImageIndex: 0
    }
  })
}));

export default useProductStore;