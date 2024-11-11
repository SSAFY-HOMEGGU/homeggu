// 주의사항
// 1. options,onSelect 넘겨줘야함
// 2. 너비 조정 가능
// 3. 선택된 옵션 색 변경 가능
{/* 
  <Dropdown 
    options={["Option 1", "Option 2", "Option 3"]} 
    onSelect={(value) => console.log(value)} 
  /> 
*/}

import { useState,useEffect } from 'react';
import { IoCaretDown } from "react-icons/io5";

export default function Dropdown({ options = [], onSelect, width = "w-[14rem]", selectedFont = "text-normalText", defaultValue = null}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  useEffect(() => {
    setSelectedOption(defaultValue || options[0]);
  }, [defaultValue, options]);


  const handleSelect = (option) => {
    setSelectedOption(option);
    setIsOpen(false);
    onSelect(option);
  };

  return (
    <div className="relative inline-block text-left ">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className={`${width} ${selectedFont} h-[2.8rem] px-4 py-2 border-[0.03rem] border-greyButtonText rounded-[0.5rem] flex items-center justify-between`}>
        {selectedOption || options[0]}
        <IoCaretDown className="text-[1.2rem] ml-2 text-greyButtonText" />
      </button>

      {isOpen && (
        <div className="absolute mt-2 w-full rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
          <ul className="py-1">
            {options.map((option, index) => (
              <li key={index} 
                  onClick={() => handleSelect(option)} 
                  className="px-4 py-2 text-subText cursor-pointer hover:bg-gray-100 text-left">
                {option}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
