import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Lottie from "lottie-react";
import check from './check.json';
import { fetchUserProfile } from '@/app/api/userApi';

export default function JoinModal({ isOpen, onClose }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [userName, setUserName] = useState(null);
  const totalSteps = 6;

  useEffect(() => {
    // 모달이 열릴 때만 API 호출
    if (isOpen) {
      const fetchProfile = async () => {
        try {
          const data = await fetchUserProfile();
          setUserName(data.user.username);
          // userName이 필요한 경우 여기서 설정
          // setUserName(data.name);
        } catch (error) {
          console.error("프로필 로딩 실패:", error);
        }
      };

      fetchProfile();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const questions = [
    {
      image1: "/joinSurvey/wood1.jpg",
      image2: "/joinSurvey/black1.jpg",
      label1: "우드",
      label2: "블랙"
    },
    {
      image1: "/joinSurvey/white1.jpg",
      image2: "/joinSurvey/modern1.jpg",
      label1: "화이트",
      label2: "모던"
    },
    {
      image1: "/joinSurvey/wood2.jpg",
      image2: "/joinSurvey/white2.jpg",
      label1: "우드",
      label2: "화이트"
    },
    {
      image1: "/joinSurvey/black2.jpg",
      image2: "/joinSurvey/modern2.jpg",
      label1: "블랙",
      label2: "모던"
    },
    {
      image1: "/joinSurvey/modern3.jpg",
      image2: "/joinSurvey/wood3.jpg",
      label1: "모던",
      label2: "우드"
    },
    {
      image1: "/joinSurvey/white3.jpg",
      image2: "/joinSurvey/black3.jpg",
      label1: "화이트",
      label2: "블랙"
    },
  ];


  const handleCloseModal = () => {
    setShowSurvey(false);
  };

  const handleSelection = (answer) => {
    setSelectedAnswers([...selectedAnswers, answer]);
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const isLastStep = currentStep === totalSteps - 1;
  const isSurveyComplete = selectedAnswers.length === totalSteps;

  const handleClose = () => {
    if (isSurveyComplete) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      <div className="relative bg-white rounded-lg w-full max-w-[35rem] p-8 shadow-xl">
        {!isSurveyComplete ? (
          <>
            <h1 className="text-2xl font-bold text-center mb-3 font-tmoney">🥳홈꾸에 오신 것을 환영합니다🥳</h1>
            <p className="text-gray-600 text-center mb-8 text-base">
              취향에 맞는 가구를 추천해드리기 위해<br />
              몇 가지 질문에 답해주세요.
            </p>

            <div className="relative w-full bg-gray-200 rounded-full h-8 mb-8">
              <div
                className="bg-point1 h-full rounded-full transition-all  flex items-center justify-end pr-3"
                style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
              >
                <span className="text-white text-sm font-medium font-tmoney">
                  {currentStep + 1}/{totalSteps}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-10 justify-center items-center mx-auto">
              <div
                onClick={() => handleSelection('option1')}
                className="cursor-pointer border rounded-lg hover:border-blue-500 w-[15rem] h-[15rem]"
              >
                <div className="relative w-full h-full">
                  <Image
                    src={questions[currentStep].image1}
                    alt={questions[currentStep].label1}
                    fill
                    className="object-cover rounded-lg"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
                {/* <p className="text-center mt-2 font-medium">{questions[currentStep].label1}</p> */}
              </div>

              <div
                onClick={() => handleSelection('option2')}
                className="cursor-pointer border rounded-lg hover:border-point2 w-[15rem] h-[15rem]"
              >
                <div className="relative w-full h-full">
                  <Image
                    src={questions[currentStep].image2}
                    alt={questions[currentStep].label2}
                    fill
                    className="object-cover rounded-lg"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
                {/* <p className="text-center mt-2 font-medium">{questions[currentStep].label2}</p> */}
              </div>
            </div>

            <p className="text-center text-gray-600">
              {userName}님의 취향을 파악중입니다
            </p>
          </>
        ) : (
          <>
            <div className="text-center">
              <Lottie 
                animationData={check}
                loop={true}
                autoplay={true}
                className='w-[8rem] h-[8rem] mx-auto mb-6'
              />
              <h2 className="text-xl font-bold mb-4">설문에 응답해주셔서 감사합니다</h2>
              <p className="text-gray-600 mb-6">
                홈꾸가 취향에 맞는 가구를 추천해드릴게요
              </p>
              <button
                onClick={handleClose}
                className="bg-point1 text-white px-6 py-2 rounded-full hover:bg-point2"
              >
                시작하기
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}