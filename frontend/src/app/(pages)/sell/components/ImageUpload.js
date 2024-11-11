import React, { useState } from 'react';
import Image from 'next/image';

export default function ImageUpload({ onUpload }) {
  const [uploadedImages, setUploadedImages] = useState(0);
  const [imagePreviews, setImagePreviews] = useState([]); 
  const [mainImageIndex, setMainImageIndex] = useState(0); // 대표 이미지 인덱스
  const [imageFiles, setImageFiles] = useState([]);

  const handleImageUpload = (event) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const newFiles = Array.from(files).slice(0, 10 - imagePreviews.length);
      const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
      
      setImagePreviews((prev) => [...prev, ...newPreviews]); 
      setUploadedImages((prev) => prev + newFiles.length); 
      setImageFiles((prev) => [...prev, ...newFiles]);
  
      // formData 형식에 맞게 데이터 구성
      const imageData = {
        goodsImagePaths: [...imagePreviews, ...newPreviews].map((preview, index) => 
          `https://example.com/image${index + 1}.png`
        ),
        threeDimensionsGoodsImagePaths: [
          `https://example.com/3dimage${mainImageIndex + 1}.png`
        ]
      };
  
      console.log('이미지 업로드:', imageData);
      onUpload(imageData); // imageData 객체 전체를 전달
    }
  };

  const removeImage = (indexToRemove) => {
    const updatedPreviews = imagePreviews.filter((_, index) => index !== indexToRemove);
    const updatedFiles = imageFiles.filter((_, index) => index !== indexToRemove);
  
    setImagePreviews(updatedPreviews);
    setImageFiles(updatedFiles);
    setUploadedImages((prev) => prev - 1);
    
    if (indexToRemove === mainImageIndex) {
      setMainImageIndex(0);
    } else if (indexToRemove < mainImageIndex) {
      setMainImageIndex(mainImageIndex - 1);
    }
  
    const imageData = {
      goodsImagePaths: updatedPreviews.map((_, index) => 
        `https://example.com/image${index + 1}.png`
      ),
      threeDimensionsGoodsImagePaths: [
        `https://example.com/3dimage${mainImageIndex === indexToRemove ? 1 : mainImageIndex + 1}.png`
      ]
    };
  
    console.log('이미지 삭제:', imageData);
    onUpload(imageData); // imageData 객체 전체를 전달
  };
  

  const selectMainImage = (index) => {
    setMainImageIndex(index);
  
    const imageData = {
      goodsImagePaths: imagePreviews.map((_, i) => 
        `https://example.com/image${i + 1}.png`
      ),
      threeDimensionsGoodsImagePaths: [
        `https://example.com/3dimage${index + 1}.png`
      ]
    };
  
    console.log('메인 이미지 변경:', imageData);
    onUpload(imageData); // imageData 객체 전체를 전달
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

      {/* 업로드된 이미지 미리보기 표시 */}
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
            {/* 대표 이미지 뱃지 */}
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