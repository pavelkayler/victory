import { Button, NavbarBrand } from "react-bootstrap";
import { Link } from "react-router-dom";

const HeaderNavRow = ({ brandLabel, isHistoryPage, onBrandClick, showUserHeaderBar, displayName, onLogout }) => {
  return (
    <div className="user-header-row header-grid">
      <div className="header-grid__brand">
        <NavbarBrand
          as={Link}
          to="/topics"
          onClick={onBrandClick}
          className="brand-topic mb-0"
        >
          {brandLabel}
        </NavbarBrand>
      </div>

      <div className="header-grid__center d-none d-md-flex justify-content-center">
        {showUserHeaderBar && (
          <div className="user-header-bar">
            <i className="bi bi-person-circle text-primary" aria-hidden="true" />
            <span className="fw-semibold user-name user-name--desktop" title={displayName}>
              {displayName}
            </span>
            <Button
              variant="outline-danger"
              type="button"
              className="user-logout-btn"
              onClick={onLogout}
            >
              Выйти
            </Button>
          </div>
        )}
      </div>

      <div className="header-grid__actions">
        <Button
          variant="outline-primary"
          className="nav-pill-btn"
          as={Link}
          to={isHistoryPage ? "/topics" : "/history"}
          type="button"
        >
          {isHistoryPage ? "Пройти тест" : "История"}
        </Button>
      </div>
    </div>
  );
};

export { HeaderNavRow };
