// 물건 판매하기 페이지에서 상단 부분에 있으며
// [상품상태, 상품크기]
// 를 입력할 수 있다


'use client';

import React, { useState } from 'react';
import { ActiveButton, UnactiveButton } from '@/app/components/OptionButton';
import InputBox from '@/app/components/InputBox';

export default function ProductDivision2({ onConditionChange, onSizeChange}) {
 const [selectedCondition, setSelectedCondition] = useState('');

 const conditionMap = {
   '새상품(미개봉)': 'UNPACKED',
   '사용감 없음': 'UNUSED', 
   '사용감 적음': 'LIKENEW',
   '사용감 많음': 'USED',
   '고장/파손 상품': 'BROKEN'
 };

 const conditions = Object.keys(conditionMap);

 const handleConditionClick = (condition) => {
   setSelectedCondition(condition);
   onConditionChange(conditionMap[condition]); 
 };

 const [size, setSize] = useState({ 
   goods_x: '',  // 가로 
   goods_y: '',  // 세로
   goods_z: ''   // 높이
 });

 const handleSizeChange = (key, value) => {
  if (!isNaN(value)) {
    const newSize = {
      ...size,
      [key]: Number(value)
    };
    setSize(newSize);
    // 키 이름 변경에 맞춰 전달
    onSizeChange({
      goods_x: key === 'goods_x' ? Number(value) : size.goods_x,
      goods_y: key === 'goods_y' ? Number(value) : size.goods_y,
      goods_z: key === 'goods_z' ? Number(value) : size.goods_z
    });
  }
};

const sizeFields = [
  { label: '가로', key: 'goods_x' },
  { label: '세로', key: 'goods_y' },
  { label: '높이', key: 'goods_z' },
];

 
 return (
   <div className='flex flex-col gap-4'>
     <div>
       <h1 className='mt-[1rem] mb-[0.5rem]'>상품상태</h1>
       <div className="flex justify-between mt-4 w-full">
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
               width="w-[11rem]"
               height="h-[3rem]"
               text="text=[1rem]"
             >
               {condition}
             </UnactiveButton>
           )
         ))}
       </div>
     </div>

     <div>
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
   </div>
 );
}