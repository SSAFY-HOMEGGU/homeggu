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
        <ClientComponent />
        <div className="grid-container">
          <div className="content-area">{children}</div>
        </div>
        <Footer />
      </body>
    </html>
  );
}
