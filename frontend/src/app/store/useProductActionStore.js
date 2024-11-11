import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { goodsLike, goodsUnlike } from '../api/userApi'
import { updateSalesBoard, deleteSalesBoard } from '../api/productApi'
import useProductListStore from './useProductListStore'

const useProductActionStore = create(
  devtools((set, get) => ({
    loading: false,
    error: null,

    // 좋아요 토글
    toggleLike: async (productId) => {
      const productStore = useProductListStore.getState();
      const product = productStore.products.find(p => p.sales_board_id === productId);
      const prevIsLiked = product?.isLiked;

      try {
        // Optimistic Update
        productStore.updateProduct(productId, { isLiked: !prevIsLiked });

        // API 호출
        if (!prevIsLiked) {
          await goodsLike({ sales_board_id: productId });
        } else {
          await goodsUnlike({ sales_board_id: productId });
        }
      } catch (error) {
        // 실패시 롤백
        productStore.updateProduct(productId, { isLiked: prevIsLiked });
        toast.error('좋아요 처리 실패');
      }
    },

    // 상품 상태 변경 (예약중, 판매중, 판매완료 등)
    updateStatus: async (product, newStatus) => {
      const productStore = useProductListStore.getState();
      const productId = product.salesBoardId
      // const product = productStore.products.find(p => p.sales_board_id === productId);
      const prevStatus = product?.isSell;
      console.log(product)
      try {
        productStore.updateProduct(productId, { status: newStatus });
        productStore.updateSelectedProduct({ status: newStatus });

        // const updatedData = {
        //   salesBoardDTO: {
        //     title: product.title,
        //     content: product.content,
        //     category: product.category,
        //     // status: product.status,
        //     status: newStatus,
        //     mood: product.mood,
        //     tradeMethod: product.tradeMethod,
        //     isSafe: product.isSafe,
        //     hopeLocation: product.hopeLocation,
        //     price: product.price,
        //     deliveryPrice: product.deliveryPrice,
        //     // isSell: newStatus  // isSell 필드 업데이트
        //   },
        //   goodsImagePaths: product.goodsImagePaths,
        //   threeDimensionsGoodsImagePaths: product.threeDimensionsGoodsImagePaths
        // };
        const updatedData = {
          salesBoardDTO: {
            ...product,
            status: newStatus,
          },
          goodsImagePaths: product.goodsImagePaths,
          threeDimensionsGoodsImagePaths: product.threeDimensionsGoodsImagePaths
        };

        // Optimistic Update
        // productStore.updateProduct(productId, { isSell: newStatus });
        
        // API 호출
        await updateSalesBoard(productId, updatedData);

        
        
        console.log('상품 상태가 변경되었습니다');
      } catch (error) {
        // 실패시 롤백
        productStore.updateProduct(productId, { status: prevStatus });
        productStore.updateSelectedProduct({ status: prevStatus });
        // set({ product });
        console.error('업데이트 실패:', error);
      }
    },

    // 상품 삭제
    deleteProduct: async (productId) => {
      const productStore = useProductListStore.getState();
      const products = productStore.products;

      try {
        // Optimistic Update
        productStore.removeProduct(productId);

        // API 호출
        await deleteSalesBoard(productId);
        
        toast.success('상품이 삭제되었습니다');
      } catch (error) {
        // 실패시 롤백
        set({ products });
        toast.error('삭제 실패');
      }
    }
  }), 
  {
    name: 'product-action-store'
  }
))

export default useProductActionStore;