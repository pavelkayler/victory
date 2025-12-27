import { useContext, useEffect } from "react";

import { AdminContext, UserContext } from "../../core/context/Context.jsx";

const AdminLayout = ({ children }) => {
  const { isAdminAuthed, logoutAdmin } = useContext(AdminContext);
  const { logout } = useContext(UserContext);

  useEffect(() => {
    logout();
  }, [logout]);

  useEffect(() => {
    if (!isAdminAuthed) {
      logoutAdmin();
    }
  }, [isAdminAuthed, logoutAdmin]);

  return (
    <div className="app-shell">
      <main className="app-content">{children}</main>
    </div>
  );
};

export { AdminLayout };
