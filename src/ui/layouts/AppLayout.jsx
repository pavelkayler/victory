import { useContext, useEffect } from "react";
import { useLocation } from "react-router-dom";

import { Header } from "../components/header/Header.jsx";
import { Footer } from "../components/footer/Footer.jsx";
import { AdminContext, UserContext } from "../../core/context/Context.jsx";
import { ADMIN_PATH } from "../../core/constants/paths.js";

const SessionEffects = () => {
  const location = useLocation();
  const { logout } = useContext(UserContext);
  const { logoutAdmin, isAdminAuthed } = useContext(AdminContext);

  useEffect(() => {
    const isAdminPath = location.pathname.startsWith(ADMIN_PATH);
    if (isAdminPath) {
      logout();
      return;
    }

    if (isAdminAuthed) {
      logoutAdmin();
    }
  }, [isAdminAuthed, location.pathname, logout, logoutAdmin]);

  return null;
};

const AppLayout = ({ children }) => {
  return (
    <div className="app-shell">
      <SessionEffects />
      <Header />
      <main className="app-content">{children}</main>
      <Footer />
    </div>
  );
};

export { AppLayout };
