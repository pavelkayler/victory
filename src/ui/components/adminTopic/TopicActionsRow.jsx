import { Button, Col, Row } from "react-bootstrap";

const TopicActionsRow = ({
  isEditingTopic,
  onEditTopic,
  onAddQuestion,
  onCancelEdit,
  onSaveTopic,
  isSaveDisabled = false,
}) => {
  return (
    <>
      <Row className="mt-3 admin-topic-row-3">
        <Col className={`action-slot ${isEditingTopic ? "is-editing" : ""}`}>
          {isEditingTopic ? (
            <>
              <Button
                variant="success"
                type="button"
                onClick={onSaveTopic}
                disabled={isSaveDisabled}
              >
                Сохранить
              </Button>
              <Button
                variant="outline-secondary"
                type="button"
                onClick={onCancelEdit}
              >
                Отмена
              </Button>
            </>
          ) : (
            <Button
              variant="outline-primary"
              type="button"
              onClick={onEditTopic}
            >
              Редактировать тему
            </Button>
          )}
        </Col>
      </Row>

      <Row className="mt-3 admin-topic-row-4">
        <Col className="d-flex justify-content-center">
          <Button variant="success" onClick={onAddQuestion} type="button">
            <i className="bi bi-plus-lg me-2" aria-hidden="true" />
            Добавить вопрос
          </Button>
        </Col>
      </Row>
    </>
  );
};

export { TopicActionsRow };
