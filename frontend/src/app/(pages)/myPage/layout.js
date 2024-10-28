// src/app/mypage/layout.js
import SideMenu from "./components/SideMenu";

export default function MyPageLayout({ children }) {
  return (
    <div className="grid grid-cols-16 min-h-screen">
      <aside className="col-start-3 col-span-2">
        <SideMenu />
      </aside>

      <main className="col-start-6 col-span-15 p-6">{children}</main>
    </div>
  );
}
