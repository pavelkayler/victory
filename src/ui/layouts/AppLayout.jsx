import { Header } from "../components/header/Header.jsx";
import { Footer } from "../components/footer/Footer.jsx";

const AppLayout = ({ children }) => {
  return (
    <div className="app-shell">
      <Header />
      <main className="app-content">{children}</main>
      <Footer />
    </div>
  );
};

export { AppLayout };
