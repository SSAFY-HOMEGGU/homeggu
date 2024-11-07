
import SideMenu from "./components/SideMenu";

export default function MyPageLayout({ children }) {
  return (
    <div className="grid grid-cols-8 gap-4 ">
      {/* 사이드 메뉴 */}
      <aside className="col-start-1 col-span-1">
      {/* <aside className="content-area"> */}
        <SideMenu />
      </aside>

      {/* 메인 콘텐츠 */}
      <main className="col-start-2 col-span-7">
        {children}
      </main>
    </div>
  );
}
