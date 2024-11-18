import React, { useState,useEffect } from 'react';
import Image from 'next/image';
import { uploadGoodsImage } from '@/app/api/productApi';
import useProductStore from '@/app/store/useProductStore';

export default function ImageUpload({ onUpload }) {
  const [uploadedImages, setUploadedImages] = useState(0);
  const [imagePreviews, setImagePreviews] = useState([]); 
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [imageFiles, setImageFiles] = useState([]);
  const [uploadedUrls, setUploadedUrls] = useState([]); // 추가: 실제 업로드된 URL 저장
  const [isUploading, setIsUploading] = useState(false);


  // Store에서 이미지 관련 상태와 액션 가져오기
  const setProductImages = useProductStore((state) => state.setProductImages);

  useEffect(() => {
    console.log('============ 현재 이미지 목록 ============');
    console.log('업로드된 이미지 URL 목록:', uploadedUrls);
    console.log('미리보기 이미지 목록:', imagePreviews);
    console.log('현재 이미지 총 개수:', uploadedImages);
    console.log('대표 이미지 인덱스:', mainImageIndex);
    console.log('========================================');
  }, [uploadedUrls, imagePreviews, uploadedImages, mainImageIndex]);


  const handleImageUpload = async (event) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setIsUploading(true);
      try {
        // 파일 개수 제한
        const newFiles = Array.from(files).slice(0, 10 - imagePreviews.length);
        
        // UI용 미리보기 URL 생성
        const newPreviews = newFiles.map(file => URL.createObjectURL(file));
        setImagePreviews(prev => [...prev, ...newPreviews]);
  
        // 실제 파일 업로드 - 원본 파일을 전송
        const uploadedData = await uploadGoodsImage(newFiles);
        const newUrls = Array.isArray(uploadedData) ? uploadedData : [];
  
        // base64 변환이 필요한 경우
        let base64 = null;
        if (newFiles[mainImageIndex]) {
          base64 = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(newFiles[mainImageIndex]);
          });
        }
        
        // 상태 업데이트
        setUploadedUrls(prev => {
          const updatedUrls = [...prev, ...newUrls];
          console.log('최종 이미지 URL 목록:', updatedUrls);
          
          // 부모 컴포넌트에 전달
          onUpload?.({
            goodsImagePaths: updatedUrls,
            mainImageUrl: base64 || updatedUrls[mainImageIndex]
          });
          
          return updatedUrls;
        });
  
        setUploadedImages(prev => prev + newFiles.length);
  
      } catch (error) {
        console.error('Image upload failed:', error);
      } finally {
        setIsUploading(false);
      }
    }
  };
  const removeImage = (indexToRemove) => {
    const updatedPreviews = imagePreviews.filter((_, index) => index !== indexToRemove);
    const updatedFiles = imageFiles.filter((_, index) => index !== indexToRemove);
    const updatedUrls = uploadedUrls.filter((_, index) => index !== indexToRemove); // 실제 업로드된 URL 배열 업데이트
  
    setImagePreviews(updatedPreviews);
    setImageFiles(updatedFiles);
    setUploadedUrls(updatedUrls); // 실제 URL 상태 업데이트
    setUploadedImages((prev) => prev - 1);
  
    // 대표 이미지 인덱스 조정
    if (indexToRemove === mainImageIndex) {
      setMainImageIndex(0);
    } else if (indexToRemove < mainImageIndex) {
      setMainImageIndex(mainImageIndex - 1);
    }
  
    // Store 업데이트 - 실제 URL 사용
    setProductImages({
      goodsImagePaths: updatedUrls, // 실제 업로드된 URL 배열 사용
      mainImageIndex: indexToRemove === mainImageIndex ? 0 : 
        indexToRemove < mainImageIndex ? mainImageIndex - 1 : mainImageIndex
    });
  };
  
  // const selectMainImage = (index) => {
  //   setMainImageIndex(index);
    
  //   // Store 업데이트 - 실제 URL 사용
  //   setProductImages({
  //     goodsImagePaths: uploadedUrls, // 실제 업로드된 URL 배열 사용
  //     mainImageIndex: index
  //   });
  // };
  // mainImage가 변경될 때도 base64 변환
const selectMainImage = async (index) => {
  setMainImageIndex(index);
  
  try {
    const response = await fetch(imagePreviews[index]);
    const blob = await response.blob();
    const base64 = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });

    setProductImages({
      goodsImagePaths: uploadedUrls,
      mainImageUrl: base64
    });
  } catch (error) {
    console.error('Failed to convert image to base64:', error);
  }
};

  return (
    <div>
      <div 
        className="w-[9.5rem] h-[9.5rem] flex flex-col items-center justify-center border rounded-[0.625rem] cursor-pointer mt-[1rem]"
        style={{ background: 'var(--GreyButton, #F6F8FA)' }}
        onClick={() => document.getElementById('imageInput').click()}
      >
        <div className="w-[3.125rem] h-[3.064rem] flex-shrink-0 mb-2">
          <Image
            src="/icons/camera.svg" 
            alt="Upload Icon"
            width={50} 
            height={49.023} 
          />
        </div>
        
        <p 
          className="text-[1.3125rem] font-medium"
          style={{ color: 'var(--GreyButtonText, #C2C8CB)', fontFamily: '"Noto Sans KR"' }}
        >
          {uploadedImages}/10
        </p>

        <input
          id="imageInput"
          type="file"
          accept="image/*"
          multiple
          style={{ display: 'none' }}
          onChange={handleImageUpload}
        />
      </div>

      <div className="flex flex-wrap gap-4 mt-4">
        {imagePreviews.map((src, index) => (
          <div 
            key={index} 
            className={`w-[9.5rem] h-[9.5rem] border rounded-[0.625rem] overflow-hidden relative flex items-center justify-center ${
              mainImageIndex === index ? 'ring-2 ring-point1' : ''
            }`}
          >
            <Image
              src="/icons/close.svg"
              alt="Close Icon"
              width={10}
              height={10}
              className="absolute top-2 right-2 cursor-pointer text-subText z-10"
              onClick={(e) => {
                e.stopPropagation();
                removeImage(index);
              }}
            />
            {mainImageIndex === index && (
              <div className="absolute top-2 left-2 bg-point1 text-white px-2 py-1 rounded-md text-xs z-10">
                대표
              </div>
            )}
            <div 
              className="w-full h-full cursor-pointer"
              onClick={() => selectMainImage(index)}
            >
              <Image
                src={src}
                alt={`Uploaded Preview ${index + 1}`}
                width={159}
                height={159}
                style={{ objectFit: 'cover' }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
  }