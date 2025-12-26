import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { AdminContext } from "../context/Context.jsx";
import { ADMIN_PATH } from "../constants/paths.js";

const useAdminGuard = () => {
  const { isAdminAuthed } = useContext(AdminContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAdminAuthed) {
      navigate(ADMIN_PATH, { replace: true });
    }
  }, [isAdminAuthed, navigate]);

  return isAdminAuthed;
};

export { useAdminGuard };
