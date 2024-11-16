import React, { useState } from 'react';
import { uploadGoodsImage } from '@/app/api/productApi';

const ModelReadyModal = ({ isOpen, onClose, objUrl, onUploadComplete }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  if (!isOpen) return null;

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const response = await fetch(objUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'model.obj';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('다운로드 실패:', error);
    }
    setIsDownloading(false);
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log('선택된 파일:', file);
      setSelectedFile(file);
      setUploadError(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadError('파일을 선택해주세요.');
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      console.log('업로드 시작:', selectedFile);
      const response = await uploadGoodsImage([selectedFile]);
      console.log('업로드 응답:', response);
      
      if (onUploadComplete) {
        try {
          await onUploadComplete(response);
          console.log('onUploadComplete 성공');
        } catch (callbackError) {
          console.error('onUploadComplete 에러:', callbackError);
          throw new Error('파일 처리 중 오류가 발생했습니다: ' + callbackError.message);
        }
      }
      
      console.log('업로드 완료, 모달 닫기');
      onClose();
    } catch (error) {
      console.error('업로드 프로세스 실패:', error);
      setUploadError(error.message || '파일 업로드에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
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