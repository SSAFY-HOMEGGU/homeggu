// AreaSelect.js
import React, { useState, useEffect } from "react";
import { area } from "./Area";

const AreaSelect = ({ onChange }) => {
  const [selectedArea, setSelectedArea] = useState("");
  const [selectedSubArea, setSelectedSubArea] = useState("");

  const subAreas = area.find((area) => area.name === selectedArea)?.subArea || [];

  // 지역이 선택될 때마다 상위 컴포넌트에 알림
  const handleAreaChange = (e) => {
    const newArea = e.target.value;
    setSelectedArea(newArea);
    setSelectedSubArea(""); // 하위 지역 초기화
    onChange({ area: newArea, subArea: "" });
  };

  const handleSubAreaChange = (e) => {
    const newSubArea = e.target.value;
    setSelectedSubArea(newSubArea);
    onChange({ area: selectedArea, subArea: newSubArea });
  };

  return (
    <div className="mt-[1rem] mb-[0.5rem]">
      <select 
        value={selectedArea} 
        onChange={handleAreaChange} 
        className="text-center border-2 py-2 px-2 mx-1 rounded-md text-black"
      >
        <option value="">지역을 선택해주세요</option>
        {area.map((area) => (
          <option key={area.name} value={area.name}>
            {area.name}
          </option>
        ))}
      </select>

      {selectedArea && (
        <select 
          value={selectedSubArea} 
          onChange={handleSubAreaChange} 
          className="text-center border-2 py-2 px-2 mx-1 rounded-md text-black"
        >
          <option value="">시, 군, 구를 선택해주세요</option>
          {subAreas.map((subArea) => (
            <option key={subArea} value={subArea}>
              {subArea}
            </option>
          ))}
        </select>
      )}
    </div>
  );
};

export default AreaSelect;