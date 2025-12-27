import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import FormControl from "react-bootstrap/FormControl";
import FormLabel from "react-bootstrap/FormLabel";
import Row from "react-bootstrap/Row";

const TopicActionsRow = ({
  isEditingTopic,
  onEditTopic,
  timeLimit,
  onChangeTimeLimit,
  onAddQuestion,
  onCancelEdit,
  onSaveTopic,
  isTimeLimitValid = true,
  isSaveDisabled = false,
}) => {
  return (
    <>
      <Row className="mt-3 admin-topic-row-3 align-items-center g-2">
        {isEditingTopic ? (
          <>
            <Col xs={12} md={4}>
              <div className="d-flex align-items-center gap-2 admin-time-input">
                <FormLabel className="mb-0 fw-semibold flex-shrink-0">Время</FormLabel>
                <FormControl
                  type="number"
                  min={1}
                  max={60}
                  value={timeLimit}
                  onChange={(event) => onChangeTimeLimit(event.target.value)}
                  isInvalid={!isTimeLimitValid}
                />
                <span className="text-muted small flex-shrink-0">мин</span>
              </div>
            </Col>
            <Col xs={12} md={4} className="d-flex justify-content-md-center">
              <Button
                variant="success"
                type="button"
                onClick={onSaveTopic}
                disabled={isSaveDisabled}
                className="admin-save-btn"
              >
                Сохранить
              </Button>
            </Col>
            <Col xs={12} md={4} className="d-flex justify-content-md-end">
              <Button
                variant="outline-secondary"
                type="button"
                onClick={onCancelEdit}
                className="admin-cancel-btn"
              >
                Отмена
              </Button>
            </Col>
          </>
        ) : (
          <Col className="d-flex justify-content-start">
            <Button
              variant="outline-primary"
              type="button"
              onClick={onEditTopic}
            >
              Редактировать тему
            </Button>
          </Col>
        )}
      </Row>

      <Row className="mt-3 mb-3 admin-topic-row-4">
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
