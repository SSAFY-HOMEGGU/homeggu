'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Image from 'next/image';
import ImageUpload from './components/ImageUpload';
import ProductDivision1 from './components/ProductDivision1';
import ProductDivision2 from './components/ProductDivision2';
import ProductDivision3 from './components/ProductDivision3';
import TradeMethod from './components/TradeMethod';
import { BlueButton, WhiteButton } from '@/app/components/Button';
import { salesBoard } from '@/app/api/productApi';
import { useRouter } from 'next/navigation';

export default function Sell() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    "salesBoardDTO": {
      "title": "",          // 상품 이름
      "content": "",        // 상품 설명
      "category": "BED",       // 카테고리 
      "mood": "WOOD_VINTAGE",   // 상품 스타일
      "status": "",        // 상품 상태
      "tradeMethod": "",   // 거래 방식 (택배거래, 직거래)
      "isSafe": false,     // 안전 거래
      "hopeLocation": "",  // 직거래 지역
      "price": 0,         // 상품 가격
      "deliveryPrice": 0, // 배달 가격
      "goods_x": 0,       // 상품 크기(가로)
      "goods_y": 0,       // 상품 크기(세로)
      "goods_z": 0        // 상품 크기(높이)
    },
    "goodsImagePaths": [],                    // 상품 이미지
    "threeDimensionsGoodsImagePaths": []      // 상품 3D이미지
  });

  useEffect(() => {
    console.log('전체 formData 업데이트:', formData);
  }, [formData]);

  const isFormValid = useMemo(() => {
    const salesDTO = formData.salesBoardDTO;
    
    // 기본 필수 필드 검사
    const baseFieldsValid = 
      salesDTO.title !== '' &&
      salesDTO.content !== '' &&
      salesDTO.category !== '' &&
      salesDTO.status !== '' &&
      salesDTO.price > 0 &&
      formData.goodsImagePaths.length > 0;

    // 크기 필드 검사
    const sizeValid = 
      salesDTO.goods_x > 0 &&
      salesDTO.goods_y > 0 &&
      salesDTO.goods_z > 0;

    // 거래 방법 관련 검사
    const tradeMethodValid = salesDTO.tradeMethod !== '';

    // 직거래 선택 시 추가 검증
    const directTradeValid = salesDTO.tradeMethod !== 'IN_PERSON' || 
      salesDTO.hopeLocation !== '';

    // 택배거래 선택 시 추가 검증
    const deliveryValid = salesDTO.tradeMethod !== 'DELIVERY' || 
      salesDTO.deliveryPrice >= 0;

    return baseFieldsValid && 
           sizeValid && 
           tradeMethodValid && 
           directTradeValid &&
           deliveryValid;
  }, [formData]);

  // 이미지 업로드 핸들러
  const handleImageUpload = (imageData) => {
    console.log('이미지 업로드 데이터:', imageData);
    // imageData가 undefined인지 확인
    if (!imageData) return;
  
    setFormData(prev => ({
      ...prev,
      goodsImagePaths: imageData.goodsImagePaths || [], // 기본값 설정
      threeDimensionsGoodsImagePaths: imageData.threeDimensionsGoodsImagePaths || [] // 기본값 설정
    }));
  };

  // 상품명 변경 핸들러
  const handleProductNameChange = (value) => {
    setFormData(prev => ({
      ...prev,
      salesBoardDTO: {
        ...prev.salesBoardDTO,
        title: value
      }
    }));
  };

  // 카테고리 선택 핸들러
  const handleCategorySelect = (value) => {
    setFormData(prev => ({
      ...prev,
      salesBoardDTO: {
        ...prev.salesBoardDTO,
        category: value
      }
    }));
  };

  // 상품 상태 변경 핸들러
  const handleConditionChange = (value) => {
    setFormData(prev => ({
      ...prev,
      salesBoardDTO: {
        ...prev.salesBoardDTO,
        status: value
      }
    }));
  };

  // 상품 크기 입력 핸들러
  const handleSizeChange = ({ goods_x, goods_y, goods_z }) => {
    console.log('상품 크기 데이터:', { goods_x, goods_y, goods_z });
    
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

  // 가격 변경 핸들러
  const handlePriceChange = (value) => {
    setFormData(prev => ({
      ...prev,
      salesBoardDTO: {
        ...prev.salesBoardDTO,
        price: Number(value)
      }
    }));
  };

  // 상품 설명 입력 핸들러
  const handleDetailChange = (value) => {
    setFormData(prev => ({
      ...prev,
      salesBoardDTO: {
        ...prev.salesBoardDTO,
        content: value
      }
    }));
  };

  // 거래 방법 변경 핸들러
  const handleTradeMethodChange = (method) => {
    setFormData(prev => ({
      ...prev,
      salesBoardDTO: {
        ...prev.salesBoardDTO,
        tradeMethod: method
      }
    }));
  };

  // 배송비 변경 핸들러
  const handleShippingCostChange = (cost) => {
    setFormData(prev => ({
      ...prev,
      salesBoardDTO: {
        ...prev.salesBoardDTO,
        deliveryPrice: Number(cost)
      }
    }));
  };

  // 안전거래 옵션 핸들러
  const handleSafeOption = (option) => {
    setFormData(prev => ({
      ...prev,
      salesBoardDTO: {
        ...prev.salesBoardDTO,
        isSafe: option
      }
    }));
  };

  // 지역 선택 핸들러
  const handleAreaSelectChange = ({ area, subArea }) => {
    setFormData(prev => ({
      ...prev,
      salesBoardDTO: {
        ...prev.salesBoardDTO,
        hopeLocation: `${area} ${subArea}`.trim()
      }
    }));
  };

  const handleSubmit = async () => {
    if (isFormValid) {
      try {
        console.log('제출할 데이터:', formData);
        const response = await salesBoard(formData);
        console.log('등록 성공:', response);
        
        // 성공 시 처리 (예: 홈으로 이동)
        router.push('/'); // Next.js router import 필요
      } catch (error) {
        console.error('상품 등록 실패:', error);
        // 에러 처리 (예: 에러 메시지 표시)
        alert('상품 등록에 실패했습니다. 다시 시도해주세요.');
      }
    }
  };

  return (
    <div className='flex flex-col gap-4'>
      <h1 className='text-[1.25rem] mt-[1rem]'>판매하기</h1>
      <ImageUpload onUpload={handleImageUpload} />
      
      <ProductDivision1
        onInputChange={handleProductNameChange}
        onCategorySelect={handleCategorySelect}
      />
      
      <ProductDivision2 
        onConditionChange={handleConditionChange}
        onSizeChange={handleSizeChange}
      />

      <ProductDivision3
        onInputPrice={handlePriceChange}
        onInputDetail={handleDetailChange}
      />

      <TradeMethod 
        onTradeMethodChange={handleTradeMethodChange}
        onSafeOption={handleSafeOption}
        onShippingCostChange={handleShippingCostChange}
        onAreaSelectChange={handleAreaSelectChange}
      />

      <div className="flex justify-center my-4">
        {isFormValid ? (
          <BlueButton
            width="w-[30rem]" 
            height="h-[3.5rem]"
            onClick={handleSubmit}
          >
            등록하기
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
    </div>
  );
}