import { createContext, useCallback, useEffect, useMemo, useState } from "react";

const AUTH_STORAGE_KEY = "quiz-auth-state";

const getStoredAuth = () => {
  if (typeof localStorage === "undefined") {
    return null;
  }

  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw);
    return {
      isAuth: Boolean(parsed.isAuth),
      userName: parsed.userName || "",
    };
  } catch (error) {
    console.error("Failed to read auth from storage", error);
    return null;
  }
};

const UserContext = createContext(null);

const persistAuthState = (authState) => {
  if (typeof localStorage === "undefined") {
    return;
  }

  if (authState.isAuth) {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authState));
    return;
  }

  localStorage.removeItem(AUTH_STORAGE_KEY);
};

const UserProvider = ({ children }) => {
  const [storedAuth] = useState(getStoredAuth);

  const [isAuth, setIsAuth] = useState(() => storedAuth?.isAuth ?? false);
  const [userName, setUserName] = useState(() => storedAuth?.userName ?? "");
  const [userStats, setUserStats] = useState({
    loginCount: 0,
    logoutCount: 0,
  });

  useEffect(() => {
    persistAuthState({ isAuth, userName });
  }, [isAuth, userName]);

  const login = useCallback((name) => {
    const nextName = name || "Гость";

    setIsAuth(true);
    setUserName(nextName);
    setUserStats((prev) => ({
      ...prev,
      loginCount: prev.loginCount + 1,
    }));
  }, []);

  const logout = useCallback(() => {
    setIsAuth(false);
    setUserName("");
    setUserStats((prev) => ({
      ...prev,
      logoutCount: prev.logoutCount + 1,
    }));
  }, []);

  const value = useMemo(
    () => ({
      isAuth,
      userName,
      userStats,
      login,
      logout,
    }),
    [isAuth, userName, userStats, login, logout],
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export { UserContext, UserProvider };
