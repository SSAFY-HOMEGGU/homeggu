// 주의 사항
// 패딩, 테두리, 테두리 색, 테두리 둥글기 수정 불가
// placeholder, value, onChange, 너비, 높이 수정 가능
{/* 
  const [inputValue, setInputValue] = useState(''); 
  <InputBox
      type="text"
      placeholder="사용자 이름"
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
      width="w-[300px]"
    /> 
*/}

export default function InputBox({
  type = "text",
  placeholder = "입력하세요",
  value,
  onChange,
  width = "w-full",
  height = "h-[2.8rem]",
}) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}                
      onChange={onChange}
      className={`
        ${width} 
        ${height} 
        border border-greyButtonText rounded-md 
        px-3 py-2 focus:outline-none`}
    />
  );
}