import { Container, Stack, Button } from "react-bootstrap";

import { APP_VERSION } from "../../../core/version.js";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="app-footer mt-auto">
      <Container fluid className="py-3">
        <div className="d-none d-md-flex justify-content-between align-items-center gap-3">
          <Stack direction="horizontal" gap={2} className="flex-wrap">
            <span className="fw-semibold d-inline-flex align-items-center gap-1">
              <i className="bi bi-c-circle" aria-hidden="true" />
              pavelkayler
            </span>
            <Button
              as="a"
              href="https://github.com/pavelkayler"
              target="_blank"
              rel="noreferrer"
              variant="link"
              className="p-0 fw-semibold footer-link-btn"
            >
              GitHub
            </Button>
          </Stack>

          <Stack direction="horizontal" gap={2} className="flex-wrap text-muted">
            <span className="fw-semibold">v{APP_VERSION}</span>
            <span className="fw-semibold">{currentYear}</span>
          </Stack>
        </div>

        <div className="d-flex d-md-none justify-content-center align-items-center">
          <Button
            as="a"
            href="https://github.com/pavelkayler"
            target="_blank"
            rel="noreferrer"
            variant="link"
            className="p-0 fw-semibold footer-link-btn d-inline-flex align-items-center gap-1"
          >
            <i className="bi bi-c-circle" aria-hidden="true" />
            pavelkayler
          </Button>
        </div>
      </Container>
    </footer>
  );
};

export { Footer };
