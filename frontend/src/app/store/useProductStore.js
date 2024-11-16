import { create } from 'zustand';

const useProductStore = create((set) => ({
  // 상품 정보
  salesBoardDTO: {
    title: '',
    content: '',
    category: 'BED', // 기본값 설정
    mood: 'WOOD_VINTAGE', // 기본값 설정
    isSell: 'AVAILABLE',
    status: '',
    tradeMethod: '',
    isSafe: false,
    hopeLocation: '',
    price: 0,
    deliveryPrice: 0,
    goods_x: 0,
    goods_y: 0,
    goods_z: 0,
  },
  goodsImagePaths: [],
  threeDimensionsGoodsImagePaths: [],

  // 상품 정보 업데이트
  updateProduct: (key, value) => set((state) => ({
    salesBoardDTO: {
      ...state.salesBoardDTO,
      [key]: value
    }
  })),

  // 이미지 경로 업데이트
  setGoodsImages: (paths) => set({ 
    goodsImagePaths: paths 
  }),
  
  // 3D 이미지 경로 업데이트
  set3DImages: (paths) => set({ 
    threeDimensionsGoodsImagePaths: paths 
  }),

  // 초기화
  resetStore: () => set({
    salesBoardDTO: {
      title: '',
      content: '',
      category: 'BED',
      mood: 'WOOD_VINTAGE',
      isSell: 'AVAILABLE',
      status: '',
      tradeMethod: '',
      isSafe: false,
      hopeLocation: '',
      price: 0,
      deliveryPrice: 0,
      goods_x: 0,
      goods_y: 0,
      goods_z: 0,
    },
    goodsImagePaths: [],
    threeDimensionsGoodsImagePaths: [],
  }),

  // 전체 데이터 가져오기 (유효성 검사용)
  getFormData: () => ({
    salesBoardDTO: useProductStore.getState().salesBoardDTO,
    goodsImagePaths: useProductStore.getState().goodsImagePaths,
    threeDimensionsGoodsImagePaths: useProductStore.getState().threeDimensionsGoodsImagePaths
  })
}));

export default useProductStore;