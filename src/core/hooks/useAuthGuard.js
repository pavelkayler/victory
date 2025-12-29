import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { UserContext } from "../context/Context.jsx";

const useAuthGuard = (redirectPath = "/") => {
  const { isAuth } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuth) {
      navigate(redirectPath, { replace: true });
    }
  }, [isAuth, navigate, redirectPath]);

  return isAuth;
};

export { useAuthGuard };
