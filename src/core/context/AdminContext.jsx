import { createContext, useMemo, useState } from "react";

const ADMIN_PASSWORD = "pass";
const ADMIN_AUTH_KEY = "quiz-admin-auth";

const AdminContext = createContext(null);

const readInitialAuth = () => {
  if (typeof sessionStorage === "undefined") {
    return false;
  }

  try {
    return sessionStorage.getItem(ADMIN_AUTH_KEY) === "1";
  } catch (error) {
    console.error("Failed to read admin auth from sessionStorage", error);
    return false;
  }
};

const AdminProvider = ({ children }) => {
  const [isAdminAuthed, setIsAdminAuthed] = useState(() => readInitialAuth());

  const authorize = (password) => {
    const isValid = password.trim() === ADMIN_PASSWORD;

    setIsAdminAuthed(isValid);

    if (isValid) {
      try {
        sessionStorage.setItem(ADMIN_AUTH_KEY, "1");
      } catch (error) {
        console.error("Failed to persist admin auth", error);
      }
    }

    return isValid;
  };

  const logoutAdmin = () => {
    setIsAdminAuthed(false);
    try {
      sessionStorage.removeItem(ADMIN_AUTH_KEY);
    } catch (error) {
      console.error("Failed to clear admin auth", error);
    }
  };

  const resetAdmin = () => logoutAdmin();

  const value = useMemo(
    () => ({
      isAdminAuthed,
      authorize,
      logoutAdmin,
      resetAdmin,
    }),
    [isAdminAuthed],
  );

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
};

export { AdminContext, AdminProvider };
