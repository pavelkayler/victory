import { Button, NavbarBrand } from "react-bootstrap";
import { Link } from "react-router-dom";

const HeaderNavRow = ({ brandLabel, isHistoryPage, onBrandClick }) => {
  return (
    <div className="user-header-row">
      <NavbarBrand
        as={Link}
        to="/topics"
        onClick={onBrandClick}
        className="brand-topic header-grid__brand mb-0"
      >
        {brandLabel}
      </NavbarBrand>

      <div className="d-flex align-items-center gap-2 flex-wrap justify-content-end">
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
