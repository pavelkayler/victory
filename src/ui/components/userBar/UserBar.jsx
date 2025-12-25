import { useContext } from "react";
import { Button } from "react-bootstrap";

import { UserContext } from "../../../core/context/Context.jsx";

const UserBar = () => {
  const { isAuth, userName, logout } = useContext(UserContext);

  if (!isAuth) {
    return null;
  }

  const displayName = userName?.trim() || "Пользователь";

  return (
    <div className="user-header-bar" aria-label="Панель пользователя">
      <div className="d-inline-flex align-items-center gap-2 flex-nowrap">
        <i className="bi bi-person-circle text-primary" aria-hidden="true" />
        <span className="fw-semibold user-name" title={displayName}>
          {displayName}
        </span>
      </div>
      <Button
        variant="outline-danger"
        type="button"
        className="header-logout-btn"
        onClick={logout}
      >
        Выйти
      </Button>
    </div>
  );
};

export { UserBar };
