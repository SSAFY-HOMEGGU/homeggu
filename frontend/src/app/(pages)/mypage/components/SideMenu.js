import Link from "next/link";

export default function SideMenu() {
  return (
    <aside className="">
      {/* a버전: 마이 페이지 */}
      <h1 className="text-black font-noto text-[1.3rem] font-bold mb-6">
        마이 페이지
      </h1>

      {/* b버전: 거래 정보 */}
      <h2 className="text-normalText font-noto text-[1.25rem] font-bold mb-3">
        거래 정보
      </h2>

      {/* c버전: 판매 내역 */}
      <ul className="space-y-1">
        <li>
          <Link
            href="/mypage"
            className="text-normalText font-noto text-[1rem] font-normal"
          >
            판매 내역
          </Link>
        </li>
        <li>
          <Link
            href="/mypage/purchase"
            className="text-normalText font-noto text-[1rem] font-normal"
          >
            구매 내역
          </Link>
        </li>
        <li>
          <Link
            href="/mypage/wishlist"
            className="text-normalText font-noto text-[1rem] font-normal"
          >
            찜한 상품
          </Link>
        </li>
      </ul>

      {/* 밑줄 */}
      <hr className="my-6 border-t border-gray-300 w-full" />

      {/* b버전: 내 정보 */}
      <h2 className="text-normalText font-noto text-[1.25rem] font-bold mb-3">
        내 정보
      </h2>

      {/* c버전: 내 정보 수정 / 탈퇴하기 */}
      <ul className="space-y-1">
        <li>
          <Link
            href="/mypage/profile"
            className="text-normalText font-noto text-[1rem] font-normal"
          >
            내 정보 수정
          </Link>
        </li>
        <li>
          <Link
            href="/mypage/withdrawal"
            className="text-normalText font-noto text-[1rem] font-normal"
          >
            탈퇴하기
          </Link>
        </li>
      </ul>
    </aside>
  );
}
