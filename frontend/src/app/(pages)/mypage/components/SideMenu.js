import Link from "next/link";

export default function SideMenu() {
  return (
    <aside className="">
      {/* a버전: 마이 페이지 */}
      <h1 className="text-black font-noto text-[1.2rem] font-bold mb-4">
        마이 페이지
      </h1>

      <ul className="space-y-1">
        <li>
          <Link
            href="/mypage/pay"
            className="text-normalText font-noto text-[0.8rem] font-normal"
          >
            거래내역
          </Link>
        </li>
        <li>
          <Link
            href="/mypage/wishlist"
            className="text-normalText font-noto text-[0.8rem] font-normal"
          >
            찜한 상품
          </Link>
        </li>

        <li>
          <Link
            href="/mypage/profile"
            className="text-normalText font-noto text-[0.8rem] font-normal"
          >
            내 정보 수정
          </Link>
        </li>
        <li>
          <Link
            href="/mypage/withdrawal"
            className="text-normalText font-noto text-[0.8rem] font-normal"
          >
            탈퇴하기
          </Link>
        </li>
      </ul>
    </aside>
  );
}
