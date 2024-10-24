import Footer from "./components/Footer";
import "./globals.css";
import ClientComponent from "./components/ClientComponent";

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="kr">
      <body>
        <ClientComponent /> {/* 이 부분을 content-area 바깥으로 이동 */}
        <div className="grid-container">
          <div className="content-area">
            <div className="max-w-screen-xl min-h-screen">{children}</div>
          </div>
        </div>
        <Footer />
      </body>
    </html>
  );
}
