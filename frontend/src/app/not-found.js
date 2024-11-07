export default function NotFound() {
  return (
    <div className="flex flex-col items-center  h-screen space-y-4">
      <h1 className="font-tmoney text-center text-[6.25rem] font-extrabold leading-tight text-[#35C5F0]">
        404
      </h1>
      <img src="/images/404.png" alt="description" className="w-2/5 mt-2" />
      <p className="w-[100%] h-[2.375rem] flex-shrink-0 text-center text-[#2F3438] text-[1.5rem] font-normal leading-normal mt-2">
        웁스! 아무것도 없네요
      </p>
      <button className="w-[21.1875rem] h-[3.75rem] flex-shrink-0 rounded-[1.25rem] bg-[#35C5F0] mt-2">
        <span className="font-tmoney flex items-center justify-center w-full h-full text-white text-center text-[1.5rem] font-extrabold leading-normal">
          홈으로 돌아가기
        </span>
      </button>
    </div>
  );
}
