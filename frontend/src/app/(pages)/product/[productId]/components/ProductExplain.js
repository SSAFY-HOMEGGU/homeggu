import React from 'react'
import Product from '@/app/components/Product';

export default function ProductExplain({product}) {
  const products = [
    {
      id: 1,
      name: "상품 이름 1",
      price: "50,000원",
      date: "2024-10-01",
      imageUrl: ["/images/bed2.png","/images/bed3.png"],
      seller: true
    },
    {
      id: 2,
      name: "상품 이름 2",
      price: "30,000원",
      date: "2024-10-02",
      imageUrl: ["/images/bed2.png","/images/bed3.png"],
      seller: true
    },
    {
      id: 3,
      name: "상품 이름 1",
      price: "50,000원",
      date: "2024-10-01",
      imageUrl: ["/images/bed2.png","/images/bed3.png"],
      seller: true
    },
    {
      id: 4,
      name: "상품 이름 2",
      price: "30,000원",
      date: "2024-10-02",
      imageUrl: ["/images/bed2.png","/images/bed3.png"],
      seller: true
    },
  ];

  return (
    <div>
      <h1 className='text-normalText font-semibold text-[1.25rem]'>상품 정보</h1>
      <div className='w-full h-[1px] bg-greyButtonText my-4'></div>
      {/* <p className='text-normalText text-[1rem] mb-4'>{selectedProduct.description}</p> */}
      <p className='text-normalText text-[1rem] mb-4'>
      사진에 보이는 2개 일괄입니다<br/>
      1개당 6칸입니다왼쪽1개는 <br/>
      아래2칸 열쇠없고오른쪽 1개는 <br/>
      아래 1칸 열쇠없습니다나머지는 열쇠 2개씩 다 있어요<br/>
      상태 좋습니다<br/>
      1개당 사이즈 가로세로높이 센치로90*50*180 반드시 2개 일괄로민 팝니다<br/>
      인천 고잔동이고트럭부터 실립니다<br/>
      가격은 32만원이고 네고절대불가해요<br/>
      배송비 추가하면 제차로 직접배송 가능합니다<br/>
      메롱메롱ㅋ메롱메롱메롱메롱<br/>
      </p>
      <div className='w-full h-[1px] bg-greyButtonText my-4'></div>

      <h1 className='text-normalText font-semibold text-[1.25rem] mb-[1rem]'>추천 상품</h1>
      <div className="grid grid-cols-4 gap-4 md:grid-cols-4 sm:grid-cols-2 grid-cols-1">
        {products.map((product) => (
          <Product key={product.id} product={product} seller={product.seller}/>
        ))}
      </div>
    </div>
  )
}
