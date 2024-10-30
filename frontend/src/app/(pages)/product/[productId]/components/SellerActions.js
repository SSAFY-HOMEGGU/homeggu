'use client';

import React from 'react'
import Dropdown from '@/app/components/Dropdown'

function SellerActions() {
  return (
    <div className='flex flex-row items-center'>
      <h1 className='mr-[1rem]'>상태 변경</h1>
      <Dropdown 
        options={["판매 중", "예약 중", "판매 완료"]} 
        onSelect={(value) => console.log(value)} 
        selectedFont = "text-point1"
      /> 
    </div>
  )
}

export default SellerActions