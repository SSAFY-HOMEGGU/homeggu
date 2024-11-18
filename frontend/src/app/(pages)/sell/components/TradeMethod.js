'use client'

import React, { useState } from 'react';
import Image from 'next/image';
import InputBox from '@/app/components/InputBox';
import AreaSelect from './AreaSelect';
import { ActiveButton, UnactiveButton } from '@/app/components/OptionButton';

export default function SellMethod({
  onTradeMethodChange,
  onSafeOption,
  onShippingCostChange,
  onAreaSelectChange,
}) {
  const [tradeMethods, setTradeMethods] = useState({
    SHIPPING: false,    // 택배거래
    IN_PERSON: false   // 직거래
  });
  const [safeOption, setSafeOption] = useState('');
  const [shippingOption, setShippingOption] = useState('');
  const [shippingPrice, setShippingPrice] = useState('');

  // 안전거래 옵션 처리
  const handleSafeOptionClick = (option) => {
    const isSelected = safeOption === option;
    const newValue = isSelected ? '' : option;
    setSafeOption(newValue);
    onSafeOption(newValue === '사용');
  };

  // 거래 방법 처리
  const handleMethodClick = (method) => {
    const updatedMethods = {
      ...tradeMethods,
      [method]: !tradeMethods[method]
    };
    setTradeMethods(updatedMethods);

    // 체크 해제 시 관련 데이터 초기화
    if (!updatedMethods[method]) {
      if (method === 'SHIPPING') {
        // 택배거래 해제 시 모든 배송 관련 데이터 초기화
        setShippingOption('');
        setShippingPrice('');
        // onShippingOptionChange('');
        onShippingCostChange(0);
      }
      if (method === 'IN_PERSON') {
        // 직거래 해제 시 지역 초기화
        onAreaSelectChange({ area: '', subArea: '' });
      }
    }

    // 선택된 모든 거래 방법을 배열로 만들어서 전달
    // const selectedMethods = Object.entries(updatedMethods)
    //   .filter(([_, isSelected]) => isSelected)
    //   .map(([method]) => method);
    
    // onTradeMethodChange(selectedMethods);

    let selectedMethod = '';
    if (updatedMethods.IN_PERSON) {
      selectedMethod = 'IN_PERSON';
    } else if (updatedMethods.SHIPPING) {
      selectedMethod = 'SHIPPING';
    }

    onTradeMethodChange(selectedMethod);

  };

  // 배송비 옵션 처리
  const handleShippingOptionClick = (option) => {
    setShippingOption(option);
    // onShippingOptionChange(option);

    // 배송비 포함으로 변경 시 배송비 초기화
    if (option === '배송비 포함') {
      setShippingPrice('');
      onShippingCostChange(0);
    }
  };

  // 배송비 입력 처리
  const handleShippingPriceChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    if (value.trim() !== '') {
      const formattedValue = Number(value).toLocaleString();
      setShippingPrice(formattedValue);
      onShippingCostChange(Number(value));
    } else {
      setShippingPrice('');
      onShippingCostChange(0);
    }
  };

  const handleAreaSelectChange = ({ area, subArea }) => {
    if (area && subArea) {
      onAreaSelectChange({ area, subArea });
    }
  };

  return (
    <div className='mb-4'>
      <h1 className='mt-[1rem] mb-[0.5rem]'>안전 거래</h1>
      <div className="flex space-x-10 items-center">
        {['사용', '미사용'].map((option) => (
          <div
            key={option}
            className="flex items-center cursor-pointer"
            onClick={() => handleSafeOptionClick(option)}
          >
            <Image
              src={safeOption === option ? '/icons/activeCheck.svg' : '/icons/unactiveCheck.svg'}
              alt={`${option} 체크`}
              width={20}
              height={20}
            />
            <span className="ml-2">{option}</span>
          </div>
        ))}
      </div>

      <h1 className='mt-[1rem] mb-[0.5rem]'>거래 방법</h1>
      <div className="flex space-x-4 items-center">
        <div
          className="flex items-center cursor-pointer"
          onClick={() => handleMethodClick('SHIPPING')}
        >
          <Image
            src={tradeMethods.SHIPPING ? '/icons/activeCheck.svg' : '/icons/unactiveCheck.svg'}
            alt="택배거래 체크"
            width={20}
            height={20}
          />
          <span className="ml-2">택배거래</span>
        </div>
        <div
          className="flex items-center cursor-pointer"
          onClick={() => handleMethodClick('IN_PERSON')}
        >
          <Image
            src={tradeMethods.IN_PERSON ? '/icons/activeCheck.svg' : '/icons/unactiveCheck.svg'}
            alt="직거래 체크"
            width={20}
            height={20}
          />
          <span className="ml-2">직거래</span>
        </div>
      </div>

      {tradeMethods.SHIPPING && (
        <div className="mt-4">
          <h2 className='mt-[1rem] mb-[0.5rem]'>택배거래 옵션</h2>
          <div className="flex gap-4 mt-2">
            {['배송비 포함', '배송비 별도'].map((option) => (
              <div key={option}>
                {shippingOption === option ? (
                  <ActiveButton 
                    onClick={() => handleShippingOptionClick(option)}
                    width="w-[8.5rem]" 
                    height="h-[2.8rem]" 
                    text="text=[1rem]"
                  >
                    {option}
                  </ActiveButton>
                ) : (
                  <UnactiveButton 
                    onClick={() => handleShippingOptionClick(option)}
                    width="w-[8.5rem]" 
                    height="h-[2.8rem]" 
                    text="text=[1rem]"  
                  >
                    {option}
                  </UnactiveButton>
                )}
              </div>
            ))}
          </div>
          {shippingOption === '배송비 별도' && (
            <div className="mt-4">
              <InputBox
                type="text"
                placeholder="₩ 배송비"
                value={shippingPrice}
                onChange={handleShippingPriceChange}
                width="w-1/2"
              />
            </div>
          )}
        </div>
      )}

      {tradeMethods.IN_PERSON && (
        <div className="mt-[1rem] mb-[0.5rem]">
          <h2>직거래 지역 선택</h2>
          <AreaSelect onChange={handleAreaSelectChange} />
        </div>
      )}
    </div>
  );
}