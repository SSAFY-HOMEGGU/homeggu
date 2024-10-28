import SideMenu from "./components/SideMenu";

export default function MyPageLayout({ children }) {
  return (
    <div className="flex min-h-screen">
      {/* 사이드 메뉴 */}
      <aside className="flex-grow" style={{ flex: 1.5 }}>
        <SideMenu />
      </aside>

      {/* 메인 콘텐츠 */}
      <main className="flex-grow p-6" style={{ flex: 6.5 }}>
        {children}
      </main>
    </div>
  );
}
