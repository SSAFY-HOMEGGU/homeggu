'use client';

import React from 'react'
import Dropdown from '@/app/components/Dropdown'
import useProductActionStore from '@/app/store/useProductActionStore';
import useProductListStore from '@/app/store/useProductListStore';

function SellerActions({ product  }) {
  const updateStatus = useProductActionStore(state => state.updateStatus);
  const updateSelectedProduct = useProductListStore(state => state.updateSelectedProduct); 
  const productId = product.salesBoardId

  console.log(product)

  // const statusMapping  = {
  //   'RESERVING': '예약 중',
  //   'SOLD': '판매 완료',
  //   'AVAILABLE': '판매 중'
  // };

  const statusMapping = {
    'UNUSED': '미사용',
    'LIKENEW': '거의 새것',
    'USED': '상태 좋음',
    'BROKEN': '사용감 있음'
  };

  const currentStatus = statusMapping[product.status] || Object.values(statusMapping)[0];

  const reverseStatusMap = Object.entries(statusMapping).reduce((acc, [key, value]) => {
    acc[value] = key;
    return acc;
  }, {});

  // 드롭다운에 표시될 옵션들
  const statusOptions = Object.values(statusMapping);

  const handleStatusChange = async (selectedOption) => {
    const newStatus = reverseStatusMap[selectedOption];
    if (newStatus) {
      try {
        await updateStatus(product, newStatus);
        updateSelectedProduct({ status: newStatus });
        console.log('업데이트 성공')
        // 상태 업데이트 성공 후 product 객체도 업데이트
        product.status = newStatus;
      } catch (error) {
        console.error('상태 업데이트 실패:', error);
      }
    }
  };

  return (
    <div className="flex flex-row items-center">
      <h1 className="mr-4">상태 변경</h1>
      <Dropdown 
        options={Object.values(statusMapping)}
        onSelect={handleStatusChange}
        selectedFont="text-point1"
        defaultValue={currentStatus}
      /> 
    </div>
  );
}

export default SellerActions