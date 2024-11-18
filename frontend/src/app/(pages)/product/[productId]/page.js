// import ProductInfo from './components/ProductInfo';
// import SellerActions from './components/SellerActions';
// import BuyerActions from './components/BuyerActions';

// export default function productDetail() {
  

//   return (
//     <div>
//       <ProductInfo />

//     </div>
//   )
// }

'use client';

import ProductInfo from './components/ProductInfo';

export default function ProductDetail({ params }) {
  return (
    <div>
      <ProductInfo />
    </div>
  );
}