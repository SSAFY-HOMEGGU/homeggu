// 상품 목록 조회를 위한 훅
export function useProductList() {
  const products = useProductListStore(state => state.products);
  const loading = useProductListStore(state => state.loading);
  const error = useProductListStore(state => state.error);
  const fetchProducts = useProductListStore(state => state.fetchProducts);

  // 컴포넌트 마운트시 상품 목록 조회
  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products,
    loading,
    error,
    fetchProducts
  };
}
