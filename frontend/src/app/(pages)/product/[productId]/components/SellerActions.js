'use client';

import React,{useState} from 'react'
import { useRouter } from 'next/navigation';
import Dropdown from '@/app/components/Dropdown'
import useProductActionStore from '@/app/store/useProductActionStore';
import useProductListStore from '@/app/store/useProductListStore';
import Modal from '@/app/components/Modal';
import alertIcon from "/public/icons/alert.svg"; //

function SellerActions({ product, onDeleteSuccess, fetchProductDetail }) {
  const router = useRouter();
  const navigate = router.navigate;
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const deleteProduct = useProductActionStore(state => state.deleteProduct);
  const updateStatus = useProductActionStore(state => state.updateStatus);
  const updateSelectedProduct = useProductListStore(state => state.updateSelectedProduct); 
  const productId = product.salesBoardId
  const{setLoading } = useProductListStore()
  const [isUpdating, setIsUpdating] = useState(false);
  
  console.log(product)

  const statusMapping  = {
    'RESERVING': '예약 중',
    'SOLD': '판매 완료',
    'AVAILABLE': '판매 중'
  };

  // const statusMapping = {
  //   'UNUSED': '미사용',
  //   'LIKENEW': '거의 새것',
  //   'USED': '상태 좋음',
  //   'BROKEN': '사용감 있음',
  // };

  const dropdownOptions = [...Object.values(statusMapping), '삭제하기'];

  // const currentStatus = statusMapping[product.isSell] || Object.values(statusMapping)[0];
  const currentStatus = statusMapping[product.isSell] ;
  console.log('currentStatus',currentStatus)

  const reverseStatusMap = Object.entries(statusMapping).reduce((acc, [key, value]) => {
    acc[value] = key;
    return acc;
  }, {});

  const handleStatusChange = async (selectedOption) => {
    if (selectedOption === '삭제하기') {
      setShowDeleteModal(true);
      return;
    }
    
    if (isUpdating) return;
    
    const newStatus = reverseStatusMap[selectedOption];
    if (newStatus && newStatus !== product.isSell) {
      try {
        // setLoading(true);
        await updateStatus(product, newStatus);
        
        
        // 상태 업데이트 후 데이터 재조회
        const updatedProduct = await fetchProductDetail(productId);
        // updateSelectedProduct({ isSell: newStatus });
        updateSelectedProduct(updatedProduct);
        
        // 옵션: 목록 페이지의 데이터도 업데이트
        const productStore = useProductListStore.getState();
        productStore.updateProduct(productId, { isSell: newStatus });

      } catch (error) {
        console.error('상태 업데이트 실패:', error);
      } finally {
        const setLoading = useProductListStore.getState().setLoading;
        // setLoading(false);
      }
    }
  };

  
  const handleDelete = async () => {
    try {
      setShowDeleteModal(false);
      await deleteProduct(product);
      onDeleteSuccess();
      // navigate(-1)
      // setTimeout(() => {
      //   window.history.back();
      // }, 100);
    } catch (error) {
      console.error('상품 삭제 실패:', error);
    }
  };

  return (
    <div className="flex flex-row items-center">
      <h1 className="mr-4">상태 변경</h1>
      <Dropdown 
        options={dropdownOptions}
        onSelect={handleStatusChange}
        selectedFont="text-point1"
        defaultValue={currentStatus}
      /> 


      <Modal
        show={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="상품 삭제"
        description="정말로 상품을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다."
        icon={alertIcon}
        onConfirm={handleDelete}
        confirmText="삭제하기"
        cancelText="취소"
         width="40rem"
        height="25rem"
      />

    </div>
  );
}

export default SellerActions