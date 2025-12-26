import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Stack from "react-bootstrap/Stack";
import { Link } from "react-router-dom";

import { HeaderShell } from "./HeaderShell.jsx";

const UserHeader = ({
  onTopicClick,
  isHistoryPage,
  displayName,
  onLogout,
  showUserRow,
}) => {
  return (
    <HeaderShell>
      <Container fluid className="p-0">
        <div className="user-header-desktop-grid d-none d-md-grid">
          <div className="user-header-desktop-left">
            <Button
              variant="outline-primary"
              className="nav-pill-btn"
              as={Link}
              to="/topics"
              type="button"
              onClick={onTopicClick}
            >
              Выбор темы
            </Button>
          </div>
          <div className="user-header-desktop-center">
            {showUserRow && (
              <Stack
                direction="horizontal"
                gap={2}
                className="user-header-bar flex-nowrap justify-content-center"
              >
                <i className="bi bi-person-circle text-primary" aria-hidden="true" />
                <span className="fw-semibold user-name user-name--desktop text-truncate" title={displayName}>
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
              </Stack>
            )}
          </div>
          <div className="user-header-desktop-right">
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

        <Row className="gy-2 align-items-center d-flex d-md-none">
          <Col xs={12}>
            <div className="user-header-mobile-actions">
              <Button
                variant="outline-primary"
                className="nav-pill-btn user-header-mobile-btn"
                as={Link}
                to="/topics"
                type="button"
                onClick={onTopicClick}
              >
                Выбор темы
              </Button>
              <Button
                variant="outline-primary"
                className="nav-pill-btn user-header-mobile-btn"
                as={Link}
                to={isHistoryPage ? "/topics" : "/history"}
                type="button"
              >
                {isHistoryPage ? "Пройти тест" : "История"}
              </Button>
            </div>
          </Col>

          {showUserRow && (
            <Col xs={12} className="user-header-mobile-user-row">
              <div className="user-header-mobile-user">
                <div className="user-header-mobile-identity">
                  <i className="bi bi-person-circle text-primary" aria-hidden="true" />
                  <span className="fw-semibold user-name user-header-mobile-name" title={displayName}>
                    {displayName}
                  </span>
                </div>
                <Button
                  variant="outline-danger"
                  type="button"
                  className="user-logout-btn user-header-mobile-logout"
                  onClick={onLogout}
                >
                  Выйти
                </Button>
              </div>
            </Col>
          )}
        </Row>
      </Container>
    </HeaderShell>
  );
};

export { UserHeader };
