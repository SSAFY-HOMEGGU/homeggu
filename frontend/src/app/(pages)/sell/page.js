'use client';

import React, { useState } from 'react';
import Image from 'next/image';

export default function Sell() {
  const [uploadedImages, setUploadedImages] = useState(0);
  const [imagePreviews, setImagePreviews] = useState([]); 

  const handleImageUpload = (event) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const newFiles = Array.from(files).slice(0, 10 - imagePreviews.length);
      const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
      
      setImagePreviews((prev) => [...prev, ...newPreviews]); 
      setUploadedImages((prev) => prev + newFiles.length); 
    }
  };

  const removeImage = (indexToRemove) => {
    setImagePreviews((prev) => prev.filter((_, index) => index !== indexToRemove));
    setUploadedImages((prev) => prev - 1);
  };

  return (
    <div>
      <h1>판매하기</h1>
      <div 
        className="w-[9.9375rem] h-[9.9375rem] flex flex-col items-center justify-center flex-shrink-0 border rounded-[0.625rem] cursor-pointer"
        style={{ background: 'var(--GreyButton, #F6F8FA)' }}
        onClick={() => document.getElementById('imageInput').click()} // 클릭 시 파일 입력창 열기
      >
        <div className="w-[3.125rem] h-[3.064rem] flex-shrink-0 mb-2">
          <Image
            src="/icons/camera.svg" 
            alt="Upload Icon"
            width={50} 
            height={49.023} 
          />
        </div>
        
        {/* 이미지 업로드 상태 표시 */}
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
          <div key={index} className="w-[9.9375rem] h-[9.9375rem] border rounded-[0.625rem] overflow-hidden relative flex items-center justify-center">
            <Image
              src="/icons/close.svg"
              alt="Close Icon"
              width={10}
              height={10}
              className="absolute top-2 right-2 cursor-pointer text-subText"
              onClick={() => removeImage(index)}
            />
            <Image
              src={src}
              alt={`Uploaded Preview ${index + 1}`}
              width={159}
              height={159}
              style={{ objectFit: 'cover' }}
            />
          </div>
        ))}
      </div>

      <h1>상품명</h1>
      <h1>카테고리</h1>
      <h1>상품상태</h1>
      <h1>판매가격</h1>
      <h1>상품 크기</h1>
      <h1>상품 설명</h1>
      <h1>거래 방법</h1>
    </div>
  );
}
