"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import addProfileImg from "/public/icons/addprofileimg.svg";
import infoIcon from "/public/icons/info.svg";
import AddressSearch from "../../../components/AddressSearch";
import { BlueButton } from "../../../components/Button";
import InputBox from "../../../components/InputBox"; // InputBox 컴포넌트 가져오기

// RegisterModal을 동적 import로 로드
const Register = dynamic(() => import("../../../components/RegisterModal"), {
  ssr: false,
});

export default function ProfilePage() {
  const [showAccountDelete, setShowAccountDelete] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null); // 업로드한 이미지 상태
  const accountBoxRef = useRef(null);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [selectedZipCode, setSelectedZipCode] = useState("");
  const [isScriptLoaded, setIsScriptLoaded] = useState(false); // 스크립트 로드 상태
  const [name, setName] = useState(""); // 이름 상태
  const [phoneNumber, setPhoneNumber] = useState(""); // 전화번호 상태
  const [detailAddress, setDetailAddress] = useState(""); // 상세주소 상태
  const [receiverName, setReceiverName] = useState(""); // 받는 사람 이름 상태
  const [receiverPhone, setReceiverPhone] = useState(""); // 받는 사람 전화번호 상태

  // 계좌 정보 초기값
  const [accountInfo, setAccountInfo] = useState({
    accountHolder: "홍길동",
    bankName: "국민은행",
    accountNumber: "123-4567-8901",
  });

  // 이미지 업로드 핸들러
  const handleImageUpload = useCallback((event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setUploadedImage(imageUrl); // 업로드한 이미지를 상태에 저장
    }
  }, []);

  // Daum 주소 검색 스크립트 로드
  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      setIsScriptLoaded(true); // 스크립트가 로드되면 상태 업데이트
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // 주소 검색 버튼 클릭 시 팝업 보이기
  const handleAddressSearch = () => {
    if (isScriptLoaded && window.daum && window.daum.Postcode) {
      new window.daum.Postcode({
        oncomplete: function (data) {
          let fullAddress = data.address;
          if (data.addressType === "R") {
            if (data.bname !== "") {
              fullAddress += " " + data.bname;
            }
            if (data.buildingName !== "") {
              fullAddress += " " + data.buildingName;
            }
          }
          setSelectedZipCode(data.zonecode); // 우편번호 설정
          setSelectedAddress(fullAddress); // 주소 설정
        },
      }).open();
    } else {
      console.error("주소 검색 스크립트가 아직 로드되지 않았습니다.");
    }
  };

  // 수정하기 버튼 클릭 핸들러
  const handleEdit = () => {
    // 수정하기 버튼을 눌렀을 때 실행할 로직 추가
    alert("수정하기 버튼이 클릭되었습니다.");
  };

  return (
    <div>
      {/* 내 정보 수정 타이틀 */}
      <h1 className="text-2xl font-bold">내 정보 수정</h1>
      <div className="flex mt-4 relative" style={{ width: "65rem" }}>
        <div
          style={{
            position: "absolute",
            bottom: "-0.35rem",
            width: "100%",
            height: "0.0625rem",
            background: "var(--GreyButtonText, #C2C8CB)",
          }}
        />
      </div>

      {/* 중앙 정렬된 컨테이너 */}
      <div
        style={{ width: "46.072rem", margin: "2rem auto", textAlign: "left" }}
      >
        {/* 프로필 이미지 수정 */}
        <div className="flex justify-center my-4">
          <label htmlFor="profile-upload" style={{ cursor: "pointer" }}>
            {uploadedImage ? (
              <img
                src={uploadedImage}
                alt="Profile Image"
                style={{ width: "137px", height: "137px", borderRadius: "50%" }}
              />
            ) : (
              <Image
                src={addProfileImg}
                alt="Profile Image"
                width={137}
                height={137}
              />
            )}
          </label>
          <input
            id="profile-upload"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            style={{ display: "none" }} // 파일 업로드 input 숨김
          />
        </div>

        {/* 회원 정보 */}
        <h2 className="mt-8 text-[#2F3438] font-normal text-[1.25rem]">
          회원 정보 수정
        </h2>
        <div className="flex flex-col space-y-4 mt-4">
          <InputBox
            type="text"
            placeholder="이름"
            value={name}
            onChange={(e) => setName(e.target.value)}
            width="w-[46.072rem]"
          />
          <InputBox
            type="text"
            placeholder="전화번호"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            width="w-[46.072rem]"
          />
        </div>

        {/* 기본 배송지 정보 */}
        <h2 className="mt-8 text-[#2F3438] font-normal text-[1.25rem]">
          기본 배송지 정보
        </h2>
        <div className="flex flex-col space-y-4 mt-4">
          {/* 우편번호 입력 필드 */}
          <input
            type="text"
            value={selectedZipCode} // 우편번호 상태값 적용
            placeholder="우편번호"
            style={{ width: "46.072rem", height: "2.8rem" }}
            className={`border border--greyButtonText rounded-md 
              px-3 py-2 focus:outline-none`}
            readOnly // 사용자가 직접 수정하지 않도록 readOnly 설정
            onClick={handleAddressSearch} // 우편번호 필드 클릭 시 팝업 열기
          />

          {/* 선택된 주소 출력 */}
          <input
            type="text"
            value={selectedAddress} // 주소가 선택되면 여기에 표시됨
            placeholder="주소"
            style={{
              width: "46.072rem",
              height: "2.8rem",
            }}
            className={`border border--greyButtonText rounded-md 
        px-3 py-2 focus:outline-none`}
            readOnly
          />
          <InputBox
            type="text"
            placeholder="상세주소"
            value={detailAddress}
            onChange={(e) => setDetailAddress(e.target.value)}
            width="w-[46.072rem]"
          />
          <InputBox
            type="text"
            placeholder="받는 사람 이름"
            value={receiverName}
            onChange={(e) => setReceiverName(e.target.value)}
            width="w-[46.072rem]"
          />
          <InputBox
            type="text"
            placeholder="받는 사람 전화번호"
            value={receiverPhone}
            onChange={(e) => setReceiverPhone(e.target.value)}
            width="w-[46.072rem]"
          />
        </div>

        {/* 계좌 관리 섹션 */}
        <h2 className="mt-8 text-[#2F3438] font-normal text-[1.25rem]">
          계좌 관리
        </h2>
        <div
          className="flex mt-4 relative"
          style={{
            width: "46rem",
            height: "9.45394rem",
            border: "1px solid var(--GreyButtonText, #C2C8CB)",
            borderRadius: "0.625rem",
          }}
          ref={accountBoxRef}
        >
          <div className="p-7 flex w-full">
            <div className="flex flex-col w-full">
              <div className="flex justify-between items-center">
                <span className="text-[#828C94] font-normal text-[1.0625rem]">
                  예금주:
                </span>
                <span className="text-[#2F3438] font-normal text-[1.0625rem]">
                  {accountInfo.accountHolder}
                </span>
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-[#828C94] font-normal text-[1.0625rem]">
                  은행명:
                </span>
                <span className="text-[#2F3438] font-normal text-[1.0625rem]">
                  {accountInfo.bankName}
                </span>
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-[#828C94] font-normal text-[1.0625rem]">
                  계좌번호:
                </span>
                <span className="text-[#2F3438] font-normal text-[1.0625rem]">
                  {accountInfo.accountNumber}
                </span>
              </div>
            </div>

            {/* 정보 아이콘 */}
            <Image
              src={infoIcon}
              alt="Info Icon"
              width={5}
              height={5}
              onClick={() => setShowAccountDelete(!showAccountDelete)}
              style={{
                cursor: "pointer",
                position: "absolute",
                top: "10px",
                right: "10px",
              }}
            />

            {/* 계좌 삭제 버튼 */}
            {showAccountDelete && (
              <div
                className="absolute top-10 right-[-12rem] w-[11rem] h-[2.5rem] flex justify-center items-center cursor-pointer"
                style={{
                  backgroundColor: "#FFF",
                  border: "1px solid #C2C8CB",
                  borderRadius: "0.625rem",
                }}
                onClick={() => {
                  setAccountInfo(null); // 계좌 정보 초기화
                  setShowAccountDelete(false); // 삭제 후 토글 숨기기
                }}
              >
                계좌 삭제
              </div>
            )}
          </div>
        </div>

        {/* 수정하기 버튼 */}
        <div className="flex justify-center mt-8">
          <BlueButton
            onClick={handleEdit}
            width="w-[18rem]"
            height="h-[3.5rem]"
          >
            수정하기
          </BlueButton>
        </div>

        {/* Register 모달 창 */}
        {showRegisterModal && (
          <Register onClose={() => setShowRegisterModal(false)} />
        )}
      </div>
    </div>
  );
}
