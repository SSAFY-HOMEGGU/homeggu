// 물건 판매하기 페이지에서 상단 부분에 있으며
// [상품명, 카테고리]
// 를 입력할 수 있다

import React,{useState} from 'react'
import InputBox from '@/app/components/InputBox'
import Dropdown from '@/app/components/Dropdown'

export default function ProductDivision1({ onInputChange, onCategorySelect }) {
  return (
    <div>
      <h1 className='mt-[1rem] mb-[0.5rem]'>상품명</h1>
        <InputBox
          type="text"
          placeholder="상품명"
          onChange={(e) => onInputChange(e.target.value)}
          width="w-full"
        /> 
      <h1 className='mt-[1rem] mb-[0.5rem]'>카테고리</h1>
      <Dropdown 
        options={["가전", "침대", "책상·식탁", "의자·소파", "조명·전등", "수납·서랍"]} 
        onSelect={(value) => onCategorySelect(value)}
      />
    </div> 
  )
}
