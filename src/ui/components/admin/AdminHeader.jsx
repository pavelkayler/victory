import { Button, CardSubtitle, CardTitle } from "react-bootstrap";

const AdminHeader = ({ onLogout }) => {
  return (
    <div>
      <div className="admin-title-row">
        <CardTitle className="fs-3 d-flex align-items-center gap-2 mb-0 admin-title">
          <i className="bi bi-shield-lock-fill text-primary" aria-hidden="true" />
          Админ-панель
        </CardTitle>
        <Button
          variant="outline-secondary"
          onClick={onLogout}
          className="admin-exit-btn d-none d-md-inline-flex"
        >
          Выйти
        </Button>
      </div>

      <div className="d-flex justify-content-center d-md-none mt-2">
        <Button variant="outline-secondary" onClick={onLogout} className="admin-exit-btn">
          Выйти
        </Button>
      </div>

      <CardSubtitle className="text-muted mb-3">
        Управляйте темами и вопросами викторины.
      </CardSubtitle>
    </div>
  );
};

export { AdminHeader };
