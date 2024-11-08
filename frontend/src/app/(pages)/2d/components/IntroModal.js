'use client';
import { useState } from 'react';
import Image from 'next/image';

export default function IntroModal() {
  const [isOpen, setIsOpen] = useState(true);

  const handleRecovery = () => {
    initHistory('recovery');
    setIsOpen(false);
  };

  const handleNewPlan = (type) => {  // TypeScript의 optional parameter 제거
    initHistory(type);
    setIsOpen(false);
  };

  if (!isOpen) return null;

  // 이미지 플랜 데이터
  const planImages = [
    { src: '/img/newPlanEmpty.jpg', type: null, alt: 'Empty Plan' },  // undefined 대신 null 사용
    { src: '/img/newPlanSquare.jpg', type: 'newSquare', alt: 'Square Plan' },
    { src: '/img/newPlanL.jpg', type: 'newL', alt: 'L Plan' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg w-full max-w-4xl mx-4">
        <div className="border-b p-4">
          <h4 className="text-xl font-medium">
            Welcome Home Rough Editor v0.95
          </h4>
        </div>
        
        <div className="p-6">
          <div id="recover" className="mb-6">
            <p className="mb-4">A plan exists in historical, would you like recover him?</p>
            <button 
              onClick={handleRecovery}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded shadow transition-colors"
            >
              YES
            </button>
            <hr className="my-4" />
            <p>Or are you prefer start a new plan?</p>
          </div>

          <div className="flex flex-col md:flex-row justify-center gap-4 w-full">
            {planImages.map((plan) => (
              <div 
                key={plan.src}
                onClick={() => handleNewPlan(plan.type)}
                className="transition-all duration-200 border-[3px] border-transparent hover:border-[#0088dd] hover:rounded cursor-pointer"
              >
                <Image
                  src={plan.src}
                  alt={plan.alt}
                  width={300}
                  height={200}
                  className="w-full h-auto"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}