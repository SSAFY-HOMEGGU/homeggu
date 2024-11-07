// 물건 판매하기 페이지에서 중단 부분에 있으며
// [상품 상태, 상품 크기]
// 를 입력할 수 있다

'use client';

import React, { useState } from 'react';
import { ActiveButton, UnactiveButton } from '@/app/components/OptionButton';
import InputBox from '@/app/components/InputBox';

export default function ProductDivision2({ onConditionChange, onSizeChange}) {
  const [selectedCondition, setSelectedCondition] = useState('');

  const conditions = [
    '새상품(미상품)',
    '사용감 없음',
    '사용감 적음',
    '사용감 많음',
    '고장/파손 상품',
  ];

  const handleConditionClick = (condition) => {
    setSelectedCondition(condition);
    onConditionChange(condition);
  };

  const [size, setSize] = useState({ width: '', length: '', height: '' });

  const handleSizeChange = (key, value) => {
    if (!isNaN(value)) {
      const newSize = {
        ...size,
        [key]: value,
      };
      setSize(newSize);
      onSizeChange(newSize);
    }
  };

  const sizeFields = [
    { label: '가로', key: 'width' },
    { label: '세로', key: 'length' },
    { label: '높이', key: 'height' },
  ];
  

  return (
    <div>
      <h1 className='mt-[1rem] mb-[0.5rem]'>상품상태</h1>
      <div className="flex gap-4 mt-4">
        {conditions.map((condition) => (
          selectedCondition === condition ? (
            <ActiveButton 
              key={condition} 
              onClick={() => handleConditionClick(condition)}
              width="w-[10rem]"
              height="h-[3rem]" 
              text="text-[1rem]"
            >
              {condition}
            </ActiveButton>
          ) : (
            <UnactiveButton 
              key={condition} 
              onClick={() => handleConditionClick(condition)}
              width="w-[10rem]" // 너비 예시
              height="h-[3rem]" // 높이 예시
              text="text=[1rem]"
            >
              {condition}
            </UnactiveButton>
          )
        ))}
      </div>
      
      <h1 className="mt-[1rem] mb-[0.5rem]">상품 크기</h1>
      <div className='flex flex-row gap-4'>
        {sizeFields.map(({ label, key }) => (
          <div key={key} className='flex flex-col'>
            <h3 className='text-subText'>{label}</h3>
            <InputBox
              type="text"
              placeholder={`상품의 ${label} (단위:mm)`}
              value={size[key]}
              onChange={(e) => handleSizeChange(key, e.target.value)}
              width="w-[19rem]"
            />
          </div>
        ))}
      </div>
    </div>
  );
}