import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

const HistoryClearButton = ({ onClick }) => {
  return (
    <Row className="my-3">
      <Col xs={12} className="d-flex justify-content-center align-items-end">
        <Button variant="outline-danger" onClick={onClick} className="px-4">
          Очистить историю
        </Button>
      </Col>
    </Row>
  );
};

export { HistoryClearButton };
