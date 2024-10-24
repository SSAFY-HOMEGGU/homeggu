"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import addProfileImg from "/public/icons/addprofileimg.svg";
import infoIcon from "/public/icons/info.svg";

export default function ProfilePage() {
  const [showAccountDelete, setShowAccountDelete] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null); // 사용자가 업로드한 이미지 상태
  const accountBoxRef = useRef(null);

  // 계좌 삭제 기능
  const [accountInfo, setAccountInfo] = useState({
    accountHolder: "홍길동",
    bankName: "국민은행",
    accountNumber: "123-4567-8901",
  });

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setUploadedImage(imageUrl); // 업로드한 이미지를 상태에 저장
    }
  };

  // 토글 외부 클릭 시 토글 숨기기
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        accountBoxRef.current &&
        !accountBoxRef.current.contains(event.target)
      ) {
        setShowAccountDelete(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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

      {/* 중앙 정렬된 컨테이너 (너비는 인풋 너비에 맞춤) */}
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
        <h2
          className="mt-8"
          style={{
            color: "var(--normalText, #2F3438)",
            fontFamily: "'Noto Sans KR', sans-serif",
            fontSize: "1.25rem",
            fontWeight: "400",
            lineHeight: "normal",
          }}
        >
          회원 정보 수정
        </h2>
        {/* 인풋 컴포넌트 자리 두 개 */}
        <div className="flex flex-col space-y-4 mt-4">
          <input
            type="text"
            placeholder="이름"
            style={{
              width: "46.072rem",
              height: "2.375rem",
            }}
          />
          <input
            type="text"
            placeholder="전화번호"
            style={{
              width: "46.072rem",
              height: "2.375rem",
            }}
          />
        </div>

        {/* 기본 배송지 정보 */}
        <h2
          className="mt-8"
          style={{
            color: "var(--normalText, #2F3438)",
            fontFamily: "'Noto Sans KR', sans-serif",
            fontSize: "1.25rem",
            fontWeight: "400",
            lineHeight: "normal",
          }}
        >
          기본 배송지 정보
        </h2>

        {/* 인풋 컴포넌트 자리 5개 */}
        <div className="flex flex-col space-y-4 mt-4">
          <input
            type="text"
            placeholder="우편번호"
            style={{
              width: "46.072rem",
              height: "2.375rem",
            }}
          />
          <input
            type="text"
            placeholder="주소"
            style={{
              width: "46.072rem",
              height: "2.375rem",
            }}
          />
          <input
            type="text"
            placeholder="상세주소"
            style={{
              width: "46.072rem",
              height: "2.375rem",
            }}
          />
          <input
            type="text"
            placeholder="받는 사람 이름"
            style={{
              width: "46.072rem",
              height: "2.375rem",
            }}
          />
          <input
            type="text"
            placeholder="받는 사람 전화번호"
            style={{
              width: "46.072rem",
              height: "2.375rem",
            }}
          />
        </div>

        {/* 계좌관리 섹션 */}
        <h2
          className="mt-8"
          style={{
            color: "var(--normalText, #2F3438)",
            fontFamily: "'Noto Sans KR', sans-serif",
            fontSize: "1.25rem",
            fontWeight: "400",
            lineHeight: "normal",
          }}
        >
          계좌관리
        </h2>

        {/* 등록된 계좌 박스 */}
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
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "row", // 가로 방향 정렬
                  justifyContent: "space-between", // 양측 정렬
                  alignItems: "center", // 수직 가운데 정렬 (옵션, 필요 시)
                  width: "100%", // 전체 너비 사용
                }}
              >
                <span
                  style={{
                    color: "var(--subText, #828C94)",
                    fontFamily: "'Noto Sans KR', sans-serif",
                    fontSize: "1.0625rem",
                    fontWeight: "350",
                    textAlign: "left",
                    flexGrow: 1, // 좌측 항목 차지 영역
                  }}
                >
                  예금주:
                </span>
                <span
                  style={{
                    color: "var(--normalText, #2F3438)",
                    fontFamily: "'Noto Sans KR', sans-serif",
                    fontSize: "1.0625rem",
                    fontWeight: "350",
                    textAlign: "right",
                    flexGrow: 1, // 우측 항목 차지 영역
                  }}
                >
                  {accountInfo.accountHolder}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "0.5rem",
                  width: "100%", // 전체 너비 사용
                }}
              >
                <span
                  style={{
                    color: "var(--subText, #828C94)",
                    fontFamily: "'Noto Sans KR', sans-serif",
                    fontSize: "1.0625rem",
                    fontWeight: "350",
                    textAlign: "left",
                    flexGrow: 1, // 좌측 항목 차지 영역
                  }}
                >
                  은행명:
                </span>
                <span
                  style={{
                    color: "var(--normalText, #2F3438)",
                    fontFamily: "'Noto Sans KR', sans-serif",
                    fontSize: "1.0625rem",
                    fontWeight: "350",
                    textAlign: "right",
                    flexGrow: 1, // 우측 항목 차지 영역
                  }}
                >
                  {accountInfo.bankName}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "0.5rem",
                  width: "100%", // 전체 너비 사용
                }}
              >
                <span
                  style={{
                    color: "var(--subText, #828C94)",
                    fontFamily: "'Noto Sans KR', sans-serif",
                    fontSize: "1.0625rem",
                    fontWeight: "350",
                    textAlign: "left",
                    flexGrow: 1, // 좌측 항목 차지 영역
                  }}
                >
                  계좌번호:
                </span>
                <span
                  style={{
                    color: "var(--normalText, #2F3438)",
                    fontFamily: "'Noto Sans KR', sans-serif",
                    fontSize: "1.0625rem",
                    fontWeight: "350",
                    textAlign: "right",
                    flexGrow: 1, // 우측 항목 차지 영역
                  }}
                >
                  {accountInfo.accountNumber}
                </span>
              </div>
            </div>

            {/* 정보 아이콘 우측 상단 배치 */}
            <Image
              src={infoIcon}
              alt="Info Icon"
              width={5}
              height={5}
              onClick={() => setShowAccountDelete(!showAccountDelete)} // 클릭 시 계좌 삭제 표시 토글
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
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "10.97969rem",
                  height: "2.5rem",
                  position: "absolute",
                  top: "10px", // 박스 오른쪽 상단과 수평
                  right: "-12rem", // 박스 바깥에 위치하게 설정
                  backgroundColor: "var(--ButtonText, #FFF)",
                  border: "1px solid var(--GreyButtonText, #C2C8CB)",
                  borderRadius: "0.625rem",
                  cursor: "pointer",
                }}
                onClick={() => {
                  setAccountInfo(null); // 계좌 삭제 시 계좌 정보 초기화
                  setShowAccountDelete(false); // 삭제 후 토글 숨기기
                }}
              >
                계좌 삭제
              </div>
            )}
          </div>
        </div>

        {/* 계좌 등록 버튼 */}
        <button
          style={{
            width: "46rem",
            height: "2.875rem",
            flexShrink: 0,
            borderRadius: "0.625rem",
            border: "1px dashed var(--GreyButtonText, #C2C8CB)",
            background: "var(--GreyButton, #F6F8FA)",
            marginTop: "1rem",
          }}
        >
          <span
            style={{
              color: "var(--subText, #828C94)",
              textAlign: "center",
              fontFamily: "'Noto Sans KR', sans-serif",
              fontSize: "1.0625rem",
              fontWeight: "350",
              lineHeight: "normal",
            }}
          >
            + 계좌 등록
          </span>
        </button>
      </div>
    </div>
  );
}
