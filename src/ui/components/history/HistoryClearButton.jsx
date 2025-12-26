import { Button, Col, Row } from "react-bootstrap";

const HistoryClearButton = ({ onClick }) => {
  return (
    <Row className="mt-3 mb-3">
      <Col xs={12} className="d-flex justify-content-center align-items-end">
        <Button variant="outline-danger" onClick={onClick}>
          Очистить историю
        </Button>
      </Col>
    </Row>
  );
};

export { HistoryClearButton };
