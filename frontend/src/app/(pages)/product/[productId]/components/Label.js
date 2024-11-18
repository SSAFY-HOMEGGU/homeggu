'use client'

const Label = ({ type, value }) => {
  const labelStyles = {
    category: 'bg-[#FFF9C4] text-[#7E6E00]',
    status: 'bg-[#E3F2FD] text-[#0D47A1]',
    mood: 'bg-[#F3E5F5] text-[#4A148C]',
    tradeMethod: 'bg-[#E8F5E9] text-[#1B5E20]',
    isSell: 'bg-[#FFEBEE] text-[#B71C1C]'
  };

  return (
    <span className={`
      inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
      ${labelStyles[type]}
      shadow-sm
      transition-all duration-200 ease-in-out
    `}>
      {value}
    </span>
  );
};

export default Label;