import { createContext, useMemo, useState } from "react";

const ADMIN_PASSWORD = "pass";

const AdminContext = createContext(null);

const AdminProvider = ({ children }) => {
  const [isAdminAuthed, setIsAdminAuthed] = useState(false);

  const authorize = (password) => {
    const isValid = password.trim() === ADMIN_PASSWORD;
    setIsAdminAuthed(isValid);
    return isValid;
  };

  const resetAdmin = () => setIsAdminAuthed(false);

  const value = useMemo(
    () => ({
      isAdminAuthed,
      authorize,
      resetAdmin,
    }),
    [isAdminAuthed],
  );

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
};

export { AdminContext, AdminProvider };
