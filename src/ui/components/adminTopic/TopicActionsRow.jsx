import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import FormControl from "react-bootstrap/FormControl";
import FormGroup from "react-bootstrap/FormGroup";
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
      <Row className="mt-3 admin-topic-row-3 align-items-start g-3">
        {isEditingTopic ? (
          <>
            <Col xs={12} md={4}>
              <FormGroup controlId="topicTimeLimitEdit" className="mb-0 admin-time-group">
                <FormLabel className="fw-semibold">Время</FormLabel>
                <div className="admin-time-input">
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
              </FormGroup>
            </Col>
            <Col xs={12} md={8}>
              <div className="admin-topic-actions-buttons">
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
              </div>
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

      <Row className="mt-3 mb-4 admin-topic-row-4">
        <Col className="d-flex justify-content-center">
          <Button variant="primary" onClick={onAddQuestion} type="button" className="admin-add-question-btn">
            <i className="bi bi-plus-lg me-2" aria-hidden="true" />
            Добавить вопрос
          </Button>
        </Col>
      </Row>
    </>
  );
};

export { TopicActionsRow };
