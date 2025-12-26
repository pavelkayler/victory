import { Button } from "react-bootstrap";

const HeaderUserRow = ({ displayName, onLogout }) => {
  if (!displayName) {
    return null;
  }

  return (
    <div className="user-header-mobile-row d-flex d-md-none">
      <div className="d-inline-flex align-items-center gap-2 flex-grow-1 min-w-0">
        <i className="bi bi-person-circle text-primary" aria-hidden="true" />
        <span className="fw-semibold user-name" title={displayName}>
          {displayName}
        </span>
      </div>
      <Button
        variant="outline-danger"
        type="button"
        className="user-logout-btn flex-shrink-0"
        onClick={onLogout}
      >
        Выйти
      </Button>
    </div>
  );
};

export { HeaderUserRow };
