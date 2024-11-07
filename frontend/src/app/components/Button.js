// 주의사항
// 흰색, 파란색 2가지 버전 있음
// 1. 설정 안하면 기본값으로 들어감
// 2. 폰트, 두께, 패딩값은 수정 불가
// 3. 너비, 높이, 배경색, 텍스트 색, 버튼 글씨, 둥글기 수정 가능
// import {BlueButton, WhiteButton} from './components/Button';
// <BlueButton bgColor="bg-red-500"  width="w-[50rem]" height="h-[1rem]">Cancel</BlueButton>

// 파랑 버튼
export function BlueButton({ 
  children,
  onClick, 
  width = "w-[18rem]", 
  height = "h-[3.5rem]", 
  bgColor = "bg-point1", 
  textColor = "text-white", 
  text="text-[1.2rem]", 
  rounded="rounded-[1rem]"  // 둥글기
  }) {
  return (
    <button
      className={`
        ${width} 
        ${height} 
        ${bgColor} 
        ${textColor} 
        ${text} 
        ${rounded} 
        px-3 py-2 font-tmoney font-bold`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

// 흰버튼
export function WhiteButton({ 
  children,
  onClick, 
  width = "w-[18rem]", 
  height = "h-[3.5rem]",
  bgColor = "bg-white", 
  textColor = "text-point1", 
  border = "border-point1",
  text="text-[1.2rem]", 
  rounded="rounded-[1rem]" 
  }) {
  return (
    <button
      className={`
        ${width} 
        ${height} 
        ${bgColor} 
        ${textColor} 
        ${text} 
        ${rounded} 
        ${border} 
        border-2 border-solid px-3 py-2 font-tmoney font-bold`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}