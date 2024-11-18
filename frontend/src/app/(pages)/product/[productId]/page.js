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

import { ErrorBoundary } from 'react-error-boundary';
import ProductInfo from './components/ProductInfo';

function ErrorFallback({ error }) {
  return (
    <div>
      <h2>Something went wrong:</h2>
      <pre>{error.message}</pre>
    </div>
  );
}

export default function ProductDetail() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <ProductInfo />
    </ErrorBoundary>
  );
}