import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { AdminContext } from "../context/Context.jsx";

const useAdminGuard = () => {
  const { isAdminAuthed } = useContext(AdminContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAdminAuthed) {
      navigate("/", { replace: true });
    }
  }, [isAdminAuthed, navigate]);

  return isAdminAuthed;
};

export { useAdminGuard };
