import { Header } from "../components/header/Header.jsx";

const AppLayout = ({ children }) => {
  return (
    <div className="app-shell">
      <Header />
      <main className="app-content">{children}</main>
    </div>
  );
};

export { AppLayout };
