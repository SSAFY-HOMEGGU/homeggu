'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { sellService } from './services/sellService';
import ImageUpload from './components/ImageUpload';
import ProductDivision1 from './components/ProductDivision1';
import ProductDivision2 from './components/ProductDivision2';
import ProductDivision3 from './components/ProductDivision3';
import TradeMethod from './components/TradeMethod';
import ConversionStatus from './components/ConversionStatus';
import { BlueButton, WhiteButton } from '@/app/components/Button';
import { backgroundConversionService } from './services/backgroundConversionService';


export default function Sell() {
  const router = useRouter(); 
  const [formData, setFormData] = useState(sellService.getInitialFormData());
  const [isLoading, setIsLoading] = useState(false);
  const [mainImageUrl, setMainImageUrl] = useState('');

  const isFormValid = sellService.validateForm(formData);

  useEffect(() => {
    console.log('formData',formData);
  }, [formData]);

  const updateFormData = (key, value) => {
    setFormData(prev => ({
      ...prev,
      salesBoardDTO: {
        ...prev.salesBoardDTO,
        [key]: value
      }
    }));
  };

  // const handleImageUpload = (imageData) => {
  //   if (!imageData) return;
  //   setFormData(prev => ({
  //     ...prev,
  //     goodsImagePaths: imageData.goodsImagePaths || [],
  //     threeDimensionsGoodsImagePaths: imageData.threeDimensionsGoodsImagePaths || []
  //   }));
  //   setMainImageUrl(imageData.mainImageUrl);
  // };

  const handleImageUpload = (imageData) => {
    if (!imageData || !imageData.goodsImagePaths) return;
    
    console.log('Received image data:', imageData); // 디버깅용
    
    setFormData(prev => ({
      ...prev,
      goodsImagePaths: imageData.goodsImagePaths // 이미지 URL 배열 업데이트
    }));
    
    setMainImageUrl(imageData.mainImageUrl);
  };

  const handleSizeChange = ({ goods_x, goods_y, goods_z }) => {
    setFormData(prev => ({
      ...prev,
      salesBoardDTO: {
        ...prev.salesBoardDTO,
        goods_x: Number(goods_x) || 0,
        goods_y: Number(goods_y) || 0,
        goods_z: Number(goods_z) || 0
      }
    }));
  };

  // const handleSubmit = async () => {
  //   if (!isFormValid) return;
  
  //   try {
  //     setIsLoading(true);
  //     await backgroundConversionService.startConversion(mainImageUrl, formData);
  //     // 제출 후 다른 페이지로 이동 가능
  //     router.push('/'); // 또는 다른 페이지로 이동
  //   } catch (error) {
  //     console.error('상품 등록 실패:', error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };
  const handleSubmit = async () => {
    if (!isFormValid) return;
  
    try {
      setIsLoading(true);
      // 3D 변환 서비스 시작
      await backgroundConversionService.startConversion(mainImageUrl, formData);
      // 상품이 등록되었으므로 메인 페이지로 이동
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
      
      <ImageUpload 
        onUpload={(imageData) => {
          // formData 업데이트
          setFormData(prev => ({
            ...prev,
            goodsImagePaths: imageData.goodsImagePaths
          }));
          setMainImageUrl(imageData.mainImageUrl);
        }} 
     />
      
      <ProductDivision1
        onInputChange={(value) => updateFormData('title', value)}
        onCategorySelect={(value) => updateFormData('category', value)}
      />
      
      <ProductDivision2 
        onConditionChange={(value) => updateFormData('status', value)}
        onSizeChange={handleSizeChange}
      />

      <ProductDivision3
        onInputPrice={(value) => updateFormData('price', Number(value))}
        onInputDetail={(value) => updateFormData('content', value)}
      />

      <TradeMethod 
        onTradeMethodChange={(value) => updateFormData('tradeMethod', value)}
        onSafeOption={(value) => updateFormData('isSafe', value)}
        onShippingCostChange={(value) => updateFormData('deliveryPrice', Number(value))}
        onAreaSelectChange={({ area, subArea }) => 
          updateFormData('hopeLocation', `${area} ${subArea}`.trim())
        }
      />

      <div className="flex justify-center my-4">
        {isFormValid ? (
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
        )}
      </div>
      
      <ConversionStatus />
    </div>
  );
}