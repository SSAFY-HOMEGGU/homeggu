import {create} from 'zustand';

const LikeStore = create((set) => ({
  likedProducts: [],
  setlikedProducts: (productId) =>
    set((state) => {
      if (state.likedProducts.includes(productId)) {
        return { likedProducts: state.likedProducts.filter(id => id !== productId) };
      }
      console.log("좋아요 상태관리:", [...state.likedProducts, productId]);
      return { likedProducts: [...state.likedProducts, productId] };
    }),
  
}));

export default LikeStore;
