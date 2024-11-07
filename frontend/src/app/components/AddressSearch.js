"use client";

import React, { useEffect } from "react";

export default function AddressSearch({ onAddressSelect }) {
  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleAddressSearch = () => {
    if (window.daum && window.daum.Postcode) {
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
          onAddressSelect(fullAddress);
        },
      }).open();
    } else {
      console.error("Postcode API를 불러오지 못했습니다.");
    }
  };

  return <div />; // 더 이상 팝업을 자동으로 열지 않음
}
