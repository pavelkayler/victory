import { useContext, useEffect } from "react";

import { AdminContext, UserContext } from "../../core/context/Context.jsx";
import { Header } from "../components/header/Header.jsx";
import { AppFooter } from "../components/footer/AppFooter.jsx";

const UserLayout = ({ children }) => {
  const { logoutAdmin } = useContext(AdminContext);
  const { isAuth } = useContext(UserContext);

  useEffect(() => {
    logoutAdmin();
  }, [logoutAdmin]);

  if (!isAuth) {
    return (
      <div className="app-shell">
        <main className="app-content">{children}</main>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <Header />
      <main className="app-content">{children}</main>
      <AppFooter />
    </div>
  );
};

export { UserLayout };
