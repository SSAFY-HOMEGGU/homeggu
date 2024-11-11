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
import Label from './Label';
import { categoryMapping,statusMapping,moodMapping,tradeMethodMapping, sellStatusMapping } from './mapping';

export default function ProductInfo() {
  const params = useParams();
  const [productId, setProductId] = useState(null);
  // const [selectedProduct, setSelectedProduct] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const [userId, setUserId] = useState(null);
  // const [loading, setLoading] = useState(false); 
  
  const { 
    selectedProduct, 
    loading, 
    fetchProductDetail,
    updateSelectedProduct 
  } = useProductListStore();

  useEffect(() => {
    if (params.productId) {
      fetchProductDetail(params.productId);
    }
  }, [params.productId,fetchProductDetail]);

  
  console.log('params',params)
  console.log('판매상품id', params.productId, 
              'userId', userId)

const categoryLinks = {
  'DESK': '/category/desk',
  'DINING_TABLE': '/category/desk',
  'BED': '/category/bed',
  'SOFA': '/category/sofa',
  'CHAIR': '/category/sofa',
  'DRESSER': '/category/drawer',
  'BOOKSHELF': '/category/drawer',
  'LIGHTING': '/category/light',
  'WARDROBE': '/category/electronics'
};



/* 거래 방식이 리스트로 변경될 경우를 대비한 형식
const tradeMethodMapping = {
  methods: ['IN_PERSON', 'SHIPPING'],
  display: {
    'IN_PERSON': '직거래',
    'SHIPPING': '택배'
  }
};

// 리스트 형식 사용 예시
const displayTradeMethod = (methods) => {
  return methods.map(method => tradeMethodMapping.display[method]).join(', ');
};
*/

const sellStatusMapping = {
  'RESERVING': '예약중',
  'SOLD': '판매완료',
  'AVAILABLE': '판매중'
 };

  useEffect(() => {
    if (params.productId) {
      setProductId(params.productId);
    }
  }, [params]);

  useEffect(() => {
    const fetchProductDetail = async () => {
      if (!productId) return;

      try {
        setLoading(true); // 이제 정의된 setLoading 사용 가능
        const data = await detailSalesBoard(productId);
        console.log('상세 데이터 조회 성공:', data);
        setSelectedProduct(data);
      } catch (error) {
        console.error('상세 데이터 조회 실패:', error);
      } finally {
        // setLoading(false); // 로딩 상태 해제
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

  const imagePaths = selectedProduct.goodsImagePaths 
    ? (typeof selectedProduct.goodsImagePaths === 'string' 
        ? JSON.parse(selectedProduct.goodsImagePaths) 
        : selectedProduct.goodsImagePaths)
    : [];

  const images = imagePaths.map((url, index) => ({
    src: url,
    alt: `${selectedProduct.title} - 이미지 ${index + 1}`,
  }));

  const firstLineTexts = ['제품상태', '거래방식', '배송비', '안전거래'];
  const secondLineTexts = [
    statusMapping[selectedProduct.status] || selectedProduct.status,
    tradeMethodMapping[selectedProduct.tradeMethod] || selectedProduct.tradeMethod,
    `${selectedProduct.deliveryPrice.toLocaleString()}원`,
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
            <Link href={categoryLinks[selectedProduct.category]}>
             <p className="text-subText">{categoryMapping[selectedProduct.category]}</p>
            </Link>
            <div className="flex flex-row justify-between items-center">
              <h1 className="text-[1.6rem] text-normalText font-bold mb-[0.2rem]">{selectedProduct.title}</h1>
              <p className={`text-[0.8rem] 
                ${selectedProduct.isSell === 'RESERVING' 
                  ? 'text-focusGreen' 
                  : selectedProduct.isSell === 'SOLD' 
                  ? 'text-focusRed' 
                  : 'text-normalText'
                }`}>
                {sellStatusMapping[selectedProduct.isSell] || selectedProduct.isSell}
              </p>
              <p>
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
                <p>{new Date(selectedProduct.createdAt).toLocaleDateString()}&nbsp;&nbsp;·&nbsp;&nbsp;</p>
                <p>조회 {selectedProduct.viewCnt}&nbsp;&nbsp;·&nbsp;&nbsp;</p>
                <p>채팅 {selectedProduct.chatCnt}&nbsp;&nbsp;·&nbsp;&nbsp;</p>
                <p>찜 {selectedProduct.likeCnt}</p>
              </div>
              <div className='flex flex-row items-center justify-center text-[0.8rem] mb-[0.1rem] cursor-pointer' 
                   onClick={() => setShowMap(!showMap)}>
                <p>거래희망 지역</p>
                <IoLocationSharp className='text-greyButtonText' />
                <p>{selectedProduct.hopeLocation}</p>
              </div>
              {showMap && (
                <MapModal 
                  address={selectedProduct.hopeLocation}
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
              {selectedProduct.userId === Number(userId) ? (
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