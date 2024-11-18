// 'use client';

// import React,{useState} from 'react'
// import { useRouter } from 'next/navigation';
// import Dropdown from '@/app/components/Dropdown'
// import useProductActionStore from '@/app/store/useProductActionStore';
// import useProductListStore from '@/app/store/useProductListStore';
// import Modal from '@/app/components/Modal';
// import alertIcon from "/public/icons/alert.svg"; //

// function SellerActions({ product, onDeleteSuccess, fetchProductDetail }) {
//   const router = useRouter();
//   const navigate = router.navigate;
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const deleteProduct = useProductActionStore(state => state.deleteProduct);
//   const updateStatus = useProductActionStore(state => state.updateStatus);
//   const updateSelectedProduct = useProductListStore(state => state.updateSelectedProduct); 
//   const productId = product.salesBoardId
//   const{setLoading } = useProductListStore()
//   const [isUpdating, setIsUpdating] = useState(false);
  
//   console.log(product)

//   const statusMapping  = {
//     'RESERVING': '예약 중',
//     'SOLD': '판매 완료',
//     'AVAILABLE': '판매 중'
//   };

//   // const statusMapping = {
//   //   'UNUSED': '미사용',
//   //   'LIKENEW': '거의 새것',
//   //   'USED': '상태 좋음',
//   //   'BROKEN': '사용감 있음',
//   // };

//   const dropdownOptions = [...Object.values(statusMapping), '삭제하기'];

//   // const currentStatus = statusMapping[product.isSell] || Object.values(statusMapping)[0];
//   const currentStatus = statusMapping[product.isSell] ;
//   console.log('currentStatus',currentStatus)

//   const reverseStatusMap = Object.entries(statusMapping).reduce((acc, [key, value]) => {
//     acc[value] = key;
//     return acc;
//   }, {});

//   const handleStatusChange = async (selectedOption) => {
//     if (selectedOption === '삭제하기') {
//       setShowDeleteModal(true);
//       return;
//     }
    
//     if (isUpdating) return;
    
//     const newStatus = reverseStatusMap[selectedOption];
//     if (newStatus && newStatus !== product.isSell) {
//       try {
//         // setLoading(true);
//         await updateStatus(product, newStatus);
        
        
//         // 상태 업데이트 후 데이터 재조회
//         const updatedProduct = await fetchProductDetail(productId);
//         // updateSelectedProduct({ isSell: newStatus });
//         updateSelectedProduct(updatedProduct);
        
//         // 옵션: 목록 페이지의 데이터도 업데이트
//         const productStore = useProductListStore.getState();
//         productStore.updateProduct(productId, { isSell: newStatus });

//       } catch (error) {
//         console.error('상태 업데이트 실패:', error);
//       } finally {
//         const setLoading = useProductListStore.getState().setLoading;
//         // setLoading(false);
//       }
//     }
//   };

//   // const handleStatusChange = async (selectedOption) => {
//   //   if (selectedOption === '삭제하기') {
//   //     setShowDeleteModal(true);
//   //     return;
//   //   }

//   //   if (isUpdating) return;
    
//   //   const newStatus = reverseStatusMap[selectedOption];
//   //   if (newStatus && newStatus !== product.isSell) {
//   //     try {
//   //       await updateStatus(product, newStatus);
//   //       // store 전체 초기화
//   //       useProductListStore.getState().resetProducts();
//   //       // 데이터 새로 불러오기
//   //       await useProductListStore.getState().fetchProducts();
//   //       // 현재 상품 상세 정보 새로 불러오기
//   //       await fetchProductDetail(productId);
//   //     } catch (error) {
//   //       console.error('상태 업데이트 실패:', error);
//   //     }
//   //   }
//   // };


  
//   const handleDelete = async () => {
//     try {
//       setShowDeleteModal(false);
//       await deleteProduct(product);
//       onDeleteSuccess();
//       // navigate(-1)
//       // setTimeout(() => {
//       //   window.history.back();
//       // }, 100);
//     } catch (error) {
//       console.error('상품 삭제 실패:', error);
//     }
//   };
//   // const handleDelete = async () => {
//   //   try {
//   //     setShowDeleteModal(false);
//   //     // store 전체 초기화 및 삭제 처리
//   //     const success = await deleteProduct(product);
//   //     if (success) {
//   //       // store 초기화
//   //       useProductListStore.getState().resetProducts();
//   //       // 데이터 새로 불러오기
//   //       await useProductListStore.getState().fetchProducts();
//   //       // 삭제 성공 후 콜백 실행
//   //       onDeleteSuccess();
//   //     }
//   //   } catch (error) {
//   //     console.error('상품 삭제 실패:', error);
//   //   }
//   // };
//   // const handleStatusChange = async (selectedOption) => {
//   //   if (selectedOption === '삭제하기') {
//   //     setShowDeleteModal(true);
//   //     return;
//   //   }

//   //   if (isUpdating) return;
    
//   //   const newStatus = reverseStatusMap[selectedOption];
//   //   if (newStatus && newStatus !== product.isSell) {
//   //     try {
//   //       setIsUpdating(true);
//   //       // API 호출
//   //       await updateStatus(product, newStatus);
        
//   //       // Store 초기화 및 새로고침
//   //       await resetProducts();
//   //       await fetchProducts();
        
//   //       // 현재 상품 상세 정보만 새로 불러오기
//   //       await fetchProductDetail(productId);
        
//   //       // 페이지 새로고침 (마지막 수단)
//   //       router.refresh();
//   //     } catch (error) {
//   //       console.error('상태 업데이트 실패:', error);
//   //     } finally {
//   //       setIsUpdating(false);
//   //     }
//   //   }
//   // };

//   // const handleDelete = async () => {
//   //   try {
//   //     setShowDeleteModal(false);
//   //     await deleteProduct(product);
      
//   //     // Store 초기화 및 새로고침
//   //     await resetProducts();
//   //     await fetchProducts();
      
//   //     // 페이지 이동 전 store 상태 확실히 업데이트
//   //     setTimeout(() => {
//   //       onDeleteSuccess();
//   //       navigate(-1); // or wherever you want to redirect
//   //     }, 100);
//   //   } catch (error) {
//   //     console.error('상품 삭제 실패:', error);
//   //   }
//   // };

//   return (
//     <div className="flex flex-row items-center">
//       <h1 className="mr-4">상태 변경</h1>
//       <Dropdown 
//         options={dropdownOptions}
//         onSelect={handleStatusChange}
//         selectedFont="text-point1"
//         defaultValue={currentStatus}
//       /> 


//       <Modal
//         show={showDeleteModal}
//         onClose={() => setShowDeleteModal(false)}
//         title="상품 삭제"
//         description="정말로 상품을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다."
//         icon={alertIcon}
//         onConfirm={handleDelete}
//         confirmText="삭제하기"
//         cancelText="취소"
//          width="40rem"
//         height="25rem"
//       />

//     </div>
//   );
// }

// export default SellerActions

'use client';

import React, { useState } from 'react'
import { useRouter } from 'next/navigation';
import Dropdown from '@/app/components/Dropdown'
import useProductStore from '@/app/store/useProductManageStore';
import Modal from '@/app/components/Modal';
import alertIcon from "/public/icons/alert.svg";

function SellerActions({ product, onDeleteSuccess }) {
  const router = useRouter();
  const navigate = router.navigate;
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  
  // 새로운 ProductStore에서 필요한 액션들을 가져옴
  const { 
    deleteProduct,
    updateProductStatus,    // updateStatus에서 이름 변경
    fetchProduct,          // fetchProductDetail에서 이름 변경
    updateSelectedProduct,
    loading,
    setLoading
  } = useProductStore();
  
  console.log(product)

  const statusMapping = {
    'AVAILABLE': '판매중',
    'RESERVING': '예약중',
    'SOLD': '판매완료'
  };

  const reverseStatusMap = {
    '판매중': 'AVAILABLE',
    '예약중': 'RESERVING',
    '판매완료': 'SOLD'
  };

  // 기존 상태 매핑 주석 유지
  // const statusMapping = {
  //   'UNUSED': '미사용',
  //   'LIKENEW': '거의 새것',
  //   'USED': '상태 좋음',
  //   'BROKEN': '사용감 있음',
  // };

  // 현재 상태값 가져오기
  const currentStatus = statusMapping[product.isSell] || '판매중';
  
  // select 옵션 배열
  const dropdownOptions = [...Object.values(statusMapping), '삭제하기'];

  const handleStatusChange = async (selectedOption) => {
    if (selectedOption === '삭제하기') {
      setShowDeleteModal(true);
      return;
    }

    const newStatus = reverseStatusMap[selectedOption];
    if (!newStatus || newStatus === product.isSell) return;
    
    console.log('상태 변경 시도:', {
      현재: product.isSell,
      선택: selectedOption,
      변경: newStatus
    });

    await updateProductStatus(product, newStatus);
  };

  // 기존 handleStatusChange 구현들 주석 유지
  // const handleStatusChange = async (selectedOption) => {
  //   if (selectedOption === '삭제하기') {
  //     setShowDeleteModal(true);
  //     return;
  //   }

  //   if (isUpdating) return;
    
  //   const newStatus = reverseStatusMap[selectedOption];
  //   if (newStatus && newStatus !== product.isSell) {
  //     try {
  //       await updateStatus(product, newStatus);
  //       // store 전체 초기화
  //       useProductListStore.getState().resetProducts();
  //       // 데이터 새로 불러오기
  //       await useProductListStore.getState().fetchProducts();
  //       // 현재 상품 상세 정보 새로 불러오기
  //       await fetchProductDetail(productId);
  //     } catch (error) {
  //       console.error('상태 업데이트 실패:', error);
  //     }
  //   }
  // };

  const handleDelete = async () => {
    if (!product?.salesBoardId) {
      console.error('salesBoardId가 없어 상품을 삭제할 수 없습니다:', product);
      return;
    }

    try {
      setShowDeleteModal(false);
      await deleteProduct(product);
      
      if (typeof onDeleteSuccess === 'function') {
        onDeleteSuccess();
      }
    } catch (error) {
      console.error('상품 삭제 실패:', error);
      // 여기에 사용자에게 에러 메시지를 보여줄 수 있습니다
    }
  };

  // 기존 handleDelete 구현들 주석 유지
  // const handleDelete = async () => {
  //   try {
  //     setShowDeleteModal(false);
  //     // store 전체 초기화 및 삭제 처리
  //     const success = await deleteProduct(product);
  //     if (success) {
  //       // store 초기화
  //       useProductListStore.getState().resetProducts();
  //       // 데이터 새로 불러오기
  //       await useProductListStore.getState().fetchProducts();
  //       // 삭제 성공 후 콜백 실행
  //       onDeleteSuccess();
  //     }
  //   } catch (error) {
  //     console.error('상품 삭제 실패:', error);
  //   }
  // };

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