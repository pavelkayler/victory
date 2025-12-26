import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { AdminContext, UserContext } from "../../core/context/Context.jsx";
import { ADMIN_PATH } from "../../core/constants/paths.js";

const AdminLayout = ({ children }) => {
  const { isAdminAuthed, logoutAdmin } = useContext(AdminContext);
  const { logout } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    logout();
  }, [logout]);

  useEffect(() => {
    if (!isAdminAuthed) {
      logoutAdmin();
      navigate(ADMIN_PATH, { replace: true });
    }
  }, [isAdminAuthed, logoutAdmin, navigate]);

  return (
    <div className="app-shell">
      <main className="app-content">{children}</main>
    </div>
  );
};

export { AdminLayout };
