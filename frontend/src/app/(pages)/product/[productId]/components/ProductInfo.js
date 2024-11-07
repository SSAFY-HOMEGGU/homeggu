// 'use client';
// import { useState,useEffect } from 'react';
// import useProductStore from '@/app/store/productStore';
// import ImageSwiper from "@/app/components/ImageSwiper";
// import MapComponent from './MapComponent';
// import Link from 'next/link';
// import { IoLocationSharp } from "react-icons/io5";
// import BuyerActions from './BuyerActions';
// import ProductExplain from './ProductExplain';
// import SellerActions from './SellerActions';
// import MapModal from './MapModal';


// export default function ProductInfo() {
//   const { selectedProduct } = useProductStore(); // Zustand에서 선택된 상품 정보 가져오기
//   const [showMap, setShowMap] = useState(false);
//   const [userId, setUserId] = useState(null);
//   console.log('판매상품',selectedProduct, 
//               'userId',userId)

//   useEffect(() => {
//     if (typeof window !== 'undefined') {
//       // 클라이언트 환경에서만 실행
//       const userId = localStorage.getItem('userId');
//       console.log('userId',userId)
//       setUserId(userId);
//     }
//   }, []);

//   if (!selectedProduct) {
//     return <div>Loading...</div>;
//   }

//   const images = selectedProduct.imageUrl.map((url, index) => ({
//     src: url,
//     alt: `${selectedProduct.name} - 이미지 ${index + 1}`,
//   }));

//   const firstLineTexts = ['제품상태', '거래방식', '배송비', '안전거래'];
//   const secondLineTexts = ['중고', '직거래,택배', '10,000원', '사용'];

//   return (
//     <div>
//       <div className="flex flex-row gap-7 mt-[1rem]">
//         {/* 상품 이미지 */}
//         <div className="flex-shrink-0">
//           <ImageSwiper
//             images={images} // 이미지 배열
//             swiperHeight="h-[20rem]" // Swiper 전체 높이
//             swiperWidth="w-[20rem]" // Swiper 전체 너비
//             arrowSize="text-[3rem]]" // 화살표 크기
//             arrowColor="text-greyButtonText" // 화살표 색상
//             paginationColor="bg-white-500" // Pagination의 색상
//             paginationSize="w-5 h-5" // Pagination의 크기
//             imageWidth={800}
//             imageHeight={800}
//           />
//         </div>

//         {/* 상품 정보 */}
//         <div className='flex-grow flex flex-col justify-between'>
//           <div className="w-full ">
//             <Link href='/category'>
//               <p className="text-subText">카테고리</p>
//             </Link>
//             <div className="flex flex-row justify-between items-center">
//               <h1 className="text-[1.6rem] text-normalText font-bold mb-[0.2rem]">{selectedProduct.name}</h1>
//               <p className="text-[0.8rem] text-focusGreen">예약중</p>
//               {/* <p 
//                 className={
//                   text-[0.8rem]
//                   selectedProduct.status === '예약중' 
//                     ? 'text-focusGreen' 
//                     : selectedProduct.status === '판매완료' 
//                     ? 'text-focusRed' 
//                     : 'text-normalText'
//                 }
//               >
//                 {selectedProduct.status === '예약중' ? '예약중' : selectedProduct.status === '판매완료' ? '판매완료' : ''}
//               </p> */}
//             </div>
//             <p className="text-[1.2rem] text-normalText font-semibold mb-2">{selectedProduct.price}</p>
//           </div>

//           <div>
//             <div className='flex flex-row items-center justify-between w-full'>
//               <div className='flex flex-row text-greyButtonText text-[0.8rem]'>
//                 <p>{selectedProduct.date}&nbsp;&nbsp;·&nbsp;&nbsp;</p>
//                 <p> 조회 47&nbsp;&nbsp;·&nbsp;&nbsp;</p>
//                 <p> 채팅 1&nbsp;&nbsp;·&nbsp;&nbsp;</p>
//                 <p> 찜 0 </p>
//               </div>
//               <div className='flex flex-row items-center justify-center text-[0.8rem] mb-[0.1rem] cursor-pointer' onClick={() => setShowMap(!showMap)}>
//                 <p>거래희망 지역</p>
//                 <IoLocationSharp className='text-greyButtonText' />
//                 <p>대전광역시 봉명동</p>
//               </div>
//               {/* {showMap && <MapComponent address="봉명동" />} */}
//               {showMap && (
//                 <MapModal 
//                   address="대전광역시 봉명동" 
//                   onClose={() => setShowMap(false)} 
//                 />
//               )}
//             </div>

//             {/* 네모 상자 */}
//             <div
//               className="flex items-center justify-between w-full h-[7rem] flex-shrink-0 border border-gray-300 rounded-[0.5rem]"
//             >
//               {[...Array(4)].map((_, index) => (
//                 <div
//                   key={index}
//                   className="flex flex-row items-center gap-2 justify-center"
//                 >
//                   <div className="w-[8.5rem] h-[4rem] flex flex-col items-center justify-center p-2 gap-1 text-center">
//                     <p className="text-greyButtonText text-[0.9rem]">{firstLineTexts[index]}</p>
//                     <p className="text-point2 font-semibold text-[1.15em]">{secondLineTexts[index]}</p>
//                   </div>
//                   {index < 3 && <p className="text-greyButtonText ">|</p>}
//                 </div>
//               ))}
//             </div>
//             {/* 구매자일 경우 */}
//             <div className='mt-4'>
//             {selectedProduct.sellerId ===  Number(userId) ? (
//               <SellerActions product={selectedProduct} />
//             ) : (
//               <BuyerActions product={selectedProduct} />
//             )}
//           </div>
            
//           </div>
//         </div>
//       </div>
//       <div className="mt-[2.5rem]">
//         <ProductExplain product={selectedProduct} />
//       </div>
//     </div>
//   );
// }


'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import useProductListStore from '@/app/store/useProductListStore';
import ImageSwiper from "@/app/components/ImageSwiper";
import MapComponent from './MapComponent';
import Link from 'next/link';
import { IoLocationSharp } from "react-icons/io5";
import BuyerActions from './BuyerActions';
import ProductExplain from './ProductExplain';
import SellerActions from './SellerActions';
import MapModal from './MapModal';
import { detailSalesBoard } from '@/app/api/productApi';

export default function ProductInfo() {
  const params = useParams();
  const [productId, setProductId] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const [userId, setUserId] = useState(null);
  
  // URL에서 product id를 가져온다고 가정
  // const selectedProduct = products[1]; // 실제로는 URL params에서 id를 가져와서 찾아야 함
  console.log('params',params)
  console.log('판매상품id', params.productId, 
              'userId', userId)

  useEffect(() => {
    if (params.productId) {
      setProductId(params.productId);
    }
  }, [params]);

  useEffect(() => {
    const fetchProductDetail = async () => {
      if (!productId) return;

      try {
        setLoading(true);
        const data = await detailSalesBoard(productId);
        console.log('상세 데이터 조회 성공:', data);
        setSelectedProduct(data);
      } catch (error) {
        console.error('상세 데이터 조회 실패:', error);
      } 
    };

    fetchProductDetail();
  }, [productId]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // 클라이언트 환경에서만 실행
      const userId = localStorage.getItem('userId');
      console.log('userId', userId)
      setUserId(userId);
    }
  }, []);

  if (!selectedProduct) {
    return <div>Loading...</div>;
  }

  const images = selectedProduct.imageUrl.map((url, index) => ({
    src: url,
    alt: `${selectedProduct.title} - 이미지 ${index + 1}`,
  }));

  const firstLineTexts = ['제품상태', '거래방식', '배송비', '안전거래'];
  const secondLineTexts = [
    selectedProduct.status,
    selectedProduct.trade_method,
    `${selectedProduct.delivery_price.toLocaleString()}원`,
    selectedProduct.isSafe ? '사용' : '미사용'
  ];

  return (
    <div>
      <div className="flex flex-row gap-7 mt-[1rem]">
        {/* 상품 이미지 */}
        <div className="flex-shrink-0">
          <ImageSwiper
            images={images}
            swiperHeight="h-[20rem]"
            swiperWidth="w-[20rem]"
            arrowSize="text-[3rem]]"
            arrowColor="text-greyButtonText"
            paginationColor="bg-white-500"
            paginationSize="w-5 h-5"
            imageWidth={800}
            imageHeight={800}
          />
        </div>

        {/* 상품 정보 */}
        <div className='flex-grow flex flex-col justify-between'>
          <div className="w-full">
            <Link href='/category'>
              <p className="text-subText">{selectedProduct.category}</p>
            </Link>
            <div className="flex flex-row justify-between items-center">
              <h1 className="text-[1.6rem] text-normalText font-bold mb-[0.2rem]">{selectedProduct.title}</h1>
              <p className={`text-[0.8rem] 
                ${selectedProduct.status === '예약중' 
                  ? 'text-focusGreen' 
                  : selectedProduct.status === '판매완료' 
                  ? 'text-focusRed' 
                  : 'text-normalText'
                }`}>
                {selectedProduct.status}
              </p>
            </div>
            <p className="text-[1.2rem] text-normalText font-semibold mb-2">
              {selectedProduct.price.toLocaleString()}원
            </p>
          </div>

          <div>
            <div className='flex flex-row items-center justify-between w-full'>
              <div className='flex flex-row text-greyButtonText text-[0.8rem]'>
                <p>{new Date(selectedProduct.created_at).toLocaleDateString()}&nbsp;&nbsp;·&nbsp;&nbsp;</p>
                <p>조회 {selectedProduct.view_cnt}&nbsp;&nbsp;·&nbsp;&nbsp;</p>
                <p>채팅 {selectedProduct.chat_cnt}&nbsp;&nbsp;·&nbsp;&nbsp;</p>
                <p>찜 {selectedProduct.like_cnt}</p>
              </div>
              <div className='flex flex-row items-center justify-center text-[0.8rem] mb-[0.1rem] cursor-pointer' 
                   onClick={() => setShowMap(!showMap)}>
                <p>거래희망 지역</p>
                <IoLocationSharp className='text-greyButtonText' />
                <p>{selectedProduct.hope_location}</p>
              </div>
              {showMap && (
                <MapModal 
                  address={selectedProduct.hope_location}
                  onClose={() => setShowMap(false)} 
                />
              )}
            </div>

            {/* 네모 상자 */}
            <div className="flex items-center justify-between w-full h-[7rem] flex-shrink-0 border border-gray-300 rounded-[0.5rem]">
              {[...Array(4)].map((_, index) => (
                <div
                  key={index}
                  className="flex flex-row items-center gap-2 justify-center"
                >
                  <div className="w-[8.5rem] h-[4rem] flex flex-col items-center justify-center p-2 gap-1 text-center">
                    <p className="text-greyButtonText text-[0.9rem]">{firstLineTexts[index]}</p>
                    <p className="text-point2 font-semibold text-[1.15em]">{secondLineTexts[index]}</p>
                  </div>
                  {index < 3 && <p className="text-greyButtonText">|</p>}
                </div>
              ))}
            </div>
            
            {/* 구매자/판매자 액션 */}
            <div className='mt-4'>
              {selectedProduct.user_id === Number(userId) ? (
                <SellerActions product={selectedProduct} />
              ) : (
                <BuyerActions product={selectedProduct} />
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="mt-[2.5rem]">
        <ProductExplain product={selectedProduct} />
      </div>
    </div>
  );
}