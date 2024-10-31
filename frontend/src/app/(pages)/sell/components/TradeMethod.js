'use client'

import React, { useState } from 'react';
import Image from 'next/image';
import InputBox from '@/app/components/InputBox';
import AreaSelect from './AreaSelect';
import { ActiveButton, UnactiveButton } from '@/app/components/OptionButton';

export default function SellMethod({
  onTradeMethodChange,
  onShippingOptionChange,
  onShippingCostChange,
  onAreaSelectChange,
}) {
  const [options, setOptions] = useState({
    택배거래: false,
    직거래: false,
  });
  const [shippingOption, setShippingOption] = useState('');
  const [price, setPrice] = useState('');

  const handleOptionClick = (option) => {
    const updatedOptions = {
      ...options,
      [option]: !options[option],
    };
    setOptions(updatedOptions);
    onTradeMethodChange(updatedOptions);

    // 택배거래 비활성화 시 배송비 초기화
    if (option === '택배거래' && !updatedOptions[option]) {
      setShippingOption('');
      setPrice('');
      onShippingOptionChange('');
      onShippingCostChange('');
    }
  };

  const handleShippingOptionClick = (option) => {
    setShippingOption(option);
    onShippingOptionChange(option);

    // 배송비 별도에서 배송비 포함으로 변경 시 가격 초기화
    if (option === '배송비 포함') {
      setPrice('');
      onShippingCostChange('');
    }
  };

  const handlePriceChange = (e) => {
    let value = e.target.value.replace(/[^0-9]/g, ''); // 숫자가 아닌 문자를 제거
    if (value.trim() !== '') {
      const formattedValue = Number(value).toLocaleString(); // 천단위로 , 찍기
      setPrice(formattedValue); // 상태 업데이트
      onShippingCostChange(value); // 원래 숫자값을 전달
    } else {
      setPrice(''); // 값이 없으면 빈 문자열로 설정
      onShippingCostChange(''); // 빈 값 전달
    }
  };

  const handleAreaSelectChange = (area, subArea) => {
    onAreaSelectChange({ area, subArea });
  };

  return (
    <div className='mb-4'>
      <h1 className='mt-[1rem] mb-[0.5rem]'>거래 방법</h1>
      <div className="flex space-x-4 items-center">
        {['택배거래', '직거래'].map((option) => (
          <div
            key={option}
            className="flex items-center cursor-pointer"
            onClick={() => handleOptionClick(option)}
          >
            <Image
              src={options[option] ? '/icons/activeCheck.svg' : '/icons/unactiveCheck.svg'}
              alt={`${option} 체크`}
              width={20}
              height={20}
            />
            <span className="ml-2">{option}</span>
          </div>
        ))}
      </div>

      {options['택배거래'] && (
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
                value={price}
                onChange={handlePriceChange}
                width="w-1/2"
              />
            </div>
          )}
        </div>
      )}

      {options['직거래'] && (
        <div className="mt-[1rem] mb-[0.5rem]">
          <h2>직거래 지역 선택</h2>
          <AreaSelect onChange={handleAreaSelectChange} />
        </div>
      )}
    </div>
  );
}
