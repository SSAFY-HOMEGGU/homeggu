// 물건 판매하기 페이지에서 중단 부분에 있으며
// [상품 가격, 상품 설명]
// 를 입력할 수 있다

"use Client"
import React,{useState} from 'react'
import InputBox from '@/app/components/InputBox'

export default function ProductDivision3({ onInputPrice, onInputDetail }) {
  const [price, setPrice] = useState("");

  const handlePriceChange = (e) => {
    let value = e.target.value.replace(/[^0-9]/g, ""); // 숫자가 아닌 문자를 제거
    if (value.trim() !== "") {
      const formattedValue = Number(value).toLocaleString(); // 천단위로 , 찍기
      setPrice(formattedValue); // 상태 업데이트
      onInputPrice(value); // 원래 숫자값을 전달
    } else {
      setPrice(""); // 값이 없으면 빈 문자열로 설정
      onInputPrice(""); // 빈 값 전달
    }
  };

  const handleDetailChange = (e) => {
    onInputDetail(e.target.value);
  };

  return (
    <div>
      <h1 className='mt-[1rem] mb-[0.5rem]'>판매 가격</h1>
      <InputBox
        type="text"
        placeholder="₩ 판매가격"
        value={price}
        onChange={handlePriceChange}
        width="w-1/2"
      />
      <h1 className='mt-[1rem] mb-[0.5rem]'>상품 설명</h1>
      <textarea
        type="text"
        placeholder={`
          - 상품명(브랜드)\n
          - 구매 시기\n
          - 사용 기간\n
          - 하자 여부\n
          * 실제 촬영한 사진과 함께 상세 정보를 입력해주세요
        `}
        onChange={handleDetailChange}
        className='w-full h-[18rem] border border-greyButtonText rounded-md focus:outline-none resize-none p-3 leading-tight'
      ></textarea>
    </div>
  )
}
