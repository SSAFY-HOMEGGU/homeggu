"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import addProfileImg from "/public/icons/addprofileimg.svg";
import { BlueButton } from "../../../components/Button";
import InputBox from "../../../components/InputBox";
import {
  fetchUserProfile,
  uploadProfileImage,
  updateUserProfile,
  checkNickname,
} from "@/app/api/userApi";
import useUserStore from "@/app/store/userStore";

export default function ProfilePage() {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [selectedZipCode, setSelectedZipCode] = useState("");
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [detailAddress, setDetailAddress] = useState("");
  const [addressNickname, setAddressNickname] = useState("우리집");
  const [nickname, setNickname] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [receiverName, setReceiverName] = useState("");
  const [receiverPhone, setReceiverPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [receiverPhoneError, setReceiverPhoneError] = useState("");
  const [isNicknameAvailable, setIsNicknameAvailable] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [originalNickname, setOriginalNickname] = useState(""); // 초기 닉네임 저장용
  const { updateUser } = useUserStore();

  const handleImageUpload = useCallback(async (event) => {
    const file = event.target.files[0];
    if (file) {
      setProfileImageFile(file);
      const imageUrl = URL.createObjectURL(file);
      setUploadedImage(imageUrl); // 미리보기용

      try {
        const response = await uploadProfileImage(file);
        console.log("업로드 성공 응답:", response);

        // 서버에서 받은 이미지 경로로 업데이트
        if (response.userImagePath) {
          setUploadedImage(response.userImagePath);
        }
      } catch (error) {
        console.error("이미지 업로드 실패:", error);
        // 원래 이미지로 복구
        setUploadedImage(null);
        alert(error.response?.data?.message || "이미지 업로드에 실패했습니다.");
      }
    }
  }, []);

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const profileData = await fetchUserProfile();
        console.log("프로필 데이터:", profileData); // 데이터 확인용
        setNickname(profileData.nickname || "");
        setOriginalNickname(profileData.nickname || "");
        setPhoneNumber(profileData.phoneNumber || "");
        setSelectedAddress(profileData.address || "");
        setDetailAddress(profileData.addressDetail || "");
        setAddressNickname(profileData.addressNickname || "우리집");

        // 프로필 이미지 설정
        if (profileData.userImagePath) {
          setUploadedImage(profileData.userImagePath);
        }
      } catch (error) {
        console.error("프로필 조회 실패:", error);
      }
    };

    loadUserProfile();
  }, []);

  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => setIsScriptLoaded(true);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const formatPhoneNumber = (value) => {
    value = value.replace(/\D/g, "");
    if (value.length > 3 && value.length <= 7) {
      return `${value.slice(0, 3)}-${value.slice(3)}`;
    } else if (value.length > 7) {
      return `${value.slice(0, 3)}-${value.slice(3, 7)}-${value.slice(7, 11)}`;
    }
    return value;
  };

  const handlePhoneNumberChange = (e) => {
    const value = e.target.value;
    if (/[^0-9-]/.test(value)) {
      setPhoneError("숫자만 입력할 수 있습니다.");
    } else {
      setPhoneError("");
    }
    setPhoneNumber(formatPhoneNumber(value));
  };

  const handleNicknameCheck = async () => {
    if (!nickname.trim()) {
      alert("닉네임을 입력해주세요.");
      return;
    }

    if (nickname === originalNickname) {
      setIsNicknameAvailable(true);
      alert("현재 사용중인 닉네임입니다.");
      return;
    }

    try {
      const { available, message } = await checkNickname(nickname);
      setIsNicknameAvailable(available);
      alert(message);
    } catch (error) {
      console.error("닉네임 중복 확인 실패:", error);
      setIsNicknameAvailable(false);
      alert(
        error.response?.data?.message || "닉네임 중복 확인에 실패했습니다."
      );
    }
  };

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
          setSelectedZipCode(data.zonecode);
          setSelectedAddress(fullAddress);
        },
      }).open();
    } else {
      console.error("주소 검색 스크립트가 아직 로드되지 않았습니다.");
    }
  };

  const handleEdit = async () => {
    if (nickname !== originalNickname && !isNicknameAvailable) {
      alert("닉네임 중복 확인을 해주세요.");
      return;
    }

    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const profileData = {
        nickname,
        address: selectedAddress,
        addressDetail: detailAddress,
        addressNickname,
        phoneNumber: phoneNumber ? phoneNumber.replace(/-/g, "") : null,
        userImagePath: uploadedImage,
      };

      const response = await updateUserProfile(profileData);
      if (response.message === "수정 완료") {
        setOriginalNickname(nickname);
        alert("프로필이 성공적으로 수정되었습니다.");
      }
    } catch (error) {
      console.error("프로필 수정 실패:", error);
      alert(error.response?.data?.message || "프로필 수정에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold">내 정보 수정</h1>
      <div className="flex mt-4 relative w-full">
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

      <div
        style={{ width: "46.072rem", margin: "2rem auto", textAlign: "left" }}
      >
        <div className="flex justify-center my-4">
          <label htmlFor="profile-upload" style={{ cursor: "pointer" }}>
            {uploadedImage ? (
              <Image
                src={uploadedImage || "/icons/addprofileimg.svg"} // 기본 이미지 경로 수정
                alt="Profile Image"
                width={120}
                height={120}
                style={{
                  width: "137px",
                  height: "137px",
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
            ) : (
              <Image
                src={addProfileImg}
                alt="Default Profile Image"
                width={120}
                height={120}
              />
            )}
          </label>

          <input
            id="profile-upload"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            style={{ display: "none" }}
          />
        </div>

        <h2 className="mt-8 ml-[18%] text-[#2F3438] font-normal text-[1.25rem]">
          회원 정보 수정
        </h2>
        <div className="flex flex-col items-center space-y-4 mt-4">
          <div className="flex items-center space-x-2">
            <InputBox
              type="text"
              placeholder="닉네임"
              value={nickname}
              onChange={(e) => {
                setNickname(e.target.value);
                if (e.target.value !== originalNickname) {
                  setIsNicknameAvailable(false);
                }
              }}
              width="w-[24rem]"
              height="h-[2.2rem]"
            />
            <button
              onClick={handleNicknameCheck}
              className="bg-blue-500 text-white px-3 py-1.5 rounded-md hover:bg-blue-600 transition-colors"
            >
              중복 확인
            </button>
          </div>
          <InputBox
            type="text"
            placeholder="전화번호"
            value={phoneNumber}
            onChange={handlePhoneNumberChange}
            width="w-[30rem]"
            height="h-[2.2rem]"
          />
          {phoneError && <p className="text-red-500 text-sm">{phoneError}</p>}
        </div>

        <h2 className="mt-8 ml-[18%] text-[#2F3438] font-normal text-[1.25rem]">
          기본 배송지 정보
        </h2>
        <div className="flex flex-col items-center space-y-4 mt-4">
          <InputBox
            type="text"
            placeholder="배송지 별명 (예: 우리집)"
            value={addressNickname}
            onChange={(e) => setAddressNickname(e.target.value)}
            width="w-[30rem]"
            height="h-[2.2rem]"
          />

          <input
            type="text"
            value={selectedAddress}
            placeholder="주소"
            style={{ width: "30rem", height: "2.2rem" }}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none"
            readOnly
            onClick={handleAddressSearch}
          />
          <InputBox
            type="text"
            placeholder="상세주소"
            value={detailAddress}
            onChange={(e) => setDetailAddress(e.target.value)}
            width="w-[30rem]"
            height="h-[2.2rem]"
          />

          {receiverPhoneError && (
            <p className="text-red-500 text-sm">{receiverPhoneError}</p>
          )}
        </div>

        <div className="flex justify-center mt-8">
          <BlueButton
            onClick={handleEdit}
            width="w-[18rem]"
            height="h-[3.5rem]"
            disabled={isSubmitting}
          >
            {isSubmitting ? "수정 중..." : "수정하기"}
          </BlueButton>
        </div>
      </div>
    </div>
  );
}
