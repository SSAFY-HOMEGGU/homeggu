import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
// import { processPayment } from '@/api/payment'  // 결제 API
import useProductListStore from './useProductListStore'

const usePurchaseStore = create(
  devtools((set, get) => ({
    loading: false,
    error: null,

    // 상품 구매
    purchaseProduct: async (productId) => {
      const productStore = useProductListStore.getState();
      const product = productStore.products.find(p => p.sales_board_id === productId);

      if (!product) {
        toast.error('상품을 찾을 수 없습니다');
        return;
      }

      try {
        set({ loading: true });

        // 결제 API 호출 (Server First - 결제는 Optimistic Update 사용하지 않음)
        const paymentResult = await processPayment(productId, product.price);

        // 결제 성공 시 상품 상태 업데이트
        productStore.updateProduct(productId, {
          status: 'SOLD_OUT',
          buyerId: paymentResult.buyerId
        });

        toast.success('구매가 완료되었습니다');
      } catch (error) {
        if (error.code === 'INSUFFICIENT_BALANCE') {
          toast.error('잔액이 부족합니다');
        } else if (error.code === 'ALREADY_SOLD') {
          toast.error('이미 판매된 상품입니다');
          // 전체 상품 목록 새로고침
          productStore.fetchProducts();
        } else {
          toast.error('구매 처리 중 오류가 발생했습니다');
        }
      } finally {
        set({ loading: false });
      }
    }
  }), 
  {
    name: 'product-purchase-store'
  }
))

export default usePurchaseStore;