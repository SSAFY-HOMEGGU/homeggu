import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-[100%] h-[100%] border-t border-solid border-subText bg-white flex justify-between items-start px-20 py-8">
      {/* 첫 번째 요소: 로고 및 텍스트 */}
      <div className="flex flex-col items-start">
        <Link href="/home">
          <Image
            src="/images/logo.png"
            alt="logo"
            width={100}
            height={50}
            sizes="(max-width: 100px) 100vw, 100px"
          />
        </Link>
        <p className="text-normalText font-tmoney text-[1rem] font-normal">
          당신을 위한 종합중고거래가구쇼핑플랫폼!
          <br />
          지금 바로 시작하세요.
        </p>
      </div>

      {/* 두 번째 요소: 사업자 정보 */}
      <div className="flex flex-col space-y-2">
        <p className="text-normalText font-noto font-bold text-[1rem]">
          (주)홈꾸 사업자 정보
        </p>
        <p className="text-subText font-noto font-normal text-[1rem]">
          대표이사: 장유진, 박선민
          <br />
          사업자번호: 498-27-01372
          <br />
          통신판매업 신고번호: 제2023-전주덕진-0007
          <br />
          주소: 전라북도 전주시 덕진구 두간6길
          <br />
          고객센터: 070-4509-1472
          <br />
          고객문의: lulurur@naver.com
        </p>
      </div>

      {/* 세 번째 요소: 정책 관련 링크 */}
      <div className="flex flex-col space-y-2">
        <Link
          href="/policies/privacy"
          className="text-normalText font-sans font-semibold text-[1rem]"
        >
          개인정보처리방침
        </Link>
        <Link
          href="/policies/terms"
          className="text-normalText font-sans text-[1rem]"
        >
          이용약관
        </Link>
        <Link
          href="/policies/operation"
          className="text-normalText font-sans text-[1rem]"
        >
          운영정책
        </Link>
        <Link
          href="/policies/youth-policy"
          className="text-normalText font-sans text-[1rem]"
        >
          청소년보호정책
        </Link>
        <Link
          href="/policies/notice"
          className="text-normalText font-sans text-[1rem]"
        >
          공지사항
        </Link>
      </div>

      {/* 네 번째 요소: SNS 아이콘 */}
      <div className="flex flex-col items-start space-y-4">
        <p className="text-normalText font-inter font-semibold text-[1rem]">
          Follow us
        </p>
        <div className="flex space-x-4">
          <a
            href="https://www.instagram.com/dings_vlog"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src="/icons/instagram.svg"
              alt="Instagram"
              width={30}
              height={30}
            />
          </a>
          <a
            href="https://www.ssafy.com/ksp/jsp/swp/swpMain.jsp"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src="/icons/facebook.svg"
              alt="Facebook"
              width={30}
              height={30}
            />
          </a>
          <a
            href="https://lab.ssafy.com/s11-final/S11P31B206"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src="/icons/gitlab.svg"
              alt="GitLab"
              width={30}
              height={30}
            />
          </a>
          <a
            href="https://ssafy.atlassian.net/jira/software/c/projects/S11P31B206/boards/7413/timeline"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image src="/icons/jira.svg" alt="Jira" width={30} height={30} />
          </a>
        </div>
      </div>
    </footer>
  );
}
