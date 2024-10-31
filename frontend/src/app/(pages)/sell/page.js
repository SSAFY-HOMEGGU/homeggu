'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import ImageUpload from './components/ImageUpload';
import ProductDivision1 from './components/ProductDivision1';
import ProductDivision2 from './components/ProductDivision2';
import ProductDivision3 from './components/ProductDivision3';
import TradeMethod from './components/TradeMethod';

export default function Sell() {
  const [formData, setFormData] = useState({
    productName: '',
    category: '',
    productCondition: '',
    price: '',
    size: { width: '', length: '', height: '' },
    description: '',
    tradeMethod: '',
    shippingOption: '', // 배송 옵션 추가
    shippingCost: '',
    images: [], // 이미지 정보 저장
  });

  console.log('판매하기 입력', formData);

  const handleImageUpload = (images) => {
    setFormData((prev) => ({
      ...prev,
      images, // 업로드된 이미지를 formData에 저장
    }));
  };

  const handleProductNameChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      productName: value,
    }));
  };

  // 카테고리 선택 핸들러
  const handleCategorySelect = (value) => {
    setFormData((prev) => ({
      ...prev,
      category: value,
    }));
  };

  const handleConditionChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      productCondition: value,
    }));
  };

  // 상품 크기 입력 핸들러
  const handleSizeChange = (size) => {
    setFormData((prev) => ({
      ...prev,
      size,
    }));
  };

  const handlePriceChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      price: value,
    }));
  };

  // 상품 설명 입력 핸들러
  const handleDetailChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      description: value,
    }));
  };

  // 거래 방법 및 배송비 입력 핸들러
  const handleTradeMethodChange = (method) => {
    setFormData((prev) => ({
      ...prev,
      tradeMethod: method,
    }));
  };

  const handleShippingCostChange = (cost) => {
    setFormData((prev) => ({
      ...prev,
      shippingCost: cost,
    }));
  };

  const handleShippingOptionChange = (option) => {
    setFormData((prev) => ({
      ...prev,
      shippingOption: option,
    }));
  };

  return (
    <div>
      <h1 className='text-[1.25rem] mt-[1rem]'>판매하기</h1>
      {/* 이미지 업로드 */}
      <ImageUpload onUpload={handleImageUpload} />

      {/* 상품명, 카테고리 */}
      <ProductDivision1
        onInputChange={handleProductNameChange}
        onCategorySelect={handleCategorySelect}
      />
      
      {/* 상품상태, 상품 크기 */}
      <ProductDivision2 
        onConditionChange={handleConditionChange}
        onSizeChange={handleSizeChange}
      />

      {/* 상품 가격, 상품 설명 */}
      <ProductDivision3
        onInputPrice={handlePriceChange}
        onInputDetail={handleDetailChange}
      />

      {/* 거래 방법 및 배송비 */}
      <TradeMethod 
        onTradeMethodChange={handleTradeMethodChange}
        onShippingCostChange={handleShippingCostChange}
        onShippingOptionChange={handleShippingOptionChange}

      />
    </div>
  );
}
