import ProductInfo from './components/ProductInfo';
import SellerActions from './components/SellerActions';
import BuyerActions from './components/BuyerActions';

export default function productDetail() {
  
  // if (!productData) {
  //   return <div>Loading...</div>;
  // }

  return (
    <div>
      {/* 공통된 상품 정보 */}
      <ProductInfo />

      {/* 판매자와 구매자에 따라 달라지는 부분 */}
      {/* {isSeller ? (
        <SellerActions productId={productData.id} />
      ) : (
        <BuyerActions productId={productData.id} />
      )} */}
    </div>
  )
}
