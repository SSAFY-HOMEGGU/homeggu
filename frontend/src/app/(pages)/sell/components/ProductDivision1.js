// 물건 판매하기 페이지에서 상단 부분에 있으며
// [상품명, 카테고리]
// 를 입력할 수 있다


'use client';

import React, { useState } from 'react';
import InputBox from '@/app/components/InputBox';
import Dropdown from '@/app/components/Dropdown';

export default function ProductDivision1({ onInputChange, onCategorySelect }) {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedMood, setSelectedMood] = useState('');

 // 카테고리 매핑
 const categoryMap = {
   "침대": "BED",
   "식탁": "DINING_TABLE", 
   "책상": "DESK",
   "소파": "SOFA",
   "의자": "CHAIR",
   "서랍": "DRESSER",
   "수납": "BOOKSHELF",
   "조명": "LIGHTING",
   "전등": "LIGHTING",   /// 수정하기
   "가전": "WARDROBE"
 };

 // 가구 스타일 매핑
 const moodMap = {
   "우드·빈티지": "WOOD_VINTAGE",
   "블랙·메탈릭": "BLACK_METALLIC",
   "화이트·미니멀": "WHITE_MINIMAL",
   "모던·클래식": "MODERN_CLASSIC"
 };

 const handleCategorySelect = (value) => {
  setSelectedCategory(value);
   onCategorySelect(categoryMap[value]);
 };

//  const handleMoodSelect = (value) => {
//    onMoodSelect(moodMap[value]);
//  };
const handleMoodSelect = (value) => {
  setSelectedMood(value);
  // mood 선택 핸들러가 전달되지 않은 경우를 대비한 안전 처리
  if (typeof onMoodSelect === 'function') {
    onMoodSelect(moodMap[value]);
  }
};

 return (
   <div className='flex flex-col gap-4'>
     <div>
       <h1 className='mt-[1rem] mb-[0.5rem]'>상품명</h1>
       <InputBox
         type="text"
         placeholder="상품명"
         onChange={(e) => onInputChange(e.target.value)}
         width="w-full"
       /> 
     </div>
     <div>
       <h1 className='mt-[1rem] mb-[0.5rem]'>카테고리</h1>
       <Dropdown 
         options={Object.keys(categoryMap)}
         onSelect={handleCategorySelect}
         defaultValue={selectedCategory || categoryMap?.[0]}
       />
     </div>
     <div>
       <h1 className='mt-[1rem] mb-[0.5rem]'>가구 스타일</h1>
       <Dropdown 
         options={Object.keys(moodMap)}
         onSelect={handleMoodSelect}
         defaultValue={selectedMood || moodMap?.[0]}
       />
     </div>
   </div> 
 );
}