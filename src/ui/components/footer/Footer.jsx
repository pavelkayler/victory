import { Container } from "react-bootstrap";
import { Link } from "react-router-dom";

import { APP_VERSION } from "../../../core/version.js";
import { ADMIN_PATH } from "../../../core/constants/paths.js";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="app-footer mt-auto">
      <Container fluid className="py-3">
        <div className="footer-desktop d-none d-md-flex justify-content-center align-items-center gap-2 flex-wrap">
          <span className="fw-semibold d-inline-flex align-items-center gap-1">
            <i className="bi bi-c-circle" aria-hidden="true" />
            <a
              href="https://github.com/pavelkayler"
              target="_blank"
              rel="noreferrer"
              className="footer-link"
            >
              pavelkayler
            </a>
          </span>
          <span className="text-muted">·</span>
          <span className="fw-semibold">{currentYear}</span>
          <span className="text-muted">·</span>
          <span className="fw-semibold">
            <Link to={ADMIN_PATH} className="footer-link version-link">v</Link>
            {APP_VERSION}
          </span>
        </div>

        <div className="footer-mobile d-flex d-md-none justify-content-center align-items-center gap-2">
          <i className="bi bi-c-circle" aria-hidden="true" />
          <a
            href="https://github.com/pavelkayler"
            target="_blank"
            rel="noreferrer"
            className="footer-link"
          >
            pavelkayler
          </a>
        </div>
      </Container>
    </footer>
  );
};

export { Footer };
