import { useEffect } from 'react'
import useProductListStore from '@/app/store/useProductListStore'
import useProductActionStore from '@/app/store/useProductActionStore'
import usePurchaseStore from '@/app/store/usePurchaseStore'

// 개별 상품 조회 및 액션을 위한 훅
export function useProduct(productId) {
  const product = useProductListStore(state => 
    state.products.find(p => p.sales_board_id === productId)
  );
  const { toggleLike, updateStatus, deleteProduct } = useProductActionStore();
  const { purchaseProduct, loading: purchaseLoading } = usePurchaseStore();

  return {
    product,
    toggleLike: () => toggleLike(productId),
    updateStatus: (status) => updateStatus(productId, status),
    purchase: () => purchaseProduct(productId),
    deleteProduct: () => deleteProduct(productId),
    purchaseLoading
  };
}