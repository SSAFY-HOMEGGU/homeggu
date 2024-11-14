// ConversionStatus.js
import React from 'react';
// import useProductStore from '@/app/store/productStore';
import useProductStore from '@/app/store/useProductStore';

const ConversionStatus = () => {
  // store에서 conversionStatus state를 직접 가져옵니다
  const conversionStatus = useProductStore(state => state.conversionStatus);
  
  // null 체크 추가
  if (!conversionStatus || (!conversionStatus.isConverting && !conversionStatus.error)) return null;

  return (
    <div className="fixed bottom-4 left-4 text-sm bg-white rounded-lg shadow-lg p-2 z-50 max-w-[200px]">
      {conversionStatus.error ? (
        <p className="text-red-500">
          {conversionStatus.error}
        </p>
      ) : (
        <p className="text-gray-600">
          3D 모델 생성 중: {conversionStatus.progress}%
        </p>
      )}
    </div>
  );
};

export default ConversionStatus;