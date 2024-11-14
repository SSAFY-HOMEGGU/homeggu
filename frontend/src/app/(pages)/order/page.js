"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { BlueButton, WhiteButton } from "@/app/components/Button";
import Modal from "@/app/components/Modal";
import alertIcon from "/public/icons/alert.svg";
import toggleDownIcon from "/public/icons/toggledown.svg"; // 아이콘 import
import { useRouter } from "next/navigation"; // useRouter 추가
import { fetchUserProfile } from "@/app/api/userApi";
import usePurchaseStore from "@/app/store/usePurchaseStore";

const OrderPage = () => {
  const router = useRouter(); // 라우터 사용 설정
  const [getUserData, setUserData] = useState(null);
  const [orderInfo, setOrderInfo] = useState(null);
  const [isProductChecked, setIsProductChecked] = useState(true);
  const [showValidationMessage, setShowValidationMessage] = useState(false);
  const [validationMessage, setValidationMessage] = useState("");
  // const [orderInfo, setOrderInfo] = useState(UserData);
  const [agreements, setAgreements] = useState({
    all: false,
    terms: false,
    privacy: false,
    thirdParty: false,
    dataCollection: false,
    paymentService: false,
  });
  
  const { updateAddress, updateAddressDetail, updateOrderInfo } = usePurchaseStore();

  const [selectedMethod, setSelectedMethod] = useState("택배거래");
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState("결제수단1");
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState("");

  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  // 구매할 상품 정보 가져오기
  const selectedProduct = usePurchaseStore(state => state.selectedProduct);

  const product = selectedProduct ? {
    name: selectedProduct.title,
    price: selectedProduct.price,
    shipping: selectedProduct.deliveryPrice,
    image: selectedProduct.goodsImagePaths[0], 
    seller: {
      name: selectedProduct.userId.toString(), // userId를 문자열로 변환. 실제 판매자 이름이 필요하다면 API에서 가져와야 함
    },
  } : null;


  // 유저 정보 가져오기
  useEffect(() => {
    const getUserProfile = async () => {
      try {
        const response = await fetchUserProfile();
        setUserData(response);
        // 응답이 있을 때 orderInfo 설정
        setOrderInfo({
          name: response.user.username,
          phone: response.phoneNumber,
          address: response.address,
          detailAddress: response.addressDetail,
        });
      } catch (error) {
        console.error("유저 프로필 조회 실패:", error);
      }
    };

    getUserProfile();
  }, []);
  


  if (!getUserData || !orderInfo) {
    return <div>Loading...</div>;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOrderInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
    updateAddressDetail(value)
  };

  const handleAddressSearch = () => {
    if (window.daum && window.daum.Postcode) {
      new window.daum.Postcode({
        oncomplete: function (data) {
          setOrderInfo((prev) => ({
            ...prev,
            address: data.address,
          }));
          updateAddress(data.address);
        },
      }).open();
    } else {
      console.error("Daum Postcode API가 로드되지 않았습니다.");
    }
  };

  const handleMethodChange = (method) => {
    setSelectedMethod(method);
  };

  const handlePaymentMethodChange = (method) => {
    setSelectedPaymentMethod(method);
  };

  const handleAgreementChange = (field) => {
    if (field === "all") {
      const newState = !agreements.all;
      setAgreements({
        all: newState,
        terms: newState,
        privacy: newState,
        thirdParty: newState,
        dataCollection: newState,
        paymentService: newState,
      });
    } else {
      setAgreements((prev) => ({
        ...prev,
        [field]: !prev[field],
      }));
    }
  };

  const handlePurchase = () => {
    const allChecked =
      isProductChecked &&
      agreements.privacy &&
      agreements.thirdParty &&
      agreements.paymentService;

    if (!isProductChecked) {
      setValidationMessage("상품을 선택해 주세요.");
      setShowValidationMessage(true);
    } else if (
      !agreements.privacy ||
      !agreements.thirdParty ||
      !agreements.paymentService
    ) {
      setValidationMessage("결제진행 필수사항을 동의해주세요.");
      setShowValidationMessage(true);
    } else {
      setShowValidationMessage(false);
      router.push("/order/success"); // 주문 완료 페이지로 이동
    }
  };

  const openModal = (content) => {
    setModalContent(content);
    setShowModal(true);
  };

  const handleModalConfirm = () => {
    setAgreements((prev) => ({
      ...prev,
      [modalContent]: true,
    }));
    setShowModal(false);
  };

  const handleProductCheckboxChange = () => {
    setIsProductChecked(!isProductChecked);
  };

  const modalDescriptions = {
    privacy: `본 약관에 따라 수집된 개인정보는 안전하게 관리되며,
      서비스 이용을 위해 최소한의 정보만을 수집합니다. 수집된 정보는 사용자의 동의
      하에만 제3자에게 제공됩니다. 본 약관에 동의함으로써 사용자는 이러한 절차에
      대해 이해하고 수락하게 됩니다.`,
    thirdParty: `개인정보 제3자 제공 동의 내용에 따라 사용자의 개인 정보는 본 서비스
      제공 및 계약 이행을 위한 목적으로 필요한 경우에 한해 제3자에게 제공될 수 있습니다.
      제공된 정보는 상기 목적 외에는 사용되지 않으며, 본 동의 절차를 통해
      개인정보보호법을 준수합니다.`,
    paymentService: `결제대행 서비스 이용약관에 따라 결제 관련 정보는 결제 서비스
      제공 업체와의 계약 이행을 위해 제공됩니다. 이는 안전하고 신뢰할 수 있는
      결제 서비스를 보장하기 위한 조치입니다. 본 서비스 이용에 동의하지 않을 시
      결제 관련 서비스 이용에 제한이 있을 수 있습니다.`,
  };

  return (
    <div className="w-full space-y-8 flex flex-row justify-between my-6 gap-20 p-10">
      <div className="flex flex-col space-y-16 flex-1">
        <div className="space-y-2">
          <h2 className="text-2xl font-medium border-b border-gray-200 pb-2 text-normalText">
            주문 상품
          </h2>
          <div
            className="flex flex-col justify-between bg-gray-50 rounded-lg p-6 border border-greyButtonText"
            style={{
              height: "20rem",
              flexShrink: 0,
              borderRadius: "0.375rem",
              backgroundColor: "var(--ButtonText, #FFF)",
            }}
          >
            {/* 판매자 정보 (상단, 중앙 정렬) */}
            <div className="flex justify-center pb-">
              <span className="text-gray-500 text-sm">
                판매자 | {product.seller.name}
              </span>
            </div>

            {/* 상품 내용과 이미지 */}
            <div className="flex items-center space-x-6 mt-2">
              <input
                type="checkbox"
                checked={isProductChecked}
                onChange={handleProductCheckboxChange}
                className={`w-5 h-5 cursor-pointer ${
                  showValidationMessage && !isProductChecked
                    ? "border-red-500"
                    : ""
                }`}
              />

              <Image
                src="/images/bed2.png"
                alt={product.name || "기본 이미지"}
                width={120}
                height={120}
                className="rounded-lg"
              />

              <div className="flex-1 flex flex-col justify-between h-full">
                {/* 상품명 */}
                <h3
                  style={{
                    width: "9.32138rem",
                    height: "1.45413rem",
                    color: "var(--normalText, #2F3438)",
                    fontFamily: "'Noto Sans KR', sans-serif",
                    fontSize: "1.5625rem",
                    fontWeight: 400,
                  }}
                >
                  {product.name}
                </h3>

                {/* 가격 (오른쪽 정렬) */}
                <span
                  style={{
                    color: "var(--normalText, #2F3438)",
                    textAlign: "right",
                    fontFamily: "'Noto Sans KR', sans-serif",
                    fontSize: "clamp(1rem, 2vw, 2rem)",
                    fontWeight: 700,
                  }}
                >
                  {product.price.toLocaleString()}원
                </span>
              </div>
            </div>
            {/* 배송비 정보 (하단) */}
            <div className="mt-4 pt-4 border-t border-gray-200 text-gray-500 text-sm text-center">
              배송비 {product.shipping.toLocaleString()}원
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-medium border-b border-gray-200 pb-2 text-normalText">
            거래 방식
          </h2>
          <div className="flex space-x-4">
            <div
              className="flex items-center cursor-pointer"
              onClick={() => handleMethodChange("택배거래")}
            >
              <Image
                src={
                  selectedMethod === "택배거래"
                    ? "/icons/activeCheck.svg"
                    : "/icons/unactiveCheck.svg"
                }
                alt="택배거래 선택 아이콘"
                width={22}
                height={22}
                className="w-6 h-6 mr-2"
                style={{ width: "26px", height: "26px" }}
              />
              <span className="text-lg font-medium">택배거래</span>
            </div>
            <div
              className="flex items-center cursor-pointer"
              onClick={() => handleMethodChange("직거래")}
            >
              <Image
                src={
                  selectedMethod === "직거래"
                    ? "/icons/activeCheck.svg"
                    : "/icons/unactiveCheck.svg"
                }
                alt="직거래 선택 아이콘"
                width={22}
                height={22}
                className="w-6 h-6 mr-2"
                style={{ width: "26px", height: "26px" }}
              />
              <span className="text-lg font-medium">직거래</span>
            </div>
          </div>
        </div>

        {/* 주문자 정보 */}
        <div className="space-y-4">
          <h2 className="text-2xl font-medium border-b border-gray-200 pb-2 text-normalText">
            주문자 정보
          </h2>
          <div className="space-y-3">
            <div className="flex items-center">
              <label
                htmlFor="name"
                className="text-[1.25rem] font-medium min-w-[5rem] mr-4 text-normalText"
              >
                이름
              </label>
              <input
                type="text"
                name="name"
                value={orderInfo.name}
                onChange={handleInputChange}
                placeholder="주문자 이름"
                className="w-full h-[2.8rem] border border-subText rounded-md px-3 py-2 focus:outline-none text-subText"
              />
            </div>
            <div className="flex items-center">
              <label
                htmlFor="phone"
                className="text-[1.25rem] font-medium min-w-[5rem] mr-4 text-normalText"
              >
                연락처
              </label>
              <input
                id="phone"
                name="phone"
                value={orderInfo.phone}
                onChange={handleInputChange}
                placeholder="주문자 연락처"
                className="w-full h-[2.8rem] border border-subText rounded-md px-3 py-2 focus:outline-none text-subText"
              />
            </div>

            {/* 배송지와 상세 주소는 택배거래일 경우에만 표시 */}
            {selectedMethod === "택배거래" && (
              <>
                <div className="flex items-center">
                  <label
                    htmlFor="address"
                    className="text-[1.25rem] font-medium min-w-[5rem] mr-4 text-normalText"
                  >
                    배송지
                  </label>
                  <input
                    id="address"
                    name="address"
                    value={orderInfo.address}
                    onClick={handleAddressSearch}
                    placeholder="주문자 배송지"
                    className="w-full h-[2.8rem] border border-subText rounded-md px-3 py-2 focus:outline-none cursor-pointer text-subText"
                    readOnly
                  />
                </div>

                <div className="flex items-center">
                  <label
                    htmlFor="detailAddress"
                    className="text-[1.25rem] font-medium min-w-[5rem] mr-4 text-normalText"
                  >
                    상세 주소
                  </label>
                  <input
                    id="detailAddress"
                    name="detailAddress"
                    value={orderInfo.detailAddress}
                    onChange={handleInputChange}
                    placeholder="상세 주소"
                    className="w-full h-[2.8rem] border border-subText rounded-md px-3 py-2 focus:outline-none text-subText"
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 요소 2 */}
      <div className="flex flex-col space-y-8 w-full max-w-xs items-center">
        <div className="bg-gray-50 p-4 rounded-lg w-full">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>총 상품금액</span>
              <span>{product.price.toLocaleString()}원</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>총 배송비</span>
              <span>+{product.shipping.toLocaleString()}원</span>
            </div>
            <div className="flex justify-between font-bold mt-4">
              <span>결제금액</span>
              <span>
                {(product.price + product.shipping).toLocaleString()}원
              </span>
            </div>
          </div>

          {/* 약관 동의 */}
          <div className="mt-4 space-y-2">
            <div className="flex items-start space-x-2">
              <input
                type="checkbox"
                id="all"
                checked={agreements.all}
                onChange={() => handleAgreementChange("all")}
                className="w-4 h-4 cursor-pointer"
              />
              <label htmlFor="all" className="text-sm">
                아래 내용에 모두 동의합니다. (필수)
              </label>
            </div>

            {["privacy", "thirdParty", "paymentService"].map((key) => (
              <div key={key} className="flex items-start space-x-2">
                <input
                  type="checkbox"
                  id={key}
                  checked={agreements[key]}
                  onChange={() => handleAgreementChange(key)}
                  className={`w-4 h-4 cursor-pointer ${
                    showValidationMessage && !agreements[key]
                      ? "border border-red-500"
                      : ""
                  }`}
                />
                <label htmlFor={key} className="text-sm flex-grow text-subText">
                  {key === "privacy"
                    ? "개인정보 수집 및 이용 동의 (필수)"
                    : key === "thirdParty"
                    ? "개인정보 제3자 제공 동의 (필수)"
                    : "결제대행 서비스 동의 (필수)"}
                </label>
                <div className="ml-auto">
                  <Image
                    src={toggleDownIcon}
                    alt="Open Details"
                    width={20}
                    height={20}
                    onClick={() =>
                      openModal(key, {
                        confirmText: "동의하기",
                        cancelText: "동의하지 않기",
                      })
                    }
                    className="cursor-pointer"
                  />
                </div>
              </div>
            ))}

            {/* 경고 메시지 */}
            {showValidationMessage && (
              <div className="text-red-500 flex items-center mt-2">
                <Image
                  src={alertIcon}
                  alt="Alert Icon"
                  width={20}
                  height={20}
                />
                {validationMessage}
              </div>
            )}
          </div>
        </div>

        {/* 구매하기 버튼 */}
        <BlueButton
          className="w-full max-w-xs bg-blue-400 hover:bg-blue-500 text-white py-6"
          onClick={handlePurchase}
        >
          선택한 상품 구매하기
        </BlueButton>
      </div>

      {/* 모달 */}
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        title={
          modalContent === "privacy"
            ? "개인정보 수집 이용 약관"
            : modalContent === "thirdParty"
            ? "개인정보 제3자 제공 동의"
            : "결제대행 서비스 이용약관"
        }
        description={modalDescriptions[modalContent]}
        confirmText="동의하기"
        cancelText="동의하지 않기"
        onConfirm={handleModalConfirm}
      />
    </div>
  );
};

export default OrderPage;
