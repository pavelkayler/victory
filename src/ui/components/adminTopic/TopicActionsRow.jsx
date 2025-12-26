import { Button, Col, Row } from "react-bootstrap";

const TopicActionsRow = ({ isEditingTopic, onEditTopic, onAddQuestion, onCancelEdit }) => {
  return (
    <Row className="mt-3 justify-content-center admin-topic-row-3">
      <Col xs="auto" className="d-flex flex-wrap gap-2 justify-content-center">
        {isEditingTopic ? (
          <Button
            variant="outline-secondary"
            type="button"
            onClick={onCancelEdit}
          >
            Отмена
          </Button>
        ) : (
          <Button
            variant="outline-primary"
            type="button"
            onClick={onEditTopic}
          >
            Редактировать тему
          </Button>
        )}

        <Button variant="success" onClick={onAddQuestion} type="button">
          <i className="bi bi-plus-lg me-2" aria-hidden="true" />
          Добавить вопрос
        </Button>
      </Col>
    </Row>
  );
};

export { TopicActionsRow };
