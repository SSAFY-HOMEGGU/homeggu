// 주의사항
// 활성, 비활성 2가지 버전 있음
// 1. 설정 안하면 기본값으로 들어감
// 2. 폰트, 폰트 두께, 패딩값은 수정 불가
// 3. 너비, 높이, 배경색, 텍스트 색, 버튼 글씨, 둥글기 수정 가능
// import {ActiveButton, UnactiveButton} from './components/Button';
// <ActiveButton bgColor="bg-red-500"  width="w-[50rem]" height="h-[1rem]">Cancel</ActiveButton>

// 활성화 버튼
export function ActiveButton({ 
  children,
  onClick, 
  width = "w-[8.6rem]", 
  height = "h-[3rem]", 
  bgColor = "bg-point1", 
  textColor = "text-white", 
  text="text-[1.2rem]", 
  rounded="rounded-[4rem]"  // 둥글기
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
        px-3 py-2`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

// 흰버튼
export function UnactiveButton({ 
  children,
  onClick, 
  width = "w-[8.6rem]", 
  height = "h-[3rem]", 
  bgColor = "bg-white", 
  textColor = "text-greyButtonText", 
  border = "border-subText",
  text="text-[1.2rem]", 
  rounded="rounded-[4rem]" 
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
        border-[0.03rem] border-solid px-3 py-2`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}