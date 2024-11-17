// import React, { useState } from 'react';
// import { uploadGoodsImage } from '@/app/api/productApi';
// import { toast } from 'react-toastify';

// const ModelReadyModal = ({ isOpen, onClose, objUrl, onUploadComplete }) => {
//   const [isDownloading, setIsDownloading] = useState(false);
//   const [isUploading, setIsUploading] = useState(false);
//   const [uploadError, setUploadError] = useState(null);
//   const [selectedFile, setSelectedFile] = useState(null);

//   if (!isOpen) return null;

//   const handleDownload = () => {
//     setIsDownloading(true);
//     try {
//       // 현재 창에서 바로 다운로드
//       window.location.href = objUrl;
//       toast.success('다운로드가 시작되었습니다.', {
//         position: 'bottom-left'
//       });
//     } catch (error) {
//       console.error('다운로드 실패:', error);
//       toast.error('다운로드에 실패했습니다.', {
//         position: 'bottom-left'
//       });
//     }
//     setIsDownloading(false);
//   };

//   const handleFileSelect = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       setSelectedFile(file);
//       setUploadError(null);
//     }
//   };

//   const handleUpload = async () => {
//     if (!selectedFile) {
//       setUploadError('파일을 선택해주세요.');
//       toast.error('파일을 선택해주세요.', {
//         position: 'bottom-left'
//       });
//       return;
//     }

//     setIsUploading(true);
//     setUploadError(null);

//     try {
//       const response = await uploadGoodsImage([selectedFile]);
      
//       if (onUploadComplete) {
//         await onUploadComplete(response);
//         // toast.success('파일이 성공적으로 업로드되었습니다.', {
//         //   position: 'bottom-left'
//         // });
//       }
      
//       onClose();
//     } catch (error) {
//       console.error('업로드 프로세스 실패:', error);
//       // const errorMessage = error.message || '파일 업로드에 실패했습니다. 다시 시도해주세요.';
//       // setUploadError(errorMessage);
//       // toast.error(errorMessage, {
//       //   position: 'bottom-left'
//       // });
//     } finally {
//       setIsUploading(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
//       <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-xl font-bold">3D 모델 다운로드</h2>
//           <button 
//             onClick={onClose}
//             className="text-gray-500 hover:text-gray-700"
//           >
//             ✕
//           </button>
//         </div>
        
//         <div className="space-y-4">
//           <p>3D 모델 변환이 완료되었습니다. 아래 버튼을 눌러 모델을 다운로드하세요.</p>
          
//           <button 
//             onClick={handleDownload}
//             disabled={isDownloading}
//             className="w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
//           >
//             {isDownloading ? '다운로드 중...' : '3D 모델 다운로드'}
//           </button>

//           <div className="text-center text-sm text-gray-500 my-4">
//             다운로드한 파일을 다시 업로드해주세요
//           </div>

//           <input
//             type="file"
//             accept=".obj"
//             onChange={handleFileSelect}
//             disabled={isUploading}
//             className="w-full p-2 border rounded"
//           />

//           {uploadError && (
//             <div className="text-red-500 text-sm mt-2">
//               {uploadError}
//             </div>
//           )}

//           <button 
//             onClick={handleUpload}
//             disabled={isUploading || !selectedFile}
//             className="w-full py-2 px-4 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-green-300 mt-4"
//           >
//             {isUploading ? '업로드 중...' : '파일 업로드'}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ModelReadyModal;

import React, { useState,useEffect } from 'react';
import { uploadGoodsImage, updateSalesBoard } from '@/app/api/productApi';
import { toast } from 'react-toastify';
import useProductStore from '@/app/store/useProductStore';

const ModelReadyModal = ({ isOpen, onClose, objUrl, productId }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  
  // Zustand store
  const { set3DImages, resetStore, salesBoardDTO, goodsImagePaths, threeDimensionsGoodsImagePaths, getFormData  } = useProductStore();

  useEffect(() => {
    console.log('getFormData ',getFormData() )
  })
  
  if (!isOpen) return null;

  const handleDownload = () => {
    setIsDownloading(true);
    try {
      window.location.href = objUrl;
      toast.success('다운로드가 시작되었습니다.', {
        position: 'bottom-left'
      });
    } catch (error) {
      console.error('다운로드 실패:', error);
      toast.error('다운로드에 실패했습니다.', {
        position: 'bottom-left'
      });
    }
    setIsDownloading(false);
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setUploadError(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadError('파일을 선택해주세요.');
      toast.error('파일을 선택해주세요.', {
        position: 'bottom-left'
      });
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      const uploadToastId = toast.loading('파일 업로드 중...', {
        closeOnClick: false,
        closeButton: false,
        draggable: false,
        position: 'bottom-left'
      });

      // 이미지 업로드
      const uploadResponse = await uploadGoodsImage([selectedFile]);
      
      // store에 3D 이미지 경로 업데이트
      set3DImages(uploadResponse);

      // 전체 상품 정보로 업데이트 요청
      const updateData = {
        salesBoardDTO,
        goodsImagePaths,
        threeDimensionsGoodsImagePaths: uploadResponse
      };

      // await updateSalesBoard(productId, updateData);
      await updateSalesBoard(50, updateData);

      toast.update(uploadToastId, {
        render: '상품 정보가 업데이트되었습니다.',
        type: 'success',
        autoClose: 3000,
        isLoading: false,
        position: 'bottom-left'
      });

      // 성공적으로 완료되면 store 초기화
      resetStore();
      onClose();
    } catch (error) {
      console.error('업로드 프로세스 실패:', error);
      setUploadError('파일 업로드에 실패했습니다. 다시 시도해주세요.');
      toast.error('업로드 실패', {
        position: 'bottom-left'
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">3D 모델 다운로드</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        
        <div className="space-y-4">
          <p>3D 모델 변환이 완료되었습니다. 아래 버튼을 눌러 모델을 다운로드하세요.</p>
          
          <button 
            onClick={handleDownload}
            disabled={isDownloading}
            className="w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
          >
            {isDownloading ? '다운로드 중...' : '3D 모델 다운로드'}
          </button>

          <div className="text-center text-sm text-gray-500 my-4">
            다운로드한 파일을 다시 업로드해주세요
          </div>

          <input
            type="file"
            accept=".obj"
            onChange={handleFileSelect}
            disabled={isUploading}
            className="w-full p-2 border rounded"
          />

          {uploadError && (
            <div className="text-red-500 text-sm mt-2">
              {uploadError}
            </div>
          )}

          <button 
            onClick={handleUpload}
            disabled={isUploading || !selectedFile}
            className="w-full py-2 px-4 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-green-300 mt-4"
          >
            {isUploading ? '업로드 중...' : '파일 업로드'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModelReadyModal;