'use client'

import HomePage from '@/app/(pages)/home/page'
import { useState } from 'react';
import {BlueButton, WhiteButton} from './components/Button';
import { ActiveButton,UnactiveButton } from './components/OptionButton';
import InputBox from './components/InputBox';
import Dropdown from './components/Dropdown';
import Product from './components/Product';

export default function Home() {
  const [inputValue, setInputValue] = useState(''); 

  const products = [
    {
      id: 1,
      name: '상품 이름 1',
      price: '50,000원',
      date: '2024-10-01',
      imageUrl: '/images/bed2.png',
    },
    {
      id: 2,
      name: '상품 이름 2',
      price: '30,000원',
      date: '2024-10-02',
      imageUrl: '/images/bed3.png',
    },
    {
      id: 3,
      name: '상품 이름 1',
      price: '50,000원',
      date: '2024-10-01',
      imageUrl: '/images/bed2.png',
    },
    {
      id: 4,
      name: '상품 이름 2',
      price: '30,000원',
      date: '2024-10-02',
      imageUrl: '/images/bed3.png',
    },
  ];


  return <div>
    <HomePage />
    {/* <Button /> */}
    <BlueButton  width="w-[50rem]"  bgColor = "bg-red-500">Submit</BlueButton>
    <BlueButton>구매하기</BlueButton>
    <WhiteButton>ㅎㅎ</WhiteButton>
    <div className='my-4'>
      <ActiveButton>새상품</ActiveButton>
      <UnactiveButton>중고상품</UnactiveButton>  
    </div>
    {/* <InputBox /> */}
    <div className='my-4 w-full'>
    <InputBox
      type="text"
      placeholder="사용자 이름"
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
    />
    </div>

    <div className='my-4'>
      <Dropdown 
        options={["Option 1", "Option 2", "Option 3"]} 
        onSelect={(value) => console.log(value)} 
      />
    </div>

    <div className="grid grid-cols-4 gap-3">
      {products.map((product) => (
        <Product key={product.id} product={product} />
      ))}
    </div>
  </div>;
}
