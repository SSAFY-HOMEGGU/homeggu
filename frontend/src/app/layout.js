import Footer from "./components/Footer";
import "./globals.css";
import ClientComponent from "./components/ClientComponent";
import { ToastContainer } from "react-toastify"; // ToastContainer import 추가
import "react-toastify/dist/ReactToastify.css";

export const metadata = {
  title: "홈꾸",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="kr">
      <body>
        <ClientComponent />
        <div className="grid-container">
          <div className="content-area">{children}</div>
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </div>
        <Footer />
      </body>
    </html>
  );
}
