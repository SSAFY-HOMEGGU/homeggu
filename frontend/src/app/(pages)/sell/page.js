// 'use client';

// import React, { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { sellService } from './services/sellService';
// import ImageUpload from './components/ImageUpload';
// import ProductDivision1 from './components/ProductDivision1';
// import ProductDivision2 from './components/ProductDivision2';
// import ProductDivision3 from './components/ProductDivision3';
// import TradeMethod from './components/TradeMethod';
// import ConversionStatus from './components/ConversionStatus';
// import { BlueButton, WhiteButton } from '@/app/components/Button';
// import { backgroundConversionService } from './services/backgroundConversionService';
// import ModelReadyModal from './services/ModelReadyModal';


// export default function Sell() {
//   const router = useRouter(); 
//   const [formData, setFormData] = useState(sellService.getInitialFormData());
//   const [isLoading, setIsLoading] = useState(false);
//   const [mainImageUrl, setMainImageUrl] = useState('');
//   const [modalData, setModalData] = useState(null);  
//   const isFormValid = sellService.validateForm(formData);

//   useEffect(() => {
//     console.log('formData',formData);
//   }, [formData]);

//   const updateFormData = (key, value) => {
//     setFormData(prev => ({
//       ...prev,
//       salesBoardDTO: {
//         ...prev.salesBoardDTO,
//         [key]: value
//       }
//     }));
//   };


//   // const handleImageUpload = (imageData) => {
//   //   if (!imageData) return;
//   //   setFormData(prev => ({
//   //     ...prev,
//   //     goodsImagePaths: imageData.goodsImagePaths || [],
//   //     threeDimensionsGoodsImagePaths: imageData.threeDimensionsGoodsImagePaths || []
//   //   }));
//   //   setMainImageUrl(imageData.mainImageUrl);
//   // };

//   const handleImageUpload = (imageData) => {
//     if (!imageData || !imageData.goodsImagePaths) return;
    
//     console.log('Received image data:', imageData); // 디버깅용
    
//     setFormData(prev => ({
//       ...prev,
//       goodsImagePaths: imageData.goodsImagePaths // 이미지 URL 배열 업데이트
//     }));
    
//     setMainImageUrl(imageData.mainImageUrl);
//   };

//   const handleSizeChange = ({ goods_x, goods_y, goods_z }) => {
//     setFormData(prev => ({
//       ...prev,
//       salesBoardDTO: {
//         ...prev.salesBoardDTO,
//         goods_x: Number(goods_x) || 0,
//         goods_y: Number(goods_y) || 0,
//         goods_z: Number(goods_z) || 0
//       }
//     }));
//   };

//   // const handleSubmit = async () => {
//   //   if (!isFormValid) return;
  
//   //   try {
//   //     setIsLoading(true);
//   //     await backgroundConversionService.startConversion(mainImageUrl, formData);
//   //     // 제출 후 다른 페이지로 이동 가능
//   //     router.push('/'); // 또는 다른 페이지로 이동
//   //   } catch (error) {
//   //     console.error('상품 등록 실패:', error);
//   //   } finally {
//   //     setIsLoading(false);
//   //   }
//   // };
//   const handleSubmit = async () => {
//     if (!isFormValid) return;
  
//     try {
//       setIsLoading(true);
//       // 3D 변환 서비스 시작
//       await backgroundConversionService.startConversion(mainImageUrl, formData);
//       // 상품이 등록되었으므로 메인 페이지로 이동
//       router.push('/');
//     } catch (error) {
//       console.error('상품 등록 실패:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };
  
//   return (
//     <div className='flex flex-col gap-4'>
//       <h1 className='text-[1.25rem] mt-[1rem]'>판매하기</h1>
      
//       <ImageUpload 
//         onUpload={(imageData) => {
//           // formData 업데이트
//           setFormData(prev => ({
//             ...prev,
//             goodsImagePaths: imageData.goodsImagePaths
//           }));
//           setMainImageUrl(imageData.mainImageUrl);
//         }} 
//      />
      
//       <ProductDivision1
//         onInputChange={(value) => updateFormData('title', value)}
//         onCategorySelect={(value) => updateFormData('category', value)}
//       />
      
//       <ProductDivision2 
//         onConditionChange={(value) => updateFormData('status', value)}
//         onSizeChange={handleSizeChange}
//       />

//       <ProductDivision3
//         onInputPrice={(value) => updateFormData('price', Number(value))}
//         onInputDetail={(value) => updateFormData('content', value)}
//       />

//       <TradeMethod 
//         onTradeMethodChange={(value) => updateFormData('tradeMethod', value)}
//         onSafeOption={(value) => updateFormData('isSafe', value)}
//         onShippingCostChange={(value) => updateFormData('deliveryPrice', Number(value))}
//         onAreaSelectChange={({ area, subArea }) => 
//           updateFormData('hopeLocation', `${area} ${subArea}`.trim())
//         }
//       />

//       <div className="flex justify-center my-4">
//         {isFormValid ? (
//           <BlueButton
//             width="w-[30rem]" 
//             height="h-[3.5rem]"
//             onClick={handleSubmit}
//             disabled={isLoading}
//           >
//             {isLoading ? '처리 중...' : '등록하기'}
//           </BlueButton>
//         ) : (
//           <WhiteButton
//             textColor='text-greyButtonText'
//             border='border-grey-500'
//             width="w-[30rem]" 
//             height="h-[3.5rem]"
//           >
//             등록하기
//           </WhiteButton>
//         )}
//       </div>
      
//       <ConversionStatus />

//       <ModelReadyModal
//         isOpen={!!modalData}
//         onClose={() => setModalData(null)}
//         objUrl={modalData?.objUrl}
//         onUploadComplete={modalData?.onUploadComplete}
//       />
//     </div>
//   );
// }

'use client';

import React, { useState,useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useProductStore from '@/app/store/useProductStore';
import { sellService } from './services/sellService';
import ImageUpload from './components/ImageUpload';
import ProductDivision1 from './components/ProductDivision1';
import ProductDivision2 from './components/ProductDivision2';
import ProductDivision3 from './components/ProductDivision3';
import TradeMethod from './components/TradeMethod';
import ConversionStatus from './components/ConversionStatus';
import { BlueButton, WhiteButton } from '@/app/components/Button';
import { backgroundConversionService } from './services/backgroundConversionService';
import ModelReadyModal from './services/ModelReadyModal';

export default function Sell() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [mainImageUrl, setMainImageUrl] = useState('');
  const [modalData, setModalData] = useState(null);

  // Zustand store 사용
  const { 
    salesBoardDTO, 
    goodsImagePaths,
    updateProduct, 
    setGoodsImages,
    resetStore,
    getFormData // 추가
  } = useProductStore();
  
  // 폼 유효성 검사
  // const isFormValid = sellService.validateForm(getFormData());

  useEffect(() => {
    console.log('상품 등록 데이터',getFormData())
  })

  const handleImageUpload = (imageData) => {
    if (!imageData || !imageData.goodsImagePaths) return;
    setGoodsImages(imageData.goodsImagePaths);
    setMainImageUrl(imageData.mainImageUrl);
  };

  const handleSizeChange = ({ goods_x, goods_y, goods_z }) => {
    updateProduct('goods_x', Number(goods_x) || 0);
    updateProduct('goods_y', Number(goods_y) || 0);
    updateProduct('goods_z', Number(goods_z) || 0);
  };

  const handleSubmit = async () => {
    // if (!isFormValid) return;
  
    try {
      setIsLoading(true);
      const formData = {
        salesBoardDTO,
        goodsImagePaths
      };
      await backgroundConversionService.startConversion(mainImageUrl, formData);
      router.push('/');
    } catch (error) {
      console.error('상품 등록 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className='flex flex-col gap-4'>
      <h1 className='text-[1.25rem] mt-[1rem]'>판매하기</h1>
      
      <ImageUpload onUpload={handleImageUpload} />
      
      <ProductDivision1
        onInputChange={(value) => updateProduct('title', value)}
        onCategorySelect={(value) => updateProduct('category', value)}
      />
      
      <ProductDivision2 
        onConditionChange={(value) => updateProduct('status', value)}
        onSizeChange={handleSizeChange}
      />

      <ProductDivision3
        onInputPrice={(value) => updateProduct('price', Number(value))}
        onInputDetail={(value) => updateProduct('content', value)}
      />

      <TradeMethod 
        onTradeMethodChange={(value) => updateProduct('tradeMethod', value)}
        onSafeOption={(value) => updateProduct('isSafe', value)}
        onShippingCostChange={(value) => updateProduct('deliveryPrice', Number(value))}
        onAreaSelectChange={({ area, subArea }) => 
          updateProduct('hopeLocation', `${area} ${subArea}`.trim())
        }
      />

      <div className="flex justify-center my-4">
        
          <BlueButton
            width="w-[30rem]" 
            height="h-[3.5rem]"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? '처리 중...' : '등록하기'}
          </BlueButton>
        
        {/* {isFormValid ? (
          <BlueButton
            width="w-[30rem]" 
            height="h-[3.5rem]"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? '처리 중...' : '등록하기'}
          </BlueButton>
        ) : (
          <WhiteButton
            textColor='text-greyButtonText'
            border='border-grey-500'
            width="w-[30rem]" 
            height="h-[3.5rem]"
          >
            등록하기
          </WhiteButton>
        )} */}
      </div>
      
      {/* <ConversionStatus /> */}

      <ModelReadyModal
        isOpen={!!modalData}
        onClose={() => setModalData(null)}
        objUrl={modalData?.objUrl}
        onUploadComplete={modalData?.onUploadComplete}
      />
    </div>
  );
}